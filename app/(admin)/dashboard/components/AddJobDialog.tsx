"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import InputText from "@/app/components/input/InputText"
import InputSelect from "@/app/components/input/InputSelect"
import InputTextArea from "@/app/components/input/InputTextArea"
import ProfileFieldsConfigurator from "./ProfileFileConfigurator"
import { useForm, Controller } from "react-hook-form"

// ********** Local Interface **********
type Choice = "mandatory" | "optional" | "off";
interface JobForm {
  jobName: string
  jobType: string
  jobDescription: string
  candidateNeeded: string
  minSalary: string
  maxSalary: string
}

// ********** Main Component **********
export const AddJobDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const fields = [
    { id: 'full-name', label: 'Full Name', fixedMandatory: true },
    { id: 'profile-pict', label: 'Photo Profile', fixedMandatory: true },
    { id: 'gender', label: 'Gender' },
    { id: 'domicile', label: 'Domicile' },
    { id: 'email', label: 'Email', fixedMandatory: true },
    { id: 'phone', label: 'Phone Number' },
    { id: 'linkedin', label: 'Linkedin link' },
    { id: 'dob', label: 'Date of birth' },
  ];

  const initialProfileState = useMemo(() => {
    const s: Record<string, Choice> = {};
    fields.forEach((f) => {
      s[f.id] = f.fixedMandatory ? 'mandatory' : 'optional';
    });
    return s;
  }, [fields]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<JobForm>({
    mode: "all",
    defaultValues: {
      jobName: "",
      jobType: "",
      jobDescription: "",
      candidateNeeded: "",
      minSalary: "",
      maxSalary: "",
    },
  })

  const [profileFields, setProfileFields] = useState<Record<string, any>>(initialProfileState);

  const resetForm = () => {
    setProfileFields(initialProfileState);
    reset();
  }

  const handleProfileFieldChange = (value:Record<string, Choice>) => {
    setProfileFields(value);
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, reset]);

  const activeButtonClasses =
    "text-white bg-[#01959F] cursor-pointer hover:bg-[#017C86]"
  const inActiveButtonClasses =
    "text-[#9E9E9E] bg-[#EDEDED] border border-[#E0E0E0] cursor-not-allowed"
  

  const onSubmit = (data: JobForm) => {
    const payload = {
      ...data,
      profileFields,
    }

    resetForm();
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-[450px]:max-w-[350px] md:max-w-[700px] lg:max-w-[900px]! [&>button[data-slot=dialog-close]:not([data-custom-close])]:hidden p-0 gap-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-[24px] border-b border-b-[#E0E0E0]">
          <DialogTitle className="text-[1.125rem] text-[#1D1F20] font-semibold">
            Job Opening
          </DialogTitle>
          <DialogClose asChild data-custom-close>
            <button
              type="button"
              className="opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-[24px] py-3 space-y-2 max-h-[60vh] overflow-y-scroll overflow-x-hidden">
            <div className="space-y-2 pb-2 border-b border-dashed border-b-[#E0E0E0]">
              {/* Job Name */}
              <Controller
                control={control}
                name="jobName"
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    errorMessage={errors.jobName?.message}
                    placeholder="Ex. Front End Engineer"
                    required
                    label="Job Name"
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                  />
                )}
              />

              {/* Job Type */}
              <Controller
                control={control}
                name="jobType"
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <InputSelect
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    required
                    errorMessage={errors.jobType?.message}
                    placeholder="Select Job Type"
                    options={[
                      { label: "Full-time", value: "full-time" },
                      { label: "Contract", value: "contract" },
                      { label: "Part-time", value: "part-time" },
                      { label: "Internship", value: "internship" },
                      { label: "Freelance", value: "freelance" },
                    ]}
                    label="Job Type"
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11"
                  />
                )}
              />

              {/* Job Description */}
              <Controller
                control={control}
                name="jobDescription"
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <InputTextArea
                    {...field}
                    errorMessage={errors.jobDescription?.message}
                    label="Job Description"
                    required
                    placeholder="Ex. Write short description..."
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11"
                  />
                )}
              />

              {/* Candidate Needed */}
              <Controller
                control={control}
                name="candidateNeeded"
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    errorMessage={errors.candidateNeeded?.message}
                    placeholder="Ex. 2"
                    required
                    label="Number of Candidate Needed"
                    className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                  />
                )}
              />
            </div>

            {/* Salary Fields */}
            <div>
              <div className="space-y-1">
                <div>
                  <span className="text-[#404040] text-[0.75rem]">
                    Job Salary
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:gap-[1rem] items-center">
                  <div className="w-full sm:w-[50%]">
                    <Controller
                      control={control}
                      name="minSalary"
                      render={({ field }) => (
                        <InputText
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          placeholder="Rp 7.000.000"
                          label="Minimum Estimated Salary"
                          className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                        />
                      )}
                    />
                  </div>
                  <div className="hidden sm:block">
                    <hr className="w-[1rem] border border-[#E0E0E0] mt-7" />
                  </div>
                  <div className="w-full sm:w-[50%]">
                    <Controller
                      control={control}
                      name="maxSalary"
                      render={({ field }) => (
                        <InputText
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          placeholder="Rp 8.000.000"
                          label="Maximum Estimated Salary"
                          className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11 max-h-[40px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Config */}
              <div className="border border-[#EDEDED] rounded-[8px] p-[16px] mt-4">
                <p className="text-[#404040] text-[0.875rem] font-bold">
                  Minimum Profile Information Required
                </p>
                <div className="sm:p-[8px]">
                  <ProfileFieldsConfigurator
                    fields={fields}
                    onChange={(v) => handleProfileFieldChange(v)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-[24px] flex justify-end items-end border-t border-t-[#E0E0E0]">
            <button
              type="submit"
              disabled={!isValid}
              className={cn(
                "py-[4px] px-[1rem] w-fit text-[0.875rem] font-bold rounded-[8px] shadow duration-300",
                isValid ? activeButtonClasses : inActiveButtonClasses
              )}
            >
              Publish Job
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
