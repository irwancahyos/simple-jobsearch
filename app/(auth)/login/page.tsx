'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import InputText from '@/app/components/input/InputText';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie'
import { useUserStore } from '@/app/store/userStore';

// ********** Local Interface **********
type LoginForm = {
  email: string;
  password: string;
};

// ********** Main Component **********
const LoginComponent = () => {
  const { setProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenEye, setIsOpenEye] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
    mode: 'all',
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const emailTrimmed = data.email.trim().toLowerCase();

      // ********** Sign In **********
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: data.password,
      });

      if (loginError) throw loginError;
      if (!loginData.user) throw new Error('User not found');

      const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', loginData.user.id).single();

      if (profileError) throw profileError;
      if (!profile?.role) throw new Error('Role is not found');

      // ********** sava in loaclstorage and session **********
      localStorage.setItem('user', JSON.stringify(loginData.session));
      localStorage.setItem(
        'userProfile',
        JSON.stringify({
          id: loginData.user.id,
          email: loginData.user.email,
          role: profile.role,
        }),
      );
      setProfile({
        id: loginData.user.id,
        email: loginData?.user.email || '',
        role: loginData.user.user_metadata.role,
      });

      toast.success('Success login');      
      
      // ********** save to cookie to allow session per user **********
      Cookies.set('role', profile.role, { expires: 7 })

      // ********** Redirect sesuai role **********
      if (profile.role === 'recruiter') {
        router.push('/dashboard')
      } else if (profile.role === 'candidate') {
        router.push('/jobs')
      } else {
        toast.error('Role is not valid');
      }
    } catch (err: any) {
      toast.error(err.message || 'random error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white shadow flex p-[20px] md:p-[40px]">
      <Toaster position="top-right" />
      <div className="w-full flex flex-col gap-3">
        {/* Header */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[#404040] text-[1.25rem] font-semibold">Join with Rakamin</h1>
          <p className="text-[0.875rem] font-normal text-[#404040]">
            Don't have an account ?{' '}
            <Link className="underline text-(--secondary-color)" href="/register">
              Register with email
            </Link>
          </p>
        </div>

        {/* Form */}
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
                  className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                />
              )}
            />

            {/* Password */}
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
                  type={isOpenEye ? 'text' : 'password'}
                  label="Password"
                  placeholder=""
                  errorMessage={errors?.password?.message}
                  suffix={
                    isOpenEye ? (
                      <Eye size={14} onClick={() => setIsOpenEye(!isOpenEye)} className="cursor-pointer" />
                    ) : (
                      <EyeOff size={14} onClick={() => setIsOpenEye(!isOpenEye)} className="cursor-pointer" />
                    )
                  }
                  className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting }
            className={cn(
              'px-[1rem] py-[6px] w-full flex justify-center items-center rounded-[8px] shadow bg-[#FBC037] hover:bg-[#f6b92b] text-[#404040] font-semibold disabled:opacity-60',
              isLoading || isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 border-2 border-(--secondary-color) border-t-transparent rounded-full animate-spin"></span>
                Waiting...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
