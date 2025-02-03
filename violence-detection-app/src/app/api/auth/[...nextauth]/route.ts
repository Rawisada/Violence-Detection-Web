
// // app/api/auth/[...nextauth]/route.ts
// import NextAuth, { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/lib/mongodb";
// import { Session, User as NextAuthUser, Account, Profile } from "next-auth";

// // กำหนดประเภทของ `user` ในระบบของเราเอง
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   image?: string;
// };

// type SessionStrategy = "jwt" | "database";

// // ขยายประเภท `Session` และ `User` ของ NextAuth
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

// export const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,  // ใช้ค่าใน .env.local
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,  // ใช้ค่าใน .env.local
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),  // ใช้ MongoDB Adapter สำหรับการเชื่อมต่อฐานข้อมูล
//   session: {
//     strategy: "jwt" as SessionStrategy,  // ใช้ JWT สำหรับ session
//   },
//   callbacks: {
//     // Callback สำหรับ signIn
//     async signIn({ user, account, profile }: { user: User | NextAuthUser; account: Account | null; profile?: Profile }) {
//       // แสดงข้อมูล user, account, profile
//       console.log("User:", user);
//       console.log("Account:", account);
//       console.log("Profile:", profile);
//       return true;  // ถ้าไม่มีข้อผิดพลาดให้ return true
//     },
//     // Callback สำหรับ session
//     async session({ session, user }: { session: Session; user: User }) {
//       if (session.user) {
//         session.user.id = user.id;  // ทำการตั้งค่า `id` ของ user จาก MongoDB
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,  // ใช้ค่าใน .env.local
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { Session, User as NextAuthUser, Account, Profile } from "next-auth";

// Define User and Session types
type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type SessionStrategy = "jwt" | "database";

// Extend types for Session and User
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

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt" as SessionStrategy, // Define session strategy as "jwt" or "database"
  },
  callbacks: {
    async signIn({ user, account, profile }: { user: NextAuthUser; account: Account | null; profile?: Profile }) {
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);

      if (account?.provider === "google") {
        const userExists = await checkIfUserExists(user.email);
        if (!userExists) {
          await createUserInDatabase(user);
        }
      }

      return true;
    },
    async session({ session, user }: { session: Session; user: NextAuthUser }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Function to check if the user exists in the database
async function checkIfUserExists(email: string) {
  const client = await clientPromise;
  const db = client.db(); // Access the database
  const user = await db.collection("users").findOne({ email });
  return user !== null;
}

// Function to create a new user in the database
async function createUserInDatabase(user: NextAuthUser) {
  const client = await clientPromise;
  const db = client.db(); // Access the database
  await db.collection("users").insertOne({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  });
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
