import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type FormEvent,
  type ReactNode,
} from "react";
import { supabase } from "./lib/supabase";
import type { Customer } from "./types/customer";
import type { Deployment } from "./types/deployment";
import type { UseCase } from "./types/useCase";
import type { Blocker } from "./types/blocker";
import type { Stakeholder } from "./types/stakeholder";
import type { ValueMetric } from "./types/valueMetric";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Database,
  DollarSign,
  FileText,
  LayoutDashboard,
  Network,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";

type Tone = "cyan" | "emerald" | "amber" | "rose" | "slate";

type CustomerFormData = {
  company_name: string;
  industry: string;
  account_owner: string;
  health_status: string;
  deployment_stage: string;
  readiness_score: number;
  monthly_value: number;
  primary_blocker: string;
  next_action: string;
};

const panel =
  "rounded-3xl border border-slate-700/70 bg-slate-900/70 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl";

const glass = "rounded-2xl border border-slate-700/70 bg-slate-950/50";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Customers", icon: Building2 },
  { name: "Deployments", icon: Workflow },
  { name: "Use Cases", icon: ClipboardList },
  { name: "Blockers", icon: AlertTriangle, count: 5 },
  { name: "Stakeholders", icon: Users },
  { name: "Value Tracking", icon: BarChart3 },
  { name: "Reports", icon: FileText },
  { name: "Settings", icon: Settings },
];

const upcomingActions = [
  "Finalize governance decision for document workflows",
  "Schedule finance champion enablement sprint",
  "Validate production API limits for support automation",
  "Prepare executive value memo for logistics account",
];

function getStageTone(stage: string): Tone {
  if (stage === "Production") return "emerald";
  if (stage === "Security Review") return "amber";
  if (stage === "Pilot") return "cyan";
  if (stage === "Blocked") return "rose";
  return "slate";
}

function getHealthTone(health: string): Tone {
  if (health === "Healthy") return "emerald";
  if (health === "Blocked") return "rose";
  if (health === "At Risk") return "amber";
  return "slate";
}

function getRiskTone(risk: string): Tone {
  if (risk === "Low") return "emerald";
  if (risk === "Medium") return "amber";
  if (risk === "High") return "rose";
  return "slate";
}

function getSeverityTone(severity: string): Tone {
  if (severity === "High") return "rose";
  if (severity === "Medium") return "amber";
  if (severity === "Low") return "emerald";
  return "slate";
}

function getInfluenceTone(influence: string | null): Tone {
  if (influence === "High") return "emerald";
  if (influence === "Medium") return "cyan";
  if (influence === "Low") return "slate";
  return "slate";
}

function getSentimentTone(sentiment: string | null): Tone {
  if (sentiment === "Aligned") return "emerald";
  if (sentiment === "Needs Enablement") return "amber";
  if (sentiment === "At Risk") return "rose";
  return "slate";
}

function getEngagementTone(status: string | null): Tone {
  if (status === "Active") return "emerald";
  if (status === "At Risk") return "amber";
  if (status === "Blocked") return "rose";
  return "slate";
}

function getValueConfidenceTone(score: number | null): Tone {
  const value = Number(score ?? 0);
  if (value >= 85) return "emerald";
  if (value >= 70) return "cyan";
  if (value >= 55) return "amber";
  return "rose";
}

function formatMonthlyValue(value: number | null) {
  return `$${Math.round(Number(value ?? 0) / 1000)}K/mo`;
}

function formatCurrency(value: number | null) {
  return `$${Math.round(Number(value ?? 0)).toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return "No touchpoint logged";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusPill({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const tones: Record<Tone, string> = {
    cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    slate: "border-slate-600 bg-slate-800 text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Sidebar({
  activePage,
  setActivePage,
}: {
  activePage: string;
  setActivePage: (page: string) => void;
}) {
  return (
    <aside className="hidden min-h-screen w-[300px] shrink-0 border-r border-slate-800 bg-slate-950 p-4 xl:block">
      <div className={`${panel} min-h-[calc(100vh-2rem)] p-4`}>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
            <Network className="text-cyan-300" size={28} />
          </div>

          <div>
            <h1 className="text-lg font-bold leading-tight text-white">
              AI Customer
              <br />
              Deployment Tracker
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Full-Stack Operations System
            </p>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-slate-700/70 bg-slate-950/60 p-3">
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Workspace
            </p>
            <ChevronDown size={14} className="text-slate-500" />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.name === activePage;

              return (
                <button
                  key={item.name}
                  onClick={() => setActivePage(item.name)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? "border border-cyan-400/30 bg-cyan-400/10 text-white"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        active
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                          : "border-slate-700 bg-slate-900 text-slate-400"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {item.name}
                  </span>

                  {item.count && (
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-300">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-emerald-300" size={22} />
            <div>
              <p className="font-bold text-white">AI Success Assistant</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Tracks blockers, readiness, and next-best actions.
              </p>
            </div>
          </div>

          <button className="mt-4 w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">
            Launch Assistant
          </button>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className={`${glass} flex items-center gap-2 px-4 py-3`}>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.75)]" />
          <span className="text-sm font-semibold text-white">
            Live Customer Ops
          </span>
          <ChevronDown size={15} className="text-slate-500" />
        </div>

        <div className={`${glass} flex items-center gap-2 px-4 py-3`}>
          <CalendarDays size={17} className="text-slate-400" />
          <span className="text-sm text-slate-300">Today</span>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-3 lg:max-w-3xl lg:justify-end">
        <div
          className={`${glass} flex min-w-[320px] flex-1 items-center gap-3 px-4 py-3 lg:max-w-xl`}
        >
          <Search size={18} className="text-slate-500" />
          <span className="text-sm text-slate-500">
            Search customers, blockers, use cases...
          </span>
        </div>

        <button className={`${glass} relative p-3`}>
          <Bell size={18} className="text-slate-300" />
          <span className="absolute -right-1 -top-1 rounded-full bg-emerald-400 px-1.5 text-[10px] font-bold text-slate-950">
            4
          </span>
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-sm font-bold text-emerald-200">
          JT
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  item,
}: {
  item: {
    label: string;
    value: string;
    change: string;
    detail: string;
    icon: ElementType;
    tone: Tone;
  };
}) {
  const Icon = item.icon;

  return (
    <div className={`${panel} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10">
            <Icon className="text-cyan-300" size={22} />
          </div>

          <p className="mt-5 text-sm text-slate-400">{item.label}</p>
          <p className="mt-1 text-3xl font-bold text-white">{item.value}</p>
          <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
        </div>

        <StatusPill tone={item.tone}>{item.change}</StatusPill>
      </div>
    </div>
  );
}

function CustomerFormModal({
  mode,
  customer,
  isOpen,
  onClose,
  onCustomerCreated,
  onCustomerUpdated,
}: {
  mode: "create" | "edit";
  customer?: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: Customer) => void;
  onCustomerUpdated: (customer: Customer) => void;
}) {
  const [formData, setFormData] = useState<CustomerFormData>({
    company_name: "",
    industry: "",
    account_owner: "",
    health_status: "Healthy",
    deployment_stage: "Discovery",
    readiness_score: 50,
    monthly_value: 0,
    primary_blocker: "None",
    next_action: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && customer) {
      setFormData({
        company_name: customer.company_name,
        industry: customer.industry,
        account_owner: customer.account_owner,
        health_status: customer.health_status,
        deployment_stage: customer.deployment_stage,
        readiness_score: customer.readiness_score,
        monthly_value: customer.monthly_value,
        primary_blocker: customer.primary_blocker ?? "None",
        next_action: customer.next_action ?? "",
      });
    }

    if (mode === "create") {
      setFormData({
        company_name: "",
        industry: "",
        account_owner: "",
        health_status: "Healthy",
        deployment_stage: "Discovery",
        readiness_score: 50,
        monthly_value: 0,
        primary_blocker: "None",
        next_action: "",
      });
    }

    setFormError(null);
  }, [mode, customer, isOpen]);

  if (!isOpen) return null;

  function updateField<K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!formData.company_name.trim()) {
      setFormError("Company name is required.");
      return;
    }

    if (!formData.industry.trim()) {
      setFormError("Industry is required.");
      return;
    }

    if (!formData.account_owner.trim()) {
      setFormError("Account owner is required.");
      return;
    }

    setIsSaving(true);

    if (mode === "create") {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          company_name: formData.company_name,
          industry: formData.industry,
          account_owner: formData.account_owner,
          health_status: formData.health_status,
          deployment_stage: formData.deployment_stage,
          readiness_score: formData.readiness_score,
          monthly_value: formData.monthly_value,
          primary_blocker: formData.primary_blocker || "None",
          next_action: formData.next_action,
        })
        .select("*")
        .single();

      if (error) {
        setFormError(error.message);
        setIsSaving(false);
        return;
      }

      onCustomerCreated(data as Customer);
      setIsSaving(false);
      onClose();
      return;
    }

    if (mode === "edit" && customer) {
      const { data, error } = await supabase
        .from("customers")
        .update({
          company_name: formData.company_name,
          industry: formData.industry,
          account_owner: formData.account_owner,
          health_status: formData.health_status,
          deployment_stage: formData.deployment_stage,
          readiness_score: formData.readiness_score,
          monthly_value: formData.monthly_value,
          primary_blocker: formData.primary_blocker || "None",
          next_action: formData.next_action,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customer.id)
        .select("*")
        .single();

      if (error) {
        setFormError(error.message);
        setIsSaving(false);
        return;
      }

      onCustomerUpdated(data as Customer);
      setIsSaving(false);
      onClose();
    }
  }

  const title = mode === "create" ? "Add Customer" : "Edit Customer";
  const eyebrow =
    mode === "create" ? "New Customer Deployment" : "Update Customer Record";
  const buttonLabel =
    mode === "create"
      ? isSaving
        ? "Creating..."
        : "Create Customer"
      : isSaving
      ? "Saving..."
      : "Save Changes";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-md">
      <div
        className={`${panel} max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {mode === "create"
                ? "Create a new enterprise AI customer deployment record in Supabase."
                : "Update the live customer deployment record in Supabase."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        {formError && (
          <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm font-semibold text-rose-200">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 grid gap-5 md:grid-cols-2">
          <input
            value={formData.company_name}
            onChange={(event) =>
              updateField("company_name", event.target.value)
            }
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            placeholder="Company Name"
          />

          <input
            value={formData.industry}
            onChange={(event) => updateField("industry", event.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            placeholder="Industry"
          />

          <input
            value={formData.account_owner}
            onChange={(event) =>
              updateField("account_owner", event.target.value)
            }
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            placeholder="Account Owner"
          />

          <select
            value={formData.health_status}
            onChange={(event) =>
              updateField("health_status", event.target.value)
            }
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          >
            <option>Healthy</option>
            <option>At Risk</option>
            <option>Blocked</option>
          </select>

          <select
            value={formData.deployment_stage}
            onChange={(event) =>
              updateField("deployment_stage", event.target.value)
            }
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          >
            <option>Discovery</option>
            <option>Readiness Review</option>
            <option>Security Review</option>
            <option>Pilot</option>
            <option>Production</option>
            <option>Expansion</option>
            <option>Blocked</option>
          </select>

          <input
            type="number"
            min="0"
            max="100"
            value={formData.readiness_score}
            onChange={(event) =>
              updateField("readiness_score", Number(event.target.value))
            }
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            placeholder="Readiness Score"
          />

          <input
            type="number"
            min="0"
            value={formData.monthly_value}
            onChange={(event) =>
              updateField("monthly_value", Number(event.target.value))
            }
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            placeholder="Monthly Value"
          />

          <input
            value={formData.primary_blocker}
            onChange={(event) =>
              updateField("primary_blocker", event.target.value)
            }
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            placeholder="Primary Blocker"
          />

          <textarea
            value={formData.next_action}
            onChange={(event) => updateField("next_action", event.target.value)}
            className="min-h-28 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 md:col-span-2"
            placeholder="Next Action"
          />

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardPage({
  customers,
  dashboardMetrics,
  isLoading,
  loadError,
}: {
  customers: Customer[];
  dashboardMetrics: {
    label: string;
    value: string;
    change: string;
    detail: string;
    icon: ElementType;
    tone: Tone;
  }[];
  isLoading: boolean;
  loadError: string | null;
}) {
  return (
    <>
      <section className="mt-8">
        <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
          AI Customer Deployment Tracker
        </p>

        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Deployment Operations Dashboard
            </h1>

            <p className="mt-4 max-w-4xl leading-8 text-slate-300">
              Manage enterprise AI customer deployments, readiness scoring,
              blockers, stakeholders, use cases, and value realization from one
              full-stack operations workspace.
            </p>
          </div>

          <div className={`${glass} flex items-center gap-3 px-4 py-3`}>
            <Database size={18} className="text-cyan-300" />
            <div>
              <p className="text-xs text-slate-500">Data Layer</p>
              <p className="text-sm font-bold text-white">
                Supabase connected
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((item) => (
          <MetricCard key={item.label} item={item} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-12">
        <div className={`${panel} xl:col-span-8 p-6`}>
          <h2 className="text-2xl font-bold text-white">
            Active Customer Deployments
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Live customer deployment records loaded from Supabase.
          </p>

          <div className="mt-7 space-y-4">
            {isLoading && (
              <div className={`${glass} p-5 text-slate-300`}>
                Loading customer deployment records from Supabase...
              </div>
            )}

            {loadError && (
              <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">
                Supabase error: {loadError}
              </div>
            )}

            {!isLoading &&
              !loadError &&
              customers.map((row) => (
                <div key={row.id} className={`${glass} p-5`}>
                  <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-3">
                      <h3 className="text-lg font-bold text-white">
                        {row.company_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Owner: {row.account_owner}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <StatusPill tone={getStageTone(row.deployment_stage)}>
                        {row.deployment_stage}
                      </StatusPill>
                    </div>

                    <div className="lg:col-span-2 text-2xl font-bold text-cyan-300">
                      {row.readiness_score}%
                    </div>

                    <div className="lg:col-span-3 text-sm font-semibold text-slate-200">
                      {row.primary_blocker ?? "None"}
                    </div>

                    <div className="lg:col-span-2 text-lg font-bold text-white">
                      {formatMonthlyValue(row.monthly_value)}
                    </div>
                  </div>

                  <div className="mt-5 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                      style={{ width: `${row.readiness_score}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className={`${panel} xl:col-span-4 p-6`}>
          <div className="flex items-center gap-3">
            <Activity className="text-emerald-300" size={24} />
            <h2 className="text-2xl font-bold text-white">
              Upcoming Actions
            </h2>
          </div>

          <div className="mt-7 space-y-4">
            {upcomingActions.map((action, index) => (
              <div key={action} className={`${glass} flex gap-4 p-4`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-sm font-bold text-emerald-300">
                  {index + 1}
                </div>

                <p className="text-sm font-semibold leading-6 text-slate-200">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CustomersPage({
  customers,
  onOpenAddCustomer,
  onOpenEditCustomer,
  onDeleteCustomer,
  deletingCustomerId,
}: {
  customers: Customer[];
  onOpenAddCustomer: () => void;
  onOpenEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  deletingCustomerId: string | null;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [healthFilter, setHealthFilter] = useState("All Health");

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          customer.company_name,
          customer.industry,
          customer.account_owner,
          customer.deployment_stage,
          customer.health_status,
          customer.primary_blocker ?? "",
          customer.next_action ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStage =
        stageFilter === "All Stages" ||
        customer.deployment_stage === stageFilter;

      const matchesHealth =
        healthFilter === "All Health" ||
        customer.health_status === healthFilter;

      return matchesSearch && matchesStage && matchesHealth;
    });
  }, [customers, searchTerm, stageFilter, healthFilter]);

  const stageOptions = [
    "All Stages",
    "Discovery",
    "Readiness Review",
    "Security Review",
    "Pilot",
    "Production",
    "Expansion",
    "Blocked",
  ];

  const healthOptions = ["All Health", "Healthy", "At Risk", "Blocked"];

  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
        Customer Records
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Customers
          </h1>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Manage enterprise AI customer accounts, deployment stages, readiness
            scores, health status, blockers, and value realization records.
          </p>
        </div>

        <button
          onClick={onOpenAddCustomer}
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          + Add Customer
        </button>
      </div>

      <div className={`${panel} mt-7 p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Customer Deployment Table
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Live customer records loaded from Supabase with search and filter
              controls.
            </p>
          </div>

          <StatusPill tone="emerald">
            {filteredCustomers.length} of {customers.length} Records
          </StatusPill>
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-12">
          <div
            className={`${glass} flex items-center gap-3 px-4 py-3 xl:col-span-6`}
          >
            <Search size={18} className="text-slate-500" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Search customers, industries, owners, blockers..."
            />
          </div>

          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
            className="rounded-2xl border border-slate-700/70 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-slate-200 outline-none transition focus:border-cyan-400 xl:col-span-3"
          >
            {stageOptions.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>

          <select
            value={healthFilter}
            onChange={(event) => setHealthFilter(event.target.value)}
            className="rounded-2xl border border-slate-700/70 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-slate-200 outline-none transition focus:border-cyan-400 xl:col-span-3"
          >
            {healthOptions.map((health) => (
              <option key={health}>{health}</option>
            ))}
          </select>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-700/70">
          <div className="grid grid-cols-12 bg-slate-950/80 px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Industry</div>
            <div className="col-span-2">Stage</div>
            <div className="col-span-1">Score</div>
            <div className="col-span-1">Health</div>
            <div className="col-span-1">Value</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-800">
            {filteredCustomers.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="text-lg font-bold text-white">
                  No matching customers found
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Adjust your search or filter selections.
                </p>
              </div>
            )}

            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="grid grid-cols-12 items-center px-5 py-5 text-sm transition hover:bg-slate-800/40"
              >
                <div className="col-span-3">
                  <p className="font-bold text-white">
                    {customer.company_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Owner: {customer.account_owner}
                  </p>
                </div>

                <div className="col-span-2 text-slate-300">
                  {customer.industry}
                </div>

                <div className="col-span-2">
                  <StatusPill tone={getStageTone(customer.deployment_stage)}>
                    {customer.deployment_stage}
                  </StatusPill>
                </div>

                <div className="col-span-1 text-lg font-bold text-cyan-300">
                  {customer.readiness_score}%
                </div>

                <div className="col-span-1">
                  <StatusPill tone={getHealthTone(customer.health_status)}>
                    {customer.health_status}
                  </StatusPill>
                </div>

                <div className="col-span-1 font-bold text-white">
                  {formatMonthlyValue(customer.monthly_value)}
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => onOpenEditCustomer(customer)}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDeleteCustomer(customer)}
                    disabled={deletingCustomerId === customer.id}
                    className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingCustomerId === customer.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(searchTerm ||
          stageFilter !== "All Stages" ||
          healthFilter !== "All Health") && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-bold text-cyan-300">
                {filteredCustomers.length}
              </span>{" "}
              matching records.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setStageFilter("All Stages");
                setHealthFilter("All Health");
              }}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-800"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function DeploymentsPage({
  deployments,
  isLoading,
  loadError,
}: {
  deployments: Deployment[];
  isLoading: boolean;
  loadError: string | null;
}) {
  const productionCount = deployments.filter(
    (deployment) => deployment.stage === "Production"
  ).length;

  const reviewCount = deployments.filter(
    (deployment) =>
      deployment.stage === "Security Review" ||
      deployment.security_status === "In Review"
  ).length;

  const averageReadiness =
    deployments.length === 0
      ? 0
      : Math.round(
          deployments.reduce(
            (total, deployment) =>
              total + Number(deployment.technical_readiness ?? 0),
            0
          ) / deployments.length
        );

  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
        Deployment Operations
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Deployments
          </h1>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Track enterprise AI deployment stages, technical readiness, security
            posture, integration progress, ownership, and go-live movement.
          </p>
        </div>

        <StatusPill tone="emerald">{deployments.length} Deployments</StatusPill>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-3">
        <MetricCard
          item={{
            label: "Average Technical Readiness",
            value: `${averageReadiness}%`,
            change: "+8",
            detail: "across active deployments",
            icon: Activity,
            tone: "cyan",
          }}
        />
        <MetricCard
          item={{
            label: "Production Deployments",
            value: String(productionCount),
            change: "+2",
            detail: "validated workflows",
            icon: CheckCircle2,
            tone: "emerald",
          }}
        />
        <MetricCard
          item={{
            label: "Security / Review Work",
            value: String(reviewCount),
            change: "review",
            detail: "needs governance attention",
            icon: AlertTriangle,
            tone: "amber",
          }}
        />
      </section>

      <div className={`${panel} mt-7 p-6`}>
        <h2 className="text-2xl font-bold text-white">Deployment Pipeline</h2>
        <p className="mt-1 text-sm text-slate-400">
          Live deployment records loaded from Supabase.
        </p>

        <div className="mt-7 space-y-4">
          {isLoading && (
            <div className={`${glass} p-5 text-slate-300`}>
              Loading deployment records from Supabase...
            </div>
          )}

          {loadError && (
            <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">
              Supabase error: {loadError}
            </div>
          )}

          {!isLoading &&
            !loadError &&
            deployments.map((deployment) => (
              <div key={deployment.id} className={`${glass} p-5`}>
                <div className="grid gap-5 xl:grid-cols-12 xl:items-center">
                  <div className="xl:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Customer
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {deployment.customers?.company_name ?? "Unknown Customer"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {deployment.customers?.industry ?? "No industry listed"}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Stage</p>
                    <div className="mt-2">
                      <StatusPill tone={getStageTone(deployment.stage)}>
                        {deployment.stage}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">
                      Technical Readiness
                    </p>
                    <p className="mt-1 text-2xl font-bold text-cyan-300">
                      {Number(deployment.technical_readiness ?? 0)}%
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Security</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {deployment.security_status}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Integration</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {deployment.integration_status}
                    </p>
                  </div>

                  <div className="xl:col-span-1">
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="mt-1 font-semibold text-white">
                      {deployment.owner}
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    style={{
                      width: `${Number(deployment.technical_readiness ?? 0)}%`,
                    }}
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Next Action
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {deployment.next_action || "No next action listed."}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesPage({
  useCases,
  isLoading,
  loadError,
}: {
  useCases: UseCase[];
  isLoading: boolean;
  loadError: string | null;
}) {
  const productionCount = useCases.filter(
    (useCase) => useCase.stage === "Production"
  ).length;

  const pilotCount = useCases.filter((useCase) => useCase.stage === "Pilot")
    .length;

  const totalMonthlyValue = useCases.reduce(
    (total, useCase) => total + Number(useCase.monthly_value ?? 0),
    0
  );

  const averageConfidence =
    useCases.length === 0
      ? 0
      : Math.round(
          useCases.reduce(
            (total, useCase) => total + Number(useCase.confidence_score ?? 0),
            0
          ) / useCases.length
        );

  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
        Workflow Activation
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Use Cases
          </h1>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Track AI workflow activation across customers, business owners,
            maturity stages, confidence, risk, next milestones, and measurable
            monthly value.
          </p>
        </div>

        <StatusPill tone="emerald">{useCases.length} Use Cases</StatusPill>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-4">
        <MetricCard
          item={{
            label: "Monthly Use Case Value",
            value: formatMonthlyValue(totalMonthlyValue),
            change: "+21%",
            detail: "combined workflow value",
            icon: BarChart3,
            tone: "emerald",
          }}
        />
        <MetricCard
          item={{
            label: "Average Confidence",
            value: `${averageConfidence}%`,
            change: "+8",
            detail: "across active use cases",
            icon: Activity,
            tone: "cyan",
          }}
        />
        <MetricCard
          item={{
            label: "Production",
            value: String(productionCount),
            change: "live",
            detail: "workflows producing value",
            icon: CheckCircle2,
            tone: "emerald",
          }}
        />
        <MetricCard
          item={{
            label: "Pilot",
            value: String(pilotCount),
            change: "pilot",
            detail: "workflows in validation",
            icon: Workflow,
            tone: "cyan",
          }}
        />
      </section>

      <div className={`${panel} mt-7 p-6`}>
        <h2 className="text-2xl font-bold text-white">
          AI Use Case Activation Pipeline
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Live workflow records loaded from Supabase.
        </p>

        <div className="mt-7 space-y-4">
          {isLoading && (
            <div className={`${glass} p-5 text-slate-300`}>
              Loading use case records from Supabase...
            </div>
          )}

          {loadError && (
            <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">
              Supabase error: {loadError}
            </div>
          )}

          {!isLoading &&
            !loadError &&
            useCases.map((useCase) => (
              <div key={useCase.id} className={`${glass} p-5`}>
                <div className="grid gap-5 xl:grid-cols-12 xl:items-center">
                  <div className="xl:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Use Case
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {useCase.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {useCase.customers?.company_name ?? "Unknown Customer"}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Stage</p>
                    <div className="mt-2">
                      <StatusPill tone={getStageTone(useCase.stage)}>
                        {useCase.stage}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Value</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {formatMonthlyValue(useCase.monthly_value)}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="mt-1 text-2xl font-bold text-cyan-300">
                      {Number(useCase.confidence_score ?? 0)}%
                    </p>
                  </div>

                  <div className="xl:col-span-1">
                    <p className="text-xs text-slate-500">Risk</p>
                    <div className="mt-2">
                      <StatusPill tone={getRiskTone(useCase.risk_level)}>
                        {useCase.risk_level}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {useCase.business_owner}
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    style={{
                      width: `${Number(useCase.confidence_score ?? 0)}%`,
                    }}
                  />
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Workflow Detail
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {useCase.workflow_detail ||
                        "Workflow detail not provided."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Next Milestone
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {useCase.next_milestone || "Next milestone not logged."}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      Technical Owner: {useCase.technical_owner}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function BlockersPage({
  blockers,
  isLoading,
  loadError,
}: {
  blockers: Blocker[];
  isLoading: boolean;
  loadError: string | null;
}) {
  const highSeverityCount = blockers.filter(
    (blocker) => blocker.severity === "High"
  ).length;

  const mediumSeverityCount = blockers.filter(
    (blocker) => blocker.severity === "Medium"
  ).length;

  const averageResolutionConfidence =
    blockers.length === 0
      ? 0
      : Math.round(
          blockers.reduce(
            (total, blocker) =>
              total + Number(blocker.resolution_confidence ?? 0),
            0
          ) / blockers.length
        );

  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
        Risk Escalation
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Blockers
          </h1>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Track active customer deployment blockers, severity, ownership,
            escalation paths, required actions, resolution confidence, and
            operational impact.
          </p>
        </div>

        <StatusPill tone="amber">{blockers.length} Active Blockers</StatusPill>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-4">
        <MetricCard
          item={{
            label: "High Severity",
            value: String(highSeverityCount),
            change: "high",
            detail: "blockers needing escalation",
            icon: AlertTriangle,
            tone: "rose",
          }}
        />
        <MetricCard
          item={{
            label: "Medium Severity",
            value: String(mediumSeverityCount),
            change: "medium",
            detail: "active operational constraints",
            icon: AlertTriangle,
            tone: "amber",
          }}
        />
        <MetricCard
          item={{
            label: "Total Risk Items",
            value: String(blockers.length),
            change: "tracked",
            detail: "tracked across customers",
            icon: ClipboardList,
            tone: "cyan",
          }}
        />
        <MetricCard
          item={{
            label: "Resolution Confidence",
            value: `${averageResolutionConfidence}%`,
            change: "+12",
            detail: "average recovery confidence",
            icon: Activity,
            tone: "emerald",
          }}
        />
      </section>

      <div className={`${panel} mt-7 p-6`}>
        <h2 className="text-2xl font-bold text-white">
          Deployment Blocker Matrix
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Live blocker records loaded from Supabase.
        </p>

        <div className="mt-7 space-y-4">
          {isLoading && (
            <div className={`${glass} p-5 text-slate-300`}>
              Loading blocker records from Supabase...
            </div>
          )}

          {loadError && (
            <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">
              Supabase error: {loadError}
            </div>
          )}

          {!isLoading &&
            !loadError &&
            blockers.map((blocker) => (
              <div key={blocker.id} className={`${glass} p-5`}>
                <div className="grid gap-5 xl:grid-cols-12 xl:items-center">
                  <div className="xl:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Blocker
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {blocker.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {blocker.customers?.company_name ?? "Unknown Customer"}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Category</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {blocker.category || "Operational"}
                    </p>
                  </div>

                  <div className="xl:col-span-1">
                    <p className="text-xs text-slate-500">Severity</p>
                    <div className="mt-2">
                      <StatusPill tone={getSeverityTone(blocker.severity)}>
                        {blocker.severity}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="mt-1 font-semibold text-white">
                      {blocker.owner}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Time Open</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {Number(blocker.time_open_days ?? 0)} days
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">
                      Resolution Confidence
                    </p>
                    <p className="mt-1 text-2xl font-bold text-cyan-300">
                      {Number(blocker.resolution_confidence ?? 0)}%
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    style={{
                      width: `${Number(blocker.resolution_confidence ?? 0)}%`,
                    }}
                  />
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Affected Use Case
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {blocker.affected_use_case ||
                        "Customer workflow adoption"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Customer Impact
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {blocker.customer_impact ||
                        "Deployment momentum slowed until blocker is resolved."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Escalation Path
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {blocker.escalation_path ||
                        "Customer Success / Technical Success"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                    Required Action
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">
                    {blocker.required_action ||
                      "Assign owner, confirm next action, and review progress in the next customer checkpoint."}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function StakeholdersPage({
  stakeholders,
  isLoading,
  loadError,
}: {
  stakeholders: Stakeholder[];
  isLoading: boolean;
  loadError: string | null;
}) {
  const executiveCount = stakeholders.filter((stakeholder) =>
    stakeholder.role.toLowerCase().includes("executive")
  ).length;

  const highInfluenceCount = stakeholders.filter(
    (stakeholder) => stakeholder.influence_level === "High"
  ).length;

  const alignedCount = stakeholders.filter(
    (stakeholder) => stakeholder.sentiment === "Aligned"
  ).length;

  const atRiskCount = stakeholders.filter(
    (stakeholder) =>
      stakeholder.sentiment === "At Risk" ||
      stakeholder.engagement_status === "At Risk"
  ).length;

  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
        Stakeholder Alignment
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Stakeholders
          </h1>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Track executive sponsors, business owners, technical champions,
            influence level, sentiment, engagement status, ownership, and next
            alignment actions across customer deployments.
          </p>
        </div>

        <StatusPill tone="emerald">
          {stakeholders.length} Stakeholders
        </StatusPill>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-4">
        <MetricCard
          item={{
            label: "Executive Sponsors",
            value: String(executiveCount),
            change: "exec",
            detail: "sponsor relationships",
            icon: Users,
            tone: "emerald",
          }}
        />
        <MetricCard
          item={{
            label: "High Influence",
            value: String(highInfluenceCount),
            change: "high",
            detail: "decision makers",
            icon: Activity,
            tone: "cyan",
          }}
        />
        <MetricCard
          item={{
            label: "Aligned",
            value: String(alignedCount),
            change: "healthy",
            detail: "positive engagement",
            icon: CheckCircle2,
            tone: "emerald",
          }}
        />
        <MetricCard
          item={{
            label: "At Risk",
            value: String(atRiskCount),
            change: "watch",
            detail: "needs attention",
            icon: AlertTriangle,
            tone: "amber",
          }}
        />
      </section>

      <div className={`${panel} mt-7 p-6`}>
        <h2 className="text-2xl font-bold text-white">
          Stakeholder Engagement Map
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Live stakeholder records loaded from Supabase.
        </p>

        <div className="mt-7 space-y-4">
          {isLoading && (
            <div className={`${glass} p-5 text-slate-300`}>
              Loading stakeholder records from Supabase...
            </div>
          )}

          {loadError && (
            <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">
              Supabase error: {loadError}
            </div>
          )}

          {!isLoading &&
            !loadError &&
            stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className={`${glass} p-5`}>
                <div className="grid gap-5 xl:grid-cols-12 xl:items-center">
                  <div className="xl:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Stakeholder
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {stakeholder.full_name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {stakeholder.customers?.company_name ??
                        "Unknown Customer"}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Role</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {stakeholder.role}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Department</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {stakeholder.department}
                    </p>
                  </div>

                  <div className="xl:col-span-1">
                    <p className="text-xs text-slate-500">Influence</p>
                    <div className="mt-2">
                      <StatusPill
                        tone={getInfluenceTone(stakeholder.influence_level)}
                      >
                        {stakeholder.influence_level ?? "Unknown"}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Sentiment</p>
                    <div className="mt-2">
                      <StatusPill
                        tone={getSentimentTone(stakeholder.sentiment)}
                      >
                        {stakeholder.sentiment ?? "Unknown"}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="text-xs text-slate-500">Engagement</p>
                    <div className="mt-2">
                      <StatusPill
                        tone={getEngagementTone(
                          stakeholder.engagement_status
                        )}
                      >
                        {stakeholder.engagement_status ?? "Unknown"}
                      </StatusPill>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Function Area
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {stakeholder.function_area ?? "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Last Touchpoint
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {formatDate(stakeholder.last_touchpoint)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Internal Owner
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                      {stakeholder.owner ?? "AI Success"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                    Next Stakeholder Action
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">
                    {stakeholder.next_action ??
                      "Schedule stakeholder alignment checkpoint."}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function ValueTrackingPage({
  valueMetrics,
  isLoading,
  loadError,
}: {
  valueMetrics: ValueMetric[];
  isLoading: boolean;
  loadError: string | null;
}) {
  const totalMonthlyImpact = valueMetrics.reduce(
    (total, metric) => total + Number(metric.monthly_impact ?? 0),
    0
  );

  const totalCurrentValue = valueMetrics.reduce(
    (total, metric) => total + Number(metric.current_value ?? 0),
    0
  );

  const totalTargetValue = valueMetrics.reduce(
    (total, metric) => total + Number(metric.target_value ?? 0),
    0
  );

  const averageConfidence =
    valueMetrics.length === 0
      ? 0
      : Math.round(
          valueMetrics.reduce(
            (total, metric) => total + Number(metric.confidence_score ?? 0),
            0
          ) / valueMetrics.length
        );

  const targetProgress =
    totalTargetValue === 0
      ? 0
      : Math.min(Math.round((totalCurrentValue / totalTargetValue) * 100), 100);

  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
        Value Realization
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Value Tracking
          </h1>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Track realized business impact, projected value, confidence,
            customer outcomes, ownership, and next value actions across AI
            deployment programs.
          </p>
        </div>

        <StatusPill tone="emerald">
          {valueMetrics.length} Value Metrics
        </StatusPill>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-4">
        <MetricCard
          item={{
            label: "Monthly Impact",
            value: formatMonthlyValue(totalMonthlyImpact),
            change: "+21%",
            detail: "realized customer value",
            icon: DollarSign,
            tone: "emerald",
          }}
        />

        <MetricCard
          item={{
            label: "Current Value",
            value: formatCurrency(totalCurrentValue),
            change: "live",
            detail: "current measured value",
            icon: TrendingUp,
            tone: "cyan",
          }}
        />

        <MetricCard
          item={{
            label: "Target Progress",
            value: `${targetProgress}%`,
            change: "target",
            detail: "toward projected value",
            icon: Target,
            tone: "amber",
          }}
        />

        <MetricCard
          item={{
            label: "Confidence",
            value: `${averageConfidence}%`,
            change: "score",
            detail: "average value confidence",
            icon: Activity,
            tone: getValueConfidenceTone(averageConfidence),
          }}
        />
      </section>

      <div className={`${panel} mt-7 p-6`}>
        <h2 className="text-2xl font-bold text-white">
          Customer Value Realization Pipeline
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Live value metric records loaded from Supabase.
        </p>

        <div className="mt-7 space-y-4">
          {isLoading && (
            <div className={`${glass} p-5 text-slate-300`}>
              Loading value metrics from Supabase...
            </div>
          )}

          {loadError && (
            <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">
              Supabase error: {loadError}
            </div>
          )}

          {!isLoading &&
            !loadError &&
            valueMetrics.map((metric) => {
              const current = Number(metric.current_value ?? 0);
              const target = Number(metric.target_value ?? 0);
              const progress =
                target === 0
                  ? 0
                  : Math.min(Math.round((current / target) * 100), 100);

              return (
                <div key={metric.id} className={`${glass} p-5`}>
                  <div className="grid gap-5 xl:grid-cols-12 xl:items-center">
                    <div className="xl:col-span-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Value Metric
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {metric.metric_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {metric.customers?.company_name ?? "Unknown Customer"}
                      </p>
                    </div>

                    <div className="xl:col-span-2">
                      <p className="text-xs text-slate-500">Category</p>
                      <p className="mt-1 font-semibold text-slate-200">
                        {metric.category ?? "Operational Efficiency"}
                      </p>
                    </div>

                    <div className="xl:col-span-2">
                      <p className="text-xs text-slate-500">Current Value</p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {formatCurrency(metric.current_value)}
                      </p>
                    </div>

                    <div className="xl:col-span-2">
                      <p className="text-xs text-slate-500">Target Value</p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {formatCurrency(metric.target_value)}
                      </p>
                    </div>

                    <div className="xl:col-span-1">
                      <p className="text-xs text-slate-500">Confidence</p>
                      <div className="mt-2">
                        <StatusPill
                          tone={getValueConfidenceTone(
                            metric.confidence_score
                          )}
                        >
                          {Number(metric.confidence_score ?? 0)}%
                        </StatusPill>
                      </div>
                    </div>

                    <div className="xl:col-span-2">
                      <p className="text-xs text-slate-500">Monthly Impact</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-300">
                        {formatMonthlyValue(metric.monthly_impact)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4 lg:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Business Outcome
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                        {metric.business_outcome ??
                          "Customer is realizing measurable business value through AI workflow deployment."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Internal Owner
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                        {metric.owner ?? "AI Success"}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        Progress to target: {progress}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                      Next Value Action
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">
                      {metric.next_action ??
                        "Review value realization progress with customer sponsor and identify expansion workflow."}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function ReportsPage({
  customers,
  deployments,
  useCases,
  blockers,
  stakeholders,
  valueMetrics,
}: {
  customers: Customer[];
  deployments: Deployment[];
  useCases: UseCase[];
  blockers: Blocker[];
  stakeholders: Stakeholder[];
  valueMetrics: ValueMetric[];
}) {
  const averageReadiness =
    customers.length === 0
      ? 0
      : Math.round(
          customers.reduce(
            (total, customer) => total + Number(customer.readiness_score ?? 0),
            0
          ) / customers.length
        );

  const productionDeployments = deployments.filter(
    (deployment) => deployment.stage === "Production"
  ).length;

  const productionUseCases = useCases.filter(
    (useCase) => useCase.stage === "Production"
  ).length;

  const highSeverityBlockers = blockers.filter(
    (blocker) => blocker.severity === "High"
  );

  const mediumSeverityBlockers = blockers.filter(
    (blocker) => blocker.severity === "Medium"
  );

  const alignedStakeholders = stakeholders.filter(
    (stakeholder) => stakeholder.sentiment === "Aligned"
  ).length;

  const atRiskStakeholders = stakeholders.filter(
    (stakeholder) =>
      stakeholder.sentiment === "At Risk" ||
      stakeholder.engagement_status === "At Risk"
  ).length;

  const highInfluenceStakeholders = stakeholders.filter(
    (stakeholder) => stakeholder.influence_level === "High"
  ).length;

  const totalMonthlyImpact = valueMetrics.reduce(
    (total, metric) => total + Number(metric.monthly_impact ?? 0),
    0
  );

  const totalCurrentValue = valueMetrics.reduce(
    (total, metric) => total + Number(metric.current_value ?? 0),
    0
  );

  const totalTargetValue = valueMetrics.reduce(
    (total, metric) => total + Number(metric.target_value ?? 0),
    0
  );

  const averageValueConfidence =
    valueMetrics.length === 0
      ? 0
      : Math.round(
          valueMetrics.reduce(
            (total, metric) => total + Number(metric.confidence_score ?? 0),
            0
          ) / valueMetrics.length
        );

  const targetProgress =
    totalTargetValue === 0
      ? 0
      : Math.min(Math.round((totalCurrentValue / totalTargetValue) * 100), 100);

  const rankedCustomers = [...customers].sort(
    (a, b) => Number(b.readiness_score ?? 0) - Number(a.readiness_score ?? 0)
  );

  const topValueMetrics = [...valueMetrics].sort(
    (a, b) => Number(b.monthly_impact ?? 0) - Number(a.monthly_impact ?? 0)
  );

  const executiveNarrative = `AI deployment portfolio is progressing with ${customers.length} active customers, ${productionDeployments} production deployment${
    productionDeployments === 1 ? "" : "s"
  }, ${blockers.length} active blocker${
    blockers.length === 1 ? "" : "s"
  }, and ${formatMonthlyValue(
    totalMonthlyImpact
  )} in tracked monthly value realization. Current portfolio readiness is ${averageReadiness}% with ${averageValueConfidence}% average value confidence.`;

  const recommendations = [
    highSeverityBlockers.length > 0
      ? `Prioritize high-severity blocker resolution for ${
          highSeverityBlockers[0].customers?.company_name ?? "the affected customer"
        }.`
      : "Maintain weekly blocker review cadence to prevent deployment delays.",
    mediumSeverityBlockers.length > 0
      ? `Run enablement or governance follow-up for ${
          mediumSeverityBlockers[0].customers?.company_name ??
          "medium-risk customer accounts"
        }.`
      : "Continue moving medium-risk items through standard success checkpoints.",
    topValueMetrics.length > 0
      ? `Prepare executive value memo for ${
          topValueMetrics[0].customers?.company_name ?? "the top value account"
        }.`
      : "Create value realization baseline for each active deployment.",
    atRiskStakeholders > 0
      ? "Schedule stakeholder alignment sessions for at-risk relationships."
      : "Use aligned stakeholders to support expansion and adoption planning.",
  ];

  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">
        Executive Reporting
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Reports
          </h1>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Executive summary of deployment health, customer readiness,
            blockers, stakeholder alignment, value realization, and recommended
            next actions.
          </p>
        </div>

        <StatusPill tone="cyan">Live Executive Summary</StatusPill>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          item={{
            label: "Customers",
            value: String(customers.length),
            change: "active",
            detail: "enterprise accounts",
            icon: Building2,
            tone: "cyan",
          }}
        />

        <MetricCard
          item={{
            label: "Production",
            value: String(productionDeployments),
            change: "live",
            detail: "production deployments",
            icon: CheckCircle2,
            tone: "emerald",
          }}
        />

        <MetricCard
          item={{
            label: "Use Cases",
            value: String(productionUseCases),
            change: "prod",
            detail: "production workflows",
            icon: Workflow,
            tone: "emerald",
          }}
        />

        <MetricCard
          item={{
            label: "Open Blockers",
            value: String(blockers.length),
            change: `${highSeverityBlockers.length} high`,
            detail: "tracked risk items",
            icon: AlertTriangle,
            tone: blockers.length > 0 ? "amber" : "emerald",
          }}
        />

        <MetricCard
          item={{
            label: "Monthly Value",
            value: formatMonthlyValue(totalMonthlyImpact),
            change: "+21%",
            detail: "tracked impact",
            icon: DollarSign,
            tone: "emerald",
          }}
        />

        <MetricCard
          item={{
            label: "Readiness",
            value: `${averageReadiness}%`,
            change: "avg",
            detail: "portfolio readiness",
            icon: Activity,
            tone: averageReadiness >= 80 ? "emerald" : "cyan",
          }}
        />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-12">
        <div className={`${panel} p-6 xl:col-span-7`}>
          <div className="flex items-center gap-3">
            <FileText className="text-cyan-300" size={24} />
            <h2 className="text-2xl font-bold text-white">
              Executive Health Narrative
            </h2>
          </div>

          <p className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-base font-semibold leading-8 text-slate-100">
            {executiveNarrative}
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className={`${glass} p-4`}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Target Progress
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {targetProgress}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                current value vs target
              </p>
            </div>

            <div className={`${glass} p-4`}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Value Confidence
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-300">
                {averageValueConfidence}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                average value confidence
              </p>
            </div>

            <div className={`${glass} p-4`}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Stakeholder Health
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {alignedStakeholders}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                aligned stakeholder records
              </p>
            </div>
          </div>
        </div>

        <div className={`${panel} p-6 xl:col-span-5`}>
          <div className="flex items-center gap-3">
            <Sparkles className="text-emerald-300" size={24} />
            <h2 className="text-2xl font-bold text-white">
              Executive Recommendations
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation} className={`${glass} flex gap-4 p-4`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-sm font-bold text-emerald-300">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-200">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-12">
        <div className={`${panel} p-6 xl:col-span-6`}>
          <h2 className="text-2xl font-bold text-white">
            Customer Readiness Ranking
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Ranked by live readiness score from Supabase.
          </p>

          <div className="mt-6 space-y-4">
            {rankedCustomers.map((customer, index) => (
              <div key={customer.id} className={`${glass} p-4`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      #{index + 1} Customer
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-white">
                      {customer.company_name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {customer.industry} • Owner: {customer.account_owner}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-300">
                      {Number(customer.readiness_score ?? 0)}%
                    </p>
                    <StatusPill tone={getHealthTone(customer.health_status)}>
                      {customer.health_status}
                    </StatusPill>
                  </div>
                </div>

                <div className="mt-4 h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    style={{ width: `${Number(customer.readiness_score ?? 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${panel} p-6 xl:col-span-6`}>
          <h2 className="text-2xl font-bold text-white">
            Risk & Blocker Summary
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Active blocker portfolio and required action visibility.
          </p>

          <div className="mt-6 space-y-4">
            {blockers.length === 0 && (
              <div className={`${glass} p-5 text-slate-300`}>
                No active blockers are currently tracked.
              </div>
            )}

            {blockers.map((blocker) => (
              <div key={blocker.id} className={`${glass} p-4`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {blocker.customers?.company_name ?? "Unknown Customer"}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-white">
                      {blocker.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                      {blocker.required_action ??
                        "Assign owner and confirm blocker resolution path."}
                    </p>
                  </div>

                  <StatusPill tone={getSeverityTone(blocker.severity)}>
                    {blocker.severity}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-12">
        <div className={`${panel} p-6 xl:col-span-5`}>
          <h2 className="text-2xl font-bold text-white">
            Stakeholder Alignment Summary
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Sponsor, champion, and stakeholder health indicators.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className={`${glass} p-4`}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                High Influence
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-300">
                {highInfluenceStakeholders}
              </p>
            </div>

            <div className={`${glass} p-4`}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Aligned
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {alignedStakeholders}
              </p>
            </div>

            <div className={`${glass} p-4`}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                At Risk
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-300">
                {atRiskStakeholders}
              </p>
            </div>
          </div>
        </div>

        <div className={`${panel} p-6 xl:col-span-7`}>
          <h2 className="text-2xl font-bold text-white">
            Value Realization Summary
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Highest-impact customer value metrics and next value actions.
          </p>

          <div className="mt-6 space-y-4">
            {topValueMetrics.slice(0, 3).map((metric) => {
              const current = Number(metric.current_value ?? 0);
              const target = Number(metric.target_value ?? 0);
              const progress =
                target === 0
                  ? 0
                  : Math.min(Math.round((current / target) * 100), 100);

              return (
                <div key={metric.id} className={`${glass} p-4`}>
                  <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-4">
                      <h3 className="font-bold text-white">
                        {metric.metric_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {metric.customers?.company_name ?? "Unknown Customer"}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Monthly Impact</p>
                      <p className="mt-1 font-bold text-emerald-300">
                        {formatMonthlyValue(metric.monthly_impact)}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Confidence</p>
                      <p className="mt-1 font-bold text-cyan-300">
                        {Number(metric.confidence_score ?? 0)}%
                      </p>
                    </div>

                    <div className="lg:col-span-4">
                      <p className="text-xs text-slate-500">Next Action</p>
                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {metric.next_action ??
                          "Review value realization with customer sponsor."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerModalMode, setCustomerModalMode] =
    useState<"create" | "edit">("create");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [valueMetrics, setValueMetrics] = useState<ValueMetric[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeploymentsLoading, setIsDeploymentsLoading] = useState(true);
  const [isUseCasesLoading, setIsUseCasesLoading] = useState(true);
  const [isBlockersLoading, setIsBlockersLoading] = useState(true);
  const [isStakeholdersLoading, setIsStakeholdersLoading] = useState(true);
  const [isValueMetricsLoading, setIsValueMetricsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [deploymentsError, setDeploymentsError] = useState<string | null>(null);
  const [useCasesError, setUseCasesError] = useState<string | null>(null);
  const [blockersError, setBlockersError] = useState<string | null>(null);
  const [stakeholdersError, setStakeholdersError] = useState<string | null>(
    null
  );
  const [valueMetricsError, setValueMetricsError] = useState<string | null>(
    null
  );

  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadCustomers() {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        setLoadError(error.message);
        setIsLoading(false);
        return;
      }

      setCustomers(data ?? []);
      setIsLoading(false);
    }

    loadCustomers();
  }, []);

  useEffect(() => {
    async function loadDeployments() {
      const { data, error } = await supabase
        .from("deployments")
        .select(
          `
          *,
          customers (
            company_name,
            industry
          )
        `
        )
        .order("created_at", { ascending: true });

      if (error) {
        setDeploymentsError(error.message);
        setIsDeploymentsLoading(false);
        return;
      }

      setDeployments((data ?? []) as Deployment[]);
      setIsDeploymentsLoading(false);
    }

    loadDeployments();
  }, []);

  useEffect(() => {
    async function loadUseCases() {
      const { data, error } = await supabase
        .from("use_cases")
        .select(
          `
          *,
          customers (
            company_name,
            industry
          )
        `
        )
        .order("created_at", { ascending: true });

      if (error) {
        setUseCasesError(error.message);
        setIsUseCasesLoading(false);
        return;
      }

      setUseCases((data ?? []) as UseCase[]);
      setIsUseCasesLoading(false);
    }

    loadUseCases();
  }, []);

  useEffect(() => {
    async function loadBlockers() {
      const { data, error } = await supabase
        .from("blockers")
        .select(
          `
          *,
          customers (
            company_name,
            industry
          )
        `
        )
        .order("created_at", { ascending: true });

      if (error) {
        setBlockersError(error.message);
        setIsBlockersLoading(false);
        return;
      }

      setBlockers((data ?? []) as Blocker[]);
      setIsBlockersLoading(false);
    }

    loadBlockers();
  }, []);

  useEffect(() => {
    async function loadStakeholders() {
      const { data, error } = await supabase
        .from("stakeholders")
        .select(
          `
          *,
          customers (
            company_name,
            industry
          )
        `
        )
        .order("created_at", { ascending: true });

      if (error) {
        setStakeholdersError(error.message);
        setIsStakeholdersLoading(false);
        return;
      }

      setStakeholders((data ?? []) as Stakeholder[]);
      setIsStakeholdersLoading(false);
    }

    loadStakeholders();
  }, []);

  useEffect(() => {
    async function loadValueMetrics() {
      const { data, error } = await supabase
        .from("value_metrics")
        .select(
          `
          *,
          customers (
            company_name,
            industry
          )
        `
        )
        .order("created_at", { ascending: true });

      if (error) {
        setValueMetricsError(error.message);
        setIsValueMetricsLoading(false);
        return;
      }

      setValueMetrics((data ?? []) as ValueMetric[]);
      setIsValueMetricsLoading(false);
    }

    loadValueMetrics();
  }, []);

  const dashboardMetrics = useMemo(() => {
    const activeCustomers = customers.length;

    const productionDeployments = customers.filter(
      (customer) => customer.deployment_stage === "Production"
    ).length;

    const openBlockers = customers.filter(
      (customer) =>
        customer.primary_blocker && customer.primary_blocker !== "None"
    ).length;

    const monthlyValue = customers.reduce(
      (total, customer) => total + Number(customer.monthly_value ?? 0),
      0
    );

    return [
      {
        label: "Active Customers",
        value: String(activeCustomers),
        change: "+4",
        detail: "enterprise accounts",
        icon: Building2,
        tone: "cyan" as Tone,
      },
      {
        label: "Production Deployments",
        value: String(productionDeployments),
        change: "+2",
        detail: "validated workflows",
        icon: CheckCircle2,
        tone: "emerald" as Tone,
      },
      {
        label: "Open Blockers",
        value: String(openBlockers),
        change: "2 high",
        detail: "need action",
        icon: AlertTriangle,
        tone: "amber" as Tone,
      },
      {
        label: "Monthly Value",
        value: `$${Math.round(monthlyValue / 1000)}K`,
        change: "+21%",
        detail: "realized impact",
        icon: BarChart3,
        tone: "emerald" as Tone,
      },
    ];
  }, [customers]);

  function openAddCustomer() {
    setCustomerModalMode("create");
    setSelectedCustomer(null);
    setIsCustomerModalOpen(true);
  }

  function openEditCustomer(customer: Customer) {
    setCustomerModalMode("edit");
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  }

  function handleCustomerCreated(customer: Customer) {
    setCustomers((current) => [...current, customer]);
  }

  function handleCustomerUpdated(updatedCustomer: Customer) {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  }

  async function handleDeleteCustomer(customer: Customer) {
    const confirmed = window.confirm(
      `Delete ${customer.company_name}? This will remove the customer record from Supabase.`
    );

    if (!confirmed) return;

    setDeletingCustomerId(customer.id);

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customer.id);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      setDeletingCustomerId(null);
      return;
    }

    setCustomers((current) =>
      current.filter((item) => item.id !== customer.id)
    );

    setDeletingCustomerId(null);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_32%),linear-gradient(135deg,#020617,#0f172a_45%,#020617)] text-white xl:flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <TopBar />

        {activePage === "Customers" ? (
          <CustomersPage
            customers={customers}
            onOpenAddCustomer={openAddCustomer}
            onOpenEditCustomer={openEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            deletingCustomerId={deletingCustomerId}
          />
        ) : activePage === "Deployments" ? (
          <DeploymentsPage
            deployments={deployments}
            isLoading={isDeploymentsLoading}
            loadError={deploymentsError}
          />
        ) : activePage === "Use Cases" ? (
          <UseCasesPage
            useCases={useCases}
            isLoading={isUseCasesLoading}
            loadError={useCasesError}
          />
        ) : activePage === "Blockers" ? (
          <BlockersPage
            blockers={blockers}
            isLoading={isBlockersLoading}
            loadError={blockersError}
          />
        ) : activePage === "Stakeholders" ? (
          <StakeholdersPage
            stakeholders={stakeholders}
            isLoading={isStakeholdersLoading}
            loadError={stakeholdersError}
          />
        ) : activePage === "Value Tracking" ? (
          <ValueTrackingPage
            valueMetrics={valueMetrics}
            isLoading={isValueMetricsLoading}
            loadError={valueMetricsError}
          />
        ) : activePage === "Reports" ? (
          <ReportsPage
            customers={customers}
            deployments={deployments}
            useCases={useCases}
            blockers={blockers}
            stakeholders={stakeholders}
            valueMetrics={valueMetrics}
          />
        ) : (
          <DashboardPage
            customers={customers}
            dashboardMetrics={dashboardMetrics}
            isLoading={isLoading}
            loadError={loadError}
          />
        )}

        <CustomerFormModal
          mode={customerModalMode}
          customer={selectedCustomer}
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          onCustomerCreated={handleCustomerCreated}
          onCustomerUpdated={handleCustomerUpdated}
        />
      </main>
    </div>
  );
}

export default App;