// app/api/auth/[...nextauth]/route.ts
import 'dotenv/config';
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { EntryModel } from '../../../../../backend/models/Schema';
import connectDB from '../../../../../backend/connectdb';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      await connectDB();

      
      const existing = await EntryModel.findOne({ email: user.email });
      if (!existing) {
        await EntryModel.create({
          name: user.name,
          email: user.email,
        });
      }
     
      return true;
    }},
});

export { handler as GET, handler as POST };
