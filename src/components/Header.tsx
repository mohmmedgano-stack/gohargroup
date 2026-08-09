import React, { useState } from 'react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Search,
  ShieldCheck,
  User,
  CloudCheck,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Clock,
  Briefcase,
  Sliders,
  CloudUpload,
  Lock,
  Building2,
  UserPlus,
  Image,
  Upload,
  Edit3,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeTab: 'sheet' | 'dashboard' | 'followups' | 'users' | 'projects' | 'cloud';
  setActiveTab: (tab: 'sheet' | 'dashboard' | 'followups' | 'users' | 'projects' | 'cloud') => void;
  onOpenAddClient: () => void;
  onOpenLoginModal: () => void;
  onOpenImportExportModal: () => void;
}

const PRESET_HEADER_LOGOS = [
  { name: 'شعار ذهبي ثلاثي الأبعاد (افتراضي)', url: null },
  { name: 'شارة جوهر المعمارية الملكية', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200' },
  { name: 'أبراج جوهر المودرن', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200' },
  { name: 'شعار التطوير العقاري الفاخر', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200' },
];

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  activeTab,
  setActiveTab,
  onOpenAddClient,
  onOpenLoginModal,
  onOpenImportExportModal,
}) => {
  const {
    currentUser,
    users,
    setCurrentUser,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    clearAllNotifications,
    cloudConfig,
    canExport,
    logoutUser,
    customLogoUrl,
    companyTitle,
    companySubtitle,
    updateLogoSettings,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  // Logo modal local state
  const [inputLogoUrl, setInputLogoUrl] = useState<string>(customLogoUrl || '');
  const [inputTitle, setInputTitle] = useState<string>(companyTitle);
  const [inputSubtitle, setInputSubtitle] = useState<string>(companySubtitle);

  const handleOpenLogoModal = () => {
    setInputLogoUrl(customLogoUrl || '');
    setInputTitle(companyTitle);
    setInputSubtitle(companySubtitle);
    setShowLogoModal(true);
  };

  const handleSaveLogoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateLogoSettings(inputLogoUrl ? inputLogoUrl : null, inputTitle, inputSubtitle);
    setShowLogoModal(false);
  };

  const handleLocalLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = evt => {
        if (evt.target?.result) {
          setInputLogoUrl(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F1115] text-slate-100 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => setActiveTab('sheet')}>
              <Logo size="md" />
            </div>
          </div>

          {/* Search Input in Header */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300" />
              <input
                type="text"
                placeholder="بحث باسم العميل، رقم الهاتف، اسم المشروع، أو المصدر..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-4 pr-10 py-2 text-sm bg-[#072619] border border-amber-500/30 rounded-xl text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Action Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#072619]/80 p-1 rounded-xl border border-amber-500/20">
            <button
              onClick={() => setActiveTab('sheet')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'sheet'
                  ? 'bg-[#D4AF37] text-gray-950 font-bold shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-900/50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              شيت العملاء
            </button>

            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  التقارير
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                    activeTab === 'users'
                      ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  الموظفين والصلاحيات
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                    activeTab === 'projects'
                      ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  إدارة المشاريع
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('followups')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'followups'
                  ? 'bg-[#D4AF37] text-gray-950 font-bold shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-900/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              مواعيد الفولو اب
            </button>

            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'cloud'
                  ? 'bg-[#D4AF37] text-gray-950 font-bold shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-900/50'
              }`}
            >
              <CloudCheck className="w-3.5 h-3.5 text-amber-300" />
              التخزين السحابي
            </button>
          </nav>

          {/* Right side controls & Profile */}
          <div className="flex items-center gap-2">
            
            {/* Create New User Button for Admin */}
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('users')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#C5A059] text-[#0F1115] hover:bg-[#d8b36c] rounded transition shadow"
                title="إنشاء يوزر جديد (أدمن أو مبيعات)"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إنشاء يوزر</span>
              </button>
            )}

            {/* Import/Export Security Badge button */}
            {canExport ? (
              <button
                onClick={onOpenImportExportModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/40 rounded hover:bg-[#C5A059]/20 transition"
                title="خاصية استيراد وتصدير الداتا مقتصرة للأدمن"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>استيراد/تصدير</span>
              </button>
            ) : (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-300/70 bg-emerald-950/60 border border-emerald-800/40 rounded-lg"
                title="خاصية الاستيراد والتصدير معطلة للموظفين بحسب صلاحيات الأدمن"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>التصدير محظور</span>
              </div>
            )}

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-emerald-100 hover:bg-emerald-800/60 rounded-xl transition border border-emerald-700/50"
              >
                <Bell className="w-5 h-5 text-amber-300" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse border-2 border-[#0B3B26]">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Popup */}
              {showNotifications && (
                <div className="absolute left-0 mt-3 w-80 sm:w-96 bg-[#072619] border border-amber-500/30 rounded-2xl shadow-2xl z-50 text-emerald-100 overflow-hidden">
                  <div className="p-3.5 bg-[#0B3B26] border-b border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-100">التنبيهات المباشرة</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-amber-300 hover:underline"
                      >
                        مسح الكل
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-emerald-900/40">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-emerald-300/70">
                        لا توجد تنبيهات جديدة حالياً
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs transition cursor-pointer hover:bg-emerald-900/40 flex items-start gap-2.5 ${
                            !n.isRead ? 'bg-amber-500/10 border-r-2 border-[#D4AF37]' : ''
                          }`}
                        >
                          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-200">{n.title}</span>
                              <span className="text-[10px] text-emerald-400">{n.timestamp}</span>
                            </div>
                            <p className="text-emerald-100/90 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current User Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-[#072619] border border-amber-500/30 hover:border-amber-400 transition"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400"
                />
                <div className="hidden sm:flex flex-col text-right leading-tight">
                  <span className="text-xs font-bold text-amber-100">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-300 font-medium">
                    {currentUser.role === 'ADMIN' ? '👑 المدير العام' : '💼 مسؤول مبيعات'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
              </button>

              {/* User Selector Dropdown */}
              {showUserMenu && (
                <div className="absolute left-0 mt-3 w-64 bg-[#072619] border border-amber-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden text-right">
                  <div className="p-3 bg-[#0B3B26] border-b border-amber-500/20">
                    <p className="text-[11px] text-emerald-300">المستخدم الحالي:</p>
                    <p className="text-xs font-bold text-amber-200 mt-0.5">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-300 font-mono mt-0.5">{currentUser.username ? `@${currentUser.username}` : currentUser.email}</p>
                  </div>

                  <div className="p-2 border-t border-slate-800 space-y-1">
                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleOpenLogoModal();
                        }}
                        className="w-full flex items-center gap-2 text-right px-3 py-2 text-xs text-[#C5A059] hover:bg-slate-800 rounded-xl transition font-bold"
                      >
                        <Image className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>⚙️ إعدادات اللوجو والعنوان</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2 text-right px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-xl transition font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج الآن</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'sheet' ? 'bg-[#C5A059] text-[#0F1115] font-bold' : 'text-slate-300'
            }`}
          >
            الشيت
          </button>
          {currentUser.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'dashboard' ? 'bg-[#C5A059] text-[#0F1115] font-bold' : 'text-slate-300'
                }`}
              >
                اللوحة
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'users' ? 'bg-[#C5A059] text-[#0F1115] font-bold' : 'text-slate-300'
                }`}
              >
                الموظفين
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('followups')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'followups' ? 'bg-[#C5A059] text-[#0F1115] font-bold' : 'text-slate-300'
            }`}
          >
            المتابعات
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'cloud' ? 'bg-[#C5A059] text-[#0F1115] font-bold' : 'text-slate-300'
            }`}
          >
            التخزين
          </button>
        </div>

      </div>

      {/* Logo Customization Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1D23] text-slate-100 rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-[#C5A059] text-sm sm:text-base flex items-center gap-2">
                <Image className="w-5 h-5 text-[#C5A059]" />
                <span>تخصيص لوجو وهيدر شركة جوهر جروب</span>
              </h3>
              <button
                onClick={() => setShowLogoModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Current Logo Preview Box */}
            <div className="p-4 bg-[#0F1115] rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2">
              <span className="text-[11px] text-slate-400">معاينة الهيدر بالشعار الجديد:</span>
              <Logo size="md" customImage={inputLogoUrl || null} customTitle={inputTitle} customSubtitle={inputSubtitle} />
            </div>

            <form onSubmit={handleSaveLogoSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم الشركة (العنوان الرئيسي بالعربي):</label>
                <input
                  type="text"
                  required
                  value={inputTitle}
                  onChange={e => setInputTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الوصف الفرعي (بالإنجليزي أو العربي):</label>
                <input
                  type="text"
                  required
                  value={inputSubtitle}
                  onChange={e => setInputSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Preset Logos Select */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">نماذج شعارات جاهزة:</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_HEADER_LOGOS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setInputLogoUrl(preset.url || '')}
                      className={`p-2 rounded-lg border text-right transition flex items-center gap-2 ${
                        (preset.url === null && !inputLogoUrl) || (preset.url === inputLogoUrl)
                          ? 'bg-[#C5A059]/20 border-[#C5A059] text-amber-300'
                          : 'bg-[#0F1115] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                        {preset.url ? <img src={preset.url} className="w-full h-full object-cover rounded" /> : '🏛️'}
                      </div>
                      <span className="text-[11px] font-bold truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Custom Image or URL */}
              <div className="p-3 bg-[#0F1115] rounded-xl border border-slate-800 space-y-2.5">
                <label className="block text-slate-300 font-bold">رفع صورة لوجو مخصصة:</label>
                
                <input
                  type="url"
                  placeholder="رابط صورة مخصص (URL)..."
                  value={inputLogoUrl}
                  onChange={e => setInputLogoUrl(e.target.value)}
                  className="w-full p-2.5 bg-[#1A1D23] border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                />

                <label className="flex items-center justify-center gap-2 p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition text-xs font-bold border border-slate-700">
                  <Upload className="w-4 h-4 text-[#C5A059]" />
                  <span>اختر ملف صورة من جهازك (PNG / JPG / SVG)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLocalLogoUpload} />
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInputLogoUrl('');
                    setInputTitle('جوهر جروب للتطوير العقاري');
                    setInputSubtitle('Gohar Group for Real Estate Development');
                  }}
                  className="px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-950/40 rounded flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الافتراضي</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C5A059] text-[#0F1115] font-bold rounded-lg hover:bg-[#d8b36c]"
                  >
                    حفظ اللوجو الجديد
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
