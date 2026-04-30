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
  FileText,
  LayoutDashboard,
  Network,
  Search,
  Settings,
  Sparkles,
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

function formatMonthlyValue(value: number) {
  return `$${Math.round(Number(value ?? 0) / 1000)}K/mo`;
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

function AddCustomerModal({
  isOpen,
  onClose,
  onCustomerCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: Customer) => void;
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

    setIsSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-md">
      <div className={`${panel} max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">
              New Customer Deployment
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Add Customer
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Create a new enterprise AI customer deployment record in Supabase.
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
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Company Name
            </label>
            <input
              value={formData.company_name}
              onChange={(event) => updateField("company_name", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Example: Acme Global Corp."
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Industry
            </label>
            <input
              value={formData.industry}
              onChange={(event) => updateField("industry", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Example: Logistics"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Account Owner
            </label>
            <input
              value={formData.account_owner}
              onChange={(event) => updateField("account_owner", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Example: AI Success"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Health Status
            </label>
            <select
              value={formData.health_status}
              onChange={(event) => updateField("health_status", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            >
              <option>Healthy</option>
              <option>At Risk</option>
              <option>Blocked</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Deployment Stage
            </label>
            <select
              value={formData.deployment_stage}
              onChange={(event) =>
                updateField("deployment_stage", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            >
              <option>Discovery</option>
              <option>Readiness Review</option>
              <option>Security Review</option>
              <option>Pilot</option>
              <option>Production</option>
              <option>Expansion</option>
              <option>Blocked</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Readiness Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.readiness_score}
              onChange={(event) =>
                updateField("readiness_score", Number(event.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Monthly Value
            </label>
            <input
              type="number"
              min="0"
              value={formData.monthly_value}
              onChange={(event) =>
                updateField("monthly_value", Number(event.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Example: 50000"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Primary Blocker
            </label>
            <input
              value={formData.primary_blocker}
              onChange={(event) =>
                updateField("primary_blocker", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Example: None"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Next Action
            </label>
            <textarea
              value={formData.next_action}
              onChange={(event) => updateField("next_action", event.target.value)}
              className="mt-2 min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Example: Schedule technical readiness review"
            />
          </div>

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
              {isSaving ? "Saving..." : "Create Customer"}
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Active Customer Deployments
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Live customer deployment records loaded from Supabase.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {isLoading && (
              <div className="rounded-3xl border border-slate-700/70 bg-slate-950/50 p-5 text-slate-300">
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
                <div
                  key={row.id}
                  className="rounded-3xl border border-slate-700/70 bg-slate-950/50 p-5"
                >
                  <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Customer
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {row.company_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Owner: {row.account_owner}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Stage</p>
                      <div className="mt-2">
                        <StatusPill tone={getStageTone(row.deployment_stage)}>
                          {row.deployment_stage}
                        </StatusPill>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Readiness</p>
                      <p className="mt-1 text-2xl font-bold text-cyan-300">
                        {row.readiness_score}%
                      </p>
                    </div>

                    <div className="lg:col-span-3">
                      <p className="text-xs text-slate-500">
                        Primary Blocker
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {row.primary_blocker ?? "None"}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Value</p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {formatMonthlyValue(row.monthly_value)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
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

          <p className="mt-1 text-sm text-slate-400">
            Priority next steps for customer deployment momentum.
          </p>

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

          <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Phase 5 Status
            </p>

            <p className="mt-2 text-lg font-bold text-white">
              Customer CRUD started
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              The dashboard reads live customer data, and the customer page can
              create new records in Supabase.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function CustomersPage({
  customers,
  onOpenAddCustomer,
}: {
  customers: Customer[];
  onOpenAddCustomer: () => void;
}) {
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
              Live customer records loaded from Supabase.
            </p>
          </div>

          <StatusPill tone="emerald">{customers.length} Records</StatusPill>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-700/70">
          <div className="grid grid-cols-12 bg-slate-950/80 px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Industry</div>
            <div className="col-span-2">Stage</div>
            <div className="col-span-1">Score</div>
            <div className="col-span-2">Health</div>
            <div className="col-span-2">Monthly Value</div>
          </div>

          <div className="divide-y divide-slate-800">
            {customers.map((customer) => (
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

                <div className="col-span-2">
                  <StatusPill tone={getHealthTone(customer.health_status)}>
                    {customer.health_status}
                  </StatusPill>
                </div>

                <div className="col-span-2 font-bold text-white">
                  {formatMonthlyValue(customer.monthly_value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  function handleCustomerCreated(customer: Customer) {
    setCustomers((current) => [...current, customer]);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_32%),linear-gradient(135deg,#020617,#0f172a_45%,#020617)] text-white xl:flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <TopBar />

        {activePage === "Customers" ? (
          <CustomersPage
            customers={customers}
            onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
          />
        ) : (
          <DashboardPage
            customers={customers}
            dashboardMetrics={dashboardMetrics}
            isLoading={isLoading}
            loadError={loadError}
          />
        )}

        <AddCustomerModal
          isOpen={isAddCustomerOpen}
          onClose={() => setIsAddCustomerOpen(false)}
          onCustomerCreated={handleCustomerCreated}
        />
      </main>
    </div>
  );
}

export default App;