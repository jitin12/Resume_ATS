import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import 'dotenv/config';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Missing text input" }, { status: 400 });
        }


        const completion = await client.chat.completions.create({
            model: "qwen/qwen3-32b",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant that extracts important keywords and skills from a url. Return them as a clean JSON array of strings. Extract keywords from this job posting : "
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
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
