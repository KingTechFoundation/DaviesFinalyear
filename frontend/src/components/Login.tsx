import { useState } from 'react';
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LoginProps {
  onNavigateToRegister: () => void;
  onForgotPassword: () => void;
  onLoginSuccess: () => void;
  onNeedsVerification: (email: string) => void;
}

export function Login({ onNavigateToRegister, onForgotPassword, onLoginSuccess, onNeedsVerification }: LoginProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error(t.toast.fillAllFields); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('agriguide_token', data.token);
        localStorage.setItem('agriguide_user', JSON.stringify(data));
        toast.success(`${t.toast.welcomeBack} ${data.name}!`);
        setTimeout(() => onLoginSuccess(), 800);
      } else if (res.status === 403 && data.needsVerification) {
        toast.error(t.toast.verifyEmail); onNeedsVerification(data.email);
      } else { toast.error(data.message || t.toast.loginFailed); }
    } catch { toast.error(t.toast.networkError); } finally { setLoading(false); }
  };

  const inputBox = (name: string) =>
    `flex items-center rounded-xl border-2 transition-all duration-200 ${
      focused === name
        ? 'border-emerald-500 bg-white shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
    }`;

  const iconColor = (name: string) =>
    `w-[18px] h-[18px] flex-shrink-0 transition-colors ${focused === name ? 'text-emerald-500' : 'text-gray-400'}`;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden">
        {/* Background image */}
        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Transparent dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-green-800/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <span className="text-xl font-bold">AgriGuide AI</span>
          </div>

          {/* Hero */}
          <div className="max-w-lg space-y-6">
            <h2 className="text-[40px] font-extrabold leading-[1.1]">
              {t.login.heroTitle}
              <span className="block text-emerald-300">{t.login.heroTitle2}</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">{t.login.heroDesc}</p>

            {/* Feature cards */}
            <div className="space-y-3">
              {[
                { emoji: '🤖', title: t.login.aiAdvisor, desc: t.login.aiAdvisorDesc },
                { emoji: '📊', title: t.login.liveAnalytics, desc: t.login.liveAnalyticsDesc },
                { emoji: '🛡️', title: t.login.pestDetection, desc: t.login.pestDetectionDesc },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all">
                  <span className="text-xl w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 flex-shrink-0">{item.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-white/50 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {[{ v: '50K+', l: t.login.activeFarmers }, { v: '98%', l: t.login.satisfaction }, { v: '35%', l: t.login.yieldBoost }].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-emerald-300">{s.v}</div>
                <div className="text-white/40 text-xs uppercase tracking-wider mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center bg-white relative p-6 sm:p-10">
        {/* Soft gradient blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full opacity-50 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-50 rounded-full opacity-40 translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

        {/* Language switcher */}
        <div className="absolute top-5 right-5 z-20"><LanguageSwitcher variant="light" /></div>

        <div className="w-full max-w-[400px] relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AgriGuide AI</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-extrabold text-gray-900 mb-1">{t.login.title}</h1>
            <p className="text-gray-400 text-[14px]">{t.login.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">{t.login.email}</label>
              <div className={inputBox('email')}>
                <div className="pl-4 pr-2.5 py-3.5"><Mail className={iconColor('email')} /></div>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="you@example.com"
                  className="flex-1 py-3.5 pr-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-[15px]" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[13px] font-semibold text-gray-600">{t.login.password}</label>
                <button type="button" onClick={onForgotPassword}
                  className="text-[12px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  {t.login.forgotPassword || 'Forgot password?'}
                </button>
              </div>
              <div className={inputBox('password')}>
                <div className="pl-4 pr-2.5 py-3.5"><Lock className={iconColor('password')} /></div>
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  className="flex-1 py-3.5 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-[15px]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-4 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-[1px] active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {t.login.signingIn}</>) : (<>{t.login.signInBtn} <ArrowRight className="w-5 h-5" /></>)}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">{t.login.or}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-gray-500 text-[14px]">
            {t.login.noAccount}{' '}
            <button onClick={onNavigateToRegister}
              className="text-emerald-600 font-bold hover:text-emerald-700 underline decoration-emerald-600/30 underline-offset-2 hover:decoration-emerald-600 transition-colors">
              {t.login.createLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
