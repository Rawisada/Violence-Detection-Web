
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

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { Session, User as NextAuthUser } from "next-auth";

// กำหนดประเภทของ `user` ในระบบของเราเอง
type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type SessionStrategy = "jwt" | "database";

// ขยายประเภท `Session` และ `User` ของ NextAuth
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
      clientId: process.env.GOOGLE_CLIENT_ID!,  // ใช้ค่าใน .env.local
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,  // ใช้ค่าใน .env.local
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),  // ใช้ MongoDB Adapter สำหรับการเชื่อมต่อฐานข้อมูล
  session: {
    strategy: "jwt" as SessionStrategy,  // ใช้ JWT สำหรับ session
  },
  callbacks: {
    // Callback สำหรับ signIn
    async signIn({ user, account, profile }: { user: User; account: any; profile: any }) {
      // ตรวจสอบหาก user ยังไม่มีในฐานข้อมูล (ใหม่)
      const existingUser = await checkIfUserExists(user.email);
      
      if (!existingUser) {
        // สร้างผู้ใช้ใหม่ในระบบฐานข้อมูล MongoDB
        await createNewUser(user);
      }
      
      // แสดงข้อมูล user, account, profile
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      return true;  // ถ้าไม่มีข้อผิดพลาดให้ return true
    },
    // Callback สำหรับ session
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.id = user.id;  // ทำการตั้งค่า `id` ของ user จาก MongoDB
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,  // ใช้ค่าใน .env.local
};

// ฟังก์ชันเพื่อตรวจสอบว่าผู้ใช้มีในฐานข้อมูลหรือไม่
async function checkIfUserExists(email: string) {
  // ตัวอย่างการตรวจสอบข้อมูลผู้ใช้ใน MongoDB
  const user = await (await clientPromise).db().collection("users").findOne({ email });
  return user;
}

// ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่ในฐานข้อมูล
async function createNewUser(user: User) {
  // ตัวอย่างการสร้างผู้ใช้ใหม่ใน MongoDB
  await (await clientPromise).db().collection("users").insertOne({
    name: user.name,
    email: user.email,
    image: user.image || "",
    createdAt: new Date(),
  });
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
