'use client';

import { Footer } from '../components/footer/Footer';
import Navbar from '../components/navbar/Navbar';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/10">
      <div className="flex flex-col pt-16">
        <Navbar candidatePage />
        <main className="flex-1 flex px-5 py-5 justify-center">{children}</main>
      </div>
      <div className="w-full px-5">
        <div className="max-w-[1400px] xl:px-[100px] m-auto ">
          <div className="py-4 px-0 border-t border-t-[rgb(237,237,237)]">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
