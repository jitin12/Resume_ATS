import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { EntryModel } from "../../../../../backend/models/Schema";
import connectDB from "../../../../../backend/connectdb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        const existing = await EntryModel.findOne({ email: user.email });
        if (!existing) {
          await EntryModel.create({
            userid: user.id,
            name: user.name,
            email: user.email,
          });
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  },
};

// App Router requires exporting GET and POST explicitly
export const GET = (req: Request) => NextAuth(authOptions)(req);
export const POST = (req: Request) => NextAuth(authOptions)(req);
