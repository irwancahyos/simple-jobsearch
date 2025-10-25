"use client";

import React, { ReactNode } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface InputSelectProps {
  label?: string;
  required?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
  options?: { label: string; value: string }[];
}

const InputSelect: React.FC<InputSelectProps> = ({
  label,
  required,
  value,
  onValueChange,
  placeholder = "",
  prefix,
  suffix,
  disabled = false,
  className = "",
  errorMessage,
  options = [],
}) => {

  console.log(value, 'ini value')

  const errorClasses = 'border-2 border-(--error-color)';
  return (
    <div className="space-y-1.5">
      {label && (
        <div>
          <label htmlFor={label} className="text-[0.75rem] text-[#404040]">
            {label}
            {required && <span className="text-[#E11428] leading-[1.25rem]">*</span>}
          </label>
        </div>
      )}

      <div className={cn('relative', className, errorMessage && errorClasses)}>
        {/* Prefix (opsional) */}
        {prefix && <div className="absolute left-3 flex items-center text-gray-500 z-10">{prefix}</div>}

        {/* Select utama */}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            id={label}
            className={`w-full border-0 text-[0.875rem] min-h-11 px-3 py-2 cursor-pointer ${
              prefix ? 'pl-9' : ''
            } ${suffix ? 'pr-9' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} data-[placeholder]:text-[#9E9E9E]`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem className="cursor-pointer" key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Suffix (opsional) */}
        {suffix && <div className="absolute right-3 flex items-center text-gray-500 z-10">{suffix}</div>}
      </div>

      {/* Error message (opsional) */}
      {errorMessage && <p className="text-[#E11428] text-[0.75rem]">{errorMessage}</p>}
    </div>
  );
};

export default InputSelect;
