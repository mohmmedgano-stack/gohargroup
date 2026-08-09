import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Building,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  PhoneCall,
  PieChart,
  FileSpreadsheet,
  AlertCircle,
  Calendar,
  Sparkles,
  Award,
  ShieldCheck,
  Facebook,
  Database,
  Compass,
  PlusCircle,
  Activity,
  CalendarDays,
  Target,
  Trash2,
  Search,
  UserCheck,
  ArrowUpRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { CallStatus, LeadSource, PriorityLevel } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    clients,
    projects,
    users,
    getPerformanceReports,
    getDailyProgressForUser,
    schedulePlans,
    createSchedulePlan,
    deleteSchedulePlan,
    allInteractions,
    addClient,
    updateUser,
    clearAllClientsData,
  } = useApp();

  const reports = getPerformanceReports();
  const salesUsers = users.filter(u => u.role === 'SALES_REP');

  // Filter for Live Activity Audit Stream
  const [activityRepFilter, setActivityRepFilter] = useState<string>('ALL');
  const [activitySearchQuery, setActivitySearchQuery] = useState<string>('');

  // Lead Schedule Form State
  const [schedUserId, setSchedUserId] = useState<string>(salesUsers[0]?.id || '');
  const [schedType, setSchedType] = useState<'7_DAYS' | '30_DAYS'>('7_DAYS');
  const [schedQuota, setSchedQuota] = useState<number>(100);
  const [schedNotes, setSchedNotes] = useState<string>('');

  // Quick Lead Add & Assign Form State
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);
  const [newLeadName, setNewLeadName] = useState<string>('');
  const [newLeadPhone, setNewLeadPhone] = useState<string>('');
  const [newLeadProject, setNewLeadProject] = useState<string>(projects[0]?.name || 'Wada Bay رأس الحكمة');
  const [newLeadAssignUser, setNewLeadAssignUser] = useState<string>(salesUsers[0]?.id || '');
  const [newLeadSource, setNewLeadSource] = useState<LeadSource>('اعلانات فيسبوك');
  const [newLeadPriority, setNewLeadPriority] = useState<PriorityLevel>('متوسط');
  const [newLeadNotes, setNewLeadNotes] = useState<string>('');

  // Calculate high level metrics
  const totalLeadsCount = clients.length;
  const interestedLeadsCount = clients.filter(c => c.status === 'مهتم').length;
  const callBackLeadsCount = clients.filter(c => c.status === 'هرجع اكلمه تاني').length;
  const pendingFollowUps = clients.filter(
    c => c.followUpDate && c.followUpDate >= new Date().toISOString().split('T')[0]
  );

  // Source distribution
  const fbAdsCount = clients.filter(c => c.source === 'اعلانات فيسبوك').length;
  const privateDataCount = clients.filter(c => c.source === 'داتا خاصة').length;
  const outdoorCount = clients.filter(c => c.source === 'اوت دور').length;

  // Filtered interactions for Admin Audit Feed
  const filteredInteractions = allInteractions.filter(item => {
    const matchesUser =
      activityRepFilter === 'ALL' ||
      item.authorName === users.find(u => u.id === activityRepFilter)?.name ||
      clients.find(c => c.id === item.clientId)?.assignedUserId === activityRepFilter;

    const query = activitySearchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      item.clientName.toLowerCase().includes(query) ||
      item.phone.includes(query) ||
      item.authorName.toLowerCase().includes(query) ||
      item.note.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query);

    return matchesUser && matchesQuery;
  });

  const handleCreateSchedulePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedUserId) return;
    createSchedulePlan(schedUserId, schedType, schedQuota, schedNotes);
    setSchedNotes('');
    alert('تم اعتماد وتفعيل خطة جدولة الداتا بنجاح!');
  };

  const handleCreateQuickLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone || !newLeadAssignUser) return;

    const assignedUserObj = users.find(u => u.id === newLeadAssignUser);

    addClient({
      name: newLeadName,
      phone: newLeadPhone,
      email: '',
      address: 'القاهرة',
      priority: newLeadPriority,
      lastInteractionDate: new Date().toISOString().split('T')[0],
      status: 'جديد',
      source: newLeadSource,
      projectName: newLeadProject,
      assignedUserId: newLeadAssignUser,
      assignedUserName: assignedUserObj?.name || 'موظف مبيعات',
      notes: newLeadNotes || 'تمت الإضافة والتخصيص مباشرة بواسطة الأدمن',
    });

    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadNotes('');
    setShowAddLeadModal(false);
    alert('تمت إضافة العميل وتخصيصه للموظف بنجاح!');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0B3B26] text-white p-6 rounded-2xl border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-black text-amber-100">
              لوحة التحكم والإشراف العام - جوهر جروب
            </h1>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            متابعة حركات الاتصال لجميع الموظفين، إدارة الكوتا اليومية (100 رقم)، وجدولة توزيع الداتا للأسبوع والـ 30 يوم.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2 bg-[#D4AF37] text-gray-950 font-bold text-xs rounded-xl shadow-lg hover:bg-amber-300 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة وتوزيع عميل جديد</span>
          </button>
          
          <button
            onClick={() => {
              if (confirm('⚠️ هل أنت ألكيد من مسح وتفريغ كافة بيانات العملاء في الشيت بالكامل؟\nسيتفريغ النظام من جميع الأرقام المسجلة.')) {
                clearAllClientsData();
              }
            }}
            className="px-3.5 py-2 bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-500/40 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
            title="مسح شيت العملاء بالكامل"
          >
            <Trash2 className="w-4 h-4 text-red-300" />
            <span>مسح بيانات الشيت بالكامل</span>
          </button>

          <div className="bg-[#072619] border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-emerald-300 block">تحديث حي ومباشر</span>
            <span className="text-xs font-bold text-amber-300 font-mono">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Leads */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold block">إجمالي الداتا والعملاء</span>
              <span className="text-3xl font-black text-gray-900 mt-1 block">{totalLeadsCount}</span>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">
                موزعة على {salesUsers.length} موظف مبيعات
              </span>
            </div>
            <div className="p-3 bg-[#0B3B26]/10 text-[#0B3B26] rounded-2xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-1 bg-[#0B3B26]" />
        </div>

        {/* Metric 2: Interested Clients */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden bg-emerald-50/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-800 font-semibold block">العملاء المهتمين (Hot Leads)</span>
              <span className="text-3xl font-black text-emerald-900 mt-1 block">{interestedLeadsCount}</span>
              <span className="text-[11px] text-emerald-800 font-bold mt-1 inline-block">
                نسبة اهتمام: {totalLeadsCount > 0 ? ((interestedLeadsCount / totalLeadsCount) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-1 bg-emerald-500" />
        </div>

        {/* Metric 3: Pending Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden bg-amber-50/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-900 font-semibold block">مواعيد الفولو اب المجدولة</span>
              <span className="text-3xl font-black text-amber-950 mt-1 block">{pendingFollowUps.length}</span>
              <span className="text-[11px] text-amber-800 font-medium mt-1 inline-block">
                تتطلب تواصل اليوم أو قريباً
              </span>
            </div>
            <div className="p-3 bg-[#D4AF37] text-gray-950 rounded-2xl shadow-md">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-1 bg-[#D4AF37]" />
        </div>

        {/* Metric 4: Scheduled Plans */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-800 font-semibold block">خطط التوزيع المجدولة</span>
              <span className="text-3xl font-black text-blue-900 mt-1 block">{schedulePlans.length}</span>
              <span className="text-[11px] text-blue-700 font-medium mt-1 inline-block">
                خطط أسبوعية وشهرية نشطة
              </span>
            </div>
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-1 bg-blue-600" />
        </div>

      </div>

      {/* SECTION 1: Daily Performance & Daily Quota Progress (100 Leads / Day) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-4 bg-[#0B3B26] text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold">متابعة إنجاز الكوتا اليومية (100 رقم يومياً) وأداء الموظفين</h2>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                تتبع التفاعل اليومي المباشر لكل يوزر مبيعات ونسبة تحقيق هدف الـ 100 اتصال يومياً.
              </p>
            </div>
          </div>
          <span className="text-xs bg-[#072619] text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-mono text-center">
            الهدف القياسي: 100 رقم / يوم
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-200 font-bold">
                <th className="p-3">اسم الموظف</th>
                <th className="p-3 text-center">إنجاز كوتا اليوم (100 رقم)</th>
                <th className="p-3 text-center">إجمالي الداتا</th>
                <th className="p-3 text-center text-emerald-700 bg-emerald-50">مهتم ⭐</th>
                <th className="p-3 text-center text-blue-700">هرجع اكلمه</th>
                <th className="p-3 text-center text-purple-700">مشغول</th>
                <th className="p-3 text-center text-amber-700">غير متاح</th>
                <th className="p-3 text-center text-red-700">مغلق</th>
                <th className="p-3 text-center text-rose-800">قفل الخط</th>
                <th className="p-3 text-center text-slate-700">مش مهتم</th>
                <th className="p-3 text-center">الفولو اب المتبقي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-500">
                    لا يوجد موظفي مبيعات مسجلين حالياً
                  </td>
                </tr>
              ) : (
                reports.map(rep => {
                  const userObj = users.find(u => u.id === rep.userId);
                  const { callsToday, dailyQuota, percentage } = getDailyProgressForUser(rep.userId);

                  return (
                    <tr key={rep.userId} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <img
                            src={userObj?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                            className="w-7 h-7 rounded-full object-cover border border-amber-400"
                          />
                          <div>
                            <span className="block font-bold text-gray-900">{rep.userName}</span>
                            <span className="text-[10px] text-gray-500 block">{userObj?.assignedProject || 'عام'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Daily Quota Progress Column */}
                      <td className="p-3 text-center bg-amber-50/50 min-w-[170px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-amber-950 font-mono">{callsToday} / {dailyQuota} رقم</span>
                            <span className="text-emerald-800">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-amber-200">
                            <div
                              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-center font-bold text-gray-900 bg-gray-50">{rep.totalCalls}</td>
                      <td className="p-3 text-center font-bold text-emerald-800 bg-emerald-100/60">
                        {rep.interestedCount}
                      </td>
                      <td className="p-3 text-center font-semibold text-blue-800">{rep.callbackCount}</td>
                      <td className="p-3 text-center font-semibold text-purple-800">{rep.busyCount}</td>
                      <td className="p-3 text-center font-semibold text-amber-800">{rep.unreachableCount}</td>
                      <td className="p-3 text-center font-semibold text-red-800">{rep.closedCount}</td>
                      <td className="p-3 text-center font-semibold text-rose-900">{rep.hungUpCount}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{rep.notInterestedCount}</td>
                      <td className="p-3 text-center font-bold text-amber-900 bg-amber-50">
                        {rep.pendingFollowUps}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Schedule Lead Distribution (7 Days & 30 Days Scheduling Engine) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scheduler Creator Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md space-y-4 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-[#0B3B26]" />
              <h2 className="text-base font-bold text-gray-900">جدولة وتوزيع العملاء (7 أو 30 يوم)</h2>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              يمكنك كأدمن تحديد موظف المبيعات وتوزيع حصص الداتا والعملاء اليومية المجدولة تلقائياً للأسبوع القادم أو لمدة شهر كامل.
            </p>

            <form onSubmit={handleCreateSchedulePlan} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">اختر الموظف:</label>
                <select
                  value={schedUserId}
                  onChange={e => setSchedUserId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                >
                  {salesUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.assignedProject || 'عام'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">مدة الجدولة والتوزيع:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSchedType('7_DAYS')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      schedType === '7_DAYS'
                        ? 'bg-[#0B3B26] text-amber-300 border-[#0B3B26] shadow'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    أسبوعي (7 أيام)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedType('30_DAYS')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      schedType === '30_DAYS'
                        ? 'bg-[#0B3B26] text-amber-300 border-[#0B3B26] shadow'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    شهري (30 يوم)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">الكوتا اليومية (عدد الأرقام/اليوم):</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={schedQuota}
                  onChange={e => setSchedQuota(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold font-mono text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  إجمالي الداتا المستهدفة: <strong className="text-emerald-800 font-mono">{schedQuota * (schedType === '7_DAYS' ? 7 : 30)} عميل</strong>
                </span>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">ملاحظات خطة الجدولة:</label>
                <input
                  type="text"
                  placeholder="مثال: داتا فيسبوك للمرحلة الأولى..."
                  value={schedNotes}
                  onChange={e => setSchedNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0B3B26] text-amber-300 font-bold rounded-xl hover:bg-[#072619] shadow transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                <span>اعتماد وتفعيل خطة الجدولة</span>
              </button>
            </form>
          </div>
        </div>

        {/* Active Schedule Plans List */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#0B3B26]" />
              <h2 className="text-base font-bold text-gray-900">جدول خطط التوزيع والجدولة النشطة على الموقع</h2>
            </div>
            <span className="text-xs text-gray-500">إجمالي ({schedulePlans.length}) خطة جدولة</span>
          </div>

          {schedulePlans.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 space-y-2">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-semibold">لا توجد خطط جدولة أسبوعية أو شهرية مسجلة حالياً.</p>
              <p className="text-[11px] text-gray-400">يمكنك إضافة خطة جديدة للموظف من النموذج الجانبي.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {schedulePlans.map(plan => (
                <div
                  key={plan.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-400 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{plan.userName}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#0B3B26] text-amber-300 rounded-md">
                        {plan.planType === '7_DAYS' ? 'جدولة أسبوعية (7 أيام)' : 'جدولة شهرية (30 يوم)'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-mono">
                      <span>الكوتا: <strong>{plan.dailyQuota} رقم/يوم</strong></span>
                      <span>•</span>
                      <span>إجمالي الأرقام: <strong>{plan.totalLeadsAllocated} عميل</strong></span>
                      <span>•</span>
                      <span className="text-emerald-800 font-bold">من {plan.startDate} إلى {plan.endDate}</span>
                    </div>
                    {plan.notes && (
                      <p className="text-xs text-gray-500 italic mt-1">"{plan.notes}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSchedulePlan(plan.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition shrink-0 self-start sm:self-center"
                    title="حذف خطة الجدولة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* SECTION 3: Live Interactions & Calls Audit Log (متابعة حركات كل الموظفين والمكالمات) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden space-y-4 p-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-gray-900">
                سجل متابعة تفاعلات وحركات الموظفين المباشرة (Calls & Notes Live Audit)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              اطلاع حي ومباشر كأدمن على كافة المكالمات والملاحظات المضافة من يوزرات المبيعات لحظة بلحظة.
            </p>
          </div>

          {/* Filters for Audit Feed */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في الملاحظات أو اسم العميل..."
                value={activitySearchQuery}
                onChange={e => setActivitySearchQuery(e.target.value)}
                className="pr-8 pl-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#0B3B26] w-48"
              />
            </div>

            <select
              value={activityRepFilter}
              onChange={e => setActivityRepFilter(e.target.value)}
              className="p-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0B3B26]"
            >
              <option value="ALL">جميع موظفي المبيعات</option>
              {salesUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Interactions Feed Table */}
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-200 font-bold sticky top-0">
                <th className="p-3">الوقت والتاريخ</th>
                <th className="p-3">اسم موظف المبيعات</th>
                <th className="p-3">بيانات العميل</th>
                <th className="p-3 text-center">الحالة المسجلة</th>
                <th className="p-3">تفاصيل الملاحظة / حركة المكالمة</th>
                <th className="p-3 text-center">المشروع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInteractions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    لا توجد حركات تواصل أو مكالمات مطابقة للفلتر المحدد
                  </td>
                </tr>
              ) : (
                filteredInteractions.slice(0, 50).map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="p-3 font-bold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{item.authorName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{item.clientName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.phone}</div>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        item.status === 'مهتم'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          : item.status === 'هرجع اكلمه تاني'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-800 font-medium max-w-xs">
                      {item.note}
                    </td>
                    <td className="p-3 text-center text-gray-600 text-[11px] whitespace-nowrap">
                      {item.projectName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SECTION 4: Lead Sources Distribution & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sources breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#0B3B26]" />
              <h2 className="text-base font-bold text-gray-900">توزيع مصادر الداتا في الشيتات</h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Facebook className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-blue-950">اعلانات فيسبوك</span>
              </div>
              <span className="text-sm font-black text-blue-900">{fbAdsCount} عميل</span>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37] text-gray-950 rounded-lg">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-amber-950">داتا خاصة (VIP)</span>
              </div>
              <span className="text-sm font-black text-amber-900">{privateDataCount} عميل</span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0B3B26] text-white rounded-lg">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-emerald-950">اوت دور (Outdoor)</span>
              </div>
              <span className="text-sm font-black text-emerald-900">{outdoorCount} عميل</span>
            </div>
          </div>
        </div>

        {/* Projects breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#0B3B26]" />
              <h2 className="text-base font-bold text-gray-900">مشاريع جوهر جروب الحالية</h2>
            </div>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto">
            {projects.map(proj => {
              const projLeads = clients.filter(c => c.projectName === proj.name);
              return (
                <div key={proj.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{proj.name}</span>
                    <span className="text-[10px] text-gray-500">{proj.location}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {projLeads.length} عميل
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL: Quick Add & Distribute Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-fadeIn text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#0B3B26]" />
                <h3 className="text-base font-bold text-gray-900">إضافة وتخصيص رقم جديد لموظف مبيعات</h3>
              </div>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuickLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">اسم العميل الخارجي:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: د. أحمد فؤاد"
                  value={newLeadName}
                  onChange={e => setNewLeadName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">رقم الهاتف:</label>
                <input
                  type="text"
                  required
                  placeholder="010xxxxxxx"
                  value={newLeadPhone}
                  onChange={e => setNewLeadPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-mono focus:outline-none focus:border-[#0B3B26]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">تخصيص للموظف (Sales Rep):</label>
                <select
                  value={newLeadAssignUser}
                  onChange={e => setNewLeadAssignUser(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                >
                  {salesUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">المشروع الموكل:</label>
                <select
                  value={newLeadProject}
                  onChange={e => setNewLeadProject(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">مصدر الداتا:</label>
                  <select
                    value={newLeadSource}
                    onChange={e => setNewLeadSource(e.target.value as LeadSource)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                  >
                    <option value="اعلانات فيسبوك">اعلانات فيسبوك</option>
                    <option value="داتا خاصة">داتا خاصة</option>
                    <option value="اوت دور">اوت دور</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">الأولوية:</label>
                  <select
                    value={newLeadPriority}
                    onChange={e => setNewLeadPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                  >
                    <option value="عالي">عالي</option>
                    <option value="متوسط">متوسط</option>
                    <option value="منخفض">منخفض</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">ملاحظات أولية:</label>
                <input
                  type="text"
                  placeholder="ملاحظات العميل الخارجي..."
                  value={newLeadNotes}
                  onChange={e => setNewLeadNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#0B3B26]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3B26] text-amber-300 font-bold rounded-xl hover:bg-[#072619] transition"
                >
                  إضافة وتخصيص الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
