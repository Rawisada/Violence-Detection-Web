"use client";
import TabsComponent from "@/app/components/TabsComponent";
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import { CircularProgress } from "@mui/material";
import DashboardComponent from "../components/DashboardComponent";

export default function summary() {
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
      <div className="mx-[104px]  pt-12"> 
        <DashboardComponent/>
      </div>
    </div>
  );
}
