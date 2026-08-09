import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeadSource, PriorityLevel, CallStatus } from '../types';
import { UserPlus, X, Building, Phone, Mail, MapPin, Tag } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient, projects, users, currentUser } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('القاهرة');
  const [priority, setPriority] = useState<PriorityLevel>('متوسط');
  const [source, setSource] = useState<LeadSource>('اعلانات فيسبوك');
  const [projectName, setProjectName] = useState(projects[0]?.name || 'Wada Bay رأس الحكمة');
  const [assignedUserId, setAssignedUserId] = useState(currentUser.id);
  const [status, setStatus] = useState<CallStatus>('جديد');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const assignedUserObj = users.find(u => u.id === assignedUserId) || currentUser;

    addClient({
      name,
      phone,
      email,
      address,
      priority,
      source,
      projectName,
      assignedUserId: assignedUserObj.id,
      assignedUserName: assignedUserObj.name,
      status,
      lastInteractionDate: new Date().toISOString().split('T')[0],
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-500/30 shadow-2xl text-right space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0B3B26] text-white rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">إضافة عميل جديد لشيت جوهر جروب</h3>
              <p className="text-xs text-gray-500">إدخال بيانات العميل ومصدر الداتا والمشروع</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">اسم العميل الثلاثي: *</label>
            <input
              type="text"
              required
              placeholder="مثال: المهندس أحمد سلامة"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">رقم الهاتف: *</label>
              <input
                type="text"
                required
                placeholder="010XXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">البريد الإلكتروني:</label>
              <input
                type="email"
                placeholder="client@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">مصدر الداتا: *</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as LeadSource)}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
              >
                <option value="اعلانات فيسبوك">اعلانات فيسبوك</option>
                <option value="داتا خاصة">داتا خاصة</option>
                <option value="اوت دور">اوت دور</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">مستوى الأولوية:</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
              >
                <option value="عالي">عالي 🔥</option>
                <option value="متوسط">متوسط</option>
                <option value="منخفض">منخفض</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">اسم المشروع المستهدف: *</label>
            <select
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
            >
              {projects.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {currentUser.role === 'ADMIN' && (
            <div>
              <label className="block text-gray-700 font-bold mb-1">تخصيص العميل لموظف مبيعات:</label>
              <select
                value={assignedUserId}
                onChange={e => setAssignedUserId(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role === 'ADMIN' ? 'المدير' : 'موظف مبيعات'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-1">العنوان والمحافظة:</label>
            <input
              type="text"
              placeholder="مثال: التجمع الخامس - القاهرة"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B3B26]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">ملاحظات أولية:</label>
            <textarea
              rows={2}
              placeholder="أي تفاصيل خاصة باهتمامات العميل..."
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
              حفظ وإضافة للشيت
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
