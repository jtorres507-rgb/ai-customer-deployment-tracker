export type Customer = {
  id: string;
  company_name: string;
  industry: string;
  account_owner: string;
  health_status: string;
  deployment_stage: string;
  readiness_score: number;
  monthly_value: number;
  primary_blocker: string | null;
  next_action: string | null;
  created_at: string;
  updated_at: string;
};