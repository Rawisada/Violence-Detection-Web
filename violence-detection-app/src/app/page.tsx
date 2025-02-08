// app/page.tsx
"use client";

import { handleSignIn, handleSignOut } from '../lib/auth';
import { useSession } from 'next-auth/react';
import { FC } from 'react';
import Home from './home/page';
const HomePage: FC = () => {
  const { data: session } = useSession();

  return (
    <main className=" min-h-screen bg-gray-100 w-full">
      {session ? (
        <div>
          <div className="w-full h-full">
            <Home session={session} />
          </div>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      )}
    </main>
  );
};

export default HomePage;
