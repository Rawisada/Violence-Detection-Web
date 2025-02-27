"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import Image from 'next/image';
import { Checkbox, FormControlLabel, TextField } from "@mui/material";

const Signup: FC = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[url('/bg-pattern.jpg')] bg-cover bg-center">
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
            <h1 className="text-3xl font-bold text-black">Create your account</h1>
            <p className="text-gray-600">
              Already a member <a href="/" className="text-blue-500">Log in</a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
            <div className='w-full'>
                <TextField
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@gmail.com"
                    required
                    fullWidth
                    slotProps={{
                        inputLabel: { required: false }, 
                    }}
                />
            </div>

            <div className='grid grid-cols-2 gap-4 w-full'>
                <TextField
                    label="First Name"
                    type="firstname"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    fullWidth
                    slotProps={{
                        inputLabel: { required: false }, 
                    }}
                />
                <TextField
                    label="Last Name"
                    type="lastname"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    required
                    fullWidth
                    slotProps={{
                        inputLabel: { required: false }, 
                    }}
                />       
            </div>

            <div className='w-full'>
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

            <FormControlLabel sx={{ color: "black", width: "100%", margin: 0, marginTop: 0}}
                control={
                    <Checkbox 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    sx={{ color: "gray", "&.Mui-checked": { color: "black" } }} />
                }
                label="I accept the Terms and Conditions"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              GET STARTED
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
            SIGN UP WITH GOOGLE
          </button>
        </div>
    </main>
  );
};

export default Signup;
