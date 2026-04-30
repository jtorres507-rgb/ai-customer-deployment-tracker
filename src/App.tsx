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

const panel =
  "rounded-3xl border border-slate-700/70 bg-slate-900/70 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl";

const glass =
  "rounded-2xl border border-slate-700/70 bg-slate-950/50";

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

const metrics = [
  {
    label: "Active Customers",
    value: "18",
    change: "+4",
    detail: "enterprise accounts",
    icon: Building2,
    tone: "cyan",
  },
  {
    label: "Production Deployments",
    value: "7",
    change: "+2",
    detail: "validated workflows",
    icon: CheckCircle2,
    tone: "emerald",
  },
  {
    label: "Open Blockers",
    value: "5",
    change: "2 high",
    detail: "need action",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    label: "Monthly Value",
    value: "$148K",
    change: "+21%",
    detail: "realized impact",
    icon: BarChart3,
    tone: "emerald",
  },
];

const deploymentRows = [
  {
    customer: "Enterprise Logistics Co.",
    stage: "Security Review",
    readiness: 82,
    owner: "AI Success",
    blocker: "Data retention approval",
    value: "$96K/mo",
    tone: "amber",
  },
  {
    customer: "Regional Finance Group",
    stage: "Pilot",
    readiness: 74,
    owner: "Solutions",
    blocker: "Champion enablement",
    value: "$42K/mo",
    tone: "cyan",
  },
  {
    customer: "Healthcare Ops Team",
    stage: "Production",
    readiness: 91,
    owner: "Technical Success",
    blocker: "None",
    value: "$68K/mo",
    tone: "emerald",
  },
];

const upcomingActions = [
  "Finalize governance decision for document workflows",
  "Schedule finance champion enablement sprint",
  "Validate production API limits for support automation",
  "Prepare executive value memo for logistics account",
];

function StatusPill({
  children,
  tone = "cyan",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "emerald" | "amber" | "rose" | "slate";
}) {
  const tones = {
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

function Sidebar() {
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
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = index === 0;

              return (
                <button
                  key={item.name}
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
        <div className={`${glass} flex min-w-[320px] flex-1 items-center gap-3 px-4 py-3 lg:max-w-xl`}>
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

function MetricCard({ item }: { item: (typeof metrics)[number] }) {
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

        <StatusPill tone={item.tone as "cyan" | "emerald" | "amber"}>
          {item.change}
        </StatusPill>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_32%),linear-gradient(135deg,#020617,#0f172a_45%,#020617)] text-white xl:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <TopBar />

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
                <p className="text-sm font-bold text-white">Supabase planned</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => (
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
                  Database-backed customer deployment records will appear here in
                  the next phase.
                </p>
              </div>
              <button className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                + Add Customer
              </button>
            </div>

            <div className="mt-7 space-y-4">
              {deploymentRows.map((row) => (
                <div
                  key={row.customer}
                  className="rounded-3xl border border-slate-700/70 bg-slate-950/50 p-5"
                >
                  <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Customer
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {row.customer}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Owner: {row.owner}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Stage</p>
                      <div className="mt-2">
                        <StatusPill tone={row.tone as "cyan" | "emerald" | "amber"}>
                          {row.stage}
                        </StatusPill>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Readiness</p>
                      <p className="mt-1 text-2xl font-bold text-cyan-300">
                        {row.readiness}%
                      </p>
                    </div>

                    <div className="lg:col-span-3">
                      <p className="text-xs text-slate-500">Primary Blocker</p>
                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {row.blocker}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-xs text-slate-500">Value</p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {row.value}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                      style={{ width: `${row.readiness}%` }}
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
                Phase 2 Status
              </p>
              <p className="mt-2 text-lg font-bold text-white">
                Frontend shell ready
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Next phase will add the real data model, Supabase project, and
                customer CRUD workflow.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;