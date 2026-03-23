import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineEnvelope, 
  HiArrowSmallRight, 
  HiArrowSmallLeft, 
  HiCheckCircle,
  HiOutlineShieldCheck
} from 'react-icons/hi2';
import { RiLeafLine, RiLoader4Line } from 'react-icons/ri';
import { toast } from 'sonner';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onCodeSent: (email: string) => void;
}

export function ForgotPassword({ onBackToLogin, onCodeSent }: ForgotPasswordProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t.toast.fillAllFields);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        toast.success(data.message);
        setTimeout(() => onCodeSent(email), 2500);
      } else {
        toast.error(data.message || 'Failed to send reset code');
      }
    } catch (error) {
      toast.error(t.toast.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] selection:bg-emerald-500/30">
      {/* Left Panel — Hero Illustration (Matching User's Format) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#1E293B]">
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?w=1200&q=80" 
            alt="Agriculture Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-[#0F172A]/80 to-[#0F172A]" />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-500/5 rounded-full blur-[120px]" />

        {/* Content */}
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
                Protect your <br />
                <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                  Digital Harvest
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Security is the backbone of modern agriculture. Reset your credentials securely and maintain full control over your farming data.
              </p>
            </motion.div>

            {/* Feature Tags */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { label: 'Secure Reset', icon: HiOutlineShieldCheck },
                { label: '256-bit AES', icon: HiCheckCircle }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
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

      {/* Right Panel — The Form (Matching User's format/aesthetic) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Navigation */}
        <div className="absolute top-8 right-8 flex items-center gap-6">
          <LanguageSwitcher variant="dark" />
          <button 
            onClick={onBackToLogin}
            className="text-slate-400 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group"
          >
            Back to login <HiArrowSmallRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
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
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    Reset Password
                  </h1>
                  <p className="text-slate-400 leading-relaxed">
                    Don't worry, it happens to the best of us. Enter your email and we'll send you a verification code.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Email Address
                    </label>
                    <div className={`relative group transition-all duration-300 ${focused === 'email' ? 'scale-[1.01]' : ''}`}>
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 blur-sm ${focused === 'email' ? 'bg-emerald-500/20 opacity-100' : 'bg-transparent opacity-0'}`} />
                      <div className={`relative flex items-center bg-[#1E293B] border-2 rounded-2xl transition-all duration-300 overflow-hidden ${focused === 'email' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
                        <div className="pl-5 pr-3 py-4">
                          <HiOutlineEnvelope className={`w-5 h-5 transition-colors duration-300 ${focused === 'email' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        </div>
                        <input 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused('')}
                          placeholder="farmer@agri-guide.com"
                          className="flex-1 py-4 pr-5 bg-transparent text-white placeholder:text-slate-600 focus:outline-none text-[15px] font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="group relative w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <RiLoader4Line className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Send Reset Code
                          <HiArrowSmallRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>

                  <div className="text-center pt-4">
                    <button 
                      type="button" 
                      onClick={onBackToLogin}
                      className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-all flex items-center justify-center gap-2 mx-auto group"
                    >
                      <HiArrowSmallLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 p-10 rounded-[32px] shadow-2xl shadow-black/20"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-inner">
                  <HiCheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Email Sent!</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
                  A verification code has been dispatched to <span className="text-white font-bold">{email}</span>. Please check your inbox.
                </p>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <RiLoader4Line className="w-5 h-5 text-emerald-400 animate-spin" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Redirecting to Reset...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
