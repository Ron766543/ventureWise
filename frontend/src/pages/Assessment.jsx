import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { SKILLS_LIST, CATEGORIES } from '../data/sample';
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, ArrowRight, Target } from 'lucide-react';

const EXPERIENCE_OPTIONS = ['Student / No experience','Less than 1 year','1–3 years','3–5 years','5+ years'];
const CAPITAL_RANGES = [
  { label:'No investment (₹0)',      value:0 },
  { label:'Up to ₹5,000',           value:5000 },
  { label:'Up to ₹20,000',          value:20000 },
  { label:'Up to ₹50,000',          value:50000 },
  { label:'Up to ₹1,00,000',        value:100000 },
  { label:'More than ₹1,00,000',    value:500000 },
];
const STEPS = ['Your Skills','Interests','Background','Budget'];

const Assessment = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    skills: [], interests: [],
    experience: '', education: '', availableCapital: 0
  });

  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills: p.skills.some(s => s.name===skill)
        ? p.skills.filter(s => s.name!==skill)
        : [...p.skills, { name:skill, level:'beginner' }]
    }));
  };
  const setSkillLevel = (name, level) => {
    setForm(p => ({ ...p, skills: p.skills.map(s => s.name===name ? {...s,level} : s) }));
  };
  const toggleInterest = (cat) => {
    setForm(p => ({
      ...p,
      interests: p.interests.includes(cat) ? p.interests.filter(i=>i!==cat) : [...p.interests, cat]
    }));
  };

  const canProceed = () => {
    if (step===1) return form.skills.length > 0;
    if (step===2) return form.interests.length > 0;
    if (step===3) return form.experience !== '';
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await assessmentAPI.save({ skills:form.skills, interests:form.interests, experience:form.experience, education:form.education, availableCapital:form.availableCapital });
      updateUser({ assessmentCompleted: true });
      toast.success('Assessment saved! Showing your matches 🎯');
      navigate('/ideas?recommended=true');
    } catch { toast.error('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const LEVEL_COLORS = {
    beginner:     { active:'bg-slate-500 text-white', inactive:'bg-slate-100 text-slate-600' },
    intermediate: { active:'bg-amber-500 text-white',  inactive:'bg-amber-50  text-amber-700' },
    advanced:     { active:'bg-emerald-600 text-white',inactive:'bg-emerald-50 text-emerald-700' },
  };

  return (
    <div className="min-h-screen bg-slate-50 hero-gradient py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Target size={28} className="text-white"/>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Tell Us About Yourself</h1>
          <p className="text-slate-500">We'll find business ideas perfectly matched to you</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <React.Fragment key={n}>
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done   ? 'bg-emerald-600 text-white' :
                    active ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                             'bg-slate-200 text-slate-400'
                  }`}>
                    {done ? <CheckCircle2 size={18}/> : n}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium hidden sm:block ${active ? 'text-emerald-700' : 'text-slate-400'}`}>{label}</span>
                </div>
                {i < STEPS.length-1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}/>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="card shadow-md animate-slide-up">

          {/* Step 1: Skills */}
          {step===1 && (
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-1">What are your skills?</h2>
              <p className="text-sm text-slate-500 mb-5">Select all that apply — pick at least one</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {SKILLS_LIST.map(skill => {
                  const sel = form.skills.some(s => s.name===skill);
                  return (
                    <button key={skill} onClick={() => toggleSkill(skill)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        sel ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}>
                      {sel && <CheckCircle2 size={13}/>} {skill}
                    </button>
                  );
                })}
              </div>
              {form.skills.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Set your skill levels:</p>
                  <div className="space-y-3">
                    {form.skills.map(skill => (
                      <div key={skill.name} className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-800 min-w-0 flex-1 truncate">{skill.name}</span>
                        <div className="flex gap-1 shrink-0">
                          {['beginner','intermediate','advanced'].map(level => (
                            <button key={level} onClick={() => setSkillLevel(skill.name, level)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                                skill.level===level ? LEVEL_COLORS[level].active : LEVEL_COLORS[level].inactive
                              }`}>{level}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Interests */}
          {step===2 && (
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-1">What sectors interest you?</h2>
              <p className="text-sm text-slate-500 mb-5">Pick all sectors you'd like to explore</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map(cat => {
                  const sel = form.interests.includes(cat.value);
                  return (
                    <button key={cat.value} onClick={() => toggleInterest(cat.value)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all relative ${
                        sel ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}>
                      {sel && <CheckCircle2 size={14} className="absolute top-2.5 right-2.5 text-emerald-600"/>}
                      <div className="text-2xl mb-1.5">{cat.icon}</div>
                      <div className="text-xs font-semibold text-slate-800 leading-snug">{cat.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Background */}
          {step===3 && (
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-1">Your Background</h2>
              <p className="text-sm text-slate-500 mb-5">Helps us recommend the right difficulty level</p>
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-700 mb-2.5">Business / Work Experience</p>
                <div className="space-y-2">
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <label key={opt}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        form.experience===opt ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                      <input type="radio" name="exp" value={opt}
                        checked={form.experience===opt}
                        onChange={e => setForm(p => ({...p, experience:e.target.value}))}
                        className="text-emerald-600 w-4 h-4"/>
                      <span className="text-sm text-slate-800 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Education Level (optional)</label>
                <select className="input" value={form.education}
                  onChange={e => setForm(p => ({...p, education:e.target.value}))}>
                  <option value="">Select...</option>
                  {['Below 10th','10th Pass','12th Pass','Diploma','Graduate','Post-Graduate','Other'].map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Capital */}
          {step===4 && (
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-1">Your Investment Budget</h2>
              <p className="text-sm text-slate-500 mb-5">We'll only suggest ideas within your budget. You can change this anytime.</p>
              <div className="space-y-2.5">
                {CAPITAL_RANGES.map(range => (
                  <label key={range.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.availableCapital===range.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <input type="radio" name="capital" value={range.value}
                      checked={form.availableCapital===range.value}
                      onChange={() => setForm(p => ({...p, availableCapital:range.value}))}
                      className="text-emerald-600 w-4 h-4"/>
                    <span className="text-sm font-medium text-slate-800">{range.label}</span>
                    {form.availableCapital===range.value && <CheckCircle2 size={16} className="ml-auto text-emerald-600"/>}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button onClick={() => setStep(s=>s-1)} className="btn-secondary">
                <ChevronLeft size={16}/> Back
              </button>
            ) : <div/>}
            {step < 4 ? (
              <button onClick={() => setStep(s=>s+1)} disabled={!canProceed()}
                className={`btn-primary ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}`}>
                Next <ChevronRight size={16}/>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving} className="btn-primary px-8">
                {saving ? <><Loader2 size={16} className="animate-spin"/> Saving...</> : <><Target size={16}/> Find My Ideas</>}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          <button onClick={() => navigate('/ideas')}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1 mx-auto">
            Skip for now and browse all ideas <ArrowRight size={12}/>
          </button>
        </p>
      </div>
    </div>
  );
};

export default Assessment;
