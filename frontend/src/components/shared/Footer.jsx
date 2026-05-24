import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUpRight, Heart } from 'lucide-react';
import { LogoIcon } from './Logo';

const PLATFORM_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/ideas',    label: 'Explore Ideas' },
  { to: '/training', label: 'Learning Hub' },
  { to: '/mentors',  label: 'Find Mentors' },
  { to: '/dashboard',label: 'Dashboard' },
];

const SUPPORT_LINKS = [
  { label: 'Become a Mentor', to: '/become-mentor' },
  { label: 'Privacy Policy',  to: '#' },
  { label: 'Terms of Use',    to: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* brand block */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <LogoIcon size={46} />
              <span className="font-display font-bold text-xl text-white">
                Venture<span className="text-emerald-400">Wise</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-5">
              Helping women, youth, and rural entrepreneurs across India discover
              the right business idea and turn it into reality — for free.
            </p>

            <div className="flex flex-wrap gap-2">
              {['Women-Friendly', 'Rural Focus', 'Free Access', 'Hindi & English'].map((t) => (
                <span
                  key={t}
                  className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* nav links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* support */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-3 mb-5">
              <li>
                <a
                  href="mailto:support@venturewise.in"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <Mail size={14} />
                  support@venturewise.in
                </a>
              </li>
              {SUPPORT_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin size={12} />
              Made for grassroots entrepreneurs across India
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} VentureWise. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-600">
            Built with <Heart size={11} className="text-red-500 fill-red-500" /> for aspiring entrepreneurs
          </p>
        </div>
      </div>
    </footer>
  );
}
