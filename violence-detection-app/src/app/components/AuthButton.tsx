// app/components/AuthButton.tsx
"use client"; // ใช้สำหรับบอกว่าเป็น Client Component

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
        <div>
            <p>Welcome, {session.user?.name}</p>
            <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
            Sign out
            </button>
        </div>
        );
    }

    return (
        <div>
            <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })} // เพิ่ม callbackUrl ถ้าต้องการให้ไปหน้าเฉพาะหลังจาก Sign In หรือ Sign Up
            className="bg-blue-600 text-white p-2 rounded w-200">
            Sign in with Google
            </button>
            <p className="text-center">or</p>
            <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })} 
            className="bg-blue-950 text-white p-2 rounded w-auto">
            Sign up with Google
            </button>
        </div>
    );
}
