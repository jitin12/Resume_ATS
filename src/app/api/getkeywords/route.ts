
import connectDB from "../../../../backend/connectdb";
import { ResumeModel } from "../../../../backend/models/Schema";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/route';

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


        return NextResponse.json({
            keywords
        }, { status: 400 });
    }
    catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}