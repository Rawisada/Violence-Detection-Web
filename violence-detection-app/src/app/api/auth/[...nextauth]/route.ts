import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb"; 
import User from "@/models/User"; 
import { MongoClient } from "mongodb";
import { Session} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
      name: string;
      email: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user }) {
      try {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });
        const nameParts = user.name.split(" "); 
        const firstName = nameParts[0]; 
        const lastName = nameParts.slice(1).join(" ");
        const personalDomains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"]
        const domain = user.email.split('@')[1] || "";
        const isPersonal = personalDomains.includes(domain.toLowerCase());
        const organization = isPersonal ? "personal" : domain.split('.')[0];
      

        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            profile: {
              firstName: firstName,
              lastName: lastName,
              image: user.image,
              role: 'user',
              organization: organization,
            },
          });

          await newUser.save();
        }
        return true; 
      } catch (error) {
        console.error("Error in sign-in callback:", error);
        return false;
      }
    },
    async session({ session}) {
      await dbConnect();
      const userInDb = await User.findOne({ email: session.user.email });
      if (userInDb) {
        session.user.id = userInDb.id; // เพิ่ม ID ของ User
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error", // Optional: custom error page for unauthorized access
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
