import React, { useState, useEffect, useCallback } from 'react'; // 1. Added useCallback
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ideasAPI } from '../utils/api';
import { SAMPLE_IDEAS, CATEGORIES } from '../data/sample';
import { IdeaCard, Spinner, EmptyState } from '../components/shared/UI';
import { toast } from 'react-toastify';
import { Search, SlidersHorizontal, X, Lightbulb } from 'lucide-react';

const Ideas = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', difficulty: '', suitableFor: '', search: '' });
  const [savedIds, setSavedIds] = useState(user?.savedIds || []);
  const [showFilters, setShowFilters] = useState(false);

  // 2. Wrapped loadIdeas in useCallback with [filters] dependency
  const loadIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.suitableFor) params.suitableFor = filters.suitableFor;
      if (filters.search) params.search = filters.search;
      const res = await ideasAPI.getAll(params);
      setIdeas(res.data.data);
    } catch {
      let f = SAMPLE_IDEAS;
      if (filters.category) f = f.filter(i => i.category === filters.category);
      if (filters.difficulty) f = f.filter(i => i.difficulty === filters.difficulty);
      if (filters.suitableFor) f = f.filter(i => i.suitableFor?.includes(filters.suitableFor));
      if (filters.search) f = f.filter(i =>
        i.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        i.description.toLowerCase().includes(filters.search.toLowerCase())
      );
      setIdeas(f);
    } finally { setLoading(false); }
  }, [filters]);

  // 3. Moved useEffect below loadIdeas and kept [loadIdeas] dependency
  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const handleSave = async (ideaId) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      const res = await ideasAPI.saveToggle(ideaId);
      setSavedIds(res.data.savedIdeas || []);
      toast.success(res.data.action === 'saved' ? 'Idea saved!' : 'Removed from saved');
    } catch { toast.error('Could not save idea'); }
  };

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const hasFilters = filters.category || filters.difficulty || filters.suitableFor || filters.search;
  const clearAll = () => setFilters({ category:'', difficulty:'', suitableFor:'', search:'' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">Explore Business Ideas</h1>
        <p className="text-slate-500">Browse {ideas.length} curated ideas with full roadmaps and resources</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search ideas, skills, categories..."
            className="input pl-11" value={filters.search}
            onChange={e => set('search', e.target.value)} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary gap-2 shrink-0 ${showFilters ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : ''}`}>
          <SlidersHorizontal size={16} /> Filters
          {hasFilters && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 shadow-sm animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Category</label>
              <select className="input text-sm" value={filters.category} onChange={e => set('category', e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Difficulty</label>
              <select className="input text-sm" value={filters.difficulty} onChange={e => set('difficulty', e.target.value)}>
                <option value="">Any Difficulty</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Suitable For</label>
              <div className="flex gap-2 flex-wrap">
                {[['women','👩'],['youth','🧑🎓'],['rural','🌾']].map(([val, emoji]) => (
                  <button key={val} onClick={() => set('suitableFor', filters.suitableFor === val ? '' : val)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition capitalize ${
                      filters.suitableFor === val ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}>
                    {emoji} {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium">
              <X size={14} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {loading ? (
        <Spinner text="Loading ideas..." />
      ) : ideas.length === 0 ? (
        <EmptyState icon={Lightbulb} title="No ideas found"
          description="Try adjusting your filters or search terms"
          action={<button onClick={clearAll} className="btn-primary">Clear Filters</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {ideas.map(idea => (
            <IdeaCard key={idea._id} idea={idea} onSave={handleSave}
              savedIds={savedIds} onClick={idea => navigate(`/ideas/${idea._id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Ideas;