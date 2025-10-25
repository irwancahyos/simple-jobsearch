import { cn } from "@/lib/utils";
import React, { ReactNode, ChangeEvent } from "react";

interface InputTextProps {
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
  label?: string;
  onBlur?: () => void;
  name?: string;
  required?: boolean
}

const InputText: React.FC<InputTextProps> = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  prefix,
  name,
  onBlur,
  suffix,
  disabled = false,
  className = "",
  errorMessage,
  label,
  required
}) => {


  const errorClasses = 'border-2 border-(--error-color)';
  return (
    <div className="space-y-1.5">
      {label && (
        <div>
          <label htmlFor={label} className="text-[0.75rem] text-[#404040]">
            {label}
            {required && <span className="text-(--error-color) leading-[1.25rem]">*</span>}
          </label>
        </div>
      )}
      <div>
        <div className={cn(className, errorMessage && errorClasses)}>
          {/* Prefix (opsional) */}
          {prefix && <div className="absolute left-3 flex items-center text-gray-500">{prefix}</div>}

          {/* Input utama */}
          <input
            id={label}
            type={type}
            name={name}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-lg py-2 px-3 focus:outline-none text-sm bg-transparent placeholder:text-[#9E9E9E] ${
              prefix ? 'pl-9' : ''
            } ${suffix ? 'pr-9' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />

          {/* Suffix */}
          {suffix && <div className="absolute right-3 flex items-center text-gray-500">{suffix}</div>}
        </div>
        {errorMessage && <span className="text-(--error-color) text-[0.75rem]">{errorMessage}</span>}
      </div>
    </div>
  );
};

export default InputText;
