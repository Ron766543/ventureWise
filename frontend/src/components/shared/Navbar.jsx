import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, LogOut,
  Compass, BookOpen, Users, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const NAV_LINKS = [
  { path: '/ideas',    label: 'Explore Ideas', Icon: Compass },
  { path: '/training', label: 'Learning Hub',  Icon: BookOpen },
  { path: '/mentors',  label: 'Mentors',       Icon: Users },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // close mobile menu whenever we navigate
  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const active = (path) => location.pathname.startsWith(path);

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 ${
      active(path)
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-slate-200 shadow-sm'
          : 'bg-white border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <Logo size={80} />

          {/* desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ path, label, Icon }) => (
              <Link key={path} to={path} className={navLinkClass(path)}>
                <Icon size={15} strokeWidth={2.2} />
                {label}
              </Link>
            ))}
          </nav>

          {/* desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <LayoutDashboard size={15} strokeWidth={2.2} />
                  Dashboard
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ShieldCheck size={15} />
                    Admin
                  </Link>
                )}

                {/* user chip */}
                <div className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm select-none">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[96px] truncate">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="ml-1 p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* mobile burger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 anim-down">
          {NAV_LINKS.map(({ path, label, Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active(path)
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2 pb-1">
              <Link to="/login"    className="btn-secondary text-sm flex-1 py-2.5">Sign in</Link>
              <Link to="/register" className="btn-primary  text-sm flex-1 py-2.5">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
