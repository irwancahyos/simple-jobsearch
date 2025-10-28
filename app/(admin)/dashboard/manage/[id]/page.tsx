"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import ManageTable from "../../components/ManageTable";
import noCandidateFound from '../../../../../asset/image/No Candidate Found.png'
import { cn } from "@/lib/utils";

// *************** Local interface and types ***************
type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Applied" | "Reviewed" | "Interviewed" | "Hired";
};

// *************** Component ***************
export default function ManageJobPage() {
  const params = useParams();
  const jobId = params.id;
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    // Dummy data for table (temporary)
    const dummyApplicants: Applicant[] = [
      { id: "1", name: "Alice Johnson", email: "alice@email.com", phone: "081234567890", status: "Applied" },
      { id: "2", name: "Bob Smith", email: "bob@email.com", phone: "081234567891", status: "Interviewed" },
      { id: "3", name: "Charlie Brown", email: "charlie@email.com", phone: "081234567892", status: "Reviewed" },
    ];

    // Simulate API delay
    setTimeout(() => {
      setApplicants(dummyApplicants);
    }, 500);
  }, [jobId]);

 const dummyData = {
   data: Array.from({ length: 20 }, (_, i) => {
     const id = `cand_20251008_${(i + 1).toString().padStart(4, '0')}`;
     const firstNames = [
       'Nadia',
       'Rizky',
       'Bima',
       'Putri',
       'Andi',
       'Citra',
       'Rani',
       'Dewa',
       'Sinta',
       'Yoga',
       'Dian',
       'Farah',
       'Raka',
       'Tania',
       'Hafiz',
       'Nina',
       'Rafi',
       'Lina',
       'Bayu',
       'Dewi',
     ];
     const lastNames = ['Putri', 'Maulana', 'Saputra', 'Wijaya', 'Siregar', 'Kusuma', 'Hartono', 'Ananda', 'Gunawan', 'Mahardika'];
     const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Denpasar', 'Makassar', 'Semarang', 'Palembang', 'Bogor'];
     const genders = ['Male', 'Female'];

     const first = firstNames[i % firstNames.length];
     const last = lastNames[i % lastNames.length];
     const name = `${first} ${last}`;
     const gender = genders[i % 2];
     const city = cities[i % cities.length];

     return {
       id,
       attributes: [
         { key: 'full_name', label: 'Full Name', value: name, order: 1 },
         { key: 'email', label: 'Email', value: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`, order: 2 },
         { key: 'phone', label: 'Phone', value: `+62 81${Math.floor(100000000 + Math.random() * 899999999)}`, order: 3 },
         { key: 'domicile', label: 'Domicile', value: city, order: 4 },
         { key: 'gender', label: 'Gender', value: gender, order: 5 },
         {
           key: 'linkedin_link',
           label: 'LinkedIn',
           value: `https://linkedin.com/in/${first.toLowerCase()}${last.toLowerCase()}`,
           order: 6,
         },
       ],
     };
   }),
 };

  return (
    <div className="w-full flex min-h-[86vh] max-w-[1400px] m-auto">
      <div className="flex flex-col gap-[24px] flex-1 overflow-x-hidden">
        <div>
          <h2 className="text-[1.125rem] text-[#1D1F20] font-semibold">Front End Developer</h2>
        </div>
        <div className={cn('h-full border border-[#E0E0E0] rounded-[8px] p-[24px]', !dummyData?.data?.length && 'flex flex-1')}>
          {/* Table */}
          {dummyData?.data?.length ? (
            <ManageTable data={dummyData?.data} />
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
                  <p className="text-[#404040] text-[0.75rem] sm:text-[1rem]">Share your job vacancies so that more candidates will apply.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
