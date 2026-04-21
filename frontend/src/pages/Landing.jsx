import { Link } from 'react-router-dom'
import { Zap, Activity, Bell, Shield, Clock, BarChart2, ArrowRight, CheckCircle, Globe, GitBranch, Server } from 'lucide-react'

const stats = [
  { value: '30s', label: 'Check interval' },
  { value: '99.9%', label: 'Uptime tracked' },
  { value: '<1s', label: 'Alert latency' },
  { value: '∞', label: 'Free forever' },
]

const features = [
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    desc: 'HTTP health checks every 30s with configurable intervals, timeouts, and expected status codes.',
    color: 'from-brand-500/20 to-brand-500/5',
    glow: 'rgba(217,70,239,0.2)',
  },
  {
    icon: Bell,
    title: 'Smart Alerting',
    desc: 'In-app, mock email, and webhook alerts fire automatically when a monitor goes down or recovers.',
    color: 'from-sky-500/20 to-sky-500/5',
    glow: 'rgba(14,165,233,0.2)',
  },
  {
    icon: BarChart2,
    title: 'Uptime Analytics',
    desc: 'Track 24-hour uptime %, average latency, check result history, and incident timelines.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    glow: 'rgba(16,185,129,0.2)',
  },
  {
    icon: Shield,
    title: 'Incident Management',
    desc: 'Incidents open automatically on failure, track failure count, and resolve when health returns.',
    color: 'from-rose-500/20 to-rose-500/5',
    glow: 'rgba(225,29,72,0.2)',
  },
  {
    icon: Globe,
    title: 'Public Status Pages',
    desc: 'Share a public /status/{slug} page — no login required — with real-time project health.',
    color: 'from-amber-500/20 to-amber-500/5',
    glow: 'rgba(245,158,11,0.2)',
  },
  {
    icon: Zap,
    title: 'API Key Events',
    desc: 'Ingest custom events from your app using project API keys with Redis-backed rate limiting.',
    color: 'from-violet-500/20 to-violet-500/5',
    glow: 'rgba(139,92,246,0.2)',
  },
]

const stack = [
  { icon: Server, label: 'Spring Boot 3', sub: 'Java 21 Virtual Threads' },
  { icon: GitBranch, label: 'PostgreSQL + Redis', sub: 'Streams queue + rate limiting' },
  { icon: Globe, label: 'React + Vite', sub: 'Deployed on Render' },
]

export default function Landing() {
  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.05] bg-black/30 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(217,70,239,0.5)]">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">UptimePulse</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white text-sm font-semibold transition-colors hidden sm:block">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm px-5 py-2">Get started →</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero: Two-column split ── */}
      <section className="max-w-7xl mx-auto px-6 pt-40 pb-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left: copy */}
        <div className="relative">
          {/* Glow blob */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 shadow-[0_0_15px_-3px_rgba(217,70,239,0.2)]">
              <Zap size={12} className="animate-pulse" />
              Open-source · Docker-ready · Free
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 bg-gradient-to-b from-white via-white to-brand-300 bg-clip-text text-transparent">
              API Monitoring<br />done right.
            </h1>

            <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
              Monitor APIs, track uptime, manage incidents and get instant alerts — powered by Spring Boot, PostgreSQL, and Redis.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/register" className="btn-primary flex items-center gap-2 px-7 py-3.5 text-base">
                Start free <ArrowRight size={17} />
              </Link>
              <Link to="/login" className="btn-secondary flex items-center gap-2 px-7 py-3.5 text-base">
                View demo
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-500">Demo: demo@uptimepulse.dev / demo123</p>
          </div>
        </div>

        {/* Right: Terminal */}
        <div className="relative">
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(217,70,239,0.2)]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-500 font-mono">~/uptimepulse — docker compose up</span>
            </div>
            <pre className="text-xs sm:text-sm font-mono text-slate-300 px-6 py-6 leading-7 overflow-x-auto">
{`$ docker compose up --build

`}<span className="text-slate-500">Starting services...</span>{`

`}<span className="text-emerald-400">✓</span>{` PostgreSQL    ready on :5432
`}<span className="text-emerald-400">✓</span>{` Redis         ready on :6379
`}<span className="text-emerald-400">✓</span>{` Backend       ready on :8080
`}<span className="text-emerald-400">✓</span>{` Frontend      ready on :5173
`}<span className="text-emerald-400">✓</span>{` Swagger UI    /swagger-ui.html

`}<span className="text-brand-400">→</span>{` Open http://localhost:5173`}
            </pre>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-white/[0.05] bg-white/[0.01] backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-b from-white to-brand-300 bg-clip-text text-transparent mb-1">{value}</p>
              <p className="text-sm text-slate-400 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features: alternating rows ── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Everything you need</h2>
          <p className="text-slate-400 text-lg">Production-grade features. Zero cost.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color, glow }) => (
            <div
              key={title}
              className="group relative card hover:-translate-y-1.5 cursor-default"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                style={{ boxShadow: `0 0 18px -4px ${glow}` }}>
                <Icon size={20} className="text-white/80" />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack row ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="card bg-gradient-to-r from-white/[0.03] to-transparent border-white/[0.06]">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {stack.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex-1 flex items-center gap-4 px-8 py-4 w-full">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech checklist ── */}
      <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-10 tracking-tight">Built for engineers who care about uptime</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            'JWT-secured multi-tenant architecture',
            'Redis Streams queue for async health checks',
            'Spring Boot 3 + Java 21 Virtual Threads',
            'Full Swagger / OpenAPI docs at /swagger-ui.html',
            'Live frontend connected to deployed Render backend',
            'Docker Compose ready in one command',
          ].map(b => (
            <div key={b} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
              <CheckCircle size={16} className="text-brand-400 mt-0.5 shrink-0 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              <span className="text-slate-300 text-sm font-medium">{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="relative overflow-hidden border-t border-white/[0.05]">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 via-brand-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-40 bg-brand-500/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 bg-gradient-to-b from-white to-brand-300 bg-clip-text text-transparent">
            Ready to monitor?
          </h2>
          <p className="text-slate-400 text-lg mb-10">Set up in 60 seconds. No credit card, no cloud account.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg">
            Create free account <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] bg-black/20 py-8 text-center text-slate-500 text-sm font-medium backdrop-blur-md">
        <p>UptimePulse — Open source API monitoring PaaS · Spring Boot 3 + React + Redis + PostgreSQL</p>
      </footer>
    </div>
  )
}
