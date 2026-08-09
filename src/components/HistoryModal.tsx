import React from 'react';
import { ClientLead } from '../types';
import { History, X, Phone, User, Calendar, Clock, Sparkles } from 'lucide-react';

interface HistoryModalProps {
  client: ClientLead | null;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-500/30 shadow-2xl text-right space-y-4 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0B3B26] text-white rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">سجل المحادثات والتفاعلات السابق</h3>
              <p className="text-xs text-gray-500">للعميل: {client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Info Badge */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-wrap justify-between gap-2">
          <span><strong>الهاتف:</strong> <span className="font-mono dir-ltr inline-block">{client.phone}</span></span>
          <span><strong>المشروع:</strong> {client.projectName}</span>
          <span><strong>مصدر الداتا:</strong> {client.source}</span>
          <span><strong>المسؤول:</strong> {client.assignedUserName}</span>
        </div>

        {/* History Timeline */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-800 text-xs">جدول الحركات والملاحظات المسجلة:</h4>

          {!client.notesHistory || client.notesHistory.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500 text-xs">
              <p className="font-medium">الملاحظات الحالية المسجلة:</p>
              <p className="font-bold text-gray-800 mt-1">{client.notes || 'لا توجد ملاحظات سابقة مدونة'}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {client.notesHistory.map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-bold text-emerald-900">{item.authorName}</span>
                    <span className="font-mono">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-900 font-bold rounded-md">
                      {item.status}
                    </span>
                    <p className="text-gray-800 text-xs font-medium leading-relaxed">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t text-left">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B3B26] text-white font-bold rounded-xl text-xs hover:bg-emerald-800"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
