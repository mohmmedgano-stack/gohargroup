import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientLead } from '../types';
import {
  Clock,
  Calendar,
  Phone,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';

interface FollowUpScheduleProps {
  onSelectClientForFollowUp: (client: ClientLead) => void;
  onOpenHistoryModal: (client: ClientLead) => void;
}

export const FollowUpSchedule: React.FC<FollowUpScheduleProps> = ({
  onSelectClientForFollowUp,
  onOpenHistoryModal,
}) => {
  const { visibleClients, updateClientStatus } = useApp();

  const [filterDate, setFilterDate] = useState<'TODAY' | 'UPCOMING' | 'ALL'>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter clients with scheduled follow-ups
  const followUpClients = visibleClients
    .filter(c => c.followUpDate && c.followUpDate.length > 0)
    .filter(c => {
      if (filterDate === 'TODAY') return c.followUpDate === todayStr;
      if (filterDate === 'UPCOMING') return c.followUpDate && c.followUpDate >= todayStr;
      return true;
    })
    .sort((a, b) => {
      const dateA = `${a.followUpDate} ${a.followUpTime || '00:00'}`;
      const dateB = `${b.followUpDate} ${b.followUpTime || '00:00'}`;
      return dateA.localeCompare(dateB);
    });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1A1D23] text-slate-100 p-5 rounded-lg border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C5A059]" />
            <h1 className="text-base font-bold text-[#C5A059]">
              جدول مواعيد الفولو اب المجدولة للعملاء المهتمين
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            متابعة جميع التكليفات والمواعيد المؤكدة مع العملاء لضمان عدم ضياع أي فرصة بيعية.
          </p>
        </div>

        {/* Date Quick Filter */}
        <div className="flex items-center gap-1 bg-[#0F1115] p-1 rounded border border-slate-800">
          <button
            onClick={() => setFilterDate('TODAY')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
              filterDate === 'TODAY' ? 'bg-[#C5A059] text-[#0F1115]' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            مواعيد اليوم
          </button>
          <button
            onClick={() => setFilterDate('UPCOMING')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
              filterDate === 'UPCOMING' ? 'bg-[#C5A059] text-[#0F1115]' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            المواعيد القادمة
          </button>
          <button
            onClick={() => setFilterDate('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
              filterDate === 'ALL' ? 'bg-[#C5A059] text-[#0F1115]' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            جميع المواعيد ({visibleClients.filter(c => c.followUpDate).length})
          </button>
        </div>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {followUpClients.length === 0 ? (
          <div className="col-span-full p-10 bg-[#1A1D23] rounded-lg border border-slate-800 text-center text-slate-500 space-y-2">
            <Clock className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-bold text-slate-200 text-sm">لا توجد مواعيد فولو اب تطابق هذا الفلتر حالياً</p>
            <p className="text-xs text-slate-500">يمكنك جدولة موعد فولو اب جديد عبر ضغط زر "مهتم" أو "هرجع اكلمه" في شيت العملاء</p>
          </div>
        ) : (
          followUpClients.map(client => {
            const isToday = client.followUpDate === todayStr;

            return (
              <div
                key={client.id}
                className={`p-4 rounded-lg border bg-[#1A1D23] shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                  isToday ? 'border-[#C5A059] ring-1 ring-[#C5A059]/20 bg-[#C5A059]/5' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs">{client.name}</h3>
                      <a
                        href={`tel:${client.phone}`}
                        className="text-xs font-mono dir-ltr text-slate-400 hover:text-[#C5A059] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{client.phone}</span>
                      </a>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        isToday
                          ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 animate-pulse'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {isToday ? '🔔 موعد اليوم' : 'قادم'}
                    </span>
                  </div>

                  {/* Date & Time Badge */}
                  <div className="mt-3 p-2.5 bg-[#0F1115] rounded border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="font-bold text-slate-200">{client.followUpDate}</span>
                    </div>
                    {client.followUpTime && (
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#C5A059]">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{client.followUpTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Project & Sales Rep details */}
                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{client.projectName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>المسؤول: {client.assignedUserName}</span>
                    </div>

                    {client.notes && (
                      <p className="mt-2 text-[11px] text-slate-300 bg-[#0F1115] p-2 rounded line-clamp-2 border border-slate-800">
                        {client.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenHistoryModal(client)}
                    className="text-xs text-slate-400 hover:text-slate-200 font-medium"
                  >
                    السجل
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectClientForFollowUp(client)}
                      className="px-2.5 py-1 text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold rounded transition"
                    >
                      تعديل الموعد
                    </button>
                    <button
                      onClick={() => updateClientStatus(client.id, 'مهتم')}
                      className="px-2.5 py-1 text-xs bg-[#C5A059] text-[#0F1115] hover:bg-[#d8b36c] font-bold rounded transition"
                    >
                      تم التواصل
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
