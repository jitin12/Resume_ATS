/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-wrapper-object-types */


import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import 'dotenv/config';
import pdfParse from "pdf-parse";


const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {


        const formData = await req.formData();
        const file = formData.get("resume") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
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
        console.log(match);

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
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
