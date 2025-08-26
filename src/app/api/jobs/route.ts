/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-wrapper-object-types */


import 'dotenv/config';
import connectDB from '../../../../backend/connectdb';
import { ResumeModel } from '../../../../backend/models/Schema';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route'; // import your authOptions

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const result = await ResumeModel.findOne({ email: session?.user?.email });
    if (!result) throw new Error("Not found");

    const keywords = result.keywords || [];
    const APP_ID = process.env.APP_ID!;
    const APP_KEY = process.env.APP_KEY!;
    let jobs: any[] = [];

    for (const keyword of keywords) {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&what=${encodeURIComponent(keyword)}`;
      const res = await fetch(url);
      const data = await res.json();
      jobs = jobs.concat(data.results);
    }

    // Deduplicate + sort
    const uniqueJobs = Array.from(new Map(jobs.map(j => [j.id, j])).values());
    jobs = uniqueJobs.map(job => {
      const text = `${job.title} ${job.description}`.toLowerCase();
      let score = 0;
      for (const kw of keywords) if (text.includes(kw.toLowerCase())) score++;
      return { ...job, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Format for response
    const allJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown",
      location: job.location?.display_name || "Unknown",
      description: job.description,
      url: job.redirect_url,
      category: job.category?.label,
      created: job.created,
      matchscore: job.matchScore
    }));

    return NextResponse.json({
      count: jobs.length,
      keywords,
      jobs: allJobs,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
