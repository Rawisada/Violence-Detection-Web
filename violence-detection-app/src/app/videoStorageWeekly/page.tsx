"use client";
import TabsComponent from "@/app/components/TabsComponent";
import { useSession } from 'next-auth/react';
import VideoStorageWeeklyComponent from "../components/VideoStorageWeeklyComponent";
import { usePathname, useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import { Box, CircularProgress } from "@mui/material";

export default function videoStorageWeekly() {
  const { data: session } = useSession();
  const router = useRouter();
  const [waiting, setWaiting] = useState(true);
  const pathname = usePathname();
  
  useEffect(() => {
    if (session) {
        setWaiting(false);  
        return; 
    }

    const timer = setTimeout(() => {
        if (!session) {
            router.push(`/?callbackUrl=${pathname}`);
        }
    }, 200);

    return () => clearTimeout(timer); 
  }, [session, router]);

  if (!session && waiting) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <CircularProgress />
      </div>
    );
  }
  
  if (!session) {
    return null; 
  }
  
  return (
    <div className="bg-[#fafafa] min-h-full">
      <TabsComponent session={session} />
      <div className="mx-[104px]">
          <VideoStorageWeeklyComponent/>
      </div>
    </div>
  );
}
