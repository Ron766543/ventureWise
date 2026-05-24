import React, { useState, useEffect } from 'react';
import { resourcesAPI } from '../utils/api';
import { SAMPLE_RESOURCES } from '../data/sample';
import { Spinner, ResourceCard, EmptyState } from '../components/shared/UI';
import { Search, Play, FileText, CheckSquare, FileCode, BookOpen, Wrench, BookMarked } from 'lucide-react';

const TYPES = [
  { val:'video',    label:'Videos',    icon: Play },
  { val:'article',  label:'Articles',  icon: FileText },
  { val:'checklist',label:'Checklists',icon: CheckSquare },
  { val:'template', label:'Templates', icon: FileCode },
  { val:'guide',    label:'Guides',    icon: BookOpen },
  { val:'tool',     label:'Tools',     icon: Wrench },
];
const HIGHLIGHTS = [
  { icon:'⚖️', title:'Legal Basics',   desc:'Registration, licenses, GST', category:'legal' },
  { icon:'📣', title:'Marketing 101',  desc:'Free channels, social media',  category:'marketing' },
  { icon:'💰', title:'Finance Basics', desc:'Bookkeeping, pricing',         category:'finance' },
  { icon:'📋', title:'Business Plan',  desc:'Templates & guides',           category:'planning' },
];

const Training = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type:'', category:'', search:'' });
  const set = (k,v) => setFilters(f => ({...f,[k]:v}));

  useEffect(() => { load(); }, [filters]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      const res = await resourcesAPI.getAll(params);
      setResources(res.data.data || []);
    } catch {
      let f = SAMPLE_RESOURCES;
      if (filters.type) f = f.filter(r => r.type === filters.type);
      if (filters.category) f = f.filter(r => r.category === filters.category);
      if (filters.search) f = f.filter(r => r.title.toLowerCase().includes(filters.search.toLowerCase()));
      setResources(f);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Learning Hub</h1>
        <p className="text-slate-500">Free videos, articles, checklists, and templates to help you succeed</p>
      </div>

      {/* Topic highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {HIGHLIGHTS.map(h => (
          <button key={h.category}
            onClick={() => set('category', filters.category === h.category ? '' : h.category)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              filters.category === h.category ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300'
            }`}>
            <div className="text-2xl mb-2">{h.icon}</div>
            <div className="font-semibold text-sm text-slate-900">{h.title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{h.desc}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input type="text" placeholder="Search resources..."
          className="input pl-11" value={filters.search} onChange={e => set('search', e.target.value)}/>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TYPES.map(({ val, label, icon: Icon }) => (
          <button key={val} onClick={() => set('type', filters.type === val ? '' : val)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition ${
              filters.type === val ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
            }`}>
            <Icon size={14} strokeWidth={2}/> {label}
          </button>
        ))}
      </div>

      {loading ? <Spinner text="Loading resources..."/> :
       resources.length === 0 ? (
        <EmptyState icon={BookMarked} title="No resources found" description="Try adjusting your filters"
          action={<button onClick={() => setFilters({type:'',category:'',search:''})} className="btn-primary">Clear Filters</button>}/>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger">
          {resources.map(r => <ResourceCard key={r._id} resource={r}/>)}
        </div>
       )}
    </div>
  );
};

export default Training;
