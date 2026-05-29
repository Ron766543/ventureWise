import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock, User, Phone, MapPin, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/shared/Logo';


function Field({ label, icon: Icon, type = 'text', ...rest }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';

  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon size={16} />
        </span>
        <input
          type={isPw ? (showPw ? 'text' : 'password') : type}
          className="input pl-10 pr-10"
          {...rest}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

// Login 
export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Invalid credentials';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md anim-up">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <LogoIcon size={95} />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to continue your journey</p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Email address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Field
              label="Password"
              icon={Lock}
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-1">
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <><span>Sign In</span><ArrowRight size={16} /></>
              }
            </button>

            {/* demo creds helper */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-emerald-700 mb-1.5">Demo accounts:</p>
              <p>Admin — admin@venturewise.in / Admin@123</p>
              <p>Mentor — priya.mentor@venturewise.in / Mentor@123</p>
              <p>User — sunita@example.com / User@123</p>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            No account?{' '}
            <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

//  Register 
export function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    role: 'user', phone: '', location: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const pick = (role) => setForm((prev) => ({ ...prev, role }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const user = await register({
        name: form.name, email: form.email, password: form.password,
        role: form.role, phone: form.phone, location: form.location,
      });
      toast.success(`Welcome, ${user.name.split(' ')[0]}! 🎉`);
      navigate('/assessment');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg anim-up">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <LogoIcon size={90} />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500">Join thousands of entrepreneurs — it&apos;s free</p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* role picker */}
            <div>
              <label className="label text-lg text-brand-700">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'user',   Icon: User,          title: 'Entrepreneur', sub: 'Explore ideas & get guidance' },
                  { val: 'mentor', Icon: GraduationCap, title: 'Mentor',       sub: 'Guide aspiring founders' },
                ].map(({ val, Icon, title, sub }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => pick(val)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      form.role === val
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`mb-1.5 ${form.role === val ? 'text-emerald-600' : 'text-slate-400'}`}
                    />
                    <p className="font-semibold text-sm text-slate-900">{title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <Field label="Full name *"        icon={User}  placeholder="Sunita Devi" value={form.name}     onChange={set('name')}     required />
            <Field label="Email address *"    icon={Mail}  type="email" placeholder="you@example.com" value={form.email}    onChange={set('email')}    required />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Password *"         icon={Lock}  type="password" placeholder="Min. 6 chars"    value={form.password} onChange={set('password')} required minLength={6} />
              <Field label="Confirm password *" icon={Lock}  type="password" placeholder="Repeat"          value={form.confirm}  onChange={set('confirm')}  required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone (optional)"    icon={Phone}  type="tel"   placeholder="+91 98765 43210" value={form.phone}    onChange={set('phone')} />
              <Field label="Location (optional)" icon={MapPin}              placeholder="City, State"     value={form.location} onChange={set('location')} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <><span>Create Free Account</span><ArrowRight size={16} /></>
              }
            </button>

            <p className="text-xs text-slate-400 text-center">
              By registering you agree to our Terms &amp; Privacy Policy.
            </p>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
