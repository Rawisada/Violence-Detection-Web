"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import Home from './home/page';
import Image from 'next/image';
import { TextField } from "@mui/material";

const HomePage: FC = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[url('/bg-pattern.jpg')] bg-cover bg-center">
      {session ? (
        <div className="w-full h-full">
          <Home session={session} />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-7">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-900 rounded-full p-5 flex items-center justify-center w-24 h-24">
              <Image
                src="/logo.png"
                alt="Camera Icon"
                width={70}
                height={70}
                className="rounded-full"
              />
            </div>
          </div>


          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-black">Welcome back</h1>
            <p className="text-gray-600">
              Don’t have an account? <a href="/signup" className="text-blue-500">Sign up</a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@gmail.com"
              required
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: { required: false }, 
              }}
            />
            </div>

            <div>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              fullWidth
              slotProps={{
                inputLabel: { required: false }, 
              }}
            />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              SIGN IN
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={() => signIn('google')} 
            className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 text-black"
          >
            <Image
              src="/google_logo.png" 
              alt="Google Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            SIGN IN WITH GOOGLE
          </button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
