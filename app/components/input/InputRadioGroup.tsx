"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ********** Local interface **********
interface Option {
  label: string;
  value: string;
}

interface InputRadioGroupProps {
  label?: string;
  required?: boolean;
  errorMessage?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  containerSpaceYClass?: string;
  direction?: "vertical" | "horizontal";
  gap?: string;
}

// ********** Main Component **********
const InputRadioGroup: React.FC<InputRadioGroupProps> = ({
  label,
  required,
  errorMessage,
  options,
  value,
  onChange,
  name,
  disabled = false,
  containerSpaceYClass = "space-y-1.5",
  direction = "vertical",
  gap = "gap-2",
}) => {

  return (
    <div className={cn("flex flex-col", containerSpaceYClass)}>
      {label && (
        <div>
          <label htmlFor={name} className="text-[0.75rem] text-[#404040]">
            {label} {required && <span className="text-[var(--error-color)]">*</span>}
          </label>
        </div>
      )}

      <RadioGroup
        value={value}
        onValueChange={(val) => !disabled && onChange?.(val)}
        className={cn(
          direction === "vertical" ? "flex flex-col" : "flex flex-row items-center",
          gap
        )}
      >
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center">
            <RadioGroupItem
              className="border border-[#404040] w-[1.25rem] h-[1.25rem] [&>span[data-slot='radio-group-indicator']>svg]:fill-[#01959F] [&>span[data-slot='radio-group-indicator']>svg]:w-4
    [&>span[data-slot='radio-group-indicator']>svg]:h-4"
              id={`${name}-${idx}`}
              value={opt.value}
              disabled={disabled}
            />
            <label htmlFor={`${name}-${idx}`} className="text-[0.875rem] text-[#404040] ml-1">
              {opt.label}
            </label>
          </div>
        ))}
      </RadioGroup>

      {errorMessage && <span className="text-[var(--error-color)] text-[0.75rem]">{errorMessage}</span>}
    </div>
  );
};

export default InputRadioGroup;
