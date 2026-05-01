export type Stakeholder = {
  id: string;
  customer_id: string;
  full_name: string;
  role: string;
  department: string;
  function_area: string | null;
  influence_level: string | null;
  sentiment: string | null;
  engagement_status: string | null;
  next_action: string | null;
  last_touchpoint: string | null;
  owner: string | null;
  created_at: string;
  updated_at: string;
  customers?: {
    company_name: string;
    industry: string;
  } | null;
};