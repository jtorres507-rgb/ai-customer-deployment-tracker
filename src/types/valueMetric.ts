export type ValueMetric = {
  id: string;
  customer_id: string;
  metric_name: string;
  category: string | null;
  current_value: number | null;
  target_value: number | null;
  monthly_impact: number | null;
  confidence_score: number | null;
  business_outcome: string | null;
  next_action: string | null;
  owner: string | null;
  created_at: string;
  updated_at: string;
  customers?: {
    company_name: string;
    industry: string;
  } | null;
};