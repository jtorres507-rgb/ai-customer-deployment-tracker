export type Deployment = {
  id: string;
  customer_id: string;
  stage: string;
  technical_readiness: number;
  security_status: string;
  integration_status: string;
  go_live_date: string | null;
  owner: string;
  next_action: string | null;
  created_at: string;
  updated_at: string;
  customers?: {
    company_name: string;
    industry: string;
  } | null;
};