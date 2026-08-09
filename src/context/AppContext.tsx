import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ClientLead,
  Project,
  CallStatus,
  LeadSource,
  PriorityLevel,
  CloudStorageConfig,
  SystemNotification,
  ActivityReport,
  LeadSchedulePlan,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_CLOUD_CONFIG,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  projects: Project[];
  clients: ClientLead[];
  visibleClients: ClientLead[];
  cloudConfig: CloudStorageConfig;
  notifications: SystemNotification[];
  unreadNotificationsCount: number;

  // Auth & Session
  isAuthenticated: boolean;
  loginUser: (user: User) => void;
  loginWithEmail: (email: string) => boolean;
  loginWithCredentials: (usernameOrEmail: string, passwordInput: string) => { success: boolean; message?: string };
  logoutUser: () => void;

  // Header Logo & Branding
  customLogoUrl: string | null;
  companyTitle: string;
  companySubtitle: string;
  updateLogoSettings: (logoUrl: string | null, title?: string, subtitle?: string) => void;

  // User Actions
  setCurrentUser: (user: User) => void;
  addUser: (newUser: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updatedData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Client Lead Actions
  updateClientStatus: (clientId: string, status: CallStatus, notes?: string) => void;
  scheduleFollowUp: (clientId: string, date: string, time: string, notes?: string) => void;
  addClient: (newClient: Omit<ClientLead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (clientId: string, updatedData: Partial<ClientLead>) => void;
  deleteClient: (clientId: string) => void;
  deleteSelectedClients: (clientIds: string[]) => void;
  clearAllClientsData: () => void;
  bulkAssignClients: (clientIds: string[], targetUserId: string, targetUserName: string) => void;
  
  // Security checks
  canExport: boolean;
  canImport: boolean;
  canManageUsers: boolean;
  
  // Import/Export
  importClientsFromCSV: (clientsData: any[]) => { success: boolean; count: number; message: string };

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Cloud Sync
  updateCloudConfig: (newConfig: Partial<CloudStorageConfig>) => void;
  triggerManualSync: () => Promise<void>;

  // Analytics, Quotas & Scheduling
  getPerformanceReports: () => ActivityReport[];
  schedulePlans: LeadSchedulePlan[];
  createSchedulePlan: (userId: string, planType: '7_DAYS' | '30_DAYS', dailyQuota: number, notes?: string) => void;
  deleteSchedulePlan: (id: string) => void;
  getDailyProgressForUser: (userId: string) => { callsToday: number; dailyQuota: number; percentage: number };
  allInteractions: {
    id: string;
    clientId: string;
    clientName: string;
    phone: string;
    authorName: string;
    status: CallStatus;
    note: string;
    date: string;
    projectName: string;
  }[];
  
  // Projects
  addProject: (project: Omit<Project, 'id' | 'totalLeads' | 'activeLeads'>) => void;
  updateProject: (id: string, updatedData: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or Fallback Mock Data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gohar_users');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const updatedParsed = parsed.map(u => {
          if (u.id === 'user-admin' || u.username === 'gohargroup') {
            return { ...u, username: 'gohargroup', password: 'gohargroup1234', role: 'ADMIN' as UserRole };
          }
          if (u.id === 'user-sales-gano' || u.username === 'gano') {
            return { ...u, username: 'gano', password: 'gano1234', role: 'SALES_REP' as UserRole };
          }
          return u;
        });

        // Ensure missing default users (Haidy01, Mai01, nada, etc.) are included
        INITIAL_USERS.forEach(initUser => {
          const exists = updatedParsed.some(u => u.username === initUser.username || u.id === initUser.id);
          if (!exists) {
            updatedParsed.push(initUser);
          }
        });

        return updatedParsed;
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('gohar_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) {}
    }
    return INITIAL_USERS[0]; // Admin default
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('gohar_is_logged_in');
    return saved === 'true'; // Requires login on initial visit or when logged out
  });

  // Logo & Branding Settings
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('gohar_custom_logo') || null;
  });

  const [companyTitle, setCompanyTitle] = useState<string>(() => {
    return localStorage.getItem('gohar_company_title') || 'جوهر جروب للتطوير العقاري';
  });

  const [companySubtitle, setCompanySubtitle] = useState<string>(() => {
    return localStorage.getItem('gohar_company_subtitle') || 'Gohar Group for Real Estate Development';
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('gohar_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [clients, setClients] = useState<ClientLead[]>(() => {
    const saved = localStorage.getItem('gohar_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [cloudConfig, setCloudConfig] = useState<CloudStorageConfig>(() => {
    const saved = localStorage.getItem('gohar_cloud_config');
    return saved ? JSON.parse(saved) : INITIAL_CLOUD_CONFIG;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('gohar_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [schedulePlans, setSchedulePlans] = useState<LeadSchedulePlan[]>(() => {
    const saved = localStorage.getItem('gohar_schedule_plans');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('gohar_schedule_plans', JSON.stringify(schedulePlans));
  }, [schedulePlans]);
  useEffect(() => {
    localStorage.setItem('gohar_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gohar_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gohar_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('gohar_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('gohar_cloud_config', JSON.stringify(cloudConfig));
  }, [cloudConfig]);

  useEffect(() => {
    localStorage.setItem('gohar_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gohar_is_logged_in', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (customLogoUrl) {
      localStorage.setItem('gohar_custom_logo', customLogoUrl);
    } else {
      localStorage.removeItem('gohar_custom_logo');
    }
  }, [customLogoUrl]);

  useEffect(() => {
    localStorage.setItem('gohar_company_title', companyTitle);
  }, [companyTitle]);

  useEffect(() => {
    localStorage.setItem('gohar_company_subtitle', companySubtitle);
  }, [companySubtitle]);

  // Auth Functions
  const loginUser = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    addNotification('تسجيل الدخول', `مرحباً بك مجدداً ${user.name} - تم الدخول إلى لوحة التحكم بنجاح.`, 'system');
  };

  const loginWithEmail = (email: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
      loginUser(foundUser);
      return true;
    }
    return false;
  };

  const loginWithCredentials = (usernameOrEmailInput: string, passwordInput: string): { success: boolean; message?: string } => {
    const cleanInput = usernameOrEmailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanInput) {
      return { success: false, message: 'يرجى إدخال اسم المستخدم' };
    }

    // Combine current state users and INITIAL_USERS
    const allUsersList = [...users];
    INITIAL_USERS.forEach(initU => {
      if (!allUsersList.some(u => u.username === initU.username || u.id === initU.id)) {
        allUsersList.push(initU);
      }
    });

    const foundUser = allUsersList.find(u =>
      (u.username && u.username.toLowerCase() === cleanInput) ||
      (u.email && u.email.toLowerCase() === cleanInput) ||
      (cleanInput === 'gohargroup' && (u.role === 'ADMIN' || u.id === 'user-admin')) ||
      (cleanInput === 'gano' && u.id === 'user-sales-gano')
    );

    if (!foundUser) {
      return { success: false, message: 'اسم المستخدم أو البريد الإلكتروني غير مسجل بالنظام' };
    }

    const expectedPassword = foundUser.password || (foundUser.role === 'ADMIN' ? 'gohargroup1234' : 'gano1234');
    if (cleanPassword !== expectedPassword) {
      return { success: false, message: 'كلمة السر غير صحيحة، يرجى إعادة المحاولة' };
    }

    loginUser(foundUser);
    return { success: true };
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.setItem('gohar_is_logged_in', 'false');
  };

  // Logo Settings Update
  const updateLogoSettings = (logoUrl: string | null, title?: string, subtitle?: string) => {
    setCustomLogoUrl(logoUrl);
    if (title !== undefined) setCompanyTitle(title);
    if (subtitle !== undefined) setCompanySubtitle(subtitle);
    addNotification('تحديث اللوجو والهيدر', 'تم تحديث وشعار جوهر جروب بنجاح.', 'system');
  };

  // Security & Role Permissions
  const canExport = currentUser.role === 'ADMIN';
  const canImport = currentUser.role === 'ADMIN';
  const canManageUsers = currentUser.role === 'ADMIN';

  // Filter clients visible to the current user
  const visibleClients = currentUser.role === 'ADMIN'
    ? clients
    : clients.filter(client => client.assignedUserId === currentUser.id);

  // Unread Notifications Count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Add notification helper
  const addNotification = (title: string, message: string, type: SystemNotification['type'], clientId?: string) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'الآن',
      type,
      isRead: false,
      clientId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Status Change Logic
  const updateClientStatus = (clientId: string, status: CallStatus, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          const newHistoryItem = notes
            ? {
                id: `note-${Date.now()}`,
                date: new Date().toLocaleString('ar-EG'),
                status,
                note: notes,
                authorName: currentUser.name,
              }
            : undefined;

          return {
            ...c,
            status,
            lastInteractionDate: today,
            updatedAt: today,
            notes: notes ? `${notes} (تحديث: ${new Date().toLocaleTimeString('ar-EG')})` : c.notes,
            notesHistory: newHistoryItem
              ? [newHistoryItem, ...(c.notesHistory || [])]
              : c.notesHistory,
          };
        }
        return c;
      })
    );

    // Notify user/admin if status changed to Interested or Follow Up
    if (status === 'مهتم') {
      addNotification('تغيير حالة عميل إلى مهتم', `تم تحديث حالة العميل للعميل المهتم بواسطة ${currentUser.name}`, 'followup', clientId);
    }
  };

  // Schedule Follow Up Date & Time
  const scheduleFollowUp = (clientId: string, date: string, time: string, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];

    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          const followUpNote = `ميعاد فولو اب: ${date} الساعة ${time}${notes ? ` - ${notes}` : ''}`;
          
          return {
            ...c,
            status: c.status === 'جديد' ? 'هرجع اكلمه تاني' : c.status,
            followUpDate: date,
            followUpTime: time,
            lastInteractionDate: today,
            updatedAt: today,
            notes: c.notes ? `${c.notes}\n[${followUpNote}]` : followUpNote,
            notesHistory: [
              {
                id: `note-${Date.now()}`,
                date: new Date().toLocaleString('ar-EG'),
                status: c.status,
                note: followUpNote,
                authorName: currentUser.name,
              },
              ...(c.notesHistory || []),
            ],
          };
        }
        return c;
      })
    );

    addNotification(
      'جدولة فولو اب جديد',
      `تم جدولة متابعة بتاريخ ${date} الساعة ${time} بواسطة ${currentUser.name}`,
      'followup',
      clientId
    );
  };

  // Add Client
  const addClient = (newClientData: Omit<ClientLead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newClient: ClientLead = {
      ...newClientData,
      id: `lead-${Date.now()}`,
      createdAt: today,
      updatedAt: today,
    };

    setClients(prev => [newClient, ...prev]);

    // Update Project lead count
    setProjects(prev =>
      prev.map(p =>
        p.name === newClientData.projectName
          ? { ...p, totalLeads: p.totalLeads + 1, activeLeads: p.activeLeads + 1 }
          : p
      )
    );

    addNotification('إضافة عميل جديد', `تم إضافة العميل (${newClient.name}) بنجاح للمشروع ${newClient.projectName}`, 'system', newClient.id);
  };

  // Update Client
  const updateClient = (clientId: string, updatedData: Partial<ClientLead>) => {
    const today = new Date().toISOString().split('T')[0];
    setClients(prev =>
      prev.map(c => (c.id === clientId ? { ...c, ...updatedData, updatedAt: today } : c))
    );
  };

  // Delete Client (Admin only or authorized)
  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  // Delete Batch of Selected Clients
  const deleteSelectedClients = (clientIds: string[]) => {
    if (clientIds.length === 0) return;
    setClients(prev => prev.filter(c => !clientIds.includes(c.id)));
    addNotification('مسح عملاء محددين', `تم مسح ${clientIds.length} عميل بنجاح من الشيت`, 'system');
  };

  // Clear All Clients Data / Wipe Sheet
  const clearAllClientsData = () => {
    setClients([]);
    localStorage.removeItem('gohar_clients');
    addNotification('مسح الشيت بالكامل', 'تم تفريغ مسح جميع بيانات الداتا من الشيت بنجاح', 'system');
  };

  // Bulk Assign Clients (Admin Feature)
  const bulkAssignClients = (clientIds: string[], targetUserId: string, targetUserName: string) => {
    if (!canManageUsers) return;

    setClients(prev =>
      prev.map(c => {
        if (clientIds.includes(c.id)) {
          return {
            ...c,
            assignedUserId: targetUserId,
            assignedUserName: targetUserName,
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );

    addNotification(
      'توزيع عملاء جديد',
      `تم إعادة تخصيص ${clientIds.length} عميل إلى الموظف ${targetUserName}`,
      'assignment'
    );
  };

  // User Management Actions
  const addUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    if (!canManageUsers) return;
    const user: User = {
      ...newUser,
      id: `user-sales-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, user]);
    addNotification('إضافة موظف جديد', `تم إنشاء حساب جديد للموظف (${user.name}) بصفة ${user.role === 'ADMIN' ? 'مدير' : 'موظف مبيعات'}`, 'system');
  };

  const updateUser = (id: string, updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updatedData } : u)));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  const deleteUser = (id: string) => {
    if (!canManageUsers || id === currentUser.id) return; // Prevent deleting oneself
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Import Clients from CSV (Admin Only)
  const importClientsFromCSV = (clientsData: any[]) => {
    if (!canImport) {
      return { success: false, count: 0, message: 'عفواً، خاصية الاستيراد مقتصرة فقط على المدير العام (الأدمن)' };
    }

    const today = new Date().toISOString().split('T')[0];
    const newLeads: ClientLead[] = clientsData.map((item, idx) => ({
      id: `lead-imported-${Date.now()}-${idx}`,
      name: item.name || item['اسم العميل'] || 'عميل غير معرف',
      phone: item.phone || item['رقم الهاتف'] || '01000000000',
      email: item.email || item['البريد الإلكتروني'] || '',
      address: item.address || item['العنوان'] || 'القاهرة',
      priority: (item.priority || item['الأولوية'] || 'متوسط') as PriorityLevel,
      lastInteractionDate: today,
      status: (item.status || item['الحالة'] || 'جديد') as CallStatus,
      source: (item.source || item['المصدر'] || 'اعلانات فيسبوك') as LeadSource,
      projectName: item.projectName || item['المشروع'] || projects[0]?.name || 'مشروع جديد',
      assignedUserId: item.assignedUserId || currentUser.id,
      assignedUserName: item.assignedUserName || currentUser.name,
      createdAt: today,
      updatedAt: today,
      notes: item.notes || item['ملاحظات'] || 'داتا مستوردة عبر أدمن النظام',
    }));

    setClients(prev => [...newLeads, ...prev]);

    addNotification('استيراد داتا عملاء', `تم استيراد ${newLeads.length} عميل جديد بنجاح إلى شيتات النظام`, 'system');

    return { success: true, count: newLeads.length, message: `تم استيراد ${newLeads.length} عميل بنجاح` };
  };

  // Notifications helpers
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Cloud Sync Actions
  const updateCloudConfig = (newConfig: Partial<CloudStorageConfig>) => {
    setCloudConfig(prev => ({ ...prev, ...newConfig }));
  };

  const triggerManualSync = async () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        setCloudConfig(prev => ({
          ...prev,
          lastSyncTime: `اليوم، ${timeStr}`,
          storageUsedMB: parseFloat((prev.storageUsedMB + 0.5).toFixed(1)),
        }));
        addNotification('مزامنة سحابية', 'تمت المزامنة السحابية اليدوية بنجاح مع Google Drive', 'system');
        resolve();
      }, 1200);
    });
  };

  // Calculate Daily Performance Reports
  const getPerformanceReports = (): ActivityReport[] => {
    const salesUsers = users.filter(u => u.role === 'SALES_REP');

    return salesUsers.map(user => {
      const userLeads = clients.filter(c => c.assignedUserId === user.id);

      return {
        userId: user.id,
        userName: user.name,
        totalCalls: userLeads.length,
        interestedCount: userLeads.filter(c => c.status === 'مهتم').length,
        callbackCount: userLeads.filter(c => c.status === 'هرجع اكلمه تاني').length,
        closedCount: userLeads.filter(c => c.status === 'مغلق').length,
        notInterestedCount: userLeads.filter(c => c.status === 'مش مهتم').length,
        unreachableCount: userLeads.filter(c => c.status === 'غير متاح').length,
        hungUpCount: userLeads.filter(c => c.status === 'قفل الخط في وشي').length,
        busyCount: userLeads.filter(c => c.status === 'مشغول دلوقتي').length,
        pendingFollowUps: userLeads.filter(c => c.followUpDate && c.followUpDate >= new Date().toISOString().split('T')[0]).length,
      };
    });
  };

  const addProject = (projectData: Omit<Project, 'id' | 'totalLeads' | 'activeLeads'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      totalLeads: 0,
      activeLeads: 0,
    };
    setProjects(prev => [...prev, newProj]);
    addNotification('إضافة مشروع جديد', `تم إدراج المشروع (${newProj.name}) في قاعدة بيانات جوهر جروب`, 'system');
  };

  const updateProject = (id: string, updatedData: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updatedData } : p)));
    addNotification('تحديث مشروع', 'تم تحديث بيانات المشروع بنجاح', 'system');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.filter ? p.id !== id : p.id !== id));
    addNotification('حذف مشروع', 'تم حذف المشروع من القائمة بنجاح', 'system');
  };

  // Schedule Plan Generator (7 days & 30 days)
  const createSchedulePlan = (userId: string, planType: '7_DAYS' | '30_DAYS', dailyQuota: number, notes?: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const startDateObj = new Date();
    const daysCount = planType === '7_DAYS' ? 7 : 30;
    const endDateObj = new Date();
    endDateObj.setDate(startDateObj.getDate() + daysCount);

    const startDateStr = startDateObj.toISOString().split('T')[0];
    const endDateStr = endDateObj.toISOString().split('T')[0];
    const totalLeadsAllocated = daysCount * dailyQuota;

    const newPlan: LeadSchedulePlan = {
      id: `plan-${Date.now()}`,
      userId,
      userName: targetUser.name,
      planType,
      dailyQuota,
      startDate: startDateStr,
      endDate: endDateStr,
      totalLeadsAllocated,
      notes,
      createdAt: startDateStr,
    };

    setSchedulePlans(prev => [newPlan, ...prev]);

    // Update user's daily quota setting
    updateUser(userId, { dailyQuota });

    addNotification(
      'جدولة توزيع عملاء جديدة',
      `تم اعتماد خطة جدولة ${planType === '7_DAYS' ? 'أسبوعية (7 أيام)' : 'شهرية (30 يوم)'} للموظف (${targetUser.name}) بمعدل ${dailyQuota} رقم/عميل يومياً إجمالي ${totalLeadsAllocated} عميل`,
      'assignment'
    );
  };

  const deleteSchedulePlan = (id: string) => {
    setSchedulePlans(prev => prev.filter(p => p.id !== id));
    addNotification('حذف خطة جدولة', 'تم إلغاء خطة التوزيع المجدولة بنجاح', 'system');
  };

  // Daily Progress Calculator for a user (Quota tracking out of 100 or custom)
  const getDailyProgressForUser = (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetUser = users.find(u => u.id === userId);
    const quota = targetUser?.dailyQuota || 100;

    // Count leads interacted with or created/updated today by this user
    const userLeads = clients.filter(c => c.assignedUserId === userId);
    const callsToday = userLeads.filter(c => 
      c.lastInteractionDate === today || 
      (c.notesHistory && c.notesHistory.some(n => n.date.includes(today)))
    ).length;

    const percentage = Math.min(100, Math.round((callsToday / quota) * 100));

    return {
      callsToday,
      dailyQuota: quota,
      percentage,
    };
  };

  // Global Interaction & Call Audit Log Feed across ALL sales reps
  const allInteractions = clients.flatMap(client => {
    if (!client.notesHistory || client.notesHistory.length === 0) {
      return [{
        id: `init-${client.id}`,
        clientId: client.id,
        clientName: client.name,
        phone: client.phone,
        authorName: client.assignedUserName,
        status: client.status,
        note: client.notes || 'تسجيل أول للعميل في الشيت',
        date: client.updatedAt || client.createdAt,
        projectName: client.projectName,
      }];
    }
    return client.notesHistory.map(hist => ({
      id: hist.id,
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      authorName: hist.authorName || client.assignedUserName,
      status: hist.status,
      note: hist.note,
      date: hist.date,
      projectName: client.projectName,
    }));
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        projects,
        clients,
        visibleClients,
        cloudConfig,
        notifications,
        unreadNotificationsCount,

        isAuthenticated,
        loginUser,
        loginWithEmail,
        loginWithCredentials,
        logoutUser,

        customLogoUrl,
        companyTitle,
        companySubtitle,
        updateLogoSettings,

        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        updateClientStatus,
        scheduleFollowUp,
        addClient,
        updateClient,
        deleteClient,
        deleteSelectedClients,
        clearAllClientsData,
        bulkAssignClients,
        canExport,
        canImport,
        canManageUsers,
        importClientsFromCSV,
        markNotificationAsRead,
        clearAllNotifications,
        updateCloudConfig,
        triggerManualSync,
        getPerformanceReports,
        schedulePlans,
        createSchedulePlan,
        deleteSchedulePlan,
        getDailyProgressForUser,
        allInteractions,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
