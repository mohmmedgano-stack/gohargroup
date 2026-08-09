import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { User } from '../types';
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, setCurrentUser } = useApp();

  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [password, setPassword] = useState('123456');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(selectedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 dir-rtl">
      <div className="bg-[#072619] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden space-y-5">
        
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-emerald-300/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 pt-2">
          <Logo size="lg" variant="full-color" />
          <p className="text-xs text-amber-200/90 font-medium">
            نظام إدارة الشيتات والعملاء والصلاحيات المتقدم
          </p>
        </div>

        {/* User Account Quick Switcher Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-amber-300">اختر الحساب للدخول السريع:</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedUser(u)}
                className={`w-full p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                  selectedUser.id === u.id
                    ? 'bg-[#D4AF37] text-gray-950 font-bold border-amber-300 shadow-md'
                    : 'bg-[#0B3B26]/80 text-emerald-100 border-emerald-800/80 hover:bg-emerald-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={u.avatar} className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-400" />
                  <div>
                    <div className="text-xs font-bold">{u.name}</div>
                    <div className="text-[10px] opacity-80 font-mono">{u.email}</div>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-black/20">
                  {u.role === 'ADMIN' ? '👑 المدير العام' : '💼 مبيعات'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3 text-xs pt-2 border-t border-emerald-800/60">
          <div>
            <label className="block text-amber-200 font-bold mb-1">البريد الإلكتروني الحساب:</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="email"
                readOnly
                value={selectedUser.email}
                className="w-full pr-9 pl-3 py-2.5 bg-[#0B3B26] border border-amber-500/30 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-200 font-bold mb-1">كلمة المرور:</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pr-9 pl-3 py-2.5 bg-[#0B3B26] border border-amber-500/30 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#D4AF37] text-gray-950 font-extrabold text-xs rounded-xl hover:bg-amber-400 transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>تسجيل الدخول إلى الشيت بصفة ({selectedUser.role === 'ADMIN' ? 'المدير' : 'الموظف'})</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </form>

      </div>
    </div>
  );
};
