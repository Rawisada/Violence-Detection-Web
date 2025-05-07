"use client";
import TabsComponent from "@/app/components/TabsComponent";
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import { Box, CircularProgress } from "@mui/material";
import SystemSettingsComponent from "../components/SystemSettingsComponent";

export default function systemSetting() {
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
    }, 300);

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
          <SystemSettingsComponent session={session}/>
      </div>
    </div>
  );
}
