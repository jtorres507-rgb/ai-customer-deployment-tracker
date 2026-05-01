export type Blocker = {
  id: string;
  customer_id: string;
  title: string;
  category: string;
  severity: string;
  owner: string;
  time_open_days: number;
  resolution_confidence: number;
  affected_use_case: string;
  customer_impact: string;
  escalation_path: string;
  required_action: string;
  created_at: string;
  updated_at: string;
  customers?: {
    company_name: string;
    industry: string;
  } | null;
};