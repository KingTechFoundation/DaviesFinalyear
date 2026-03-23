import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeSlash, 
  HiOutlineShieldCheck,
  HiArrowSmallLeft,
  HiCheckCircle,
  HiOutlineHashtag
} from 'react-icons/hi2';
import { RiLeafLine, RiLoader4Line } from 'react-icons/ri';
import { toast } from 'sonner';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface ResetPasswordProps {
  email: string;
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

export function ResetPassword({ email, onBackToLogin, onResetSuccess }: ResetPasswordProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ otp: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.otp || !form.password || !form.confirmPassword) {
      toast.error(t.toast.fillAllFields);
      return;
    }

    if (form.otp.length !== 6) {
      toast.error(t.toast.enterComplete);
      return;
    }

    if (form.password.length < 6) {
      toast.error(t.toast.passwordMin);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error(t.toast.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: form.otp,
          password: form.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success(t.forgotPassword.successTitle || 'Password Reset!');
        setTimeout(() => onResetSuccess(), 3000);
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(t.toast.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] selection:bg-emerald-500/30">
      {/* Left Panel — Hero Illustration */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#1E293B]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&q=80" 
            alt="Security Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-[#0F172A]/80 to-[#0F172A]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <RiLeafLine className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              AgriGuide<span className="text-emerald-500">AI</span>
            </span>
          </motion.div>

          <div className="max-w-md space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
                Recovery <br />
                <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                  In Progress
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Verification complete. Now choose a strong password to ensure your farming operations remain protected and accessible only by you.
              </p>
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-500 text-sm font-medium"
          >
            &copy; 2026 AgriGuide AI. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Right Panel — The Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="absolute top-8 right-8">
          <LanguageSwitcher variant="dark" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[440px] z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <RiLeafLine className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AgriGuide AI</span>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    {t.forgotPassword.resetTitle}
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Enter the code sent to <span className="text-emerald-400 font-bold">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* OTP Input */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                      {t.forgotPassword.otp}
                    </label>
                    <div className={`relative group transition-all duration-300 ${focused === 'otp' ? 'scale-[1.01]' : ''}`}>
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 blur-sm ${focused === 'otp' ? 'bg-emerald-500/20 opacity-100' : 'bg-transparent opacity-0'}`} />
                      <div className={`relative flex items-center bg-[#1E293B] border-2 rounded-2xl transition-all duration-300 overflow-hidden ${focused === 'otp' ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                        <div className="pl-5 pr-3 py-4">
                          <HiOutlineHashtag className={`w-5 h-5 transition-colors duration-300 ${focused === 'otp' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        </div>
                        <input 
                          type="text" 
                          name="otp" 
                          maxLength={6} 
                          value={form.otp} 
                          onChange={handleChange}
                          onFocus={() => setFocused('otp')}
                          onBlur={() => setFocused('')}
                          placeholder="000000"
                          className="flex-1 py-4 pr-5 bg-transparent text-white placeholder:text-slate-600 focus:outline-none text-[18px] font-mono tracking-[0.5em]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                      {t.forgotPassword.newPassword}
                    </label>
                    <div className={`relative group transition-all duration-300 ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 blur-sm ${focused === 'password' ? 'bg-emerald-500/20 opacity-100' : 'bg-transparent opacity-0'}`} />
                      <div className={`relative flex items-center bg-[#1E293B] border-2 rounded-2xl transition-all duration-300 overflow-hidden ${focused === 'password' ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                        <div className="pl-5 pr-3 py-4">
                          <HiOutlineLockClosed className={`w-5 h-5 transition-colors duration-300 ${focused === 'password' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        </div>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          name="password" 
                          value={form.password} 
                          onChange={handleChange}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused('')}
                          placeholder="••••••••"
                          className="flex-1 py-4 bg-transparent text-white placeholder:text-slate-600 focus:outline-none text-[15px] font-medium"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="px-5 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                      {t.forgotPassword.confirmPassword}
                    </label>
                    <div className={`relative group transition-all duration-300 ${focused === 'confirmPassword' ? 'scale-[1.01]' : ''}`}>
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 blur-sm ${focused === 'confirmPassword' ? 'bg-emerald-500/20 opacity-100' : 'bg-transparent opacity-0'}`} />
                      <div className={`relative flex items-center bg-[#1E293B] border-2 rounded-2xl transition-all duration-300 overflow-hidden ${focused === 'confirmPassword' ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                        <div className="pl-5 pr-3 py-4">
                          <HiOutlineShieldCheck className={`w-5 h-5 transition-colors duration-300 ${focused === 'confirmPassword' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        </div>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          name="confirmPassword" 
                          value={form.confirmPassword} 
                          onChange={handleChange}
                          onFocus={() => setFocused('confirmPassword')}
                          onBlur={() => setFocused('')}
                          placeholder="••••••••"
                          className="flex-1 py-4 pr-5 bg-transparent text-white placeholder:text-slate-600 focus:outline-none text-[15px] font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="group relative w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-900/20 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <RiLoader4Line className="w-5 h-5 animate-spin" />
                      ) : (
                        t.forgotPassword.resetBtn
                      )}
                    </span>
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      type="button" 
                      onClick={onBackToLogin}
                      className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-all flex items-center justify-center gap-2 mx-auto group"
                    >
                      <HiArrowSmallLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      {t.forgotPassword.backToLogin}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="reset-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 p-12 rounded-[40px] shadow-2xl shadow-black/40"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-inner rotate-6">
                  <HiCheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">{t.forgotPassword.successTitle}</h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs mx-auto">{t.forgotPassword.successDesc}</p>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Redirecting</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
