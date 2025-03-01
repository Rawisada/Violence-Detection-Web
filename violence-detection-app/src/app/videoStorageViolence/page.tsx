"use client";
import TabsComponent from "@/app/components/TabsComponent";
import { useSession } from 'next-auth/react';
import VideoStorageComponent from "../components/VideoStorageViolenceComponent";
import { useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import { Box, CircularProgress } from "@mui/material";

export default function videoStorageViolence() {
  const { data: session } = useSession();
  const router = useRouter();
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    if (session) {
        setWaiting(false);  
        return; 
    }

    const timer = setTimeout(() => {
        if (!session) {
            router.push('/');
        }
    }, 200);

    return () => clearTimeout(timer); 
  }, [session, router]);

  if (!session && waiting) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fafafa'}}>
            <CircularProgress />
        </Box>
    );
  }
  
  if (!session) {
    return null; 
  }
  
  return (
    <div className="bg-[#fafafa] min-h-full">
      <TabsComponent session={session} />
      <div className="mx-[104px]"> 
        <VideoStorageComponent/>
      </div>
    </div>
  );
}
