import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Lightbulb, Users, GraduationCap,
  BookOpen, Target, Map, BarChart2, Sparkles, TrendingUp,
  Shield, Star, Zap, Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { IdeaCard } from '../components/shared/UI';
import { LogoIcon } from '../components/shared/Logo';
import { SAMPLE_IDEAS } from '../data/sample';

// pulled out so Landing stays readable
const STATS = [
  { Icon: Lightbulb,    label: 'Business Ideas', value: '200+' },
  { Icon: Users,        label: 'Entrepreneurs',  value: '5,000+' },
  { Icon: GraduationCap,label: 'Mentors',        value: '150+' },
  { Icon: BookOpen,     label: 'Free Resources', value: '500+' },
];

const FEATURES = [
  { Icon: Target,       title: 'Skill-Matched Ideas',   desc: 'Ideas matched to your skills, interests, and budget.' },
  { Icon: Map,          title: 'Step-by-Step Roadmaps', desc: 'Validation steps, legal checklist, costs, and marketing.' },
  { Icon: GraduationCap,title: 'Verified Mentors',      desc: 'Connect with entrepreneurs who have done it before.' },
  { Icon: BarChart2,    title: 'Progress Dashboard',    desc: 'Track milestones and stay accountable.' },
  { Icon: BookOpen,     title: 'Learning Hub',          desc: 'Videos, articles, checklists — always free.' },
  { Icon: Users,        title: 'Community Focus',       desc: 'Built for women, youth, and rural India.' },
];

const HOW_IT_WORKS = [
  { step: '01', Icon: Target,     title: 'Take the Assessment', desc: 'Tell us your skills, interests, and startup budget.' },
  { step: '02', Icon: Sparkles,   title: 'Get Matched Ideas',   desc: 'We surface ideas that actually fit you.' },
  { step: '03', Icon: Map,        title: 'Follow the Roadmap',  desc: 'A clear plan from idea to first customer.' },
  { step: '04', Icon: TrendingUp, title: 'Launch & Grow',       desc: 'Mentor support and resources to keep going.' },
];

const TRUST = [
  { Icon: Shield, title: 'Verified Mentors',   desc: 'Every mentor is manually reviewed before they join.' },
  { Icon: Star,   title: 'Curated Content',    desc: 'All ideas and resources are approved by the team.' },
  { Icon: Zap,    title: 'Low-Bandwidth Safe', desc: 'Designed to work even on slow 3G connections.' },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  // just first 3 featured ones for the preview section
  const previewIdeas = SAMPLE_IDEAS.filter((i) => i.isFeatured).slice(0, 3);

  return (
    <div className="anim-fade">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-bg pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm">
              <Globe size={14} />
              Empowering India&apos;s next generation of entrepreneurs
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.05] tracking-tight mb-6">
              Turn Your Skills Into a{' '}
              <span className="text-emerald-600 relative inline-block">
                Thriving Business
                {/* hand-drawn underline effect */}
                <svg
                  className="absolute -bottom-1.5 left-0 w-full"
                  height="6"
                  viewBox="0 0 300 6"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 5 Q75 0 150 5 Q225 10 300 5"
                    stroke="#6ee7b7"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              VentureWise helps women, youth, and rural entrepreneurs discover the right business
              idea, get a clear roadmap, and connect with mentors — all completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5">
                  Go to Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-base px-8 py-3.5">
                    Start for Free <ArrowRight size={18} />
                  </Link>
                  <Link to="/ideas" className="btn-secondary text-base px-8 py-3.5">
                    Browse Ideas
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-slate-400">
              {['Free forever', 'No credit card needed', 'Hindi & English'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats banner ─────────────────────────────────────── */}
      <section className="bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger">
            {STATS.map(({ Icon, label, value }) => (
              <div key={label} className="text-center anim-up">
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-emerald-200" strokeWidth={2} />
                </div>
                <p className="text-3xl font-display font-bold text-white mb-0.5">{value}</p>
                <p className="text-sm text-emerald-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who is this for ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Who is this for?
            </p>
            <h2 className="section-heading mb-4">Built for Every Aspiring Entrepreneur</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Whether you&apos;re a homemaker, recent graduate, or a farmer — there&apos;s
              something here for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {[
              { emoji: '👩',   title: 'Women',               desc: 'Home-based, flexible ideas that fit around your schedule.' },
              { emoji: '🧑‍🎓', title: 'Youth',               desc: 'Low-cost digital and service businesses to get started fast.' },
              { emoji: '🌾',   title: 'Rural Entrepreneurs', desc: 'Agriculture, crafts, and local service ideas for your area.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="card-interactive text-center p-8 group">
                <div className="text-5xl mb-5">{emoji}</div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              What you get
            </p>
            <h2 className="section-heading mb-4">Everything You Need to Launch</h2>
            <p className="text-slate-500">From idea discovery to your first customer.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all group anim-up"
              >
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <Icon size={20} className="text-emerald-600" strokeWidth={2} />
                </div>
                <h3 className="font-display font-semibold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preview ideas ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">
                Handpicked for you
              </p>
              <h2 className="section-heading">Popular Business Ideas</h2>
            </div>
            <Link to="/ideas" className="btn-outline text-sm hidden sm:flex">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewIdeas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/ideas" className="btn-outline">
              View All Ideas <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Simple process
            </p>
            <h2 className="section-heading">How VentureWise Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {HOW_IT_WORKS.map(({ step, Icon, title, desc }) => (
              <div
                key={step}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative anim-up"
              >
                {/* big step number in the background */}
                <span className="absolute top-4 right-5 text-5xl font-display font-bold text-slate-50 select-none">
                  {step}
                </span>
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Icon size={20} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="font-display font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ─────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {TRUST.map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={22} className="text-emerald-600" strokeWidth={2} />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* subtle background glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #059669 0%, transparent 50%), radial-gradient(circle at 80% 50%, #047857 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <TrendingUp size={14} />
            5,000+ entrepreneurs already started
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5 leading-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Create your free account and find the business idea that&apos;s right for you — in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/ideas"
              className="inline-flex items-center justify-center gap-2 text-base px-8 py-3.5 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-150"
            >
              Browse Ideas First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
