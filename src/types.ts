export type UserRole = 'ADMIN' | 'SALES_REP';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  assignedProject?: string; // اسم المشروع الأساسي الموكل إليه
  activeStatus: 'active' | 'inactive';
  dailyQuota?: number; // عدد الأرقام اليومية المخصصة (افتراضي 100)
  createdAt: string;
}

export type CallStatus = 
  | 'مش مهتم' 
  | 'مغلق' 
  | 'غير متاح' 
  | 'قفل الخط في وشي' 
  | 'هرجع اكلمه تاني' 
  | 'مشغول دلوقتي' 
  | 'مهتم'
  | 'جديد';

export type LeadSource = 'اعلانات فيسبوك' | 'داتا خاصة' | 'اوت دور';

export type PriorityLevel = 'عالي' | 'متوسط' | 'منخفض';

export interface InteractionNote {
  id: string;
  date: string;
  status: CallStatus;
  note: string;
  authorName: string;
}

export interface ClientLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  priority: PriorityLevel;
  lastInteractionDate: string;
  status: CallStatus;
  source: LeadSource;
  projectName: string;
  assignedUserId: string; // ID اليوزر المخصص له العميل
  assignedUserName: string;
  followUpDate?: string; // YYYY-MM-DD
  followUpTime?: string; // HH:mm
  notes?: string;
  notesHistory?: InteractionNote[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  totalLeads: number;
  activeLeads: number;
  status: 'متاح للبيع' | 'مباع بالكامل' | 'قيد الإنشاء';
  imageUrl?: string;
}

export interface LeadSchedulePlan {
  id: string;
  userId: string;
  userName: string;
  planType: '7_DAYS' | '30_DAYS'; // جدولة أسبوعية أم شهرية
  dailyQuota: number; // عدد الأرقام/العملاء يومياً (مثلاً 100)
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalLeadsAllocated: number;
  notes?: string;
  createdAt: string;
}

export interface ActivityReport {
  userId: string;
  userName: string;
  totalCalls: number;
  interestedCount: number;
  callbackCount: number;
  closedCount: number;
  notInterestedCount: number;
  unreachableCount: number;
  hungUpCount: number;
  busyCount: number;
  pendingFollowUps: number;
}

export interface CloudStorageConfig {
  provider: 'Google Drive' | 'OneDrive' | 'Dropbox' | 'Server Storage';
  isConnected: boolean;
  autoSync: boolean;
  lastSyncTime?: string;
  driveFolderUrl?: string;
  storageUsedMB: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'followup' | 'assignment' | 'system' | 'security';
  isRead: boolean;
  clientId?: string;
}
