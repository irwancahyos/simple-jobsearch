"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-gray-600">Sorry, halaman yang kamu tuju tidak ada.</p>
      <Link href="/" className="text-white bg-teal-600 px-4 py-2 rounded hover:bg-teal-700">
        Kembali ke Home
      </Link>
    </div>
  );
}
