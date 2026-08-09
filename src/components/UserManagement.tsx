import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Trash2,
  Edit,
  ShieldAlert,
  CheckCircle2,
  Upload,
  Image,
} from 'lucide-react';

const PRESET_USER_AVATARS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
];

export const UserManagement: React.FC = () => {
  const { users, projects, addUser, updateUser, deleteUser, currentUser } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('SALES_REP');
  const [assignedProject, setAssignedProject] = useState('');
  const [avatar, setAvatar] = useState(PRESET_USER_AVATARS[0]);

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('SALES_REP');
    setAssignedProject(projects[0]?.name || 'جميع المشاريع');
    setAvatar(PRESET_USER_AVATARS[0]);
    setShowAddModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        email,
        phone,
        role,
        assignedProject,
        avatar: avatar || PRESET_USER_AVATARS[0],
      });
      setEditingUser(null);
    } else {
      addUser({
        name,
        email,
        phone,
        role,
        assignedProject: assignedProject || 'جميع المشاريع',
        activeStatus: 'active',
        avatar: avatar || PRESET_USER_AVATARS[0],
      });
      setShowAddModal(false);
    }
  };

  const handleStartEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone || '');
    setRole(u.role);
    setAssignedProject(u.assignedProject || '');
    setAvatar(u.avatar || PRESET_USER_AVATARS[0]);
  };

  const handleLocalAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = evt => {
        if (evt.target?.result) {
          setAvatar(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1A1D23] text-slate-100 p-5 rounded-lg border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <h1 className="text-base font-bold text-[#C5A059]">
              إدارة حسابات الموظفين والصلاحيات (User Access Control)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            إنشاء يوزر جديد (أدمن أو مبيعات)، إضافة وتعديل صورة الموظف، وتخصيص شيتات العملاء.
          </p>
        </div>

        {currentUser.role === 'ADMIN' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#C5A059] text-[#0F1115] hover:bg-[#d8b36c] font-bold text-xs rounded shadow transition flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ إنشاء يوزر جديد الآن</span>
          </button>
        )}
      </div>

      {/* Security Rules Banner */}
      <div className="bg-[#0F1115] border border-amber-500/30 p-4 rounded-lg text-xs text-amber-200/90 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-[#C5A059] text-sm">نظام الأمان والتحكم الصارم بالصلاحيات:</h3>
          <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300 leading-relaxed">
            <li>الموظف الفرعي (Sales Rep) يرى ويعدّل فقط العملاء المخصصين له داخل شيت حسابه الشخصي.</li>
            <li>خاصية استيراد الملفات وتصدير شيتات Excel حصرية بالمدير العام (الأدمن) للحفاظ على السرية.</li>
            <li>يمكن للمدير إدراج صورة خاصة لكل يوزر ليتم التمييز بسهولة داخل قائمة الموظفين والهيدر.</li>
          </ul>
        </div>
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => (
          <div
            key={u.id}
            className={`p-4 rounded-lg border bg-[#1A1D23] shadow-sm transition hover:border-slate-700 space-y-3 ${
              u.role === 'ADMIN' ? 'border-[#C5A059]/60' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar || PRESET_USER_AVATARS[0]}
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C5A059]/50 shadow-md shrink-0"
                />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{u.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono block">{u.email}</span>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                  u.role === 'ADMIN'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700/50'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                }`}
              >
                {u.role === 'ADMIN' ? '👑 أدمن رئيسي' : '💼 مبيعات'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="dir-ltr font-mono">{u.phone || '01000000000'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-medium text-slate-200">
                  المشروع المخصص: {u.assignedProject || 'جميع المشاريع'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                <span>تاريخ الإنشاء: {u.createdAt}</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  حساب مفعّل
                </span>
              </div>
            </div>

            {/* Admin Controls */}
            {currentUser.role === 'ADMIN' && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleStartEdit(u)}
                  className="px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition font-bold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5 text-[#C5A059]" />
                  تعديل اليوزر والصورة
                </button>
                {u.id !== currentUser.id && (
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت محقق من حذف يوزر الموظف (${u.name})؟`)) {
                        deleteUser(u.id);
                      }
                    }}
                    className="px-3 py-1.5 text-xs text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 rounded transition font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1D23] text-slate-100 rounded-lg max-w-md w-full p-5 border border-slate-800 shadow-2xl space-y-4 text-right max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-[#C5A059] text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#C5A059]" />
                <span>{editingUser ? `تعديل بيانات يوزر: ${editingUser.name}` : 'إنشاء يوزر موظف جديد'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              
              {/* User Avatar Selection */}
              <div className="p-3 bg-[#0F1115] rounded border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-bold mb-1">صورة الموظف (Avatar):</label>
                <div className="flex items-center gap-3">
                  <img
                    src={avatar || PRESET_USER_AVATARS[0]}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C5A059] shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <span className="block text-[11px] text-slate-400">اختر صورة رمزية أو ارفع صورة خاصة:</span>
                    <div className="flex items-center gap-1.5">
                      {PRESET_USER_AVATARS.map((pAvatar, idx) => (
                        <img
                          key={idx}
                          src={pAvatar}
                          onClick={() => setAvatar(pAvatar)}
                          className={`w-7 h-7 rounded-full object-cover cursor-pointer border-2 transition ${
                            avatar === pAvatar ? 'border-[#C5A059] scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <input
                    type="url"
                    placeholder="رابط صورة مخصص (URL)..."
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    className="w-full p-2 bg-[#1A1D23] border border-slate-800 rounded text-slate-100 font-mono text-[11px] focus:outline-none focus:border-[#C5A059]"
                  />
                  <label className="flex items-center justify-center gap-1.5 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition text-xs font-bold border border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>رفع صورة موظف من الجهاز</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLocalAvatarUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم الموظف الثلاثي:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد عبد الله الشريف"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني (اسم المستخدم للدخول):</label>
                <input
                  type="email"
                  required
                  placeholder="sales1@gohar.eg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">رقم الهاتف / الواتساب:</label>
                <input
                  type="text"
                  placeholder="010XXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الدور والصلاحية برابط الشيتات:</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="SALES_REP">💼 موظف مبيعات (Sales Rep) - شيت مستقل للعملاء الخاصة به فقط</option>
                  <option value="ADMIN">👑 مدير عام (Admin) - التحكم الشامل واستيراد/تصدير الداتا</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">المشروع العقاري الموكل إليه:</label>
                <select
                  value={assignedProject}
                  onChange={e => setAssignedProject(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="جميع المشاريع">جميع المشاريع</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] text-[#0F1115] font-bold rounded hover:bg-[#d8b36c]"
                >
                  حفظ بيانات اليوزر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
