import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SpreadsheetView } from './components/SpreadsheetView';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { ProjectManagement } from './components/ProjectManagement';
import { FollowUpSchedule } from './components/FollowUpSchedule';
import { CloudSyncView } from './components/CloudSyncView';
import { FollowUpModal } from './components/FollowUpModal';
import { AddClientModal } from './components/AddClientModal';
import { ImportExportModal } from './components/ImportExportModal';
import { HistoryModal } from './components/HistoryModal';
import { LoginModal } from './components/LoginModal';
import { LoginPage } from './components/LoginPage';
import { ClientLead } from './types';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { currentUser, isAuthenticated } = useApp();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'sheet' | 'dashboard' | 'followups' | 'users' | 'projects' | 'cloud'>('sheet');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [followUpClient, setFollowUpClient] = useState<ClientLead | null>(null);
  const [historyClient, setHistoryClient] = useState<ClientLead | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-100 flex flex-col font-sans dir-rtl">
      
      {/* Top Main Navigation Header */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddClient={() => setIsAddClientOpen(true)}
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onOpenImportExportModal={() => setIsImportExportOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'sheet' && (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <SpreadsheetView
                searchTerm={searchTerm}
                onOpenAddClient={() => setIsAddClientOpen(true)}
                onSelectClientForFollowUp={client => setFollowUpClient(client)}
                onOpenHistoryModal={client => setHistoryClient(client)}
                onOpenImportExportModal={() => setIsImportExportOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'dashboard' && currentUser.role === 'ADMIN' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <AdminDashboard />
            </motion.div>
          )}

          {activeTab === 'users' && currentUser.role === 'ADMIN' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <UserManagement />
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <ProjectManagement />
            </motion.div>
          )}

          {activeTab === 'followups' && (
            <motion.div
              key="followups"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <FollowUpSchedule
                onSelectClientForFollowUp={client => setFollowUpClient(client)}
                onOpenHistoryModal={client => setHistoryClient(client)}
              />
            </motion.div>
          )}

          {activeTab === 'cloud' && (
            <motion.div
              key="cloud"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <CloudSyncView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#14171D] text-slate-400 border-t border-slate-800 py-3 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            جميع الحقوق محفوظة © {new Date().getFullYear()} - <strong className="text-slate-200">شركة جوهر جروب للتطوير العقاري (Gohar Group)</strong>
          </span>
          <span className="text-[11px] text-[#C5A059]">
            نظام الشيتات المباشرة والأمان السحابي
          </span>
        </div>
      </footer>

      {/* Modals */}
      <FollowUpModal
        client={followUpClient}
        onClose={() => setFollowUpClient(null)}
      />

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />

      <HistoryModal
        client={historyClient}
        onClose={() => setHistoryClient(null)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
