import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI, authAPI } from '../utils/api';
import { Spinner, StatCard, ProgressBar } from '../components/shared/UI';
import { toast } from 'react-toastify';
import {
  Target, Rocket, CheckCircle, Bookmark, LayoutDashboard,
  Compass, GraduationCap, BookOpen, Pencil, ChevronRight,
  Calendar, Flag, TrendingUp, Lightbulb
} from 'lucide-react';

const STATUS_COLORS = {
  exploring:   'bg-slate-100   text-slate-600',
  planning:    'bg-blue-100    text-blue-700',
  'in-progress':'bg-amber-100  text-amber-700',
  launched:    'bg-emerald-100 text-emerald-700',
  paused:      'bg-red-100     text-red-600',
};
const STATUS_OPTIONS = ['exploring','planning','in-progress','launched','paused'];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('progress');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, userRes] = await Promise.all([progressAPI.getAll(), authAPI.getMe()]);
      setProgress(pRes.data.data || []);
      setSavedIdeas(userRes.data.data?.savedIdeas || []);
    } catch { setProgress([]); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await progressAPI.update(id, { status });
      setProgress(prev => prev.map(p => p._id === id ? { ...p, status } : p));
      toast.success('Status updated!');
    } catch { toast.error('Could not update status'); }
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  const stats = [
    { icon: Target,       label: 'Tracking',   value: progress.length,                                       color: 'primary' },
    { icon: TrendingUp,   label: 'In Progress', value: progress.filter(p => p.status==='in-progress').length, color: 'yellow'  },
    { icon: CheckCircle,  label: 'Launched',    value: progress.filter(p => p.status==='launched').length,    color: 'primary' },
    { icon: Bookmark,     label: 'Saved',       value: savedIdeas.length,                                     color: 'blue'    },
  ];

  if (loading) return <div className="py-20"><Spinner text="Loading dashboard..." /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-600 font-semibold text-sm mb-1">{greeting()}</p>
          <h1 className="text-3xl font-display font-bold text-slate-900">{user?.name?.split(' ')[0]}'s Dashboard</h1>
        </div>
        <div className="flex gap-3">
          {!user?.assessmentCompleted && (
            <Link to="/assessment" className="btn-primary text-sm">Take Assessment</Link>
          )}
          <Link to="/ideas" className="btn-secondary text-sm"><Compass size={15}/> Explore Ideas</Link>
        </div>
      </div>

      {/* Assessment banner */}
      {!user?.assessmentCompleted && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Target size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-1">Complete Your Assessment</h3>
              <p className="text-emerald-100 text-sm">Tell us your skills and budget to get personalised idea recommendations.</p>
            </div>
            <Link to="/assessment" className="bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shrink-0">
              Start Now <ChevronRight size={16} className="inline" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Profile + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          {user?.location && <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5"><Flag size={13}/>{user.location}</p>}
          {user?.skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.slice(0,5).map(s => (
                  <span key={s.name} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{s.name}</span>
                ))}
              </div>
            </div>
          )}
          <Link to="/profile" className="btn-ghost text-xs mt-4 w-full justify-center border border-slate-200">
            <Pencil size={13}/> Edit Profile
          </Link>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Rocket size={18} className="text-emerald-600"/> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Lightbulb,      label: 'Browse Ideas',        to: '/ideas' },
              { icon: GraduationCap,  label: 'Find a Mentor',       to: '/mentors' },
              { icon: BookOpen,       label: 'Learning Hub',         to: '/training' },
              { icon: Target,         label: 'Retake Assessment',    to: '/assessment' },
            ].map(a => (
              <Link key={a.to} to={a.to}
                className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-emerald-50 rounded-xl transition group">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <a.icon size={17} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {[
          { id:'progress', label:'My Progress', icon: LayoutDashboard },
          { id:'saved',    label:'Saved Ideas', icon: Bookmark },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab===t.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        progress.length === 0 ? (
          <div className="card text-center py-14">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target size={28} className="text-emerald-400"/>
            </div>
            <h3 className="font-display font-semibold text-slate-700 mb-2">No ideas tracked yet</h3>
            <p className="text-slate-400 text-sm mb-5">Explore ideas and click "Track This Idea" to start</p>
            <Link to="/ideas" className="btn-primary">Browse Ideas</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {progress.map(p => (
              <div key={p._id} className="card hover:shadow-sm transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{p.businessIdea?.icon || '💡'}</div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{p.businessIdea?.title || 'Business Idea'}</h3>
                      <span className="text-xs text-slate-400 capitalize">{p.businessIdea?.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={p.status} onChange={e => updateStatus(p._id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_COLORS[p.status]}`}>
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="bg-white text-slate-800 capitalize">{s}</option>
                      ))}
                    </select>
                    <Link to={`/ideas/${p.businessIdea?._id}`}
                      className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1">
                      Roadmap <ChevronRight size={13}/>
                    </Link>
                  </div>
                </div>
                {p.percentComplete > 0 && (
                  <div className="mt-4"><ProgressBar percent={p.percentComplete} label="Progress" /></div>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar size={12}/>Started {new Date(p.startDate||p.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Saved Tab */}
      {activeTab === 'saved' && (
        savedIdeas.length === 0 ? (
          <div className="card text-center py-14">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark size={28} className="text-slate-400"/>
            </div>
            <h3 className="font-display font-semibold text-slate-700 mb-2">No saved ideas</h3>
            <p className="text-slate-400 text-sm mb-5">Click the bookmark icon on any idea to save it</p>
            <Link to="/ideas" className="btn-primary">Explore Ideas</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedIdeas.map(idea => (
              <div key={idea._id||idea}
                className="card-interactive flex items-center gap-3"
                onClick={() => navigate(`/ideas/${idea._id||idea}`)}>
                <span className="text-3xl">{idea.icon || '💡'}</span>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{idea.title||'Saved Idea'}</p>
                  <span className="text-xs text-slate-400 capitalize">{idea.category}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
