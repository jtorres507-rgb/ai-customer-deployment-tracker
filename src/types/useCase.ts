export type UseCase = {
  id: string;
  customer_id: string;
  name: string;
  business_owner: string;
  stage: string;
  monthly_value: number;
  confidence_score: number;
  risk_level: string;
  workflow_detail: string;
  next_milestone: string;
  technical_owner: string;
  created_at: string;
  updated_at: string;
  customers?: {
    company_name: string;
    industry: string;
  } | null;
};