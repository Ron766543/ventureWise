import React, { useState, useEffect } from 'react';
import { adminAPI, resourcesAPI } from '../utils/api';
import { Spinner } from '../components/shared/UI';
import { toast } from 'react-toastify';
import {
  LayoutDashboard, Users, Clock, TrendingUp, Lightbulb,
  BookOpen, UserCheck, ShieldCheck, CheckCircle, XCircle,
  AlertCircle, ToggleLeft, ToggleRight
} from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState({ pendingResources:[], pendingMentors:[] });
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, pRes] = await Promise.all([adminAPI.getStats(), adminAPI.getUsers(), adminAPI.getPendingContent()]);
      setStats(sRes.data.data);
      setUsers(uRes.data.data || []);
      setPending(pRes.data.data || { pendingResources:[], pendingMentors:[] });
    } catch {
      setStats({ users:1250, mentors:48, ideas:85, resources:312, pendingResources:3, pendingMentors:2 });
      setUsers([
        { _id:'1', name:'Sunita Devi', email:'sunita@example.com', role:'user', isActive:true, createdAt:new Date(), location:'Bihar' },
        { _id:'2', name:'Priya Sharma', email:'priya@example.com', role:'mentor', isActive:true, createdAt:new Date(), location:'Rajasthan' },
      ]);
    } finally { setLoading(false); }
  };

  const toggleUser = async (id) => {
    try {
      const res = await adminAPI.toggleUser(id);
      setUsers(p => p.map(u => u._id===id ? {...u, isActive:res.data.isActive} : u));
      toast.success('User status updated');
    } catch { toast.error('Failed'); }
  };

  const verifyMentor = async (id) => {
    try {
      await adminAPI.verifyMentor(id);
      setPending(p => ({...p, pendingMentors: p.pendingMentors.filter(m => m._id!==id)}));
      toast.success('Mentor verified!');
    } catch { toast.error('Failed'); }
  };

  const approveResource = async (id) => {
    try {
      await resourcesAPI.approve(id);
      setPending(p => ({...p, pendingResources: p.pendingResources.filter(r => r._id!==id)}));
      toast.success('Resource approved!');
    } catch { toast.error('Failed'); }
  };

  const statCards = stats ? [
    { icon: Users,       label:'Total Users',     value: stats.users,            color:'primary' },
    { icon: ShieldCheck, label:'Mentors',          value: stats.mentors,          color:'blue'    },
    { icon: Lightbulb,   label:'Ideas',            value: stats.ideas,            color:'yellow'  },
    { icon: BookOpen,    label:'Resources',        value: stats.resources,        color:'purple'  },
    { icon: AlertCircle, label:'Pending Resources',value: stats.pendingResources||0, color:'red'  },
    { icon: Clock,       label:'Pending Mentors',  value: stats.pendingMentors||0,   color:'red'  },
  ] : [];

  const pendingCount = (pending.pendingResources?.length||0) + (pending.pendingMentors?.length||0);

  const TABS = [
    { id:'overview', label:'Overview',  icon: LayoutDashboard },
    { id:'users',    label:'Users',     icon: Users },
    { id:'pending',  label:`Pending (${pendingCount})`, icon: Clock },
  ];

  const ROLE_BADGE = {
    admin:  'bg-red-100  text-red-700',
    mentor: 'bg-blue-100 text-blue-700',
    user:   'bg-slate-100 text-slate-600',
  };

  if (loading) return <div className="py-20"><Spinner text="Loading admin panel..."/></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center">
          <ShieldCheck size={22} className="text-red-600"/>
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Manage users, content, and platform health</p>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
              s.color==='red' ? 'bg-red-50' : s.color==='blue' ? 'bg-blue-50' :
              s.color==='yellow' ? 'bg-amber-50' : s.color==='purple' ? 'bg-purple-50' : 'bg-emerald-50'
            }`}>
              <s.icon size={18} className={
                s.color==='red' ? 'text-red-500' : s.color==='blue' ? 'text-blue-500' :
                s.color==='yellow' ? 'text-amber-500' : s.color==='purple' ? 'text-purple-500' : 'text-emerald-500'
              }/>
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
              tab===t.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <t.icon size={14}/> {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab==='overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-600"/>Platform Health</h3>
            <div className="space-y-3">
              {[
                { label:'Active Users',      value:stats?.users||0,     ok:true },
                { label:'Verified Mentors',  value:stats?.mentors||0,   ok:true },
                { label:'Approved Ideas',    value:stats?.ideas||0,     ok:true },
                { label:'Pending Reviews',   value:(stats?.pendingResources||0)+(stats?.pendingMentors||0), ok:((stats?.pendingResources||0)+(stats?.pendingMentors||0))===0 },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.value}</span>
                    {item.ok ? <CheckCircle size={16} className="text-emerald-500"/> : <AlertCircle size={16} className="text-amber-500"/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="font-display font-semibold text-slate-900 mb-4">⚡ Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:'💡', label:'Add Idea',      action:()=>{} },
                { icon:'📚', label:'Add Resource',  action:()=>{} },
                { icon:'📤', label:'Export Users',  action:()=>{} },
                { icon:'📊', label:'View Reports',  action:()=>{} },
              ].map(a => (
                <button key={a.label} onClick={a.action}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 rounded-xl transition group">
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab==='users' && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['User','Role','Location','Joined','Status','Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge capitalize ${ROLE_BADGE[u.role]||ROLE_BADGE.user}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{u.location||'—'}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        {u.isActive ? 'Active':'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleUser(u._id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                          u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}>
                        {u.isActive ? <><ToggleLeft size={14}/> Deactivate</> : <><ToggleRight size={14}/> Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending */}
      {tab==='pending' && (
        <div className="space-y-8">
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <UserCheck size={18} className="text-blue-500"/> Mentor Verifications ({pending.pendingMentors?.length||0})
            </h3>
            {!pending.pendingMentors?.length ? (
              <div className="card text-center py-10 text-slate-400">
                <CheckCircle size={32} className="mx-auto mb-2 text-emerald-400"/> All caught up!
              </div>
            ) : pending.pendingMentors.map(m => (
              <div key={m._id} className="card flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{m.user?.name}</p>
                  <p className="text-sm text-slate-400">{m.user?.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => verifyMentor(m._id)} className="btn-primary text-sm py-2">
                    <CheckCircle size={15}/> Verify
                  </button>
                  <button className="btn-secondary text-sm py-2 text-red-500 hover:border-red-300">
                    <XCircle size={15}/> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-500"/> Resource Approvals ({pending.pendingResources?.length||0})
            </h3>
            {!pending.pendingResources?.length ? (
              <div className="card text-center py-10 text-slate-400">
                <CheckCircle size={32} className="mx-auto mb-2 text-emerald-400"/> All caught up!
              </div>
            ) : pending.pendingResources.map(r => (
              <div key={r._id} className="card flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{r.title}</p>
                  <p className="text-sm text-slate-400 capitalize">{r.type} · {r.category}</p>
                  <p className="text-xs text-slate-300">by {r.uploadedBy?.name}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => approveResource(r._id)} className="btn-primary text-sm py-2">
                    <CheckCircle size={15}/> Approve
                  </button>
                  <button className="btn-secondary text-sm py-2 text-red-500 hover:border-red-300">
                    <XCircle size={15}/> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
