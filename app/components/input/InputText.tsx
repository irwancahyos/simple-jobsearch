import React, { ChangeEvent, ReactNode, useState, useEffect } from "react";
import { cn, formatRupiah, parseNumber } from "@/lib/utils";

// ********** Local interface **********
interface InputTextProps {
  type?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement> | { target: { value: any } }) => void;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
  label?: string;
  onBlur?: () => void
  name?: string;
  required?: boolean;
  currency?: "IDR";
  containerSpaceYClass?: string;
}
// ********** Main Component **********
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
  required,
  currency,
  containerSpaceYClass = 'space-y-1.5'
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (currency) {
      setDisplayValue(formatRupiah(value ?? ""));
    } else {
      setDisplayValue(value?.toString() ?? "");
    }
  }, [value, currency]);

  const errorClasses = "border-2 border-[var(--error-color)]";

  return (
    <div className={cn('relative', containerSpaceYClass)}>
      {label && (
        <div>
          <label htmlFor={label} className="text-[0.75rem] text-[#404040]">
            {label}
            {required && <span className="text-[var(--error-color)] leading-[1.25rem]">*</span>}
          </label>
        </div>
      )}
      <div className={cn(className, errorMessage && errorClasses)}>
        {prefix && <div className="absolute left-3 flex items-center text-gray-500">{prefix}</div>}

        <input
          id={label}
          type={type}
          name={name}
          onBlur={onBlur}
          value={displayValue}
          onChange={(e) => {
            if (currency) {
              const rawNumber = parseNumber(e.target.value);
              setDisplayValue(formatRupiah(rawNumber));
              onChange?.({ target: { value: Number(rawNumber) } } as any);
            } else {
              setDisplayValue(e.target.value);
              onChange?.(e);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg py-2 px-3 focus:outline-none text-sm bg-transparent placeholder:text-[#9E9E9E] ${
            prefix ? 'pl-9' : ''
          } ${suffix ? 'pr-9' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        {suffix && <div className="absolute right-3 flex items-center text-gray-500">{suffix}</div>}
      </div>
      {errorMessage && <span className="text-[var(--error-color)] text-[0.75rem]">{errorMessage}</span>}
    </div>
  );
};

export default InputText;
