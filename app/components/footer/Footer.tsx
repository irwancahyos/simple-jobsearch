export const Footer = () => {
  return (
    <footer className="flex flex-col">
      <div className="flex justify-between items-center flex-col md:flex-row gap-y-6">
        <div className="w-full md:max-w-[20rem] text-[0.875rem] text-center md:text-left">
          <p>Optiiion Digital Careers</p>
          <p className="text-[rgb(117,117,117)] mt-[8px]">Menara Angin - Jl. Merapi Golf, Sleman, Kecamatan Cangkringan, Yogyakarta, DI Yogyakrata 11111</p>
        </div>
        <div className="flex w-full md:w-auto gap-y-3">
          <div className="w-[50%] text-center md:text-left md:max-w-[20rem] text-[0.875rem]">
            <p>Feature to Help You</p>
            <p className="text-[rgb(117,117,117)] hover:text-(--secondary-color) hover:cursor-not-allowed mt-[8px] md:mt-0">Feature to Help You</p>
            <p className="text-[rgb(117,117,117)] hover:text-(--secondary-color) hover:cursor-not-allowed">Digital career profile</p>
            <p className="text-[rgb(117,117,117)] hover:text-(--secondary-color) hover:cursor-not-allowed">Project based internship</p>
          </div>
          <div className="w-[50%] text-center md:text-left md:max-w-[20rem] text-[0.875rem] ml-0 md:ml-[48px]">
            <p>Resources</p>
            <p className="text-[rgb(117,117,117)] hover:text-(--secondary-color) hover:cursor-not-allowed mt-[8px] md:mt-0">Feature to Help You</p>
            <p className="text-[rgb(117,117,117)] hover:text-(--secondary-color) hover:cursor-not-allowed">Digital career profile</p>
            <p className="text-[rgb(117,117,117)] hover:text-(--secondary-color) hover:cursor-not-allowed">Project based internship</p>
          </div>
        </div>
      </div>
      <div className="mt-[24px] text-center">
        <p className="text-[rgb(179,179,179)] text-[0.875rem]">@ Jobsearch Career Solution 2025. All rights reserved</p>
      </div>
    </footer>
  )
}