'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

import InputText from '@/app/components/input/InputText';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// ********** Local Interface **********
type RegisterCandidateForm = {
  email: string;
  password: string;
};

// ********** Main Component **********
const CandidateRegister = () => {
  
  const router = useRouter();
  const [isOpenEye, setIsOpenEye] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCandidateForm>({
    defaultValues: { email: '', password: '' },
    mode: 'all',
  });

  // ********** Handle Submit **********
  const onSubmit = async (data: RegisterCandidateForm) => {
    setIsLoading(true);
    try {
      const emailTrimmed = data.email.trim().toLowerCase();

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password: data.password,
      });
      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) throw new Error('Gagal mendapatkan ID user');

      const { error: profileError } = await supabase.from('profiles').insert([{ id: userId, email: emailTrimmed, role: 'candidate' }]);
      if (profileError) throw profileError;

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: data.password,
      });
      if (signInError) throw signInError;

      toast.success('Akun berhasil dibuat 🎉');
      reset();
      router.push('/jobs');
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat akun, coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white shadow flex p-[20px] md:p-[40px]">
      <Toaster position="top-right" />
      <div className="w-full flex flex-col gap-3">
        {/* ********** Header ********** */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[#404040] text-[1.25rem] font-semibold">Join with Rakamin</h1>
          <p className="text-[0.875rem] font-normal text-[#404040]">
            Already have an account?{' '}
            <Link className="underline text-(--secondary-color)" href="/login">
              Login
            </Link>
          </p>
        </div>

        {/* ********** Form ********** */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[14px]">
          <div className="flex flex-col gap-1.5">
            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email pattern is not valid',
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="Ex. dio@raka.com"
                  label="Email address"
                  errorMessage={errors?.email?.message}
                  className={`relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]`}
                />
              )}
            />

            {/* ********** Password ********** */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Min 6 digit for password',
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder=""
                  type={isOpenEye ? 'text' : 'password'}
                  errorMessage={errors?.password?.message}
                  suffix={
                    isOpenEye ? (
                      <Eye size={14} onClick={() => setIsOpenEye(!isOpenEye)} className="cursor-pointer" />
                    ) : (
                      <EyeOff size={14} onClick={() => setIsOpenEye(!isOpenEye)} className="cursor-pointer" />
                    )
                  }
                  label="Password"
                  className={`relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]`}
                />
              )}
            />
          </div>

          {/* ********** Submit Button ********** */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className={cn(
              'px-[1rem] py-[6px] w-full flex justify-center items-center rounded-[8px] shadow bg-[#FBC037] hover:bg-[#f6b92b] text-[#404040] font-semibold disabled:opacity-60',
              isLoading || isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {isLoading || isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 border-2 border-(--secondary-color) border-t-transparent rounded-full animate-spin"></span>
                Waiting...
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateRegister;
