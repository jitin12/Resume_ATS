/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-wrapper-object-types */


import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "../../../../backend/s3";
import connectDB from "../../../../backend/connectdb";
import { EntryModel, ResumeModel } from "../../../../backend/models/Schema";
import Groq from "groq-sdk";
import 'dotenv/config';
import pdfParse from "pdf-parse";
import mongoose from "mongoose";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    await connectDB();
    const file = formData.get("resume") as File;
    const email = formData.get("email") as string;
    console.log(email);
    const curruser = await EntryModel.findOne({ email: email });

    const userid = curruser._id;

    const result = await handles3upload(file, userid);
    const s3url = result.location;


    const existing = await ResumeModel.findOne({ entryId: new mongoose.Types.ObjectId(userid) });

    if (existing) {
      if (existing.s3url == s3url) {
        return NextResponse.json({ message: "Resume uploaded successfully" }, { status: 200 });
      }
      existing.s3url = s3url;
      const keywords = await handlekeywords(file);
      existing.keywords = keywords;
      await existing.save();
      return NextResponse.json({ message: "Resume uploaded successfully" }, { status: 200 });
    } else {
      const keywords = await handlekeywords(file);
      const resumeres = handleresumeupload(file, s3url,email, userid, keywords);
      return NextResponse.json({ message: "Resume uploaded successfully" }, { status: 200 });
    }

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


async function handleresumeupload(file: File, s3url: string,email:String, userid: string, keywords: string[]) {
  try {


    await ResumeModel.create({ entryId: userid, s3url,email,keywords });

    return NextResponse.json({ message: "Resume uploaded successfully" }, { status: 200 });
  }
  catch (e) {
    console.error("Error uploading resume:", e);
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}


export async function handlekeywords(file: File): Promise<string[]> {
  try {


    if (!file) {
      console.error("No file uploaded");
      throw new Error("No file uploaded");
    }


    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);


    const text = data.text;


    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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

    return keywords;

  } catch (err: any) {
    console.error("Error extracting keywords:", err);
    throw new Error("Keyword extraction failed");
  }
}
