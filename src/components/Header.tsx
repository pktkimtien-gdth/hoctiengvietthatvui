/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  User, 
  Users, 
  GraduationCap, 
  Search, 
  Heart, 
  Award,
  Home,
  Gamepad2,
  FileText,
  BarChart3,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Key,
  Mail,
  X as CloseIcon,
  Map
} from 'lucide-react';
import { UserRole, StudentStats } from '../types';
import { playSuccessMelody, playErrorSound } from '../utils/audio';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from '../lib/firebase';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  stats: StudentStats;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  role,
  setRole,
  stats,
  searchTerm,
  setSearchTerm,
}: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);

  // Firebase Authentication States
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authMode, setAuthMode] = useState<'google' | 'email' | 'register' | 'passcode'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        setRole('teacher');
      }
    });
    return () => unsubscribe();
  }, [setRole]);

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'teacher') {
      if (currentUser) {
        // Already authenticated via Firebase, grant teacher role instantly
        setRole('teacher');
      } else {
        setPendingRole('teacher');
        setPasscode('');
        setAuthError('');
        setAuthMode('google');
        setShowAuthModal(true);
      }
    } else {
      setRole(newRole);
      if (currentTab === 'dashboard') {
        setCurrentTab('home');
      }
    }
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo passcode is 1234
    if (passcode === '1234') {
      playSuccessMelody();
      setRole('teacher');
      setShowAuthModal(false);
      setPasscode('');
      setAuthError('');
    } else {
      playErrorSound();
      setAuthError('Mật mã không đúng! Vui lòng thử lại.');
    }
  };

  // Google sign in handler
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError('');
    setIsUnauthorizedDomain(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        playSuccessMelody();
        setRole('teacher');
        setShowAuthModal(false);
      }
    } catch (error: any) {
      playErrorSound();
      console.error(error);
      if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain')) {
        setIsUnauthorizedDomain(true);
        setAuthError('Cảnh báo: Miền (domain) truy cập hiện tại chưa được cấp quyền trong Firebase!');
      } else {
        setAuthError(error.message || 'Đăng nhập bằng tài khoản Google/Gmail thất bại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email login handler
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        playSuccessMelody();
        setRole('teacher');
        setShowAuthModal(false);
      }
    } catch (error: any) {
      playErrorSound();
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        // Fallback to register if user not found to make testing seamless,
        // or print the clear message
        setAuthError('Không tìm thấy tài khoản hoặc mật khẩu không đúng. Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới.');
      } else {
        setAuthError(error.message || 'Đăng nhập bằng Gmail thất bại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email registration handler
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        playSuccessMelody();
        setRole('teacher');
        setShowAuthModal(false);
      }
    } catch (error: any) {
      playErrorSound();
      setAuthError(error.message || 'Đăng ký tài khoản giáo viên thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setRole('student');
      if (currentTab === 'dashboard') {
        setCurrentTab('home');
      }
      playSuccessMelody();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { 
      id: 'home', 
      label: 'Trang chủ', 
      icon: Home, 
      activeClass: 'bg-gradient-to-r from-[#FF7675] to-[#ff8c8a] text-white shadow-md shadow-[#FF7675]/30', 
      inactiveClass: 'bg-[#FF7675]/5 text-[#FF7675] border border-[#FF7675]/20 hover:bg-[#FF7675]/10',
      iconClass: 'text-[#FF7675]'
    },
    { 
      id: 'learning-path', 
      label: 'Lộ trình cá nhân 🗺️', 
      icon: Map, 
      activeClass: 'bg-gradient-to-r from-[#8e44ad] to-[#9b59b6] text-white shadow-md shadow-[#8e44ad]/30', 
      inactiveClass: 'bg-[#8e44ad]/5 text-[#8e44ad] border border-[#8e44ad]/20 hover:bg-[#8e44ad]/10',
      iconClass: 'text-[#8e44ad]'
    },
    { 
      id: 'grades', 
      label: 'Khối lớp', 
      icon: GraduationCap, 
      activeClass: 'bg-gradient-to-r from-[#00D2FF] to-[#0066FF] text-white shadow-md shadow-[#0066FF]/30', 
      inactiveClass: 'bg-[#0066FF]/5 text-[#0066FF] border border-[#0066FF]/20 hover:bg-[#0066FF]/10',
      iconClass: 'text-[#0066FF]'
    },
    { 
      id: 'resources', 
      label: 'Kho học liệu', 
      icon: BookOpen, 
      activeClass: 'bg-gradient-to-r from-[#2ECC71] to-[#11998E] text-white shadow-md shadow-[#2ECC71]/30', 
      inactiveClass: 'bg-[#11998E]/5 text-[#11998E] border border-[#11998E]/20 hover:bg-[#11998E]/10',
      iconClass: 'text-[#11998E]'
    },
    { 
      id: 'games', 
      label: 'Trò chơi', 
      icon: Gamepad2, 
      activeClass: 'bg-gradient-to-r from-[#FF9966] to-[#FF5E62] text-white shadow-md shadow-[#FF5E62]/30', 
      inactiveClass: 'bg-[#FF5E62]/5 text-[#FF5E62] border border-[#FF5E62]/20 hover:bg-[#FF5E62]/10',
      iconClass: 'text-[#FF5E62]'
    },
    { 
      id: 'quizzes', 
      label: 'Bài kiểm tra', 
      icon: FileText, 
      activeClass: 'bg-gradient-to-r from-[#FFD000] to-[#FF8C00] text-white shadow-md shadow-[#FF8C00]/30', 
      inactiveClass: 'bg-[#FF8C00]/5 text-[#FF8C00] border border-[#FF8C00]/20 hover:bg-[#FF8C00]/10',
      iconClass: 'text-[#FF8C00]'
    },
    { 
      id: 'analytics', 
      label: 'Báo cáo học tập', 
      icon: BarChart3, 
      activeClass: 'bg-gradient-to-r from-[#A55EEA] to-[#8854D0] text-white shadow-md shadow-[#8854D0]/30', 
      inactiveClass: 'bg-[#8854D0]/5 text-[#8854D0] border border-[#8854D0]/20 hover:bg-[#8854D0]/10',
      iconClass: 'text-[#8854D0]'
    },
    { 
      id: 'ai-tutor', 
      label: 'Trợ lý AI 🌟', 
      icon: Sparkles, 
      activeClass: 'bg-gradient-to-r from-[#FF7675] to-[#A55EEA] text-white shadow-md shadow-[#A55EEA]/30', 
      inactiveClass: 'bg-gradient-to-r from-pink-500/5 to-purple-500/5 text-pink-600 border border-pink-500/20 hover:from-pink-500/10 hover:to-purple-500/10',
      iconClass: 'text-pink-500'
    },
  ];

  if (role === 'teacher') {
    navItems.push({
      id: 'dashboard',
      label: 'Bảng quản lý (Admin)',
      icon: LayoutDashboard,
      activeClass: 'bg-gradient-to-r from-[#34495E] to-[#2C3E50] text-white shadow-md shadow-[#34495E]/30',
      inactiveClass: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/60',
      iconClass: 'text-[#34495E]'
    });
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-blue-100/60 sticky top-0 z-50 shadow-sm" id="main-header">
      {/* Top Bar for Role Switching & Stats */}
      <div className="bg-[#FF7675] text-white px-4 py-2 text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Slogan */}
          <div className="flex items-center gap-1.5 font-display text-base">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>Học Tiếng Việt thật vui - Kiến tạo tương lai số!</span>
          </div>

          {/* Role Switching */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 bg-[#e85a58] px-3 py-1 rounded-full text-xs shadow-inner">
              <span className="opacity-80">Vai trò:</span>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="bg-transparent border-none text-white font-bold outline-none cursor-pointer text-xs sm:text-sm"
                aria-label="Chọn vai trò người dùng"
              >
                <option value="student" className="text-gray-800">🎒 Học sinh (Người xem)</option>
                <option value="parent" className="text-gray-800">👨‍👩‍👦 Phụ huynh (Người xem)</option>
                <option value="teacher" className="text-gray-800">👩‍🏫 Giáo viên (Admin)</option>
              </select>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs bg-[#e85a58] px-3 py-1 rounded-full shadow-inner border border-white/20">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-3.5 h-3.5 text-white" />
                )}
                <span className="font-bold hidden sm:inline max-w-[120px] truncate">{currentUser.displayName || currentUser.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-white/25 hover:bg-white/40 text-white text-[10px] px-2 py-0.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ml-1"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              role === 'teacher' && (
                <div className="text-3xs bg-amber-500/90 px-2 py-1 rounded-full font-extrabold text-white border border-white/10 flex items-center gap-1">
                  🔑 Chế độ khách (Chưa đăng nhập Gmail)
                </div>
              )
            )}

            {/* Little Quick Stats for Students */}
            {role === 'student' && (
              <div className="hidden md:flex items-center gap-3 text-xs bg-[#e85a58] px-3 py-1 rounded-full shadow-inner">
                <span className="flex items-center gap-1 font-bold">
                  <Award className="w-4 h-4 text-yellow-300" /> {stats.badges.filter(b => b.unlockedAt).length} Huy hiệu
                </span>
                <span className="opacity-40">|</span>
                <span className="font-bold">✨ {stats.totalQuizScore} Điểm</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Logo */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="logo-btn"
          >
            <div className="w-10 h-10 bg-[#FF7675] rounded-xl flex items-center justify-center text-white shadow-sm transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl font-bold font-display">V</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0984E3] tracking-tight leading-tight">
                Tiếng Việt <span className="text-[#FF7675]">Tiểu Học</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-medium font-sans">Kho Học Liệu Số & Luyện Tập Tương Tác</p>
            </div>
          </button>

          {/* Search Box */}
          <div className="w-full lg:max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Tìm bài học, trò chơi, video, học liệu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentTab !== 'resources' && currentTab !== 'home') {
                  setCurrentTab('resources'); // Auto redirect to learning resource store for results
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 hover:bg-gray-200/50 focus:bg-white border-none rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
              aria-label="Tìm kiếm bài học và tài liệu"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pt-3 pb-3 scrollbar-none md:scrollbar-thin scrollbar-thumb-sky-200 mask-image" id="main-nav">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-full font-display text-xs sm:text-sm font-extrabold transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer group ${
                  isActive
                    ? `${item.activeClass} ring-4 ring-white/15 scale-[1.02]`
                    : `${item.inactiveClass} hover:shadow-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                  isActive 
                    ? 'scale-110 rotate-3 text-white' 
                    : `${item.iconClass} group-hover:scale-110 group-hover:rotate-6`
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Verification & Firebase Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[999] flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#FF7675] to-[#f35754] text-white p-6 relative flex flex-col items-center text-center">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 text-white p-1.5 rounded-full transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
              
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-7 h-7 text-white animate-pulse" />
              </div>
              <h3 className="font-display font-extrabold text-lg">Đăng Nhập Quản Trị Viên</h3>
              <p className="text-xs text-white/85 mt-1 font-medium">Vui lòng đăng nhập bằng tài khoản Gmail của bạn để nhận quyền thêm, sửa, xóa nội dung bài giảng và bài tập.</p>
            </div>

            {/* Tab selection */}
            <div className="flex border-b border-slate-100 bg-slate-50 text-2xs sm:text-xs font-bold text-slate-500">
              <button
                type="button"
                onClick={() => { setAuthMode('google'); setAuthError(''); }}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${authMode === 'google' ? 'text-[#FF7675] bg-white border-b-2 border-[#FF7675] font-extrabold' : 'hover:bg-slate-100/50'}`}
              >
                🌈 Google / Gmail
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('email'); setAuthError(''); }}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${authMode === 'email' || authMode === 'register' ? 'text-[#0984E3] bg-white border-b-2 border-[#0984E3] font-extrabold' : 'hover:bg-slate-100/50'}`}
              >
                ✉️ Tài khoản Email
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('passcode'); setAuthError(''); }}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${authMode === 'passcode' ? 'text-amber-600 bg-white border-b-2 border-amber-500 font-extrabold' : 'hover:bg-slate-100/50'}`}
              >
                🔑 Mật mã nhanh
              </button>
            </div>

            {/* Modal Body depending on Tab */}
            {authMode === 'google' && (
              <div className="p-6 space-y-4 text-center">
                <div className="flex justify-center py-2">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.61 0 3.05.55 4.19 1.63l3.14-3.14C17.38 1.77 14.88 1 12 1 7.35 1 3.39 3.68 1.49 7.62l3.78 2.93c.92-2.76 3.5-4.51 6.73-4.51z"/>
                      <path fill="#4285F4" d="M23.45 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.43c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.14-1.97 3.37-4.88 3.37-8.51z"/>
                      <path fill="#FBBC05" d="M5.27 14.18c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.49 7.62C.54 9.6 0 11.75 0 14s.54 4.4 1.49 6.38l3.78-2.93c-.24-.72-.38-1.49-.38-2.29z"/>
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.01.68-2.31 1.08-4.31 1.08-3.23 0-5.81-1.75-6.73-4.51l-3.78 2.93C3.39 20.32 7.35 23 12 23z"/>
                    </svg>
                  </div>
                </div>
                <h4 className="font-display font-extrabold text-slate-800 text-sm">Liên kết đăng nhập bằng Google</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Vui lòng nhấn nút bên dưới để chọn tài khoản Gmail của bạn. Hệ thống sẽ tự động xác thực và cấp quyền quản trị.
                </p>

                {authError && (
                  <div className="text-xs text-rose-500 font-bold text-center bg-rose-50 py-2.5 px-3 rounded-xl border border-rose-100">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-display font-extrabold text-sm rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.46-1.1 2.69-2.34 3.52v2.93h3.79c2.21-2.04 3.49-5.04 3.49-8.56z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.93l-3.79-2.93c-1.05.7-2.4 1.12-4.17 1.12-3.21 0-5.93-2.17-6.9-5.1H1.28v3.02C3.26 21.05 7.31 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.1 14.28c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38V6.5H1.28C.46 8.15 0 9.98 0 12s.46 3.85 1.28 5.5l3.82-3.22z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.31 0 3.26 2.95 1.28 6.5l3.82 3.22c.97-2.93 3.69-5.1 6.9-5.1z"/>
                        </svg>
                        Đăng nhập bằng Gmail (Google)
                      </>
                    )}
                  </button>
                </div>

                {isUnauthorizedDomain && (
                  <div className="p-4 bg-amber-50/95 rounded-2xl border border-amber-200 text-left space-y-2.5 mt-3 shadow-xs">
                    <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs">
                      <Map className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Hướng dẫn thêm miền được ủy quyền:</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-normal font-semibold">
                      Tên miền chạy thử nghiệm hiện tại của bạn chưa được cấp quyền trong dự án Firebase của bạn. Hãy thêm miền dưới đây vào danh sách <strong className="font-bold text-amber-800">Authorized Domains</strong>:
                    </p>
                    <div className="p-2 bg-white rounded-xl font-mono text-[10px] text-slate-800 break-all select-all border border-slate-200 font-extrabold flex justify-between items-center">
                      <span>{window.location.hostname}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-sans font-bold border border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => navigator.clipboard.writeText(window.location.hostname)}>Copy</span>
                    </div>

                    <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-xl text-[10px] text-sky-800 font-bold leading-normal">
                      💡 MẸO THỬ NGHIỆM NHANH:<br />
                      Để bỏ qua bước này và vào ngay bảng quản trị, bạn hãy chuyển sang tab <span className="underline cursor-pointer font-extrabold" onClick={() => { setAuthMode('passcode'); setAuthError(''); }}>🔑 Mật mã nhanh</span> ở hàng trên cùng và nhập mã số <span className="bg-white px-1.5 py-0.5 rounded-md border border-sky-200 font-extrabold">1234</span> để đăng nhập ngay lập tức!
                    </div>

                    <div className="text-[10px] text-slate-600 space-y-1 font-medium leading-relaxed">
                      <p className="font-bold text-amber-800">Các bước cấu hình vĩnh viễn trên Firebase:</p>
                      <ol className="list-decimal pl-4 space-y-0.5">
                        <li>Truy cập <a href={`https://console.firebase.google.com/project/${auth.app.options.projectId}/authentication/providers`} target="_blank" rel="noreferrer" className="text-[#0984E3] hover:underline font-extrabold">Firebase Console Settings</a></li>
                        <li>Chuyển sang tab <strong className="font-extrabold text-slate-700">Settings</strong> (Cài đặt) ở hàng trên cùng.</li>
                        <li>Chọn mục <strong className="font-extrabold text-slate-700">Authorized domains</strong> ở menu bên trái hoặc dưới.</li>
                        <li>Nhấp nút <strong className="font-extrabold text-slate-700">Add domain</strong> và dán miền ở trên vào.</li>
                        <li>Ấn <strong className="font-extrabold text-slate-700">Lưu</strong> rồi tải lại trang này để đăng nhập lại!</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(authMode === 'email' || authMode === 'register') && (
              <form onSubmit={authMode === 'email' ? handleEmailSignIn : handleEmailRegister} className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-3xs font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Nhập địa chỉ Gmail của bạn
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      placeholder="vd: giaovien@gmail.com"
                      className="w-full px-4 py-2.5 border-2 border-slate-150 bg-slate-50 rounded-xl font-medium text-sm focus:border-[#0984E3] focus:bg-white focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-3xs font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-slate-400" /> Mật khẩu đăng nhập
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      placeholder="Nhập ít nhất 6 ký tự..."
                      minLength={6}
                      className="w-full px-4 py-2.5 border-2 border-slate-150 bg-slate-50 rounded-xl font-medium text-sm focus:border-[#0984E3] focus:bg-white focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {authError && (
                  <div className="text-xs text-rose-500 font-bold text-center bg-rose-50 py-2.5 px-3 rounded-xl border border-rose-100 leading-relaxed">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#0984E3] to-[#74b9ff] text-white font-display font-extrabold text-sm rounded-xl transition-all shadow-md shadow-[#0984E3]/20 hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : authMode === 'email' ? 'Đăng nhập giáo viên' : 'Đăng ký tài khoản giáo viên'}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'email' ? 'register' : 'email');
                        setAuthError('');
                      }}
                      className="text-xs text-[#0984E3] hover:underline font-bold transition-all cursor-pointer"
                    >
                      {authMode === 'email' 
                        ? 'Chưa có tài khoản? Click để Đăng ký ngay' 
                        : 'Đã có tài khoản? Quay lại Đăng nhập'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {authMode === 'passcode' && (
              <form onSubmit={handleVerifyPasscode} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-slate-400" /> Nhập mật mã quản trị viên nhanh
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Nhập 4 chữ số..."
                    maxLength={10}
                    className="w-full px-4 py-3 border-2 border-slate-100 bg-slate-50 rounded-2xl text-center font-mono font-bold text-lg tracking-widest focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                    autoFocus
                    required
                  />
                </div>

                {authError && (
                  <div className="text-xs text-rose-500 font-bold text-center bg-rose-50 py-2.5 px-3 rounded-xl border border-rose-100">
                    ⚠️ {authError}
                  </div>
                )}

                {/* Guide Hint */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-3xs sm:text-2xs text-amber-700 font-medium">
                  <span className="font-bold block mb-0.5">💡 Thử nghiệm hệ thống:</span>
                  Nhập mật mã quản trị viên mặc định là <strong className="bg-amber-200/60 px-1.5 py-0.5 rounded font-mono text-xs text-amber-800 font-extrabold">1234</strong> để đăng nhập nhanh mà không cần tài khoản!
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-sm rounded-2xl transition-all cursor-pointer active:scale-95"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-display font-bold text-sm rounded-2xl transition-all shadow-md shadow-amber-500/20 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    Xác nhận
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
