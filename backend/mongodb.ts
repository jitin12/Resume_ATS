import { useSession } from "next-auth/react";
import connectDB from "./connectdb";
import { EntryModel } from "./models/Schema";

export default async function upload() {
    const { data: session } = useSession();
    await connectDB();
    if (session) {

        const newentry = new EntryModel({
            user: session.user?.email,
            name: session.user?.name,
        });

        await newentry.save();
    }
}