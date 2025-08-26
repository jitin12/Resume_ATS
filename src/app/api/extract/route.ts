import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import 'dotenv/config';
import puppeteer from "puppeteer";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });



export async function POST(req: NextRequest) {
    try {

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const { jobUrl } = await req.json();

        await page.goto(jobUrl, { waitUntil: "networkidle0" }); 

        // Get full visible text
        let text = await page.evaluate(() => document.body.innerText);

        await browser.close();

        // Normalize whitespace
        text = text.replace(/\s+/g, " ").trim()
        console.log("Extracted text:", text);



        const completion = await client.chat.completions.create({
            model: "qwen/qwen3-32b",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant that extracts important skills from a url, Only use the keywords that are present in the url that are actual skills. Return them as a clean JSON array of strings. Extract key skills from this pdf : "
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
