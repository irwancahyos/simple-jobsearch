'use client'

import Image from "next/image"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import jobsCardImage from '@/asset/image/main-logo-platform.png';
import noJobsExistImasge from '@/asset/image/image-no-job.png';

import JobCard from "./components/JobCard";
import JobDetailDialog from "./components/JobDetailDialog";

import { supabase } from "@/lib/supabaseClient";
import { JobsData } from "@/app/models/adminModel";
import { cn } from "@/lib/utils";
import { JobCardSkeleton, JobDetailSkeleton } from "@/app/components/skeletons/candidatesSkeleton";

const JobsComponent = () => {

  const [jobs, setJobs] = useState<JobsData[]>([])
  const [selectedJob, setSelectedJob] = useState<JobsData | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const router = useRouter()

  // ********** Fetch Jobs **********
  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      setJobs(data || [])
      if (data?.length) setSelectedJob(data[0])
    } catch (err) {
      console.error(err)
      toast.error('Gagal memuat data jobs!')
    } finally {
      setIsLoading(false)
    }
  }

  // ********** Realtime Subscribe **********
  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('jobs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, (payload) => {
        console.log('Realtime change:', payload);
        fetchJobs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSelectJob = (job: JobsData) => {
    setSelectedJob(job);
    if (window.innerWidth < 768) setIsDetailVisible(true);
  };

  const jobTypeMap: Record<string, string> = {
    'full-time': 'Full-time',
    'contract': 'Contract',
    'part-time': 'Part-time',
    'internship': 'Internship',
    'freelance': 'Freelance',
  };
  return (
    <div className={cn('w-full max-w-[1400px] h-[86vh] mx-auto flex justify-center xl:px-[100px]', jobs.length < 1 && !isLoading && 'items-center')}>
      {/* ********** Wrapper ********** */}
      {jobs?.length > 0 || (jobs?.length < 1 && isLoading) ? (
        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* ********** Left Side (Job List) ********** */}
          <div className="scrollbar-candidate-jobs-custom w-full md:w-[320px] lg:w-[360px] xl:w-[460px] overflow-y-auto">
            {isLoading ? (
              <JobCardSkeleton />
            ) : jobs.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500 text-sm">Tidak ada job aktif</div>
            ) : (
              <div className="sm:pr-[1rem]">
                <div className="flex flex-col gap-3">
                  {jobs.map((job) => (
                    <div key={job.id} onClick={() => handleSelectJob(job)}>
                      <JobCard jobData={job} selectedJobId={selectedJob?.id || ''} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ********** Right Side (Job Detail, will hidden in mobiile view) ********** */}
          <div className="hidden md:block flex-1 bg-white rounded-[12px] shadow-sm border border-[#E0E0E0] overflow-y-auto">
            {isLoading ? (
              <JobDetailSkeleton />
            ) : selectedJob ? (
              <div className="p-[24px] h-full flex gap-[24px] flex-col">
                <div className="flex justify-between gap-[24px]">
                  <div className="flex gap-[24px] justify-between">
                    <div className="w-fit">
                      <Image
                        alt="Jobs card image"
                        src={jobsCardImage?.src}
                        height={200}
                        width={200}
                        className="w-[3rem] h-[3rem] rounded-[4px] border border-[#E0E0E0]"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-[8px]">
                      {selectedJob?.job_type && (
                        <div className="bg-[#43936C] rounded-[4px] py-[2px] px-[8px] text-white text-[0.75rem] font-semibold w-fit">
                          <span>{jobTypeMap[selectedJob?.job_type]}</span>
                        </div>
                      )}
                      <h2 className="text-[1.25rem] text-[#404040] font-semibold">{selectedJob?.title}</h2>
                      <span className="text-[#757575] text-[0.875rem]">PT Template</span>
                    </div>
                  </div>
                  <div>
                    <button onClick={() => router.push(`/apply/${selectedJob?.id}`)} className="bg-[#FBC037] hover:bg-[#f3b627] cursor-pointer py-[4px] px-[16px] rounded-[8px] text-[#404040] shadow font-semibold text-[0.875rem]">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="w-full border border-[#E0E0E0] inset-0" />
                <div>
                  <ul>
                    <li className="text-[#404040] text-[0.875rem]">{selectedJob.description}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500 text-sm">Pilih salah satu job untuk melihat detail</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[1rem]">
          <Image alt="Image no job exist" src={noJobsExistImasge?.src} height={200} width={200} className="w-[17rem] h-[17rem]" />
          <div className="flex flex-col items-center text-center gap-[4px]">
            <h1 className="text-[#404040] text-[1.25rem] font-semibold">No job openings available</h1>
            <span className="text-[#404040] text-[1rem]">Please wait for the next batch of openings.</span>
          </div>
        </div>
      )}
      <JobDetailDialog isOpen={isDetailVisible} onOpenChange={setIsDetailVisible} selectedJob={selectedJob} />
    </div>
  );
}

export default JobsComponent
