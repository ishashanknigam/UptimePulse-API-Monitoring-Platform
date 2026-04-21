import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, Clock, TrendingUp, ExternalLink } from 'lucide-react'
import { getDashboard } from '../api/dashboard'
import StatCard from '../components/StatCard'
import { MonitorStatusBadge, IncidentStatusBadge } from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDistanceToNow } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const fetchData = () => {
      getDashboard()
        .then(res => { if (mounted) { setData(res); setError('') } })
        .catch(() => { if (mounted) setError('Failed to load dashboard') })
        .finally(() => { if (mounted) setLoading(false) })
    }
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <p className="text-red-400 text-sm">{error}</p>

  const chartData = (data?.recentChecks || [])
    .slice(0, 20)
    .reverse()
    .map((c, i) => ({
      name: i,
      latency: c.latencyMs,
      success: c.success ? 1 : 0,
    }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time infrastructure overview</p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Stat Cards (Top Row) */}
        <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Monitors"    value={data?.totalMonitors ?? 0}    icon={Activity}       color="brand" />
          <StatCard title="Uptime (24h)"      value={`${data?.uptimePercentage ?? 100}%`} icon={TrendingUp} color="green" />
          <StatCard title="Avg Latency"       value={`${Math.round(data?.avgLatencyMs ?? 0)} ms`} icon={Clock} color="yellow" />
          <StatCard title="Open Incidents"    value={data?.openIncidents ?? 0}    icon={AlertTriangle}  color="red" />
        </div>

        {/* Latency Chart (Spans 8 columns) */}
        <div className="card md:col-span-8 flex flex-col min-h-[300px]">
          <h2 className="font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={18} className="text-brand-400" />
            Network Latency
          </h2>
          {chartData.length > 0 ? (
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="ms" width={45} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    labelStyle={{ display: 'none' }}
                    itemStyle={{ color: '#d946ef', fontWeight: 'bold' }}
                    formatter={v => [`${v} ms`, 'Latency']}
                  />
                  <Line type="monotone" dataKey="latency" stroke="#d946ef" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#d946ef' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-500 text-sm">Waiting for metric ingestion...</p>
            </div>
          )}
        </div>

        {/* Recent Incidents (Spans 4 columns) */}
        <div className="card md:col-span-4 flex flex-col h-full max-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" />
              Active Incidents
            </h2>
            <Link to="/incidents" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all &rarr;
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {data?.recentIncidents?.length ? (
              data.recentIncidents.map(i => (
                <div key={i.id} className="bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white truncate pr-2">{i.monitorName}</p>
                    <IncidentStatusBadge status={i.status} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{i.reason}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center pb-8 pt-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Activity size={24} className="text-emerald-400" />
                </div>
                <p className="text-slate-300 font-medium text-sm">All systems operational</p>
                <p className="text-slate-500 text-xs mt-1">No active incidents</p>
              </div>
            )}
          </div>
        </div>

        {/* Monitor List (Spans 12 columns) */}
        <div className="card md:col-span-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white">Monitored Endpoints</h2>
            <Link to="/projects" className="btn-secondary text-xs px-3 py-1.5">
              Manage endpoints
            </Link>
          </div>
          {data?.monitors?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-white/[0.03]">
                  <tr className="text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold rounded-l-lg">Name</th>
                    <th className="px-4 py-3 font-semibold">Target URL</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold rounded-r-lg">Last check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {data.monitors.map(m => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-200">{m.name}</td>
                      <td className="px-4 py-3.5 text-slate-400 max-w-[250px] truncate">{m.url}</td>
                      <td className="px-4 py-3.5"><MonitorStatusBadge active={m.active} hasOpenIncident={m.hasOpenIncident} /></td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {m.lastCheckedAt ? formatDistanceToNow(new Date(m.lastCheckedAt), { addSuffix: true }) : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
              <p className="text-slate-400 mb-4 font-medium">No endpoints are currently being monitored.</p>
              <Link to="/projects" className="btn-primary">Add your first monitor</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
