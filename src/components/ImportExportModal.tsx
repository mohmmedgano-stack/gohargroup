import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  Upload,
  FileSpreadsheet,
  Lock,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCode,
  Users,
  Building,
  Link,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const {
    canExport,
    canImport,
    visibleClients,
    importClientsFromCSV,
    users,
    projects,
    currentUser,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode Selection: 'file' | 'google-sheet' | 'text' | 'export'
  const [activeTab, setActiveTab] = useState<'file' | 'google-sheet' | 'text' | 'export'>('file');

  // Import Targets
  const salesUsers = users.filter(u => u.role === 'SALES_REP');
  const [selectedSalesRepId, setSelectedSalesRepId] = useState<string>('ROUND_ROBIN');
  const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.name || 'جميع المشاريع');

  // File Upload State
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>('');
  const [rawTextData, setRawTextData] = useState<string>('');

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ success?: boolean; text?: string }>({});

  if (!isOpen) return null;

  // 1. File Parser (Excel .xlsx / .xls or CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatusMessage({});
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = evt => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          setParsedRows(data);
          setStatusMessage({ success: true, text: `تم قراءة ملف إكسل بنجاح (${data.length.toLocaleString('ar-EG')} صف جاهز للاستيراد)` });
        } catch (err) {
          setStatusMessage({ success: false, text: 'حدث خطأ أثناء قراءة ملف الإكسل' });
        }
      };
      reader.readAsBinaryString(file);
    } else {
      // CSV or TXT
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
          setParsedRows(results.data);
          setStatusMessage({ success: true, text: `تم قراءة الملف بنجاح (${results.data.length.toLocaleString('ar-EG')} صف جاهز للاستيراد)` });
        },
        error: () => {
          setStatusMessage({ success: false, text: 'حدث خطأ أثناء قراءة ملف CSV' });
        },
      });
    }
  };

  // 2. Fetch or Parse Google Sheets CSV URL
  const handleGoogleSheetsParse = () => {
    if (!googleSheetUrl) return;
    setStatusMessage({ success: true, text: 'جاري جلب وقراءة بيانات جوجل شيت...' });

    // Extract CSV link or parse raw string
    let url = googleSheetUrl.trim();
    if (url.includes('docs.google.com/spreadsheets')) {
      // Convert view link to export csv link if needed
      if (!url.includes('/export?format=csv') && !url.includes('/pub?output=csv')) {
        url = url.replace(/\/edit.*$/, '/export?format=csv');
      }
    }

    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => {
        if (results.data && results.data.length > 0) {
          setParsedRows(results.data);
          setStatusMessage({ success: true, text: `تم ربط وجلب شيت جوجل بنجاح (${results.data.length.toLocaleString('ar-EG')} عميل)` });
        } else {
          setStatusMessage({ success: false, text: 'لم يتم العثور على أسطر بيانات في الرابط المرفق' });
        }
      },
      error: () => {
        setStatusMessage({
          success: false,
          text: 'تعذر الاتصال برابط الشيت المباشر. يرجى التأكد أن الشيت متاح للجميع (Public/Anyone with link) أو لصق البيانات يدوياً.',
        });
      },
    });
  };

  // 3. Process Large Scale Import (Batch Execution)
  const handleExecuteImport = async () => {
    let rowsToImport: any[] = [];

    if (activeTab === 'text') {
      const lines = rawTextData.trim().split('\n');
      rowsToImport = lines.map((line, idx) => {
        const parts = line.split(/[,;\t]/).map(s => s.trim().replace(/^"|"$/g, ''));
        return {
          'اسم العميل': parts[0] || `عميل ${idx + 1}`,
          'رقم الهاتف': parts[1] || '01000000000',
          'البريد الإلكتروني': parts[2] || '',
          'العنوان': parts[3] || 'القاهرة',
          'المشروع': parts[4] || selectedProject,
          'ملاحظات': parts[5] || 'استيراد سريع',
        };
      });
    } else {
      rowsToImport = parsedRows;
    }

    if (!rowsToImport || rowsToImport.length === 0) {
      setStatusMessage({ success: false, text: 'الرجاء اختيار ملف أو إدخال بيانات أولاً' });
      return;
    }

    setIsProcessing(true);
    setProgressPercent(0);
    setProcessedCount(0);

    const total = rowsToImport.length;

    // Simulate high-speed multi-threaded batching for huge files
    const step = Math.max(1, Math.floor(total / 20));
    let current = 0;

    const interval = setInterval(() => {
      current += step;
      if (current >= total) {
        current = total;
        clearInterval(interval);

        // Normalize rows for AppContext
        const formattedData = rowsToImport.map((row, idx) => {
          // Determine assigned user
          let assignedUser = salesUsers[0] || currentUser;
          if (selectedSalesRepId === 'ROUND_ROBIN' && salesUsers.length > 0) {
            assignedUser = salesUsers[idx % salesUsers.length];
          } else if (selectedSalesRepId !== 'ROUND_ROBIN') {
            const found = salesUsers.find(u => u.id === selectedSalesRepId);
            if (found) assignedUser = found;
          }

          // Auto map columns
          const clientName =
            row['اسم العميل'] || row['Name'] || row['Full Name'] || row['الاسم'] || row['عميل'] || Object.values(row)[0] || 'عميل جديد';
          const clientPhone =
            row['رقم الهاتف'] || row['Phone'] || row['Mobile'] || row['الهاتف'] || row['الموبايل'] || row['رقم الموبايل'] || Object.values(row)[1] || '01000000000';
          const clientProject = row['المشروع'] || row['Project'] || selectedProject;
          const clientSource = row['المصدر'] || row['Source'] || 'داتا خاصة';

          return {
            name: String(clientName),
            phone: String(clientPhone),
            email: row['البريد الإلكتروني'] || row['Email'] || '',
            address: row['العنوان'] || row['Address'] || 'القاهرة',
            status: row['الحالة'] || row['Status'] || 'جديد',
            projectName: clientProject,
            source: clientSource,
            priority: row['الأولوية'] || 'متوسط',
            assignedUserId: assignedUser.id,
            assignedUserName: assignedUser.name,
            notes: row['ملاحظات'] || `داتا مستوردة وتعيينها للموظف ${assignedUser.name}`,
          };
        });

        // Add to global state
        const result = importClientsFromCSV(formattedData);

        setIsProcessing(false);
        setProgressPercent(100);
        setProcessedCount(total);
        setStatusMessage({
          success: true,
          text: `🎉 تم استيراد وتخصيص ${total.toLocaleString('ar-EG')} عميل بنجاح وتحويلهم تلقائياً لشيت الموظف المستهدف!`,
        });

        // Reset state
        setParsedRows([]);
        setRawTextData('');
      } else {
        setProcessedCount(current);
        setProgressPercent(Math.round((current / total) * 100));
      }
    }, 80);
  };

  // 4. Export CSV / Excel
  const handleExportCSV = () => {
    if (!canExport) return;

    const headers = [
      'اسم العميل',
      'رقم الهاتف',
      'البريد الإلكتروني',
      'العنوان',
      'الحالة',
      'المشروع',
      'مصدر الداتا',
      'الأولوية',
      'الموظف المسؤول',
      'ميعاد الفولو اب',
      'الملاحظات',
    ];

    const rows = visibleClients.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.address}"`,
      `"${c.status}"`,
      `"${c.projectName}"`,
      `"${c.source}"`,
      `"${c.priority}"`,
      `"${c.assignedUserName}"`,
      `"${c.followUpDate || ''} ${c.followUpTime || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Gohar_Group_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A1D23] text-slate-100 rounded-lg max-w-2xl w-full p-6 border border-slate-800 shadow-2xl text-right space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0F1115] text-[#C5A059] rounded border border-slate-800">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#C5A059] text-base">
                مركز استيراد الداتا الضخمة (Million Leads Import Center)
              </h3>
              <p className="text-xs text-slate-400">
                رفع واستيراد شيتات الإكسل والجوجل شيت وتوجيهها مباشرة إلى المبيعات
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!canImport ? (
          <div className="p-6 text-center text-red-400 bg-red-950/30 rounded border border-red-900/40 space-y-2">
            <Lock className="w-10 h-10 mx-auto text-red-400" />
            <h4 className="font-bold text-sm">خاصية التصدير والاستيراد مقتصرة فقط على أدمن النظام</h4>
            <p className="text-xs text-slate-400">
              حسب سياسة أمان شركة جوهر جروب، لا يملك الموظفون الفرعيون صلاحية تصدير الداتا لتجنب التسريب.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            
            {/* Main Tabs Navigation */}
            <div className="flex items-center gap-1 bg-[#0F1115] p-1 rounded border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('file')}
                className={`flex-1 py-2 px-3 rounded font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'file' ? 'bg-[#C5A059] text-[#0F1115]' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع ملف Excel / CSV</span>
              </button>

              <button
                onClick={() => setActiveTab('google-sheet')}
                className={`flex-1 py-2 px-3 rounded font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'google-sheet' ? 'bg-[#C5A059] text-[#0F1115]' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>رابط Google Sheet</span>
              </button>

              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2 px-3 rounded font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'text' ? 'bg-[#C5A059] text-[#0F1115]' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>لصق أرقام مجمعة</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`flex-1 py-2 px-3 rounded font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'export' ? 'bg-[#C5A059] text-[#0F1115]' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير الشيت</span>
              </button>
            </div>

            {/* Target Assignment Controls (Shown for all import tabs) */}
            {activeTab !== 'export' && (
              <div className="p-3 bg-[#0F1115] rounded border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs">
                  <Users className="w-4 h-4" />
                  <span>تحديد الموظف وتخصيص الداتا المستوردة تلقائياً:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">يوزر المبيعات المستلم للداتا:</label>
                    <select
                      value={selectedSalesRepId}
                      onChange={e => setSelectedSalesRepId(e.target.value)}
                      className="w-full p-2 bg-[#1A1D23] border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="ROUND_ROBIN">🔄 توزيع آلي بالتساوي على كافة فريق المبيعات</option>
                      {salesUsers.map(u => (
                        <option key={u.id} value={u.id}>
                          💼 {u.name} ({u.assignedProject || 'جميع المشاريع'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">تخصيص للمشروع العقاري:</label>
                    <select
                      value={selectedProject}
                      onChange={e => setSelectedProject(e.target.value)}
                      className="w-full p-2 bg-[#1A1D23] border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-[#C5A059]"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.name}>
                          🏢 {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: FILE UPLOAD */}
            {activeTab === 'file' && (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-[#C5A059] bg-[#0F1115] p-8 rounded text-center cursor-pointer transition space-y-2"
                >
                  <FileSpreadsheet className="w-10 h-10 text-[#C5A059] mx-auto" />
                  <p className="font-bold text-slate-200 text-xs">
                    اضغط هنا لاختيار ملف Excel (.xlsx, .xls) أو CSV من جهازك
                  </p>
                  <p className="text-[11px] text-slate-500">
                    يدعم الشيتات الضخمة التي تحتوي على آلاف وملايين أرقام العملاء.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv, .txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {fileName && (
                  <div className="p-2.5 bg-[#0F1115] border border-slate-800 rounded flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-mono">📁 {fileName}</span>
                    <span className="text-[#C5A059] font-bold">
                      {parsedRows.length > 0 ? `${parsedRows.length.toLocaleString('ar-EG')} صف` : 'جاهز'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GOOGLE SHEETS LINK */}
            {activeTab === 'google-sheet' && (
              <div className="space-y-3">
                <p className="text-slate-400 text-xs">
                  ضع رابط شيت جوجل المباشر (Google Sheets URL) ليتم جلب وتفريغ البيانات فورياً:
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/12345/edit#gid=0"
                    value={googleSheetUrl}
                    onChange={e => setGoogleSheetUrl(e.target.value)}
                    className="flex-1 p-2.5 bg-[#0F1115] border border-slate-800 rounded text-slate-100 font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={handleGoogleSheetsParse}
                    className="px-4 py-2.5 bg-slate-800 text-slate-200 font-bold rounded hover:bg-slate-700 shrink-0"
                  >
                    قراءة الشيت
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: PASTE RAW TEXT */}
            {activeTab === 'text' && (
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs">
                  لصق أرقام وأسماء العملاء (كل سطر يحتوي على: الاسم, الهاتف, البريد, العنوان, المشروع):
                </label>
                <textarea
                  rows={5}
                  placeholder={`أحمد عبد العزيز, 01012345678, ahmed@gmail.com, المعادي, Wada Bay رأس الحكمة\nمحمود كمال, 01198765432, mahmoud@yahoo.com, المنصورة, مول الهابي لاند الطبي Health Capital`}
                  value={rawTextData}
                  onChange={e => setRawTextData(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-slate-800 rounded text-slate-200 font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            )}

            {/* TAB 4: EXPORT SECTION */}
            {activeTab === 'export' && (
              <div className="p-5 bg-[#0F1115] rounded border border-slate-800 space-y-4 text-center">
                <Download className="w-10 h-10 text-[#C5A059] mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">تنزيل وتصدير شيت العملاء الحالي</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    تصدير كافة أسطر وحالات ومتابعات العملاء في شيت Excel / CSV جاهز للتحليل.
                  </p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="w-full py-3 bg-[#C5A059] text-[#0F1115] font-bold rounded hover:bg-[#d8b36c] transition shadow flex items-center justify-center gap-2 text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير ملف Excel الآن ({visibleClients.length} عميل)</span>
                </button>
              </div>
            )}

            {/* Progress Bar during Batch processing */}
            {isProcessing && (
              <div className="p-4 bg-[#0F1115] border border-[#C5A059]/40 rounded space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#C5A059]">
                  <span>جاري المعالجة والتوزيع للعملاء...</span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#C5A059] h-2 transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center font-mono">
                  تم معالجة {processedCount.toLocaleString('ar-EG')} سطر...
                </p>
              </div>
            )}

            {/* Status Messages */}
            {statusMessage.text && (
              <div
                className={`p-3 rounded border text-xs font-bold ${
                  statusMessage.success
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                    : 'bg-red-950/60 text-red-400 border-red-800'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {/* Execute Button */}
            {activeTab !== 'export' && (
              <button
                onClick={handleExecuteImport}
                disabled={
                  isProcessing ||
                  (activeTab === 'file' && parsedRows.length === 0) ||
                  (activeTab === 'google-sheet' && parsedRows.length === 0) ||
                  (activeTab === 'text' && !rawTextData.trim())
                }
                className="w-full py-3 bg-[#C5A059] text-[#0F1115] font-bold rounded hover:bg-[#d8b36c] transition shadow disabled:opacity-50 text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  تأكيد استيراد وتخصيص الداتا ليوزر المبيعات (
                  {selectedSalesRepId === 'ROUND_ROBIN'
                    ? 'توزيع متساوي'
                    : salesUsers.find(u => u.id === selectedSalesRepId)?.name || 'الموظف المحدد'}
                  )
                </span>
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
