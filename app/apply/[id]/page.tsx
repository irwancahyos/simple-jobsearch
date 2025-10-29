'use client'

import { ArrowLeft, Upload } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";

import uploadImageAvatar from '../../../asset/image/upload-avatar.png';
import { DOMICILE } from "@/data/domicile";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from '@/lib/supabaseClient';

import InputText from "@/app/components/input/InputText";
import InputDatePicker from "@/app/components/input/InputDatePicker";
import InputRadioGroup from "@/app/components/input/InputRadioGroup";
import InputSelectSearch from "@/app/components/input/InputSelectSearch";
import InputDialCode from "@/app/components/input/InputDialCode";
import { ApplyPageSkeleton } from "@/app/components/skeletons/candidatesSkeleton";
import HandCaptureModal from "@/app/components/hand-capture/HandCaptureModal";

// ********** Local Interface and Type **********
type ApplyFormData = {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  domicile: string;
  phoneNumber: string;
  email: string;
  linkedin: string;
  profilePict: string
};

type FieldValidation = {
  required: boolean;
};

type ApplicationField = {
  key: string;
  validation: FieldValidation;
};

type ApplicationSection = {
  title: string;
  fields: ApplicationField[];
};

type ApplicationForm = {
  sections: ApplicationSection[];
};

type JobType = {
  id: string;
  slug: string;
  title: string;
  status: string;
  created_at: string;
  metadata: any | null;
  salary_range: any;
  list_card: any;
  application_form: ApplicationForm;
  job_type: string;
  description: string;
  candidate_needed: number;
};

type RHFValidationRules = {
  required?: string | boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
};

// ********** Local Cnstant Variable **********
const FIELD_KEY_MAP = {
  fullName: 'full-name',
  dateOfBirth: 'dob',
  gender: 'gender',
  domicile: 'domicile',
  phoneNumber: 'phone',
  email: 'email',
  linkedin: 'linkedin',
  profilePict: "profile-pict"
};

const getValidationRules = (job: JobType | null, fieldName: keyof ApplyFormData): RHFValidationRules => {
  if (!job?.application_form?.sections) return {};

  const apiKey = FIELD_KEY_MAP[fieldName];
  if (!apiKey) return {};

  const fieldConfig = job.application_form.sections
    .flatMap(section => section.fields)
    .find(field => field.key === apiKey);

  if (fieldConfig?.validation?.required) {
    if(fieldName === 'email' || fieldName === 'linkedin') {
      if(fieldName === 'email') {
        return {required: 'Please enter your email in the format: name@example.com'}
      } else if(fieldName === 'linkedin') {
        return { required: 'Please copy paste your Linkedin URL, example: https://www.linkedin.com/in/username' };
      }
    } else {
      return { 
      required: `Required`, 
    };
    }
  }
  
  return {};
}

const shouldRenderField = (job: JobType | null, fieldName: keyof ApplyFormData): boolean => {
  const apiKey = FIELD_KEY_MAP[fieldName];
  if (!job?.application_form?.sections || !apiKey) return false;

  return job.application_form.sections.flatMap((section) => section.fields).some((field) => field.key === apiKey);
};


// ********** Main Component **********
const ApplyJobPage = () => {

  const params = useParams();
  const jobId = params?.id;
  const router = useRouter();

  const [job, setJob] = useState<JobType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [photoProfileUrl, setPhotoProfileUrl] = useState(uploadImageAvatar.src); 

  const { handleSubmit, setValue, control, formState: { errors } } = useForm<ApplyFormData>({
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: "",
      domicile: "",
      phoneNumber: "",
      email: "",
      linkedin: "",
      profilePict: ""
    }
  });

  const handleCaptureSuccess = (imageDataUrl: string) => {
    setPhotoProfileUrl(imageDataUrl);
    setValue('profilePict', imageDataUrl, { shouldValidate: true });
    setIsCaptureModalOpen(false);
    toast.success('Photo profile captured!');
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('jobs').select('*').eq('id', jobId).single();

      if (error) {
        console.log('Error fetching job:', error);
      } else {
        setJob(data);
      }
      setIsLoading(false);
    };

    fetchJob();
  }, [jobId]);

  const onSubmit = async (data: ApplyFormData) => {
    setIsLoading(true);

    try {
      // Build attributes array dynamically
      const attributes = Object.entries(renderField)
        .filter(([fieldName, shouldRender]) => shouldRender && data[fieldName as keyof ApplyFormData])
        .map(([fieldName], index) => {
          let key = '', label = '';
          switch(fieldName) {
            case 'fullName': key='full_name'; label='Full Name'; break;
            case 'email': key='email'; label='Email'; break;
            case 'phoneNumber': key='phone'; label='Phone'; break;
            case 'domicile': key='domicile'; label='Domicile'; break;
            case 'gender': key='gender'; label='Gender'; break;
            case 'linkedin': key='linkedin_link'; label='LinkedIn'; break;
            case 'profilePict': key='profile_picture'; label='Profile Picture'; break;
          }
          return { key, label, value: data[fieldName as keyof ApplyFormData], order: index+1 };
        });

      // Insert to Supabase
      const { error } = await supabase.from('applications').insert([{
        job_id: jobId,
        attributes
      }]);

      if (error) {
        console.error('Error inserting application:', error);
        toast.error('Failed to submit application.');
      } else {
        toast.success('Application submitted successfully!');
        router.push('/thankyou');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const rules = {
    profilePict: getValidationRules(job, 'profilePict'),
    fullName: getValidationRules(job, 'fullName'),
    dateOfBirth: getValidationRules(job, 'dateOfBirth'),
    gender: getValidationRules(job, 'gender'),
    domicile: getValidationRules(job, 'domicile'),
    phoneNumber: {
      ...getValidationRules(job, 'phoneNumber'),
    },
    email: {
      ...getValidationRules(job, 'email'),
      pattern: { value: /^\S+@\S+$/i, message: 'Please enter your email in the format: name@example.com' },
    },
    linkedin: {
      ...getValidationRules(job, 'linkedin'),
      pattern: {
        value: /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+\/?$/i,
        message: 'Please copy paste your Linkedin URL, example: https://www.linkedin.com/in/username',
      },
    },
  };

  const renderField = {
    fullName: shouldRenderField(job, 'fullName'),
    dateOfBirth: shouldRenderField(job, 'dateOfBirth'),
    gender: shouldRenderField(job, 'gender'),
    domicile: shouldRenderField(job, 'domicile'),
    phoneNumber: shouldRenderField(job, 'phoneNumber'),
    email: shouldRenderField(job, 'email'),
    linkedin: shouldRenderField(job, 'linkedin'),
    profilePict: shouldRenderField(job, 'profilePict')
  };

  return (
    <div className="w-full bg-[#FAFAFA] flex justify-center items-center sm:py-16">
      {isLoading ? (
        <ApplyPageSkeleton />
      ) : (
        <div className="bg-white sm:border sm:border-[#E0E0E0] sm:shadow w-full flex flex-col gap-[24px] h-screen sm:h-full sm:max-h-[800px] sm:max-w-[600px] md:max-w-[700px] max-[450px]:py-[40px] max-[450px]:px-[20px] p-[40px]">
          {/* Apply header */}
          <div className="flex items-center gap-[1rem]">
            <button
              onClick={() => router.push('/jobs')}
              className="w-[1.75rem] h-[1.75rem] bg-white hover:bg-[#f7f7f7] border p-1 shadow cursor-pointer border-[#E0E0E0] rounded-[8px] flex justify-center items-center"
            >
              <ArrowLeft strokeWidth={2} className="w-[1.25] h-[1.25] text-[#333333] font-semibold" />
            </button>
            <div className="flex-1 flex justify-between items-center">
              <h1 className="text-[#1D1F20] text-[1.125rem] font-semibold">{job?.title}</h1>
              <p className="text-[#404040] text-[0.875rem] max-[650px]:hidden">ℹ️ This field required to fill</p>
              <div className="min-[650px]:hidden">
                <Tooltip>
                  <TooltipTrigger>ℹ️</TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white text-[0.875rem]">This field required to fill</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Apply form */}
          <form id="applyForm" onSubmit={handleSubmit(onSubmit)} className="md:px-[24px] space-y-[1rem] overflow-y-auto">
            <div>
              <p className="text-(--error-color) text-[0.75rem] font-semibold">
                <span className="">*</span> Required
              </p>
            </div>
            <div className="w-full flex flex-col gap-[1rem]">
              <label className="text-[#404040] text-[0.75rem] font-semibold">Photo Profile</label>
              <Controller
                name="profilePict"
                control={control}
                rules={rules.profilePict}
                render={({ field, fieldState }) => (
                  <>
                    {/* Tampilkan Image */}
                    <Image
                      alt="Upload image pict"
                      src={photoProfileUrl}
                      width={300}
                      height={300}
                      className="w-[8rem] h-[8rem] object-cover rounded-full"
                    />

                    {/* Button take picture */}
                    <button
                      type="button"
                      onClick={() => setIsCaptureModalOpen(true)}
                      className="w-fit border border-[#E0E0E0] px-[1rem] py-1 flex gap-1 items-center hover:bg-[#f7f6f6] rounded-[8px] cursor-pointer shadow"
                    >
                      <Upload className="w-[0.875rem] h-[0.875rem]" strokeWidth={3} />
                      <span className="text-[#1D1F20] text-[0.875rem] font-semibold">Take a Picture</span>
                    </button>

                    {fieldState.error && <p className="text-red-500 text-[0.75rem]">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>

            {/* Full name */}
            {renderField.fullName && (
              <Controller
                name="fullName"
                control={control}
                rules={rules.fullName}
                render={({ field, fieldState }) => (
                  <InputText
                    {...field}
                    label="Full name"
                    placeholder="Enter your full name"
                    required={!!rules.fullName?.required}
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] 
                 focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* Date of Birth */}
            {renderField.dateOfBirth && (
              <Controller
                name="dateOfBirth"
                control={control}
                rules={rules.dateOfBirth}
                render={({ field, fieldState }) => (
                  <InputDatePicker
                    label="Date of Birth"
                    required={!!rules.dateOfBirth.required}
                    placeholder="30 January 2021"
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.toISOString() : '');
                    }}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* Gender */}
            {renderField.gender && (
              <Controller
                name="gender"
                control={control}
                rules={rules.gender}
                render={({ field }) => (
                  <InputRadioGroup
                    {...field}
                    label="Pronoun (gender)"
                    required={!!rules.gender.required}
                    options={[
                      { label: 'She/her (Female)', value: 'female' },
                      { label: 'He/him (Male)', value: 'male' },
                    ]}
                    name="layout"
                    direction="horizontal"
                    errorMessage={errors?.gender?.message}
                    gap="gap-4"
                  />
                )}
              />
            )}

            {/* Domicile */}
            {renderField.domicile && (
              <Controller
                name="domicile"
                control={control}
                rules={rules.domicile}
                render={({ field }) => (
                  <InputSelectSearch
                    {...field}
                    label="Domisili"
                    required={!!rules.domicile.required}
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11"
                    placeholder="Pilih provinsi..."
                    options={DOMICILE.map((d) => ({
                      label: d.value,
                      value: d.id,
                    }))}
                    errorMessage={errors.domicile?.message}
                  />
                )}
              />
            )}

            {/* Phone number (dumyy data) */}
            {renderField.phoneNumber && (
              <Controller
                name="phoneNumber"
                control={control}
                rules={rules.phoneNumber}
                render={({ field }) => (
                  <InputDialCode
                    {...field}
                    required={!!rules.phoneNumber.required}
                    placeholder="81XXXXXXXXX"
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                    error={errors.phoneNumber?.message}
                  />
                )}
              />
            )}

            {/* Email */}
            {renderField.email && (
              <Controller
                name="email"
                control={control}
                rules={rules.email}
                render={({ field, fieldState }) => (
                  <InputText
                    {...field}
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    required={!!rules.email?.required}
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040]
                 focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* Linkedin */}
            {renderField.linkedin && (
              <Controller
                name="linkedin"
                control={control}
                rules={rules.linkedin}
                render={({ field, fieldState }) => (
                  <InputText
                    {...field}
                    label="Link Linkedin"
                    placeholder="https://www.linkedin.com/in/username"
                    required={!!rules.linkedin?.required}
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040]
                 focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            )}
          </form>

          {/* Apply Action */}
          <div className="w-full">
            <button
              type="submit"
              form="applyForm"
              className="bg-[#01959F] w-full hover:bg-[#038690] cursor-pointer px-[1rem] py-[6px] rounded-[8px] text-white text-[1rem] font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      <Toaster position="bottom-left" />
      {isCaptureModalOpen && <HandCaptureModal onClose={() => setIsCaptureModalOpen(false)} onCaptureSuccess={handleCaptureSuccess} />}
    </div>
  );
};

export default ApplyJobPage;
