"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";

type Choice = "mandatory" | "optional" | "off";

type FieldConfig = {
  id: string;
  label: string;
  fixedMandatory?: boolean; // contoh: name, email, phone
  initial?: Choice;
};

interface Props {
  fields: FieldConfig[];
  onChange?: (state: Record<string, Choice>) => void;
}

export default function ProfileFieldsConfigurator({ fields, onChange }: Props) {
  const initialState = useMemo(() => {
    const s: Record<string, Choice> = {};
    fields.forEach((f) => {
      if (f.fixedMandatory) s[f.id] = 'mandatory';
      else s[f.id] = f.initial ?? 'optional';
    });
    return s;
  }, [fields]);

  const [state, setState] = useState<Record<string, Choice>>(initialState);

useEffect(() => {
  onChange?.(state);
}, [state, onChange]);

const setField = (id: string, value: Choice) => {
  setState((prev) => ({ ...prev, [id]: value }));
};

  return (
    <div className="divide-y divide-[#F0F0F0]">
      {fields.map((f) => {
        const current = state[f.id];
        const isFixed = !!f.fixedMandatory;

        return (
          <div key={f.id} className="flex items-center justify-between gap-4 py-3 sm:px-[8px] first:pt-4 last:pb-4">
            <div className="flex-1">
              <div className="text-[0.95rem] text-[#1f1f1f]">{f.label}</div>
            </div>

            <div className="hidden sm:flex gap-2 items-center">
              {(['mandatory', 'optional', 'off'] as Choice[]).map((choice) => {
                const active = current === choice;
                const base = 'px-[12px] py-[4px] rounded-[1rem] text-[0.875rem] font-normal transition-colors duration-150 cursor-pointer';
                const activeClass = 'bg-white text-(--secondary-color) border border-(--secondary-color) shadow-sm';
                const normalClass = 'bg-white text-[#404040] border border-[#E0E0E0]';
                const disabledClass = 'bg-[#F5F5F5] text-[#BDBDBD] border border-[#E0E0E0] pointer-events-none';

                // disable buttons if field is fixedMandatory and not its active choice
                const isDisabled = isFixed && choice !== 'mandatory';

                const className = `${base} ${isDisabled ? disabledClass : active ? activeClass : normalClass}`;

                return (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={active}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setField(f.id, choice)}
                    className={className}
                  >
                    {choice === 'mandatory' ? 'Mandatory' : choice === 'optional' ? 'Optional' : 'Off'}
                  </button>
                );
              })}
            </div>

            <div className="sm:hidden mt-2">
              <Select value={current} onValueChange={(value: Choice) => setField(f.id, value)} disabled={isFixed}>
                <SelectTrigger className="w-[120px] cursor-pointer sm:w-full border border-[#E0E0E0] rounded-[8px] px-2 py-[6px] text-sm text-[#404040] bg-white">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="mandatory">
                    Mandatory
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="optional">
                    Optional
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="off">
                    Off
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
