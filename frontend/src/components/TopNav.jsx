import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, LogOut } from 'lucide-react'

const navItems = [
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/projects',   label: 'Projects'  },
  { to: '/incidents',  label: 'Incidents' },
  { to: '/alerts',     label: 'Alerts'    },
]

export default function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    // relative is on the full-width header so absolute children center on the SCREEN
    <header className="sticky top-0 z-50 w-full relative bg-white/[0.01] backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">

      {/* Nav links — absolutely centered on the full screen width */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:flex justify-center items-center">
        <nav className="flex items-center gap-1 pointer-events-auto">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 shadow-[0_0_15px_-3px_rgba(217,70,239,0.2)] border border-brand-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logo + Profile row (z-10 so it sits above the absolute nav layer) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(217,70,239,0.5)]">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white hidden sm:block">UptimePulse</span>
          </div>

          {/* Right side: Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all border border-transparent hover:border-red-500/20"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-white/5 gap-2 pb-3">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  )
}
