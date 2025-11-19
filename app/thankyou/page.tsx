'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThankyouImage from '@/asset/image/Thankyou.png';

const Thankyou = () => {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex justify-center items-center p-[1rem]">
      <div className="md:max-w-[37.875rem] w-full flex flex-col justify-center items-center">
        {/* ********** Thankyou image ********** */}
        <div>
          <Image alt="Thankyou image" height={300} width={300} src={ThankyouImage?.src} className="w-[12.5rem] h-[12.5rem]" />
        </div>

        {/* ********** Thankyou text ********** */}
        <div className="flex flex-col justify-center items-center">
          <div>
            <h1 className="text-[#404040] text-[1.5rem] font-semibold">🎉 Your application was sent!</h1>
          </div>
          <div>
            <p className="text-[#404040] text-[1rem] text-center">
              Congratulations! You've taken the first step towards a rewarding career at Rakamin. We look forward to learning more about you
              during the application process.
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center mt-2">
          <button
            onClick={() => router.push('/jobs')}
            className="py-[6px] px-[1rem] cursor-pointer rounded-[8px] text-[0.875rem] font-semibold text-[#404040] bg-[#FBC037] hover:bg-[#f5b92e]"
          >
            back to jobs
          </button>
        </div>
      </div>
    </div>
  );
}

export default Thankyou;