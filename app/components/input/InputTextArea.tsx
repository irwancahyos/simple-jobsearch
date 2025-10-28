import { cn } from "@/lib/utils";
import React, { ChangeEvent } from "react";

// ********** Local interface **********
interface TextAreaProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  rows?: number;
}

// ********** Main Component **********
const InputTextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
  errorMessage,
  label,
  required,
  rows = 4,
}) => {

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

      <div className={cn(className, errorMessage && errorClasses)}>
        <textarea
          id={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`w-full rounded-lg py-2 px-3 focus:outline-none text-sm bg-transparent resize-none placeholder:text-[#9E9E9E] ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>

      {errorMessage && <p className="text-[#E11428] text-[0.75rem]">{errorMessage}</p>}
    </div>
  );
};

export default InputTextArea;
