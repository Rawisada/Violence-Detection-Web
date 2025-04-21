"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { Alert, Button, TextField } from "@mui/material";
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from "@mui/material";

const HomePage: FC = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/liveFeed'); 
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  
    if (result?.error) {
      setErrorMessage(result.error); 
    } else if (result?.ok) {
      router.push("/liveFeed");
    }
  };
  

  return (
    <div>
      {session ? 
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fafafa'}}>
            <CircularProgress />
        </Box> : (
        <div className="min-h-screen flex items-center justify-center bg-[url('/bg-pattern.jpg')] bg-cover bg-center">
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
              <h1 className="text-3xl font-bold text-black">Welcome</h1>
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
              {errorMessage && (
                <Alert  variant="filled"  severity="error" style={{ marginBottom: '10px' }}>
                  {errorMessage}
                </Alert>
              )}
    
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: '4px',
                  backgroundColor: '#03A9F4',
                  '&:hover': {
                    backgroundColor: '#01579B',
                  },
                }}
                disabled={!email || !password}
              >
                SIGN IN
              </Button>
            </form>

            <div className="flex items-center my-3">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <Button
                variant="text"
                onClick={() => signIn('google')} 
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: '4px',
                  backgroundColor: '#fffff',
                  color: 'black',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#fffff',
                    boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)', 
                  },
                }}
              >
                <Image
                  src="/google_logo.png" 
                  alt="Google Icon"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                SIGN IN WITH GOOGLE
            </Button>

          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
