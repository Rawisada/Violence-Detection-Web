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

        // If the user doesn't exist, create a new user
        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            profile: {
              firstName: user.name,
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

// // Define User and Session types
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   image?: string;
// };

// type SessionStrategy = "jwt" | "database";

// // Extend types for Session and User
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       image?: string;
//     };
//   }

//   interface User {
//     id: string;
//     name: string;
//     email: string;
//     image?: string;
//   }
// }


// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || (() => { throw new Error("Missing GOOGLE_CLIENT_ID") })(),
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || (() => { throw new Error("Missing GOOGLE_CLIENT_SECRET") })(),
//       authorization: {
//         url: "https://accounts.google.com/o/oauth2/auth",
//         params: {
//           scope: "openid email profile",
//           prompt: "consent",  // บังคับให้ Google ถามก่อนล็อกอิน
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
//   session: {
//     strategy: "jwt" as SessionStrategy, // Define session strategy as "jwt" or "database"
//   },
//   callbacks: {
//     async signIn({ user, account }: { user: NextAuthUser; account?: Account }) {
//       if (!user.email) return false;
  
//       const client = await clientPromise;
//       const db = client.db();
//       const existingUser = await db.collection("users").findOne({ email: user.email });
  
//       if (!existingUser) {
//         if (account?.provider === "google") {
//           await db.collection("users").insertOne({
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             providers: [account.provider], // 🔥 เพิ่ม field providers
//           });
//           return true;
//         }
//         return false;
//       }
  
//       // ✅ เชื่อมโยง provider ใหม่กับบัญชีเดิม
//       if (!existingUser.providers.includes(account?.provider)) {
//         await db.collection("users").updateOne(
//           { email: user.email },
//           { $addToSet: { providers: account?.provider } }
//         );
//       }
  
//       return true;
//     },
//     async session({ session }: { session: Session }) {
//       if (session.user) {
//         const client = await clientPromise;
//         const db = client.db();
        
//         const dbUser = await db.collection("users").findOne({ email: session.user.email });

//         if (dbUser) {
//           session.user.id = dbUser.id;
//         }
//       }
//       return session;
//     },

//     async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
//       return `${baseUrl}/home`; // Redirect ไปที่หน้า Home หลังจากล็อกอิน
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// // Function to check if the user exists in the database
// async function checkIfUserExists(email: string) {
//   const client = await clientPromise;
//   const db = client.db(); // Access the database
//   const user = await db.collection("users").findOne({ email });
//   return user !== null;
// }

// // Function to create a new user in the database
// async function createUserInDatabase(user: NextAuthUser) {
//   const client = await clientPromise;
//   const db = client.db(); // Access the database
//   await db.collection("users").insertOne({
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     image: user.image,
//   });
// }

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
