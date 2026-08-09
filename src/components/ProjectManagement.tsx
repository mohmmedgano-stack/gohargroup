import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import {
  Building2,
  Plus,
  MapPin,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Search,
  Image,
  Upload,
  Sparkles,
} from 'lucide-react';

const PRESET_PROJECT_IMAGES = [
  { name: 'كمبوند سكني فاخر', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600' },
  { name: 'أبراج فندقية ومودرن', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' },
  { name: 'مول تجاري وإداري', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600' },
  { name: 'منتجع وسياحة ساحلي', url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600' },
  { name: 'فلل مستقلة مودرن', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600' },
  { name: 'برج إداري شاهق', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600' },
];

export const ProjectManagement: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, clients, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'متاح للبيع' | 'مباع بالكامل' | 'قيد الإنشاء'>('متاح للبيع');
  const [imageUrl, setImageUrl] = useState('');

  const filteredProjects = projects.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setName('');
    setLocation('');
    setDescription('');
    setStatus('متاح للبيع');
    setImageUrl(PRESET_PROJECT_IMAGES[0].url);
    setShowAddModal(true);
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setName(proj.name);
    setLocation(proj.location);
    setDescription(proj.description);
    setStatus(proj.status);
    setImageUrl(proj.imageUrl || PRESET_PROJECT_IMAGES[0].url);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        name,
        location,
        description,
        status,
        imageUrl: imageUrl || PRESET_PROJECT_IMAGES[0].url,
      });
      setEditingProject(null);
    } else {
      addProject({
        name,
        location,
        description,
        status,
        imageUrl: imageUrl || PRESET_PROJECT_IMAGES[0].url,
      });
      setShowAddModal(false);
    }
  };

  // Handle local image file select
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImageUrl(evt.target.result as string);
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
            <Building2 className="w-5 h-5 text-[#C5A059]" />
            <h1 className="text-base font-bold text-[#C5A059]">
              إدارة مشاريع جوهر جروب للتطوير العقاري (Real Estate Projects Engine)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            تعديل أسماء المشاريع، إنشاء مشروع جديد، إضافة وتغيير صور المشروع المعمارية، ومتابعة عملاء كل مشروع.
          </p>
        </div>

        {currentUser.role === 'ADMIN' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#C5A059] text-[#0F1115] hover:bg-[#d8b36c] font-bold text-xs rounded shadow transition flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ إنشاء مشروع جديد</span>
          </button>
        )}
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1A1D23] p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">إجمالي المشاريع</span>
            <span className="text-lg font-bold font-mono text-[#C5A059]">{projects.length}</span>
          </div>
          <Building2 className="w-5 h-5 text-[#C5A059] opacity-80" />
        </div>

        <div className="bg-[#1A1D23] p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">المشاريع المتاحة للبيع</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {projects.filter(p => p.status === 'متاح للبيع').length}
            </span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#1A1D23] p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">إجمالي العملاء المسجلين</span>
            <span className="text-lg font-bold font-mono text-amber-300">{clients.length}</span>
          </div>
          <Users className="w-5 h-5 text-amber-400 opacity-80" />
        </div>

        <div className="bg-[#1A1D23] p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">العملاء المهتمين</span>
            <span className="text-lg font-bold font-mono text-emerald-300">
              {clients.filter(c => c.status === 'مهتم').length}
            </span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-300 opacity-80" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="تصفية المشاريع باسم المشروع أو الموقع..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-3 pr-9 py-2 text-xs bg-[#1A1D23] border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
        />
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map(proj => {
          const projectLeads = clients.filter(c => c.projectName === proj.name);
          const interestedLeads = projectLeads.filter(c => c.status === 'مهتم');

          return (
            <div
              key={proj.id}
              className="bg-[#1A1D23] rounded-lg border border-slate-800 overflow-hidden shadow-md space-y-3 hover:border-slate-700 transition flex flex-col justify-between group"
            >
              <div>
                {/* Project Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={proj.imageUrl || PRESET_PROJECT_IMAGES[0].url}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D23] via-transparent to-black/40" />

                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded border shadow-lg backdrop-blur-md ${
                      proj.status === 'متاح للبيع'
                        ? 'bg-emerald-950/90 text-emerald-400 border-emerald-700'
                        : proj.status === 'قيد الإنشاء'
                        ? 'bg-amber-950/90 text-amber-400 border-amber-700'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700'
                    }`}
                  >
                    {proj.status}
                  </span>

                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="text-[10px] text-amber-300 bg-black/60 px-2 py-0.5 rounded font-mono border border-amber-500/30">
                      مشروع جوهر جروب المعماري
                    </span>
                  </div>
                </div>

                {/* Project Header Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>{proj.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{proj.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0F1115] p-3 rounded border border-slate-800/80">
                    {proj.description || 'لا يوجد وصف تفصيلي مسجل للمشروع.'}
                  </p>

                  {/* Live Project Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-[#0F1115] p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">عملاء المشروع:</span>
                      <span className="font-bold text-[#C5A059] font-mono">{projectLeads.length} عميل</span>
                    </div>
                    <div className="bg-[#0F1115] p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">مهتمين مؤكدين:</span>
                      <span className="font-bold text-emerald-400 font-mono">{interestedLeads.length} عميل</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Controls */}
              {currentUser.role === 'ADMIN' && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleStartEdit(proj)}
                    className="px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 font-bold rounded transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>تعديل الاسم والصورة</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت محقق من حذف مشروع (${proj.name})؟`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="px-3 py-1.5 text-xs text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 font-bold rounded transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Project Modal */}
      {(showAddModal || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1D23] text-slate-100 rounded-lg max-w-lg w-full p-5 border border-slate-800 shadow-2xl text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-[#C5A059] text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C5A059]" />
                <span>{editingProject ? `تعديل مشروع: ${editingProject.name}` : 'إنشاء مشروع عقاري جديد'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProject(null);
                }}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم المشروع العقاري:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: جوهر زايد تاورز - الشيخ زايد"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الموقع والتفاصيل الجغرافية:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: التجمع الخامس - النرجس الجديدة"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">حالة البيع والمشروع:</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="متاح للبيع">متاح للبيع</option>
                  <option value="قيد الإنشاء">قيد الإنشاء</option>
                  <option value="مباع بالكامل">مباع بالكامل</option>
                </select>
              </div>

              {/* Project Image Selection Section */}
              <div className="p-3 bg-[#0F1115] rounded border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-[#C5A059]" />
                    <span>صورة المشروع المعمارية:</span>
                  </label>
                  <span className="text-[10px] text-slate-400">اختر صورة جاهزة أو ارفع صورة خاصة</span>
                </div>

                {/* Image Preview */}
                {imageUrl && (
                  <div className="relative h-28 w-full rounded overflow-hidden border border-slate-800">
                    <img src={imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/70 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono">
                      معاينة الصورة
                    </div>
                  </div>
                )}

                {/* Preset Options */}
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">نماذج صور هندسية جاهزة للمشروع:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_PROJECT_IMAGES.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setImageUrl(preset.url)}
                        className={`cursor-pointer rounded border overflow-hidden relative h-14 group transition ${
                          imageUrl === preset.url ? 'border-[#C5A059] ring-1 ring-[#C5A059]' : 'border-slate-800 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/80 text-slate-200 text-[9px] text-center py-0.5 truncate px-1">
                          {preset.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom URL or File Upload */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <input
                    type="url"
                    placeholder="أو ضع رابط صورة مخصص (URL)..."
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full p-2 bg-[#1A1D23] border border-slate-800 rounded text-slate-100 text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                  />

                  <label className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition text-xs font-bold border border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>رفع صورة مشروع جديدة من الجهاز</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLocalImageUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">وصف المشروع والمزايا الرئيسية:</label>
                <textarea
                  rows={3}
                  placeholder="مساحات الوحدات، أنظمة السداد، موعد التسليم..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] text-[#0F1115] font-bold rounded hover:bg-[#d8b36c]"
                >
                  حفظ بيانات المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
