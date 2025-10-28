export interface JobsData {
  id: string;
  slug: string;
  title: string;
  job_type: string;
  status: string; 
  description: string;
  created_at?: string;
  metadata: any | null; 
  salary_range: SalaryRange;
  list_card: ListCard;
}

interface SalaryRange {
  max: number;
  min: number;
  currency: string;
  display_text: string;
}

interface ListCard {
  cta: string;
  badge: string;
  started_on_text: string;
}