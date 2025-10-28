'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

import InputText from '@/app/components/input/InputText'
import { supabase } from '@/lib/supabaseClient'
import { cn } from '@/lib/utils'

// ********** Local Interface **********
type RegisterRecruiterForm = {
  email: string
  password: string
}

// ********** Main Component **********
const LoginComponent = () => {
  const [isOpenEye, setIsOpenEye] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRecruiterForm>({
    defaultValues: { email: '', password: '' },
    mode: 'all'
  })

  const onSubmit = async (data: RegisterRecruiterForm) => {
    try {
      const { email, password } = data;

      // ********** Supabase Sign In **********
      const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || 'Gagal login, periksa kembali data Anda.');
        return;
      }

      toast.success('Berhasil login 🎉');
      localStorage.setItem('user', JSON.stringify(loginData.session));
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan tak terduga.');
    }
  };

  return (
    <div className="w-full bg-white shadow flex p-[20px] md:p-[40px]">
      <Toaster position="top-right" />
      <div className="w-full flex flex-col gap-3">
        {/* ********** Header ********** */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[#404040] text-[1.25rem] font-semibold">Masuk ke Rakamin</h1>
          <p className="text-[0.875rem] font-normal text-[#404040]">
            Belum punya akun?{' '}
            <Link className="underline text-(--secondary-color)" href="/register">
              Daftar menggunakan email
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
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Format email tidak valid',
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="Ex. dio@raka.com"
                  label="Alamat email"
                  errorMessage={errors?.email?.message}
                  className={`relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]`}
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Kata sandi wajib diisi',
                minLength: {
                  value: 6,
                  message: 'Kata sandi minimal 6 karakter',
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
                  label="Kata sandi"
                  className={`relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]`}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'px-[1rem] py-[6px] w-full flex justify-center items-center rounded-[8px] shadow bg-[#FBC037] hover:bg-[#f6b92b] text-[#404040] font-semibold disabled:opacity-60',
              isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 border-2 border-(--secondary-color) border-t-transparent rounded-full animate-spin"></span>
                Menunggu...
              </div>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginComponent;
