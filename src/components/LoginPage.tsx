import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Lock,
  Mail,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials } = useApp();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = loginWithCredentials(usernameInput, passwordInput);
    if (!res.success) {
      setErrorMsg(res.message || 'خطأ في تسجيل الدخول، يرجى التأكد من بيانات الاعتماد');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B3B26] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* Background Architectural Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#072619] rounded-full blur-[80px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-5 border-b border-emerald-800/60 bg-[#072619]/80 backdrop-blur-md flex items-center justify-between z-10">
        <Logo size="md" />
        <div className="flex items-center gap-2 bg-[#0B3B26] px-3.5 py-1.5 rounded-full border border-amber-500/30">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs text-amber-100 font-bold">بوابة الدخول المشفر للشركات</span>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-6">
        <div className="max-w-md w-full bg-[#072619] rounded-2xl border border-amber-500/30 shadow-2xl p-6 sm:p-8 backdrop-blur-xl flex flex-col items-center space-y-6">
          
          {/* Logo & Company Title Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Logo size="lg" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-100">
                تسجيل الدخول للنظام
              </h2>
              <p className="text-xs text-emerald-200/80 mt-1">
                يرجى إدخال اسم المستخدم وكلمة السر المعتمدة
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="w-full bg-red-950/90 border border-red-600/80 p-3 rounded-lg text-xs text-red-200 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Secure Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="w-full space-y-4 text-xs">
            <div>
              <label className="block text-emerald-100 font-bold mb-1.5">اسم المستخدم:</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  required
                  placeholder="اسم المستخدم..."
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 bg-[#0B3B26] border border-emerald-800/80 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37] placeholder-emerald-300/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-100 font-bold mb-1.5">كلمة السر:</label>
              <div className="relative">
                <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="كلمة السر..."
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full pr-9 pl-10 py-2.5 bg-[#0B3B26] border border-emerald-800/80 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37] placeholder-emerald-300/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-amber-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D4AF37] text-gray-950 font-bold text-xs rounded-lg hover:bg-[#e0bc46] shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
          </form>

        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="p-4 border-t border-emerald-900/80 bg-[#072619]/60 text-center text-xs text-emerald-300/70 z-10">
        جميع الحقوق محفوظة © {new Date().getFullYear()} - جوهر جروب للتطوير العقاري (Gohar Group)
      </footer>
    </div>
  );
};
