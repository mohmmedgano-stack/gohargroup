import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CloudCheck,
  CloudUpload,
  RefreshCw,
  HardDrive,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Download,
  Lock,
} from 'lucide-react';

export const CloudSyncView: React.FC = () => {
  const { cloudConfig, updateCloudConfig, triggerManualSync, canExport, currentUser } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerManualSync();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1A1D23] text-slate-100 p-5 rounded-lg border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudCheck className="w-5 h-5 text-[#C5A059]" />
            <h1 className="text-base font-bold text-[#C5A059]">
              التكامل مع خدمات التخزين السحابي (Cloud Storage Sync)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ربط ومزامنة شيتات البيانات تلقائياً مع Google Drive لمنع فقدان البيانات وضمان التخزين الآمن.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-3.5 py-1.5 bg-[#C5A059] text-[#0F1115] hover:bg-[#d8b36c] font-bold text-xs rounded shadow transition flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن مع Google Drive'}</span>
        </button>
      </div>

      {/* Cloud Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Provider Status */}
        <div className="bg-[#1A1D23] p-4 rounded-lg border border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">مزود الخدمة السحابية</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-400 rounded border border-emerald-800">
              ● متصل بنجاح
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 text-[#C5A059] rounded border border-slate-700">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-xs">{cloudConfig.provider}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">الحساب المؤسسي لشركة جوهر</p>
            </div>
          </div>
        </div>

        {/* Card 2: Last Sync Time */}
        <div className="bg-[#1A1D23] p-4 rounded-lg border border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">تاريخ آخر مزامنة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-xs">{cloudConfig.lastSyncTime || 'الآن'}</h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">المزامنة التلقائية مفعلة كل ساعة</p>
          </div>
        </div>

        {/* Card 3: Storage Capacity */}
        <div className="bg-[#1A1D23] p-4 rounded-lg border border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">المساحة المستهلكة</span>
            <span className="text-xs font-mono font-bold text-[#C5A059]">{cloudConfig.storageUsedMB} MB</span>
          </div>
          <div className="w-full bg-[#0F1115] rounded-full h-2 overflow-hidden border border-slate-800">
            <div className="bg-[#C5A059] h-2 rounded-full" style={{ width: '12%' }} />
          </div>
          <p className="text-[10px] text-slate-500">15 GB مساحة مجانية متبقية في السحابة</p>
        </div>

      </div>

      {/* Cloud Link & Download Manager */}
      <div className="bg-[#1A1D23] p-4 rounded-lg border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#C5A059]" />
            <h2 className="text-sm font-bold text-slate-100">مجلد Google Drive الخارجي للنسخ الاحتياطية</h2>
          </div>
        </div>

        <div className="p-3 bg-[#0F1115] rounded border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-7 h-7 text-[#C5A059]" />
            <div>
              <p className="font-bold text-slate-200 text-xs">مجلد الشيتات وقواعد البيانات / Gohar_Group_CRM_Backups</p>
              <p className="text-slate-400 font-mono dir-ltr text-right text-[10px] mt-0.5">
                {cloudConfig.driveFolderUrl}
              </p>
            </div>
          </div>

          <a
            href={cloudConfig.driveFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 bg-[#C5A059] text-[#0F1115] hover:bg-[#d8b36c] font-bold rounded transition flex items-center gap-1.5 shrink-0"
          >
            <span>فتح المجلد بالسحابة</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Security Alert for Cloud Exports */}
        {!canExport && (
          <div className="p-2.5 bg-[#C5A059]/10 border border-[#C5A059]/30 text-amber-200 rounded text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>تنزل النسخ الاحتياطية وتصدير الداتا مقتصر فقط على مدير النظام (الأدمن).</span>
          </div>
        )}
      </div>

    </div>
  );
};
