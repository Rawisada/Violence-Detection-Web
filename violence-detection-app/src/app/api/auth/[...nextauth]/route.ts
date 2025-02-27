import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb"; // Import a utility to connect to the DB
import User from "@/models/User"; // Assuming you place your user model in `models/User`
import { MongoClient } from "mongodb";
import { Session} from "next-auth";

// Extend Session and User types
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Adding custom user ID to the session
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

        // Check if user already exists in the databas
        const existingUser = await User.findOne({ email: user.email });
        const nameParts = user.name.split(" "); // แยกด้วยช่องว่าง
        const firstName = nameParts[0]; // ชื่อแรกสุด
        const lastName = nameParts.slice(1).join(" "); // รวมคำที่เหลือเป็น lastName
        // If the user doesn't exist, create a new user
        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            profile: {
              firstName: firstName,
              lastName: lastName,
              image: user.image,
            },
          });

          // Save the new user
          await newUser.save();
        }
        return true; // Allow the sign-in to proceed
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
