import React, { useState, useEffect } from 'react';
import { mentorsAPI } from '../utils/api';
import { SAMPLE_MENTORS } from '../data/sample';
import { Spinner, EmptyState } from '../components/shared/UI';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search, Star, Users, Clock, BadgeCheck, Languages,
  MessageCircle, X, GraduationCap, Send
} from 'lucide-react';

const MentorCard = ({ mentor, onContact }) => {
  const u = mentor.user || {};
  const initials = u.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'M';
  return (
    <div className="card-interactive flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        {u.avatar ? (
          <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-full object-cover shrink-0"/>
        ) : (
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-display font-semibold text-slate-900">{u.name}</h3>
            {mentor.isVerified && (
              <BadgeCheck size={16} className="text-blue-500 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 leading-snug">{mentor.headline}</p>
          {u.location && <p className="text-xs text-slate-400 mt-1">📍 {u.location}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {mentor.expertise?.slice(0,4).map(e => (
          <span key={e} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{e}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400"/>{mentor.rating?.toFixed(1)} ({mentor.totalReviews})</span>
        <span className="flex items-center gap-1"><Users size={12}/>{mentor.totalMentees} mentees</span>
        <span className="flex items-center gap-1"><Clock size={12}/>{mentor.yearsOfExperience}yr exp</span>
      </div>

      {mentor.languages?.length > 0 && (
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {mentor.languages.map(l => (
            <span key={l} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Languages size={10}/> {l}
            </span>
          ))}
        </div>
      )}

      {u.bio && <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-grow leading-relaxed">{u.bio}</p>}

      <button onClick={() => onContact(mentor)}
        className="btn-primary text-sm w-full mt-auto">
        <MessageCircle size={15}/> Ask a Question
      </button>
    </div>
  );
};

const QuestionModal = ({ mentor, onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const u = mentor.user || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    await onSubmit(mentor._id, { question, category, isPublic });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
              {u.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900">Ask {u.name}</h3>
              <p className="text-xs text-slate-400">{mentor.headline}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={18}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Topic</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
              {['general','funding','marketing','legal','operations','scaling'].map(c => (
                <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()+c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Question *</label>
            <textarea className="input min-h-[110px] resize-none"
              placeholder="Be specific — what challenge are you facing? What have you tried so far?"
              value={question} onChange={e => setQuestion(e.target.value)} required maxLength={2000}/>
            <p className="text-xs text-slate-400 text-right mt-1">{question.length}/2000</p>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="rounded text-emerald-600 w-4 h-4"/>
            <span className="text-sm text-slate-600">Make this question public (helps others with the same doubt)</span>
          </label>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading || !question.trim()} className="btn-primary flex-1">
              {loading ? 'Sending...' : <><Send size={15}/> Send Question</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MentorDirectory = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await mentorsAPI.getAll();
      setMentors(res.data.data || []);
    } catch { setMentors(SAMPLE_MENTORS); }
    finally { setLoading(false); }
  };

  const handleContact = (mentor) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSelectedMentor(mentor);
  };

  const handleQuestion = async (mentorId, data) => {
    try {
      await mentorsAPI.askQuestion(mentorId, data);
      toast.success('Question sent! The mentor will respond soon.');
      setSelectedMentor(null);
    } catch { toast.error('Could not send question. Please try again.'); }
  };

  const filtered = mentors.filter(m =>
    !search ||
    m.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.expertise?.some(e => e.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Find a Mentor</h1>
        <p className="text-slate-500">Connect with verified entrepreneurs who can guide your journey</p>
      </div>

      {/* Become mentor CTA */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
          <GraduationCap size={24} className="text-emerald-400"/>
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-white mb-0.5">Are you an experienced entrepreneur?</h3>
          <p className="text-sm text-slate-400">Register as a mentor and help aspiring entrepreneurs build their futures.</p>
        </div>
        <button onClick={() => navigate('/become-mentor')} className="btn-outline text-sm border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white shrink-0">
          Become a Mentor
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input type="text" placeholder="Search by name or expertise..."
          className="input pl-11" value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {loading ? <Spinner text="Loading mentors..."/> :
       filtered.length === 0 ? <EmptyState icon={GraduationCap} title="No mentors found" description="Try a different search term"/> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {filtered.map(m => <MentorCard key={m._id} mentor={m} onContact={handleContact}/>)}
        </div>
      )}

      {selectedMentor && (
        <QuestionModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} onSubmit={handleQuestion}/>
      )}
    </div>
  );
};

export default MentorDirectory;
