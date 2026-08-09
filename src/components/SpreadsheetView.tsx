import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientLead, CallStatus, PriorityLevel, LeadSource } from '../types';
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Building,
  Tag,
  Lock,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
  PhoneOff,
  PhoneCall,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Target,
} from 'lucide-react';

interface SpreadsheetViewProps {
  searchTerm: string;
  onOpenAddClient: () => void;
  onSelectClientForFollowUp: (client: ClientLead) => void;
  onOpenHistoryModal: (client: ClientLead) => void;
  onOpenImportExportModal: () => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  searchTerm,
  onOpenAddClient,
  onSelectClientForFollowUp,
  onOpenHistoryModal,
  onOpenImportExportModal,
}) => {
  const {
    currentUser,
    visibleClients,
    updateClientStatus,
    projects,
    users,
    canExport,
    bulkAssignClients,
    deleteClient,
    deleteSelectedClients,
    clearAllClientsData,
    getDailyProgressForUser,
  } = useApp();

  const { callsToday, dailyQuota, percentage } = getDailyProgressForUser(currentUser.id);

  // Filters state
  const [selectedProject, setSelectedProject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<string>('ALL');

  // Bulk Selection State
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [targetAssignUserId, setTargetAssignUserId] = useState<string>('');

  // Status Colors & Badge Styling Map
  const statusConfig: Record<
    CallStatus,
    { label: string; bg: string; text: string; border: string; icon: any }
  > = {
    'مش مهتم': {
      label: 'مش مهتم',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: XCircle,
    },
    مغلق: {
      label: 'مغلق',
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: PhoneOff,
    },
    'غير متاح': {
      label: 'غير متاح',
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: AlertTriangle,
    },
    'قفل الخط في وشي': {
      label: 'قفل الخط في وشي',
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-400',
      icon: XCircle,
    },
    'هرجع اكلمه تاني': {
      label: 'هرجع اكلمه تاني',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: PhoneCall,
    },
    'مشغول دلوقتي': {
      label: 'مشغول دلوقتي',
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-300',
      icon: Clock,
    },
    مهتم: {
      label: 'مهتم ⭐',
      bg: 'bg-emerald-100',
      text: 'text-emerald-900 font-bold',
      border: 'border-emerald-400 ring-2 ring-emerald-500/20',
      icon: CheckCircle,
    },
    جديد: {
      label: 'جديد',
      bg: 'bg-[#D4AF37]/20',
      text: 'text-amber-900 font-semibold',
      border: 'border-amber-400',
      icon: Sparkles,
    },
  };

  // Filter Clients Logic
  const filteredClients = visibleClients.filter(c => {
    // Search Query Match
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.projectName.toLowerCase().includes(query) ||
      c.source.toLowerCase().includes(query) ||
      c.assignedUserName.toLowerCase().includes(query);

    // Dropdown filters
    const matchesProject = selectedProject === 'ALL' || c.projectName === selectedProject;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
    const matchesSource = selectedSource === 'ALL' || c.source === selectedSource;
    const matchesUser = selectedUser === 'ALL' || c.assignedUserId === selectedUser;

    return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesSource && matchesUser;
  });

  // Handle Select All Checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedClientIds(filteredClients.map(c => c.id));
    } else {
      setSelectedClientIds([]);
    }
  };

  const handleToggleSelectClient = (id: string) => {
    setSelectedClientIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle Bulk Assignment Trigger
  const handleApplyBulkAssign = () => {
    if (!targetAssignUserId || selectedClientIds.length === 0) return;
    const targetUser = users.find(u => u.id === targetAssignUserId);
    if (!targetUser) return;

    bulkAssignClients(selectedClientIds, targetUser.id, targetUser.name);
    setSelectedClientIds([]);
    setTargetAssignUserId('');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner & Control Tools */}
      <div className="bg-[#0B3B26] text-white p-5 rounded-2xl border border-amber-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h1 className="text-xl font-bold text-amber-100">
              {currentUser.role === 'ADMIN' ? 'شيت العملاء العام - جميع الموظفين' : `شيت العملاء الخاص بك: (${currentUser.name})`}
            </h1>
          </div>
          <p className="text-xs text-emerald-200/90 mt-1">
            {currentUser.role === 'ADMIN'
              ? 'بصفتك م. أسامة جوهر (المدير العام)، لديك الاطلاع الكامل والقدرة على التحكم في كافة الشيتات وتخصيص العملاء وتصدير الداتا.'
              : `معروض فقط العملاء المخصصين لك في مشروع (${currentUser.assignedProject || 'المحدد'}). لا يمكنك تصدير أو استيراد البيانات.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddClient}
            className="px-4 py-2 bg-[#D4AF37] text-gray-950 hover:bg-amber-400 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            إضافة عميل جديد
          </button>

          {canExport ? (
            <button
              onClick={onOpenImportExportModal}
              className="px-3.5 py-2 bg-emerald-900/80 text-amber-200 border border-amber-500/40 hover:bg-emerald-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              تصدير / استيراد اكسل
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-emerald-950/80 text-amber-300/80 border border-emerald-800/60 rounded-xl text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>التصدير محظور للموظف</span>
            </div>
          )}

          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => {
                if (confirm('⚠️ هل أنت ألكيد من تفريغ ومسح كافة بيانات الداتا في الشيت بالكامل؟\nسيتم مسح كل العملاء المسجلين.')) {
                  clearAllClientsData();
                }
              }}
              className="px-3.5 py-2 bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-500/40 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              title="مسح كافة الداتا والعملاء"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-300" />
              <span>مسح كل الداتا</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily Quota Tracker Banner for Sales Reps */}
      {currentUser.role === 'SALES_REP' && (
        <div className="bg-[#072619] text-amber-100 p-4 rounded-2xl border border-amber-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D4AF37] text-gray-950 rounded-xl font-bold shrink-0 shadow">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-200">الكوتا اليومية المطلوبة للأرقام</span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono font-bold border border-amber-500/30">
                  {dailyQuota} رقم / اليوم
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                تم التواصل وتحديث حالات <strong className="text-amber-300 font-mono">{callsToday}</strong> من أصل <strong className="text-amber-300 font-mono">{dailyQuota}</strong> عميل اليوم.
              </p>
            </div>
          </div>

          <div className="w-full md:w-56 space-y-1.5 shrink-0">
            <div className="flex justify-between text-[11px] font-bold text-amber-300 font-mono">
              <span>نسبة الإنجاز اليومي:</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-3 overflow-hidden border border-amber-500/40">
              <div
                className="bg-[#D4AF37] h-3 rounded-full transition-all duration-500 shadow"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
      {!canExport && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>تنبيه الأمان والصلاحيات:</strong> يمنع الموظفين من استيراد أو تصدير أي بيانات عملاء. فقط مدير النظام من يقوم بتصدير الداتا وتوزيعها.
            </span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">
            نظام حماية الداتا
          </span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0B3B26]" />
            <span>تصفية وفرز البيانات الشيت:</span>
          </div>
          <span className="text-gray-500 font-normal">
            عرض ({filteredClients.length}) عميل من أصل ({visibleClients.length})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          {/* Project Filter */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-1 font-medium">اسم المشروع:</label>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0B3B26]"
            >
              <option value="ALL">جميع المشاريع</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-1 font-medium font-arabic">حالة الاتصال:</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0B3B26]"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="مهتم">مهتم ⭐</option>
              <option value="هرجع اكلمه تاني">هرجع اكلمه تاني</option>
              <option value="مشغول دلوقتي">مشغول دلوقتي</option>
              <option value="غير متاح">غير متاح</option>
              <option value="مغلق">مغلق</option>
              <option value="قفل الخط في وشي">قفل الخط في وشي</option>
              <option value="مش مهتم">مش مهتم</option>
            </select>
          </div>

          {/* Lead Source Filter */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-1 font-medium">مصدر الداتا:</label>
            <select
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0B3B26]"
            >
              <option value="ALL">جميع المصادر</option>
              <option value="اعلانات فيسبوك">اعلانات فيسبوك</option>
              <option value="داتا خاصة">داتا خاصة</option>
              <option value="اوت دور">اوت دور</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-1 font-medium">الأولوية:</label>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0B3B26]"
            >
              <option value="ALL">جميع الأولويات</option>
              <option value="عالي">عالي 🔥</option>
              <option value="متوسط">متوسط</option>
              <option value="منخفض">منخفض</option>
            </select>
          </div>

          {/* User Filter (Admin View) */}
          {currentUser.role === 'ADMIN' && (
            <div>
              <label className="block text-[10px] text-gray-500 mb-1 font-medium">الموظف المسؤول:</label>
              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0B3B26]"
              >
                <option value="ALL">جميع الموظفين</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Bulk Action Controls (Admin Only) */}
        {currentUser.role === 'ADMIN' && selectedClientIds.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-amber-900">
              تم تحديد ({selectedClientIds.length}) عميل للتوزيع السريع:
            </span>
            <div className="flex items-center gap-2">
              <select
                value={targetAssignUserId}
                onChange={e => setTargetAssignUserId(e.target.value)}
                className="p-1.5 bg-white border border-amber-300 rounded-lg text-xs"
              >
                <option value="">اختر الموظف لنقل الداتا...</option>
                {users.filter(u => u.role === 'SALES_REP').map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleApplyBulkAssign}
                disabled={!targetAssignUserId}
                className="px-3 py-1.5 bg-[#0B3B26] text-white font-bold rounded-lg hover:bg-emerald-800 disabled:opacity-50 transition"
              >
                توزيع الآن
              </button>

              <button
                onClick={() => {
                  if (confirm(`هل أنت تأكد من مسح (${selectedClientIds.length}) عميل المحددة من الشيت؟`)) {
                    deleteSelectedClients(selectedClientIds);
                    setSelectedClientIds([]);
                  }
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="حذف العملاء المحددين"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح المحدد ({selectedClientIds.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spreadsheet Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            
            {/* Header Row Google Sheets Style */}
            <thead>
              <tr className="bg-[#0B3B26] text-amber-100 text-xs font-bold border-b border-amber-500/30">
                {currentUser.role === 'ADMIN' && (
                  <th className="p-3 w-10 text-center border-l border-emerald-900/40">
                    <input
                      type="checkbox"
                      checked={
                        filteredClients.length > 0 &&
                        selectedClientIds.length === filteredClients.length
                      }
                      onChange={handleSelectAll}
                      className="rounded accent-[#D4AF37]"
                    />
                  </th>
                )}
                <th className="p-3 border-l border-emerald-900/40 min-w-[160px]">اسم العميل</th>
                <th className="p-3 border-l border-emerald-900/40 min-w-[130px]">رقم الهاتف</th>
                <th className="p-3 border-l border-emerald-900/40 min-w-[280px]">
                  أزرار كول ستاتس (تحديث الحالة بضغطة واحدة)
                </th>
                <th className="p-3 border-l border-emerald-900/40 min-w-[150px]">ميعاد الفولو اب</th>
                <th className="p-3 border-l border-emerald-900/40 min-w-[150px]">المشروع</th>
                <th className="p-3 border-l border-emerald-900/40 min-w-[110px]">مصدر الداتا</th>
                <th className="p-3 border-l border-emerald-900/40 min-w-[90px]">الأولوية</th>
                {currentUser.role === 'ADMIN' && (
                  <th className="p-3 border-l border-emerald-900/40 min-w-[130px]">الموظف المسؤول</th>
                )}
                <th className="p-3 border-l border-emerald-900/40 min-w-[180px]">البريد والعنوان</th>
                <th className="p-3 border-l border-emerald-900/40 min-w-[180px]">الملاحظات وسجل المحادثات</th>
                <th className="p-3 min-w-[80px] text-center">إجراءات</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 text-xs font-sans">
              {filteredClients.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentUser.role === 'ADMIN' ? 12 : 10}
                    className="p-12 text-center text-gray-500 bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p className="font-bold text-gray-700">لا يوجد عملاء يطابقون خيارات البحث أو التصفية الحالية</p>
                      <p className="text-[11px] text-gray-400">تأكد من تعديل الفلتر أو إضافة عملاء جدد للشيت</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, idx) => {
                  const StatusBadgeIcon = statusConfig[client.status]?.icon || Sparkles;
                  const isChecked = selectedClientIds.includes(client.id);

                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-amber-50/40 transition group ${
                        client.status === 'مهتم'
                          ? 'bg-emerald-50/30'
                          : idx % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50/50'
                      }`}
                    >
                      {/* Select Checkbox for Admin */}
                      {currentUser.role === 'ADMIN' && (
                        <td className="p-3 text-center border-l border-gray-100">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectClient(client.id)}
                            className="rounded accent-[#D4AF37]"
                          />
                        </td>
                      )}

                      {/* Client Name */}
                      <td className="p-3 font-bold text-gray-900 border-l border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#0B3B26]" />
                          <span>{client.name}</span>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="p-3 font-mono dir-ltr text-right border-l border-gray-100">
                        <a
                          href={`tel:${client.phone}`}
                          className="inline-flex items-center gap-1 text-emerald-900 hover:text-amber-600 font-semibold hover:underline"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{client.phone}</span>
                        </a>
                      </td>

                      {/* Explicit Call Status Action Buttons */}
                      <td className="p-2 border-l border-gray-100 bg-gray-50/30">
                        <div className="flex flex-col gap-1.5">
                          {/* Active Status Display Badge */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-gray-400 font-semibold">الحالة الحالية:</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] border flex items-center gap-1 ${
                                statusConfig[client.status]?.bg
                              } ${statusConfig[client.status]?.text} ${
                                statusConfig[client.status]?.border
                              }`}
                            >
                              <StatusBadgeIcon className="w-3 h-3" />
                              {client.status}
                            </span>
                          </div>

                          {/* The 7 Required Action Buttons */}
                          <div className="grid grid-cols-4 gap-1">
                            {/* 1. مهتم */}
                            <button
                              onClick={() => {
                                updateClientStatus(client.id, 'مهتم');
                                onSelectClientForFollowUp(client);
                              }}
                              className={`px-1.5 py-1 text-[10px] font-bold rounded transition border text-center ${
                                client.status === 'مهتم'
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                              }`}
                              title="تحديد مهتم + إضافة ميعاد فولو اب"
                            >
                              مهتم ⭐
                            </button>

                            {/* 2. هرجع اكلمه تاني */}
                            <button
                              onClick={() => {
                                updateClientStatus(client.id, 'هرجع اكلمه تاني');
                                onSelectClientForFollowUp(client);
                              }}
                              className={`px-1.5 py-1 text-[10px] font-semibold rounded transition border text-center ${
                                client.status === 'هرجع اكلمه تاني'
                                  ? 'bg-blue-600 text-white border-blue-700'
                                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                              }`}
                            >
                              هرجع اكلمه
                            </button>

                            {/* 3. مشغول دلوقتي */}
                            <button
                              onClick={() => updateClientStatus(client.id, 'مشغول دلوقتي')}
                              className={`px-1.5 py-1 text-[10px] font-semibold rounded transition border text-center ${
                                client.status === 'مشغول دلوقتي'
                                  ? 'bg-purple-600 text-white border-purple-700'
                                  : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                              }`}
                            >
                              مشغول
                            </button>

                            {/* 4. غير متاح */}
                            <button
                              onClick={() => updateClientStatus(client.id, 'غير متاح')}
                              className={`px-1.5 py-1 text-[10px] font-semibold rounded transition border text-center ${
                                client.status === 'غير متاح'
                                  ? 'bg-amber-600 text-white border-amber-700'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              غير متاح
                            </button>

                            {/* 5. مغلق */}
                            <button
                              onClick={() => updateClientStatus(client.id, 'مغلق')}
                              className={`px-1.5 py-1 text-[10px] font-semibold rounded transition border text-center ${
                                client.status === 'مغلق'
                                  ? 'bg-red-600 text-white border-red-700'
                                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                              }`}
                            >
                              مغلق
                            </button>

                            {/* 6. قفل الخط في وشي */}
                            <button
                              onClick={() => updateClientStatus(client.id, 'قفل الخط في وشي')}
                              className={`px-1.5 py-1 text-[10px] font-semibold rounded transition border text-center ${
                                client.status === 'قفل الخط في وشي'
                                  ? 'bg-rose-700 text-white border-rose-800'
                                  : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              قفل الخط
                            </button>

                            {/* 7. مش مهتم */}
                            <button
                              onClick={() => updateClientStatus(client.id, 'مش مهتم')}
                              className={`col-span-2 px-1.5 py-1 text-[10px] font-semibold rounded transition border text-center ${
                                client.status === 'مش مهتم'
                                  ? 'bg-slate-700 text-white border-slate-800'
                                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              مش مهتم
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Follow-up Date & Time */}
                      <td className="p-3 border-l border-gray-100">
                        {client.followUpDate ? (
                          <div className="flex flex-col gap-1 bg-amber-50 p-2 rounded-xl border border-amber-200">
                            <div className="flex items-center gap-1 font-bold text-amber-900 text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-amber-600" />
                              <span>{client.followUpDate}</span>
                            </div>
                            {client.followUpTime && (
                              <div className="flex items-center gap-1 text-[10px] text-amber-800 font-mono">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>{client.followUpTime}</span>
                              </div>
                            )}
                            <button
                              onClick={() => onSelectClientForFollowUp(client)}
                              className="text-[10px] text-[#0B3B26] underline font-bold hover:text-amber-700 mt-0.5 text-right"
                            >
                              تعديل الموعد
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectClientForFollowUp(client)}
                            className="px-2.5 py-1 text-[11px] text-amber-900 bg-amber-100/60 hover:bg-amber-200 rounded-lg border border-amber-300 font-semibold transition flex items-center gap-1"
                          >
                            <Calendar className="w-3 h-3 text-amber-700" />
                            <span>تحديد موعد</span>
                          </button>
                        )}
                      </td>

                      {/* Project Name */}
                      <td className="p-3 border-l border-gray-100">
                        <div className="flex items-center gap-1 text-gray-800 font-medium">
                          <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{client.projectName}</span>
                        </div>
                      </td>

                      {/* Lead Source */}
                      <td className="p-3 border-l border-gray-100">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] rounded-full font-bold ${
                            client.source === 'اعلانات فيسبوك'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : client.source === 'داتا خاصة'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {client.source}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="p-3 border-l border-gray-100">
                        <span
                          className={`font-bold ${
                            client.priority === 'عالي'
                              ? 'text-red-600'
                              : client.priority === 'متوسط'
                              ? 'text-amber-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {client.priority === 'عالي' ? '🔥 عالي' : client.priority}
                        </span>
                      </td>

                      {/* Assigned Sales Rep (Admin view) */}
                      {currentUser.role === 'ADMIN' && (
                        <td className="p-3 border-l border-gray-100">
                          <div className="flex items-center gap-1 text-gray-700 text-[11px]">
                            <User className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="font-semibold">{client.assignedUserName}</span>
                          </div>
                        </td>
                      )}

                      {/* Email & Address */}
                      <td className="p-3 border-l border-gray-100 text-gray-600">
                        <div className="flex flex-col gap-0.5">
                          {client.email && (
                            <span className="truncate max-w-[170px] text-[10px] text-gray-500 font-mono">
                              {client.email}
                            </span>
                          )}
                          <span className="text-[11px] text-gray-700">{client.address || 'القاهرة'}</span>
                        </div>
                      </td>

                      {/* Call Notes & History */}
                      <td className="p-3 border-l border-gray-100">
                        <div className="flex flex-col gap-1">
                          <p className="text-[11px] text-gray-700 line-clamp-2 leading-relaxed">
                            {client.notes || 'لا توجد ملاحظات سابقة'}
                          </p>
                          <button
                            onClick={() => onOpenHistoryModal(client)}
                            className="inline-flex items-center gap-1 text-[10px] text-amber-800 hover:text-amber-950 font-bold hover:underline"
                          >
                            <History className="w-3 h-3 text-amber-600" />
                            <span>سجل المحادثات ({client.notesHistory?.length || 0})</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenHistoryModal(client)}
                            className="p-1.5 text-gray-500 hover:text-[#0B3B26] hover:bg-gray-100 rounded-lg transition"
                            title="عرض السجل بالتفصيل"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          {currentUser.role === 'ADMIN' && (
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت تأكد من حذف العميل (${client.name})؟`)) {
                                  deleteClient(client.id);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                              title="حذف العميل"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-800">
              إجمالي النتائج: {filteredClients.length} عميل
            </span>
            <span className="text-emerald-800 font-semibold">
              المهتمين: {filteredClients.filter(c => c.status === 'مهتم').length}
            </span>
            <span className="text-blue-800 font-semibold">
              المتابعات: {filteredClients.filter(c => c.status === 'هرجع اكلمه تاني').length}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            شيت تفاعلي أوتوماتيكي - شركة جوهر جروب للتطوير العقاري
          </span>
        </div>
      </div>
    </div>
  );
};
