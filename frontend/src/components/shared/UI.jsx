import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, Bookmark, IndianRupee, Clock, Search,
         Play, FileText, CheckSquare, FileCode, BookOpen,
         Wrench, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


export const DIFF_COLORS = {
  low:    'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100   text-amber-700',
  high:   'bg-red-100     text-red-700',
};

export const DEMAND_COLORS = {
  low:        'bg-slate-100  text-slate-600',
  medium:     'bg-blue-100   text-blue-700',
  high:       'bg-orange-100 text-orange-700',
  'very-high':'bg-emerald-100 text-emerald-700',
};


export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Spinner text="Loading..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


export function Spinner({ text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 size={28} className="text-emerald-500 animate-spin" />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
}


export function IdeaCard({ idea, savedIds = [], onSave, onClick }) {
  const saved = savedIds.includes(idea._id);

  return (
    <article
      className="card-interactive group flex flex-col anim-up"
      onClick={() => onClick?.(idea)}
    >
      {/* top row: icon + title + bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-3xl leading-none shrink-0">{idea.icon ?? '💡'}</span>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-sm md:text-base leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {idea.title}
            </h3>
            <span className="text-xs text-slate-400 capitalize">{idea.category?.replace(/-/g, ' ')}</span>
          </div>
        </div>

        {onSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onSave(idea._id); }}
            className={`shrink-0 p-1.5 rounded-lg transition-all ${
              saved
                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
            }`}
            title={saved ? 'Remove' : 'Save'}
          >
            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
        {idea.description}
      </p>

      {/* badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`badge ${DIFF_COLORS[idea.difficulty]}`}>{idea.difficulty}</span>
        <span className={`badge ${DEMAND_COLORS[idea.marketDemand]}`}>
          {idea.marketDemand} demand
        </span>
      </div>

      {/* meta */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50">
        <span className="flex items-center gap-1">
          <IndianRupee size={11} />
          {idea.requiredCapital?.min?.toLocaleString('en-IN')}–
          {idea.requiredCapital?.max?.toLocaleString('en-IN')}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> {idea.timeToProfit}
        </span>
      </div>

      {idea.suitableFor?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {idea.suitableFor.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}


export function EmptyState({ Icon = Search, title, description, action }) {
  return (
    <div className="text-center py-20 px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h3 className="font-display font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}


const STAT_COLORS = {
  primary: 'bg-emerald-50 text-emerald-600',
  yellow:  'bg-amber-50   text-amber-600',
  blue:    'bg-blue-50    text-blue-600',
  red:     'bg-red-50     text-red-600',
  purple:  'bg-purple-50  text-purple-600',
};

export function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const colorClass = STAT_COLORS[color] ?? STAT_COLORS.primary;
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none mb-0.5">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}


const BAR_COLORS = {
  primary: 'bg-emerald-500',
  blue:    'bg-blue-500',
  amber:   'bg-amber-500',
  red:     'bg-red-500',
  purple:  'bg-purple-500',
};

export function ProgressBar({ pct, label, color = 'primary' }) {
  const fill = Math.min(100, Math.max(0, pct));
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-slate-600">{label}</span>
          <span className="font-semibold text-slate-700">{fill}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${BAR_COLORS[color] ?? BAR_COLORS.primary}`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
}

const TYPE_ICONS = {
  video: Play, article: FileText, checklist: CheckSquare,
  template: FileCode, guide: BookOpen, tool: Wrench,
};

const DIFF_BADGE = {
  beginner:     'bg-emerald-50 text-emerald-700',
  intermediate: 'bg-amber-50   text-amber-700',
  advanced:     'bg-red-50     text-red-700',
};

export function ResourceCard({ resource }) {
  const TypeIcon = TYPE_ICONS[resource.type] ?? FileText;

  return (
    <div className="card-interactive flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
          <TypeIcon size={18} className="text-slate-600" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug">
            {resource.title}
          </h3>
          <span className="text-xs text-slate-400 capitalize">{resource.category}</span>
        </div>
      </div>

      {resource.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-grow leading-relaxed">
          {resource.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
        <span className={`badge ${DIFF_BADGE[resource.difficulty] ?? DIFF_BADGE.beginner}`}>
          {resource.difficulty}
        </span>
        <div className="flex items-center gap-3">
          {resource.duration && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={11} />
              {resource.duration}
            </span>
          )}
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              Open <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
