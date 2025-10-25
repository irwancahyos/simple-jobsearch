export const JobListCard = () => {
  return (
    <div className="p-[24px] rounded-[1rem] shadow-md flex flex-col gap-[12px]">
      <div className="flex gap-[1rem]">
        <div className="px-[1rem] py-[4px] border rounded-[8px] border-[#B8DBCA] bg-[#F8FBF9] text-[#43936C] text-[0.875rem] font-bold">
          Active 
        </div>
        <div className="px-[1rem] py-[4px] border border-[#E0E0E0] rounded-[4px] text-[#404040]">
          started on 1 Oct 2025
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div>
          <span className="text-[1.125rem] font-bold text-[#1D1F20]">Front End Developer</span>
        </div>
        <div className="flex justify-between sm:items-center flex-col sm:flex-row gap-y-2">
          <span className="text-[#616161] text-[1rem]">{`${"Rp 7.000.000"} - ${"Rp 12.500.000"}`}</span>
          <button className="py-2 px-[1rem] bg-[#01959F] w-full above-450:w-fit above-450:self-end text-white text-[0.75rem] font-bold cursor-pointer rounded-[8px] shadow hover:bg-[#02828b] duration-300">Manage Job</button>
        </div>
      </div>
    </div>
  )
}