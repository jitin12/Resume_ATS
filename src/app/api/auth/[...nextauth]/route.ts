import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { EntryModel } from "../../../../../backend/models/Schema";
import connectDB from "../../../../../backend/connectdb";
import { NextRequest, NextResponse } from "next/server";

// Auth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: User }) {
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
    },
  },
};

// App Router wrapper
const handler = async (req: NextRequest) => {
  return await NextAuth(authOptions)(req, {} as any); // App Router fix
};

export { handler as GET, handler as POST };
