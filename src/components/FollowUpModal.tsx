import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ClientLead } from '../types';
import { Calendar, Clock, CheckCircle, X, Sparkles } from 'lucide-react';

interface FollowUpModalProps {
  client: ClientLead | null;
  onClose: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({ client, onClose }) => {
  const { scheduleFollowUp } = useApp();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (client) {
      // Default to tomorrow if not set
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];

      setDate(client.followUpDate || defaultDateStr);
      setTime(client.followUpTime || '14:00');
      setNotes('');
    }
  }, [client]);

  if (!client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    scheduleFollowUp(client.id, date, time, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-amber-500/30 shadow-2xl text-right space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">تحديد ميعاد الفولو اب (المتابعة)</h3>
              <p className="text-xs text-gray-500">للتواصل مع العميل: {client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Details Summary */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <p><strong>رقم العميل:</strong> <span className="font-mono dir-ltr inline-block">{client.phone}</span></p>
          <p><strong>المشروع:</strong> {client.projectName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">تاريخ المتابعة:</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">وقت المتابعة المفصل:</label>
            <input
              type="time"
              required
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">ملاحظات الكول / سبب الفولو اب:</label>
            <textarea
              rows={3}
              placeholder="مثال: طلب الاطلاع على المساحات المتاحة وأسعار الكاش والتقسيط لمشروع Wada Bay رأس الحكمة..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
            />
          </div>

          <div className="pt-3 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0B3B26] text-white font-bold rounded-xl hover:bg-emerald-800 shadow-md"
            >
              تأكيد وحفظ الموعد
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
