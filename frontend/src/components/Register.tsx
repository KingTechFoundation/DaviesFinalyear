import { useState } from 'react';
import { Sprout, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2, Landmark, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface RegisterProps {
  onNavigateToLogin: () => void;
  onNavigateToOTP: (email: string, name: string) => void;
}

export function Register({ onNavigateToLogin, onNavigateToOTP }: RegisterProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [role, setRole] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error(t.toast.fillRequired); return; }
    if (form.password.length < 6) { toast.error(t.toast.passwordMin); return; }
    if (form.password !== form.confirmPassword) { toast.error(t.toast.passwordMismatch); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, role }),
      });
      const data = await res.json();
      if (res.ok) { toast.success(data.message || t.toast.regSuccess); onNavigateToOTP(form.email, form.name); }
      else { toast.error(data.message || t.toast.regFailed); }
    } catch { toast.error(t.toast.networkError); } finally { setLoading(false); }
  };

  const getStrength = () => {
    const p = form.password; if (!p) return null;
    let s = 0;
    if (p.length >= 6) s++; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    const levels = [
      { w: '20%', c: '#ef4444', l: 'Weak' }, { w: '40%', c: '#f97316', l: 'Fair' },
      { w: '60%', c: '#eab308', l: 'Good' }, { w: '80%', c: '#84cc16', l: 'Strong' },
      { w: '100%', c: '#22c55e', l: 'Excellent' },
    ];
    return levels[Math.min(s, 4)];
  };
  const strength = getStrength();

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
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-green-800/50 to-transparent" />

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
            <h2 className="text-[38px] font-extrabold leading-[1.1]">
              {t.register.heroTitle}
              <span className="block text-emerald-300">{t.register.heroTitle2}</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">{t.register.heroDesc}</p>

            {/* Testimonial */}
            <div className="p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <p className="text-white/80 text-sm leading-relaxed italic mb-3">{t.register.testimonial}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">JC</div>
                <div>
                  <div className="text-sm font-semibold">{t.register.testimonialName}</div>
                  <div className="text-white/40 text-xs">{t.register.testimonialLocation}</div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 text-white/50 text-xs">
              {[t.register.freeToStart, t.register.noCreditCard, t.register.cancelAnytime].map((text, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {[{ v: '50K+', l: t.register.activeFarmers }, { v: '30', l: t.register.districts }, { v: '35%', l: t.register.yieldBoost }].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-emerald-300">{s.v}</div>
                <div className="text-white/40 text-xs uppercase tracking-wider mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center bg-white relative p-6 sm:p-8 overflow-y-auto">
        {/* Soft gradient blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full opacity-50 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-50 rounded-full opacity-40 translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

        <div className="absolute top-5 right-5 z-20"><LanguageSwitcher variant="light" /></div>

        <div className="w-full max-w-[400px] relative z-10 my-4">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AgriGuide AI</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[26px] font-extrabold text-gray-900 mb-1">{t.register.title}</h1>
            <p className="text-gray-400 text-[13px]">{t.register.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-gray-600 mb-2.5">{t.register.selectRole} *</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'farmer', label: t.register.farmerRole, icon: Sprout, desc: t.register.farmerDesc },
                  { id: 'agronomist', label: t.register.agronomistRole, icon: GraduationCap, desc: t.register.agronomistDesc },
                  { id: 'policymaker', label: t.register.policymakerRole, icon: Landmark, desc: t.register.policymakerDesc }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 group ${
                      role === r.id 
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                      role === r.id ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                    }`}>
                      <r.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold text-center leading-tight ${
                      role === r.id ? 'text-emerald-700' : 'text-gray-500'
                    }`}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">{t.register.fullName} *</label>
              <div className={inputBox('name')}>
                <div className="pl-3.5 pr-2 py-3"><User className={iconColor('name')} /></div>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="Muhabwe Davies"
                  className="flex-1 py-3 pr-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-[14px]" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">{t.register.email} *</label>
              <div className={inputBox('email')}>
                <div className="pl-3.5 pr-2 py-3"><Mail className={iconColor('email')} /></div>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="davies@example.com"
                  className="flex-1 py-3 pr-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-[14px]" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">{t.register.phone}</label>
              <div className={inputBox('phone')}>
                <div className="pl-3.5 pr-2 py-3"><Phone className={iconColor('phone')} /></div>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                  placeholder="+250 788 123 456"
                  className="flex-1 py-3 pr-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-[14px]" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">{t.register.password} *</label>
              <div className={inputBox('password')}>
                <div className="pl-3.5 pr-2 py-3"><Lock className={iconColor('password')} /></div>
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  placeholder={t.register.minChars}
                  className="flex-1 py-3 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-[14px]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {strength && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: strength.w, backgroundColor: strength.c }} />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: strength.c }}>{strength.l}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">{t.register.confirmPassword} *</label>
              <div className={inputBox('confirm')}>
                <div className="pl-3.5 pr-2 py-3"><Lock className={iconColor('confirm')} /></div>
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                  placeholder={t.register.reenter}
                  className="flex-1 py-3 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-[14px]" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-[11px] font-semibold mt-1">{t.register.passwordMismatch}</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[14px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-[1px] active:translate-y-0 mt-1"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {t.register.creating}</>) : (<>{t.register.createBtn} <ArrowRight className="w-5 h-5" /></>)}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">{t.register.or}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-gray-500 text-[14px]">
            {t.register.hasAccount}{' '}
            <button onClick={onNavigateToLogin}
              className="text-emerald-600 font-bold hover:text-emerald-700 underline decoration-emerald-600/30 underline-offset-2 hover:decoration-emerald-600 transition-colors">
              {t.register.signInLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
