import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "../../../../backend/s3";
import connectDB from "../../../../backend/connectdb";
import { ResumeModel } from "../../../../backend/models/Schema";
import Groq from "groq-sdk";
import 'dotenv/config';
import pdfParse from "pdf-parse";


const client = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const userid = formData.get("userid") as string;
    const result = await handles3upload(file, userid);
    const s3url = result.location;
    const keywordsres = await handlekeywords(file);
    const keywords = await keywordsres.json();
    const keywordsarray = keywords.keywords || [];
    const resumeres = handleresumeupload(s3url, userid ,keywordsarray);

    return resumeres;
  }
  catch (e) {
    console.error("Error in POST /api/resume:", e);
    return NextResponse.json({ error: "Failed to process resume upload" }, { status: 500 });
  }
}


async function handles3upload(file: File, userid: string) {


  try {

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadToS3(buffer, userid, file.name, file.type);


    return {
      location: result.Location,
      userid: userid,
    }
  }
  catch (e) {
    console.error("Error uploading to S3:", e);
    throw new Error("S3 upload failed");
  }
}


async function handleresumeupload(s3url: string, userid: string , keywords: string[]) {
  try {

    await connectDB();

    const existing = await ResumeModel.findOne({ entryId: userid });

    if (existing) {
      existing.s3url = s3url;
      await existing.save();
    } else {
      await ResumeModel.create({ entryId: userid, s3url , keywords });
    }
    return NextResponse.json({ message: "Resume uploaded successfully" }, { status: 200 });
  }
  catch (e) {
    console.error("Error uploading resume:", e);
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}


export async function handlekeywords(file : File) {
  try {


    if (!file) {
      console.error("No file uploaded");
      throw new Error("No file uploaded");
    }


    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);


    const text = data.text;


    const completion = await client.chat.completions.create({
      model: "qwen/qwen3-32b",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that extracts important skills from a pdf, Only use the keywords that are present in the resume that are actual skills. Return them as a clean JSON array of strings. Extract keywords from this pdf : "
        },
        { role: "user", content: text }
      ],
      temperature: 0,
      max_tokens: 4096,
      "top_p": 0.95,
      "stop": null
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";



    const match = raw.match(/\[([\s\S]*?)\]/);

    let keywords: string[] = [];
    if (match) {
      try {
        keywords = JSON.parse(match[0]);
      } catch {
        keywords = [];
      }
    }

    return NextResponse.json({ keywords });

  } catch (err: any) {
    console.error("Error extracting keywords:", err);
    throw new Error("Keyword extraction failed");
  }
}
