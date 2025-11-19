import Image from "next/image";
import React from "react";
import rakaminImage from '@/asset/image/Optiiion-new-logo.png';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="w-[90vw] md:w-[31.25rem] flex flex-col gap-[16px]">
        <div>
          <Image width={200} height={100} src={rakaminImage?.src} alt="This image of rakamin logo" />
        </div>
        {children}
      </div>
    </div>
  )
}
