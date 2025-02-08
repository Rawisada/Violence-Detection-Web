"use client";
import TabsComponent from "@/app/components/TabsComponent";
interface HomeProps {
  session: any; // คุณสามารถกำหนด type ที่เฉพาะเจาะจงมากขึ้น เช่น Session จาก next-auth
}

export default function Home({ session }: HomeProps) {
  return (
    <div className="flex flex-col items-center w-full h-full  bg-white min-h-screen">
      <TabsComponent session={session} />
    </div>
  );
}
