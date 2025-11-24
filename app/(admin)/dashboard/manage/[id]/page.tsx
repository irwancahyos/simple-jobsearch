"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";

import ManageTable from "../../components/ManageTable";
import noCandidateFound from '@/asset/image/No Candidate Found.png'
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { ManageJobSkeleton } from "@/app/components/skeletons/adminSkeletons";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import InputText from "@/app/components/input/InputText";
import toast from "react-hot-toast";

// *************** Local interface and types ***************
type Applicant = {
  id: string;
  job_id: string;
  created_at: string;
  updated_at: string;
  attributes: {
    key: string;
    label: string;
    value?: string;
    order: number;
  }[];
};

// *************** Component ***************
export default function ManageJobPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params.id;
  const jobTitle = searchParams.get('title');

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchName, setSearchName] = useState('');

  const fetchApplicants = async (queryName = '') => {
    setIsLoading(true);
    let supabaseQuery = supabase.from('applications').select('*').eq('job_id', jobId).order('created_at', { ascending: false });

    if(queryName) {
      supabaseQuery = supabaseQuery.ilike('applicant_name', `%${queryName}%`);     
    }

    const {error, data} = await supabaseQuery;

    if (error) {
      toast.error('Error when fetch applicant');
      setApplicants([]);
    } else {
      setApplicants(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!jobId) return;

    fetchApplicants(searchName);
  }, [jobId, searchName]);

  return (
    <div className="w-full flex min-h-[86vh] max-w-[1400px] m-auto">
      <div className="flex flex-col gap-[24px] flex-1 overflow-x-hidden relative">
        <div className="flex justify-between items-center">
          <h2 className="text-[1.125rem] text-[#1D1F20] font-semibold">{jobTitle || 'Front end Dev'}</h2>
          <div>
            <Button
              onClick={() => setOpenFilter(!openFilter)}
              disabled={isLoading}
              variant={'ghost'}
              className={cn('p-0! shadow-none hover:bg-transparent group/filter', !isLoading && 'cursor-pointer')}
            >
              <Filter size={16} className="group-hover/filter:opacity-50" />
            </Button>
          </div>
        </div>
        <div className={cn('h-full border border-[#E0E0E0] rounded-[8px] p-[24px]', !applicants?.length && 'flex flex-1')}>
          {/* Table */}
          {isLoading ? (
            <ManageJobSkeleton />
          ) : applicants.length ? (
            <>
              <div className="hidden md:block">
                <ManageTable
                  data={applicants.map((el) => {
                    // Create flat object from attribute
                    const flat: Record<string, string> = {};
                    el.attributes.forEach((attr) => {
                      if (attr.key) flat[attr.key] = attr.value ?? '-';
                    });

                    return {
                      id: el.id,
                      attributes: [
                        { key: 'full_name', label: 'Full Name', value: flat.full_name || '-', order: 1 },
                        { key: 'email', label: 'Email', value: flat.email || '-', order: 2 },
                        { key: 'phone', label: 'Phone', value: flat.phone || '-', order: 3 },
                        { key: 'domicile', label: 'Domicile', value: flat.domicile || '-', order: 4 },
                        { key: 'gender', label: 'Gender', value: flat.gender || '-', order: 5 },
                        { key: 'linkedin_link', label: 'LinkedIn', value: flat.linkedin_link || '-', order: 6 },
                        { key: 'status', label: 'Status', value: flat.status || '-', order: 7 },
                      ],
                    };
                  })}
                />
              </div>

              {/* Temporary on Mobile */}
              <div className="md:hidden relative flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
                {applicants.map((el) => {
                  const flat: Record<string, string> = {};
                  el.attributes.forEach((attr) => {
                    if (attr.key) flat[attr.key] = attr.value ?? '-';
                  });

                  return (
                    <div key={el.id} className="border border-[#E0E0E0] rounded-[8px] p-4 shadow-sm bg-white flex flex-col gap-3">
                      {/* Candidate Name as Card Title */}
                      <h1 className="text-[1rem] sm:text-[1.125rem] font-semibold truncate">{flat.full_name || '-'}</h1>

                      {/* Attributes Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[0.875rem]">
                        <span className="font-semibold text-gray-600">Email</span>
                        <span className="truncate">{flat.email || '-'}</span>

                        <span className="font-semibold text-gray-600">Phone</span>
                        <span className="truncate">{flat.phone || '-'}</span>

                        <span className="font-semibold text-gray-600">Domicile</span>
                        <span className="truncate">{flat.domicile || '-'}</span>

                        <span className="font-semibold text-gray-600">Gender</span>
                        <span className="truncate">{flat.gender || '-'}</span>

                        <span className="font-semibold text-gray-600">Status</span>
                        <span className="truncate">{flat.status || '-'}</span>

                        <span className="font-semibold text-gray-600">LinkedIn</span>
                        {flat.linkedin_link ? (
                          <a
                            href={flat.linkedin_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#01959F] hover:text-[#037982] underline truncate"
                          >
                            {flat.linkedin_link.split('/').pop()}
                          </a>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            // No data exist handliong
            <div className="flex h-full flex-col flex-1 justify-center items-center gap-4">
              <Image
                src={noCandidateFound?.src}
                width={200}
                height={200}
                alt="empty job list image"
                className={'w-[8rem] h-[7rem] sm:w-[12rem] sm:h-[11rem] md:w-[16rem] md:h-[15rem]'}
              />
              <div className="flex flex-col gap-3 items-center">
                <div className="flex gap-1 flex-col text-center items-center">
                  <p className="text-[#404040] font-bold text-[1rem] sm:text-[1.25rem]">No candidates found</p>
                  <p className="text-[#404040] text-[0.75rem] sm:text-[1rem]">
                    Share your job vacancies so that more candidates will apply.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-8 left-24">
          <TableFilterPopup sendSearchedName={(name) => setSearchName(name)} onOpenChange={setOpenFilter} open={openFilter} />
        </div>
      </div>
    </div>
  );
}

interface TableFilterProps {
  open: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>
  sendSearchedName?: (name: string) => void;
}

const TableFilterPopup = ({onOpenChange, open, sendSearchedName}: TableFilterProps) => {

  const [searchName, setSearchName] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if(debounceTimeout?.current) clearTimeout(debounceTimeout?.current);

    debounceTimeout.current = setTimeout(() => {
      // action
      sendSearchedName?.(searchName);
    }, 300)

    return () => {
      if(debounceTimeout?.current) clearTimeout(debounceTimeout?.current);
    }

  }, [searchName]);
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger className="pr-0 sr-only" asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-1 px-3 min-w-[70px] justify-between"
        ></Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 px-2 py-1">
        <div className="flex gap-1.5 flex-col">
          <div>
            <p className="text-[10px] opacity-80">Search base on name</p>
          </div>
          <div className="w-full">
            <InputText onChange={(event) => setSearchName(event?.target?.value)} className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#404040] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-7 max-h-9" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
