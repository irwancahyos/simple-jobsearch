"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ********** Local Interface **********
type Country = {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
};

type Props = {
  value?: string;
  onChange?: (val: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

// use dummy data for temporary, we can change to use react-input-phone-number latter or just update the data
const countries: Country[] = [
  { code: 'ID', dialCode: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'MY', dialCode: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
];

// ********** Main Component **********
const InputDialCode = ({
  value,
  onChange,
  onBlur,
  error,
  placeholder = "8123456789",
  className,
  required
}: Props) => {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    countries[0]
  );
  const [open, setOpen] = React.useState(false);

  const errorClasses = "border-2 border-[var(--error-color)]!";

  return (
    <div className="flex flex-col w-full space-y-1.5">
      <div>
        <label className="text-[0.75rem] text-[#404040]">
          {'Phone number'} {required && <span className="text-[var(--error-color)]">*</span>}
        </label>
      </div>

      <div
        className={cn(
          'flex items-center rounded-[8px] bg-white text-[#404040] text-[0.875rem] min-h-11 max-h-[40px] duration-300',
          error && errorClasses ,
          className,
        )}
      >
        {/* ********** Popover choose country ********** */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="pr-0" asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex items-center gap-1 px-3 min-w-[70px] justify-between"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">
            <Command>
              <CommandInput placeholder="Cari negara..." />
              <CommandEmpty>Tidak ditemukan</CommandEmpty>
              <CommandGroup>
                {countries.map((c) => (
                  <CommandItem
                    key={c.code}
                    value={c.name}
                    onSelect={() => {
                      setSelectedCountry(c);
                      setOpen(false);
                    }}
                    className="flex justify-between"
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="ml-2 flex-1">{c.name}</span>
                    <span className="text-gray-500">{c.dialCode}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* ********** Dial code ********** */}
        <span className="select-none">{selectedCountry.dialCode}</span>

        {/* ********** Numbert input ********** */}
        <input
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value ?? '')}
          onBlur={onBlur}
          className="flex-1 outline-none p-2 text-[#404040] text-[0.875rem] placeholder:text-[#9E9E9E]"
        />
      </div>

      {error && <span className="text-[#E11428] text-[14px] mt-1">{error}</span>}
    </div>
  );
}

export default InputDialCode;
