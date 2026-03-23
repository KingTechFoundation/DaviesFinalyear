import { useState, useRef, useEffect } from 'react';
import { Sprout, Mail, Loader2, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface OTPVerificationProps {
  email: string;
  name: string;
  onVerified: () => void;
  onBack: () => void;
}

export function OTPVerification({ email, name, onVerified, onBack }: OTPVerificationProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (countdown > 0) { const timer = setTimeout(() => setCountdown(countdown - 1), 1000); return () => clearTimeout(timer); }
    else { setCanResend(true); }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp]; newOtp[index] = value.slice(-1); setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5 && newOtp.join('').length === 6) handleVerify(newOtp.join(''));
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => { if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus(); };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault(); const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (d.length === 6) { setOtp(d.split('')); inputRefs.current[5]?.focus(); handleVerify(d); }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 6) { toast.error(t.toast.enterComplete); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp: code }) });
      const data = await res.json();
      if (res.ok) { toast.success(data.message || t.toast.verifySuccess); setTimeout(() => onVerified(), 1500); }
      else { toast.error(data.message || t.toast.verifyFailed); setOtp(['', '', '', '', '', '']); inputRefs.current[0]?.focus(); }
    } catch { toast.error(t.toast.networkError); } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) { toast.success(data.message || t.toast.codeSent); setCountdown(60); setCanResend(false); setOtp(['', '', '', '', '', '']); inputRefs.current[0]?.focus(); }
      else { toast.error(data.message || t.toast.resendFailed); }
    } catch { toast.error(t.toast.networkError); } finally { setResending(false); }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)' }}>
      
      {/* Transparent overlays */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-300 rounded-full opacity-10 translate-y-1/2 -translate-x-1/3 blur-[80px] pointer-events-none" />

      <div className="absolute top-5 right-5 z-30"><LanguageSwitcher variant="dark" /></div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          {/* Green header */}
          <div className="p-8 pb-6 text-center" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[24px] font-extrabold text-white mb-2">{t.otp.title}</h1>
            <p className="text-emerald-100/80 text-[13px] mb-3">{t.otp.sentTo}</p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <Mail className="w-3.5 h-3.5 text-emerald-200" />
              <span className="text-white text-sm font-semibold">{maskedEmail}</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {name && <p className="text-gray-400 text-sm text-center mb-6">{t.otp.greeting} <strong className="text-gray-700">{name}</strong>{t.otp.enterCode}</p>}

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input key={index} ref={el => { inputRefs.current[index] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-xl font-extrabold rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    digit
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-800 focus:border-emerald-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
                  }`} />
              ))}
            </div>

            {/* Verify button */}
            <button onClick={() => handleVerify()} disabled={loading || otp.join('').length !== 6}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-[1px]"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {t.otp.verifying}</>) : (<><CheckCircle2 className="w-5 h-5" /> {t.otp.verifyBtn}</>)}
            </button>

            {/* Resend */}
            <div className="mt-5 text-center">
              {canResend ? (
                <button onClick={handleResend} disabled={resending} className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors">
                  {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} {t.otp.resendBtn}
                </button>
              ) : (
                <p className="text-gray-400 text-sm">{t.otp.resendIn} <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm">{countdown}</span></p>
              )}
            </div>
            <div className="mt-4 text-center">
              <button onClick={onBack} className="text-gray-400 hover:text-gray-500 text-sm transition-colors">{t.otp.backToReg}</button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 opacity-60">
          <Sprout className="w-4 h-4 text-white" /><span className="text-white text-xs font-medium">{t.otp.secure}</span>
        </div>
      </div>
    </div>
  );
}
