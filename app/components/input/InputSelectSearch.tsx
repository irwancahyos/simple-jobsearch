"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// ********** Local interface **********
interface Option {
  label: string;
  value: string;
}

interface InputComboProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: Option[];
  errorMessage?: string;
  disabled?: boolean;
  className?: string; 
  containerClassName?: string;
  containerSpaceYClass?: string;
}

// ********** Main Component **********
const InputSelectSearch: React.FC<InputComboProps> = ({
  label,
  required,
  value,
  onChange,
  placeholder = "Pilih...",
  options,
  errorMessage,
  disabled = false,
  className = "",
  containerClassName = "",
  containerSpaceYClass = "space-y-1.5",
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // close dropdown when click in the outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const errorClasses = "border-2 border-[var(--error-color)]";

  return (
    <div className={cn('relative', containerSpaceYClass, containerClassName)} ref={ref}>
      {label && (
        <div>
          <label className="text-[0.75rem] text-[#404040]">
            {label} {required && <span className="text-[var(--error-color)]">*</span>}
          </label>
        </div>
      )}

      <div
        className={cn(
          'relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className,
          errorMessage && errorClasses,
        )}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
            onChange?.(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent px-3 py-2 outline-none text-sm"
        />
      </div>

      {open && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full max-h-[268px] overflow-auto bg-white border border-[#EDEDED] rounded-md mt-1 shadow-lg">
          {filteredOptions.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                setInputValue(opt.label);
                onChange?.(opt.value);
                setOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-[#F3F3F3] text-sm"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {errorMessage && <span className="text-[var(--error-color)] text-[0.75rem]">{errorMessage}</span>}
    </div>
  );
};

export default InputSelectSearch;
