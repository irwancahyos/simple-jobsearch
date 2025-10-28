"use client";

import React, { useState, useRef, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ********** Local Interface **********
interface InputDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
  containerSpaceYClass?: string;
}

// ********** Main Component **********
const InputDatePicker: React.FC<InputDatePickerProps> = ({
  value,
  onChange,
  label,
  required,
  placeholder = "Pilih tanggal...",
  errorMessage,
  className = "",
  name,
  disabled = false,
  containerSpaceYClass = 'space-y-1.5',
}) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"month" | "year" | "decade">("month");
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setView("month");
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDrillUp = () => {
    if (view === "month") setView("year");
    else if (view === "year") setView("decade");
  };

  const handleDrillDown = () => {
    if (view === "decade") setView("year");
    else if (view === "year") setView("month");
  };

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

  const errorClasses = "border-2 border-[var(--error-color)]";

  return (
    <div className={cn('relative', containerSpaceYClass)} ref={containerRef}>
      {label && (
        <div>
          <label htmlFor={name} className="text-[0.75rem] text-[#404040]">
            {label} {required && <span className="text-[var(--error-color)]">*</span>}
          </label>
        </div>
      )}

      <div
        className={cn(
          'w-full rounded-lg min-h-11 border-2 bg-white relative flex items-center transition-colors duration-300',
          errorMessage ? errorClasses : focused ? 'border-[#01959F]' : 'border-[#EDEDED]',
          className,
        )}
      >
        {/* ********** Prefix: Calendar icon ********** */}
        <div className="absolute left-3 flex items-center text-gray-500">
          <CalendarDays className="w-4 h-4" />
        </div>

        <input
          type="text"
          name={name}
          value={formatDate(value || null)}
          onClick={() => !disabled && setOpen(!open)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full py-2 px-3 text-sm bg-white text-[#757575] placeholder:text-[#9E9E9E] pl-9 pr-9 focus:outline-none rounded-lg',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          )}
        />

        <div className="absolute right-3 flex items-center text-[#1D1F20] transition-transform duration-200">
          <ChevronDown
            strokeWidth={3}
            className={cn('w-4 h-4 transform transition-transform duration-200', open ? 'rotate-180' : 'rotate-0')}
          />
        </div>

        {/* ********** Calendar popover ********** */}
        {open && !disabled && (
          <div className="absolute top-full mt-1 z-50 bg-white rounded-xl shadow-xl p-2">
            <Calendar
              onChange={(date: any) => {
                onChange?.(Array.isArray(date) ? date[0] : date);
                setOpen(false);
                setView('month');
                setFocused(false);
              }}
              value={value ?? new Date()}
              view={view}
              onDrillUp={handleDrillUp}
              onDrillDown={handleDrillDown}
              locale="en-GB"
              formatShortWeekday={(locale, date) => {
                const shortDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                return shortDays[date.getDay()];
              }}
              tileClassName="!text-[#1D1F20]" 
            />
          </div>
        )}
      </div>

      {errorMessage && <span className="text-[var(--error-color)] text-[0.75rem]">{errorMessage}</span>}
    </div>
  );
};

export default InputDatePicker;
