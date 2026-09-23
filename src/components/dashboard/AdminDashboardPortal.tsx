import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Briefcase, 
  FileText, 
  Search, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Activity, 
  Server, 
  LogOut, 
  UserCheck, 
  AlertTriangle,
  Lock,
  Mail,
  ChevronRight,
  TrendingUp,
  Eye,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi, AdminStats, AdminUser, DbTableInfo, CreateUserPayload } from '../../api/admin.api';
import { UserPlus, X } from 'lucide-react';

export const AdminDashboardPortal: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Local Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'database' | 'jobs'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState('Tous');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Database Explorer State
  const [dbTables, setDbTables] = useState<DbTableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  // UI Loaders & Alerts
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserPayload>({ name: '', email: '', password: '', role: 'candidat' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const isAdminManager = user?.role === 'admin_manager';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch Stats & Initial Data when Admin is authenticated
  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers(userRoleFilter, userSearchQuery);
      setUsersList(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDatabaseTables = async () => {
    try {
      setLoading(true);
      const tables = await adminApi.getDatabaseTables();
      setDbTables(tables);
      if (tables.length > 0) {
        loadTableData(selectedTable || tables[0].tableName);
      }
    } catch (err) {
      console.error('Failed to load database tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    try {
      setSelectedTable(tableName);
      setLoading(true);
      const rows = await adminApi.getTableRows(tableName);
      setTableData(rows);
    } catch (err) {
      console.error(`Failed to load table ${tableName} data:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'admin_manager')) {
      loadUsers();
      if (user?.role === 'admin') {
        loadStats();
        loadDatabaseTables();
        setActiveTab('stats');
      } else {
        setActiveTab('users');
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'admin_manager') && activeTab === 'users') {
      loadUsers();
    }
  }, [userRoleFilter, userSearchQuery]);

  // Handle Admin Login Form
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      setLoading(true);
      await login(adminEmail, adminPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Identifiants invalides ou privilèges administrateur requis.');
    } finally {
      setLoading(false);
    }
  };

  // Handle User Role Change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUser(userId, newRole);
      showToast('Rôle de l\'utilisateur mis à jour avec succès');
      loadUsers();
      loadStats();
    } catch (err) {
      showToast('Erreur lors de la mise à jour du rôle');
    }
  };

  // Handle User Delete
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${userName} ?`)) {
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      showToast(`Utilisateur ${userName} supprimé`);
      loadUsers();
      if (user?.role === 'admin') loadStats();
    } catch (err: any) {
      showToast(err.message === 'CANNOT_DELETE_SELF' ? 'Impossible de supprimer votre propre compte admin' : 'Erreur lors de la suppression');
    }
  };

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);
    try {
      const result = await adminApi.createUser(createForm);
      showToast(`✅ Compte créé : ${result.user.name} (${result.user.role})`);
      setShowCreateModal(false);
      setCreateForm({ name: '', email: '', password: '', role: 'candidat' });
      loadUsers();
    } catch (err: any) {
      setCreateError(err.message || 'Erreur lors de la création');
    } finally {
      setCreateLoading(false);
    }
  };

  // Check Admin Gate — allow admin and admin_manager
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'admin_manager')) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4 sm:p-8 font-inter text-[#1A1A2E]">
        <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-800 overflow-hidden relative grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Panel — Panoramic Admin Branding */}
          <div className="md:col-span-5 bg-[#141424] text-white p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-800/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D6BE4]/10 rounded-full filter blur-3xl pointer-events-none"></div>
            
            <div>
              <div className="w-14 h-14 bg-[#2D6BE4] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold uppercase tracking-wider mb-3">
                Port : 3007 • Espace Sécurisé
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Portail Administrateur</h2>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed font-medium">
                Accès restreint à la base de données PostgreSQL Supabase et à la gestion des privilèges utilisateurs NovoRise.
              </p>
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-gray-800/80 text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Explorateur de tables SQL en direct</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Gestion avancée des comptes utilisateurs</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Supervision de la santé du serveur (API 3006)</span>
              </div>
            </div>
          </div>

          {/* Right Panel — Login Form */}
          <div className="md:col-span-7 p-8 md:p-10 bg-white flex flex-col justify-center">
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1A1A2E]">Connexion Secrète</h3>
              <p className="text-[#6B7280] text-xs mt-1 font-medium">Veuillez saisir vos identifiants à privilèges administrateur.</p>
            </div>

            {loginError && (
              <div className="mb-6 bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Identifiant / Email Administrateur</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin (ou admin@novorise.com)"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6BE4] hover:bg-[#2D6BE4]/90 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
              >
                <Key className="w-4 h-4" />
                <span>Se connecter au Portail Admin</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-[11px] text-[#6B7280] font-medium">
                Serveur d'administration configuré sur le port <span className="font-bold text-[#2D6BE4]">3007</span>.
              </p>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F5] font-inter text-[#1A1A2E]">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A2E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs border border-gray-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Navbar — Wide Panoramic Container */}
      <header className="bg-[#1A1A2E] text-white sticky top-0 z-40 border-b border-gray-800 shadow-md">
        <div className="max-w-[1780px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Admin */}
            <div className="flex items-center gap-3">
              <div className="bg-[#2D6BE4] p-2 rounded-xl text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white">
                    Novo<span className="text-[#2D6BE4]">Rise</span> Admin
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-400/30">
                    Port : 3007
                  </span>
                </div>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex space-x-1 items-center bg-gray-800/60 p-1.5 rounded-xl border border-gray-700">
              {/* Stats tab — admin only */}
              {!isAdminManager && (
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'stats' ? 'bg-[#2D6BE4] text-white shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Statistiques &amp; Santé</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'users' ? 'bg-[#2D6BE4] text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Utilisateurs ({usersList.length})</span>
              </button>

              {/* Database tab — admin only */}
              {!isAdminManager && (
                <button
                  onClick={() => setActiveTab('database')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'database' ? 'bg-[#2D6BE4] text-white shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Base PostgreSQL ({dbTables.length} tables)</span>
                </button>
              )}
            </nav>

            {/* User Session Info & Refresh */}
            <div className="flex items-center gap-3">
              {!isAdminManager && (
                <button
                  onClick={() => {
                    loadStats();
                    loadUsers();
                    loadDatabaseTables();
                    showToast('Données actualisées en direct depuis PostgreSQL');
                  }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Actualiser les données"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
              {isAdminManager && (
                <button
                  onClick={() => loadUsers()}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Actualiser"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}

              <div className="flex items-center gap-2.5 bg-gray-800/80 px-3 py-1.5 rounded-xl border border-gray-700">
                <div className="w-7 h-7 rounded-lg bg-[#2D6BE4] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none">{user.name}</div>
                  <div className={`text-[10px] font-medium mt-0.5 ${isAdminManager ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isAdminManager ? 'Admin Manager' : 'Admin connecté'}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Déconnexion Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Body — Wide Widescreen Layout */}
      <main className="max-w-[1780px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8">
        
        {/* ================= TAB 1: STATS & SYSTEM HEALTH ================= */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Vue d'ensemble de la Plateforme</h2>
              <p className="text-[#6B7280] text-sm mt-1 font-medium">Métriques d'activité et état de la base de données PostgreSQL en temps réel.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider block">Total Utilisateurs</span>
                  <span className="text-3xl font-bold text-[#1A1A2E] mt-1 block">{stats.users.total}</span>
                  <div className="flex gap-2 text-[11px] text-[#6B7280] mt-2 font-medium">
                    <span>{stats.users.candidats} Candidats</span> • <span>{stats.users.recruteurs} Recruteurs</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2D6BE4] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider block">Offres Publiées</span>
                  <span className="text-3xl font-bold text-[#1A1A2E] mt-1 block">{stats.jobs.total}</span>
                  <div className="flex gap-2 text-[11px] text-[#6B7280] mt-2 font-medium">
                    <span className="text-emerald-600 font-semibold">{stats.jobs.actifs} Actives</span> • <span>{stats.jobs.clotures} Clôturées</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider block">Candidatures</span>
                  <span className="text-3xl font-bold text-[#1A1A2E] mt-1 block">{stats.applications.total}</span>
                  <div className="flex gap-2 text-[11px] text-[#6B7280] mt-2 font-medium">
                    <span>{stats.applications.en_attente} En attente</span> • <span className="text-emerald-600">{stats.applications.acceptees} Acceptées</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider block">Moteur de BD</span>
                  <span className="text-sm font-bold text-[#1A1A2E] mt-1 block truncate max-w-[150px]">PostgreSQL</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">✓ Connexion SSL Supabase</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Server className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Backend Service Banner */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-[#2D6BE4]" /> Services Backend & Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-[#6B7280]">
                <div className="bg-[#F8F7F5] p-4 rounded-xl border border-gray-200/60">
                  <span className="text-[#1A1A2E] font-bold block mb-1">Serveur API Express</span>
                  <span>Port : 3006 • Node.js / TypeScript</span>
                  <span className="text-emerald-600 font-semibold block mt-2">✓ Statut : En cours d'exécution</span>
                </div>

                <div className="bg-[#F8F7F5] p-4 rounded-xl border border-gray-200/60">
                  <span className="text-[#1A1A2E] font-bold block mb-1">Portail Administrateur</span>
                  <span>Port : 3007 (Isolé du public)</span>
                  <span className="text-emerald-600 font-semibold block mt-2">✓ Accès Administrateur Actif</span>
                </div>

                <div className="bg-[#F8F7F5] p-4 rounded-xl border border-gray-200/60">
                  <span className="text-[#1A1A2E] font-bold block mb-1">File de Tâches Email</span>
                  <span>Bull Queue + Mailtrap SMTP</span>
                  <span className="text-emerald-600 font-semibold block mt-2">✓ Worker Asynchrone Prêt</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: USER ACCOUNT MANAGER ================= */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E]">Gestion des Comptes Utilisateurs</h2>
                <p className="text-[#6B7280] text-sm mt-1 font-medium">Recherchez, modifiez les rôles ou gérez les autorisations d'accès des membres.</p>
              </div>

              {/* Role filter buttons & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Nom ou email..."
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-3 py-2 text-xs outline-none focus:border-[#2D6BE4]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 w-full sm:w-auto">
                  {['Tous', 'candidat', 'recruteur', 'admin', 'admin_manager'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        userRoleFilter === role ? 'bg-[#2D6BE4] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A2E]'
                      }`}
                    >
                      {role === 'admin_manager' ? 'Manager' : role}
                    </button>
                  ))}
                </div>

                {/* Create User button — admin only */}
                {!isAdminManager && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-[#2D6BE4] hover:bg-[#2D6BE4]/90 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm whitespace-nowrap cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Créer un compte
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8F7F5] border-b border-gray-200/60 text-[#6B7280] font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Utilisateur</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Rôle</th>
                      <th className="py-3.5 px-4">Statut Email</th>
                      <th className="py-3.5 px-4">Date d'inscription</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#1A1A2E]">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#2D6BE4] text-white flex items-center justify-center font-bold text-xs">
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{usr.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#6B7280] font-mono">{usr.email}</td>
                        <td className="py-3.5 px-4">
                          <select
                            value={usr.role}
                            onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                            className="bg-[#F8F7F5] border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1A1A2E] outline-none focus:border-[#2D6BE4]"
                          >
                            <option value="candidat">Candidat</option>
                            <option value="recruteur">Recruteur</option>
                            <option value="admin">Administrateur</option>
                            <option value="admin_manager">Admin Manager</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          {usr.is_verified ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Vérifié
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-full text-[11px]">
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#6B7280]">
                          {new Date(usr.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(usr.id, usr.name)}
                            disabled={usr.id === user.id}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                            title="Supprimer l'utilisateur"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DATABASE EXPLORER ================= */}
        {activeTab === 'database' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Explorateur de Base de Données PostgreSQL</h2>
              <p className="text-[#6B7280] text-sm mt-1 font-medium">Inspectez la structure des tables SQL et les enregistrements en direct.</p>
            </div>

            {/* Table Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dbTables.map((table) => (
                <div
                  key={table.tableName}
                  onClick={() => loadTableData(table.tableName)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedTable === table.tableName
                      ? 'border-[#2D6BE4] bg-blue-50/50 shadow-sm ring-2 ring-blue-400/20'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-[#1A1A2E]">{table.tableName}</span>
                    <span className="text-xs font-bold text-[#2D6BE4] bg-white px-2.5 py-0.5 rounded-full border border-gray-100 shadow-sm">
                      {table.rowCount} lignes
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280] font-medium">
                    {table.columns.length} colonnes : {table.columns.slice(0, 3).map(c => c.column_name).join(', ')}...
                  </div>
                </div>
              ))}
            </div>

            {/* Table Content Data Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-[#1A1A2E] mb-4 flex items-center justify-between">
                <span>Contenu de la table : <code className="text-[#2D6BE4] font-mono">{selectedTable}</code></span>
                <span className="text-xs text-[#6B7280] font-normal">Limité aux 100 derniers enregistrements</span>
              </h3>

              {tableData.length === 0 ? (
                <p className="text-gray-400 text-xs py-8 text-center">Aucune donnée disponible dans cette table SQL.</p>
              ) : (
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="sticky top-0 bg-[#F8F7F5] shadow-sm">
                      <tr className="text-[#1A1A2E]">
                        {Object.keys(tableData[0]).map((key) => (
                          <th key={key} className="py-2.5 px-3 border-b border-gray-200 whitespace-nowrap">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="py-3 px-4 whitespace-nowrap max-w-[340px] truncate text-gray-800">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ======= Create User Modal ======= */}
      {/* ======= Create User Modal ======= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B132B]/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden my-6">
            
            {/* Modal Top Header (NovoRise Dark Theme) */}
            <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-36 h-36 bg-[#2D6BE4]/20 rounded-full blur-2xl pointer-events-none" />
              
              <button
                onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                className="absolute top-5 right-5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 relative z-10 pr-8">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2D6BE4] to-[#5C94FF] text-white flex items-center justify-center shadow-lg border border-white/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Créer un nouveau compte</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Le compte sera immédiatement actif et vérifié.</p>
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="ex: Yacine El Idrissi"
                  className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Adresse email *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="ex: contact@example.com"
                  className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mot de passe *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={createForm.password}
                  onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Minimum 8 caractères"
                  className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Rôle attribué *</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm(f => ({ ...f, role: e.target.value as CreateUserPayload['role'] }))}
                  className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#2D6BE4]/15 outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="candidat">Candidat — Cherche un emploi</option>
                  <option value="recruteur">Recruteur — Publie des offres</option>
                  <option value="admin_manager">Admin Manager — Gère les utilisateurs</option>
                  <option value="admin">Administrateur — Accès complet</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                  className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-gradient-to-r from-[#2D6BE4] to-[#1C4CB0] hover:from-[#255bc4] hover:to-[#173e90] text-white py-3 rounded-2xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {createLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {createLoading ? 'Création...' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
