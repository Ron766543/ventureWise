import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ideasAPI, roadmapAPI, progressAPI } from '../utils/api';
import { SAMPLE_IDEAS } from '../data/sample';
import { Spinner } from '../components/shared/UI';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  ArrowLeft, Target, GraduationCap, BarChart2, Clock,
  IndianRupee, Eye, Bookmark, CheckCircle2, Wrench,
  Scale, Megaphone, Map, TrendingUp, Flame, Zap, Info,
  ChevronRight, Loader2, ExternalLink
} from 'lucide-react';

const TABS = [
  { id: 'overview',  label: 'Overview',  icon: Map },
  { id: 'roadmap',   label: 'Roadmap',   icon: Target },
  { id: 'costs',     label: 'Costs',     icon: IndianRupee },
  { id: 'legal',     label: 'Legal',     icon: Scale },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
];

const EFFECT_ICONS = { high: Flame, medium: Zap, low: Info };
const EFFECT_COLORS = { high: 'text-emerald-600', medium: 'text-amber-500', low: 'text-slate-400' };

const IdeaDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await ideasAPI.getById(id);
      setIdea(res.data.data);
      if (res.data.data.roadmap?._id) {
        const rRes = await roadmapAPI.getById(res.data.data.roadmap._id);
        setRoadmap(rRes.data.data);
      }
    } catch {
      const found = SAMPLE_IDEAS.find(i => i._id === id);
      setIdea(found || SAMPLE_IDEAS[1]);
    } finally { setLoading(false); }
  };

  const handleTrack = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setTracking(true);
    try {
      await progressAPI.create({ businessIdea: idea._id, roadmap: roadmap?._id, status: 'exploring' });
      toast.success('Added to your dashboard!');
      navigate('/dashboard');
    } catch (e) {
      if (e.response?.data?.message?.includes('already exists')) {
        toast.info('Already tracking — check your dashboard');
        navigate('/dashboard');
      } else { toast.error('Could not start tracking'); }
    } finally { setTracking(false); }
  };

  // Demo roadmap for when no real roadmap exists
  const rm = roadmap || {
    validation: { steps: [
      { order:1, title:'Survey potential customers', description:'Talk to 15–20 people in your target market about their problems and willingness to pay.', estimatedDays:3 },
      { order:2, title:'Run a paid pilot', description:'Offer your product or service to 5 people at a small price to test real demand.', estimatedDays:7 },
      { order:3, title:'Refine your offer', description:'Use feedback to improve your product, pricing, and positioning before scaling.', estimatedDays:3 },
    ]},
    skillsAndTools: {
      requiredSkills: [
        { name:'Core domain skill', importance:'must-have' },
        { name:'Basic bookkeeping', importance:'nice-to-have' },
        { name:'Customer communication', importance:'must-have' },
      ],
      recommendedTools: [
        { name:'WhatsApp Business', purpose:'Customer orders & communication', cost:'Free' },
        { name:'Google Sheets', purpose:'Track orders, expenses & revenue', cost:'Free' },
        { name:'Canva', purpose:'Marketing materials & social posts', cost:'Free' },
        { name:'Paytm/PhonePe', purpose:'Accept digital payments', cost:'Free' },
      ]
    },
    legalSteps: [
      { order:1, title:'Sole Proprietorship Registration', description:'Register your business at the local Udyam portal — the simplest legal structure for small businesses.', documents:['Aadhaar Card','PAN Card','Address Proof'], estimatedCost:'Free', timeframe:'1–3 days', authority:'udyamregistration.gov.in' },
      { order:2, title:'Bank Current Account', description:'Open a dedicated business bank account to keep personal and business finances separate.', documents:['Business registration certificate','Aadhaar','PAN'], estimatedCost:'Free', timeframe:'2–5 days', authority:'Any nationalized bank' },
      { order:3, title:'GST Registration (if applicable)', description:'Required only if annual turnover exceeds ₹20 lakh for services or ₹40 lakh for goods.', documents:['PAN','Aadhaar','Business proof'], estimatedCost:'Free', timeframe:'3–7 days', authority:'gst.gov.in' },
    ],
    costEstimation: {
      startup: [
        { item:'Equipment & Tools',       minCost: idea?.requiredCapital?.min || 5000, maxCost: Math.floor((idea?.requiredCapital?.max || 30000) * 0.5), currency:'INR' },
        { item:'Initial stock/materials', minCost:2000, maxCost:10000, currency:'INR' },
        { item:'Legal & registration',    minCost:0,    maxCost:2000,  currency:'INR' },
        { item:'Marketing (first month)', minCost:500,  maxCost:3000,  currency:'INR' },
      ],
      monthly: [
        { item:'Raw materials / inventory', minCost:5000, maxCost:20000, currency:'INR' },
        { item:'Utilities & packaging',     minCost:500,  maxCost:2000,  currency:'INR' },
        { item:'Marketing',                 minCost:200,  maxCost:2000,  currency:'INR' },
      ],
      totalStartupMin: idea?.requiredCapital?.min || 7500,
      totalStartupMax: idea?.requiredCapital?.max || 45000,
    },
    marketingBasics: {
      targetCustomers: 'Local residents and community members within a 5 km radius, aged 20–50.',
      channels: [
        { name:'WhatsApp & Local Groups', description:'Share your product in neighbourhood and community WhatsApp groups and ask for referrals.', cost:'Free', effectiveness:'high' },
        { name:'Word of Mouth',           description:'Deliver exceptional quality and ask every satisfied customer for 2 referrals.', cost:'Free', effectiveness:'high' },
        { name:'Facebook / Instagram',    description:'Post photos of your work regularly — consistency builds trust and following.', cost:'Free', effectiveness:'medium' },
        { name:'Local Flyers & Pamphlets',description:'Distribute at temples, markets, and offices near your area.', cost:'₹500–2,000', effectiveness:'medium' },
      ],
      pricingStrategy:'Start 10–15% below the market rate to attract your first customers, then raise prices as reviews build up.',
      usp:'Your personal touch, reliability, and local presence are your biggest competitive advantages.'
    },
    milestones: [
      { order:1, title:'Market Research Done',     description:'Spoke to 15+ potential customers', targetWeek:1 },
      { order:2, title:'First Pilot Customers',    description:'5 paying trial customers served',  targetWeek:2 },
      { order:3, title:'Legal Setup Complete',     description:'Udyam registration & bank account',targetWeek:3 },
      { order:4, title:'10 Paying Customers',      description:'Consistent recurring revenue',     targetWeek:6 },
      { order:5, title:'Break-even Reached',       description:'Revenue covers all monthly costs', targetWeek:10 },
      { order:6, title:'Scale & Grow',             description:'Expand capacity or delivery area', targetWeek:16 },
    ]
  };

  if (loading) return <div className="py-24"><Spinner text="Loading idea details..." /></div>;
  if (!idea) return <div className="text-center py-24 text-slate-500">Idea not found</div>;

  const DIFF_COLORS = { low:'bg-emerald-100 text-emerald-700', medium:'bg-amber-100 text-amber-700', high:'bg-red-100 text-red-700' };
  const DEMAND_COLORS = { low:'bg-slate-100 text-slate-600', medium:'bg-blue-100 text-blue-700', high:'bg-orange-100 text-orange-700', 'very-high':'bg-emerald-100 text-emerald-700' };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 mb-6 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Ideas
      </button>

      {/* Hero card */}
      <div className="card mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="text-6xl shrink-0">{idea.icon || '💡'}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge bg-emerald-100 text-emerald-700 capitalize">{idea.category?.replace(/-/g,' ')}</span>
              <span className={`badge ${DIFF_COLORS[idea.difficulty]}`}>{idea.difficulty} difficulty</span>
              <span className={`badge ${DEMAND_COLORS[idea.marketDemand]}`}>{idea.marketDemand} demand</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3 leading-tight">{idea.title}</h1>
            <p className="text-slate-600 leading-relaxed mb-4">{idea.description}</p>
            <div className="flex flex-wrap gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><IndianRupee size={14}/>₹{idea.requiredCapital?.min?.toLocaleString('en-IN')}–₹{idea.requiredCapital?.max?.toLocaleString('en-IN')}</span>
              <span className="flex items-center gap-1.5"><Clock size={14}/>Profit in {idea.timeToProfit}</span>
              <span className="flex items-center gap-1.5"><Eye size={14}/>{idea.viewCount||0} views</span>
              <span className="flex items-center gap-1.5"><Bookmark size={14}/>{idea.saveCount||0} saved</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button onClick={handleTrack} disabled={tracking}
              className="btn-primary whitespace-nowrap">
              {tracking ? <Loader2 size={16} className="animate-spin"/> : <TrendingUp size={16}/>}
              {tracking ? 'Adding...' : 'Track This Idea'}
            </button>
            <button onClick={() => navigate('/mentors')} className="btn-secondary text-sm whitespace-nowrap">
              <GraduationCap size={15}/> Find a Mentor
            </button>
          </div>
        </div>
        {idea.requiredSkills?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Skills Required</p>
            <div className="flex flex-wrap gap-2">
              {idea.requiredSkills.map(s => (
                <span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 flex-1 min-w-max px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab===id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <Icon size={14} strokeWidth={2}/> {label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab==='overview' && (
        <div className="space-y-5 animate-fade-in">
          {/* Timeline */}
          <div className="card">
            <h2 className="text-lg font-display font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Target size={18} className="text-emerald-600"/> Launch Timeline
            </h2>
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-100"/>
              {rm.milestones.map((m, i) => (
                <div key={i} className="relative mb-5 last:mb-0">
                  <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${i === 0 ? 'bg-emerald-500' : 'bg-slate-200'}`}/>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">{m.title}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">Week {m.targetWeek}</span>
                  </div>
                  {m.description && <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="card">
            <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-emerald-600"/> Recommended Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rm.skillsAndTools?.recommendedTools?.map((t, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                    <Wrench size={16} className="text-emerald-600"/>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.purpose}</p>
                    <span className="text-xs font-semibold text-emerald-600 mt-0.5 block">{t.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Roadmap ── */}
      {activeTab==='roadmap' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card">
            <h2 className="text-lg font-display font-bold text-slate-900 mb-5 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600"/> Validation Steps
            </h2>
            <div className="space-y-4">
              {rm.validation?.steps?.map((step, i) => (
                <div key={i} className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shrink-0">{step.order}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                    {step.estimatedDays && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium mt-2">
                        <Clock size={11}/> Est. {step.estimatedDays} days
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {rm.skillsAndTools?.requiredSkills?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-display font-bold text-slate-900 mb-4">Skills You Need</h2>
              <div className="space-y-2">
                {rm.skillsAndTools.requiredSkills.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-medium text-sm text-slate-800">{s.name}</span>
                    <span className={`badge ${s.importance==='must-have' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                      {s.importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Costs ── */}
      {activeTab==='costs' && (
        <div className="space-y-5 animate-fade-in">
          <div className="card">
            <h2 className="text-lg font-display font-bold text-slate-900 mb-5 flex items-center gap-2">
              <IndianRupee size={18} className="text-emerald-600"/> Startup Cost Estimate
            </h2>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 text-center mb-5 border border-emerald-100">
              <p className="text-sm text-slate-600 mb-1">Total Startup Investment</p>
              <p className="text-3xl font-display font-bold text-emerald-700">
                ₹{rm.costEstimation?.totalStartupMin?.toLocaleString('en-IN')} – ₹{rm.costEstimation?.totalStartupMax?.toLocaleString('en-IN')}
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100">
                  <th className="pb-3 font-semibold">Item</th>
                  <th className="pb-3 font-semibold text-right">Min</th>
                  <th className="pb-3 font-semibold text-right">Max</th>
                </tr>
              </thead>
              <tbody>
                {rm.costEstimation?.startup?.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-slate-700">{item.item}</td>
                    <td className="py-3 text-right text-slate-600 font-medium">₹{item.minCost?.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right text-slate-600 font-medium">₹{item.maxCost?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rm.costEstimation?.monthly?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-display font-bold text-slate-900 mb-4">Monthly Running Costs</h2>
              <div className="space-y-2">
                {rm.costEstimation.monthly.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50">
                    <span className="text-sm text-slate-700">{item.item}</span>
                    <span className="text-sm font-medium text-slate-600">
                      ₹{item.minCost?.toLocaleString('en-IN')}–₹{item.maxCost?.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Legal ── */}
      {activeTab==='legal' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5"/>
            <p className="text-sm text-amber-800">These are general guidelines. Always consult a local CA or lawyer for your specific situation.</p>
          </div>
          {rm.legalSteps?.map((step, i) => (
            <div key={i} className="card hover:shadow-sm transition">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">{step.order}</div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge bg-blue-50 text-blue-700 flex items-center gap-1"><IndianRupee size={11}/>{step.estimatedCost}</span>
                    <span className="badge bg-slate-100 text-slate-600 flex items-center gap-1"><Clock size={11}/>{step.timeframe}</span>
                    <span className="badge bg-purple-50 text-purple-700">{step.authority}</span>
                  </div>
                  {step.documents?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-500 mb-1.5">Documents needed:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.documents.map(d => (
                          <span key={d} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Marketing ── */}
      {activeTab==='marketing' && (
        <div className="space-y-5 animate-fade-in">
          <div className="card">
            <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Megaphone size={18} className="text-emerald-600"/> Marketing Channels
            </h2>
            <div className="space-y-3">
              {rm.marketingBasics?.channels?.map((ch, i) => {
                const EIcon = EFFECT_ICONS[ch.effectiveness] || Info;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
                    <div className={`shrink-0 mt-0.5 ${EFFECT_COLORS[ch.effectiveness]}`}>
                      <EIcon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-slate-900">{ch.name}</h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">{ch.cost}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{ch.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2"><IndianRupee size={16} className="text-emerald-600"/>Pricing Strategy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{rm.marketingBasics?.pricingStrategy}</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2"><Zap size={16} className="text-amber-500"/>Your Unique Advantage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{rm.marketingBasics?.usp}</p>
            </div>
          </div>

          {rm.marketingBasics?.targetCustomers && (
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2"><Target size={16} className="text-blue-500"/>Target Customers</h3>
              <p className="text-sm text-slate-600">{rm.marketingBasics.targetCustomers}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IdeaDetail;
