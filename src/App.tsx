/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X as CloseIcon } from 'lucide-react';
import { FIRESTORE_RULES_TEXT } from './constants/rules';
import Header from './components/Header';
import Home from './components/Home';
import GradeDetail from './components/GradeDetail';
import ResourcesStore from './components/ResourcesStore';
import VideoPlayer from './components/VideoPlayer';
import GamesCenter from './components/GamesCenter';
import QuizCenter from './components/QuizCenter';
import Analytics from './components/Analytics';
import AIAssistant from './components/AIAssistant';
import TeacherDashboard from './components/TeacherDashboard';
import LearningPath from './components/LearningPath';

import {
  INITIAL_RESOURCES,
  INITIAL_VIDEOS,
  INITIAL_GAMES,
  INITIAL_QUIZZES,
  INITIAL_ANNOUNCEMENTS,
  ALL_BADGES
} from './data';
import { Resource, VideoLesson, GameItem, Quiz, StudentStats, QuizHistory, UserRole, GradeType } from './types';
import { playSuccessMelody } from './utils/audio';
import {
  seedDatabaseIfEmpty,
  fetchResourcesFromDb,
  saveResourceToDb,
  deleteResourceFromDb,
  fetchVideosFromDb,
  saveVideoToDb,
  deleteVideoFromDb,
  fetchGamesFromDb,
  saveGameToDb,
  deleteGameFromDb,
  fetchQuizzesFromDb,
  saveQuizToDb,
  deleteQuizFromDb,
  fetchQuizHistoryFromDb,
  saveQuizHistoryToDb,
  fetchStatsFromDb,
  saveStatsToDb
} from './lib/firebase';

// Declaring initial tracker state with referenced badges
const INITIAL_STATS: StudentStats = {
  videosWatched: 2,
  gamesPlayed: 1,
  quizzesCompleted: 1,
  totalQuizScore: 18,
  learningTimeMinutes: 45,
  completedResourceIds: [],
  badges: ALL_BADGES.map((b, idx) => ({
    ...b,
    // Pre-unlock first badge for nice demo experience
    unlockedAt: idx === 0 ? '2026-07-03' : undefined
  }))
};

export default function App() {
  // 1. Core global routing and navigation states
  const [role, setRole] = useState<UserRole>('student');
  const [selectedGrade, setSelectedGrade] = useState<GradeType>('1');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isFirebaseBlocked, setIsFirebaseBlocked] = useState<boolean>(false);
  const [showRulesInstructionModal, setShowRulesInstructionModal] = useState<boolean>(false);

  // 2. Raw state storage
  const [resources, rawSetResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [videos, rawSetVideos] = useState<VideoLesson[]>(INITIAL_VIDEOS);
  const [games, rawSetGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [quizzes, rawSetQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);

  // 3. User tracking analytics states
  const [stats, rawSetStats] = useState<StudentStats>(INITIAL_STATS);
  const [quizHistory, rawSetQuizHistory] = useState<QuizHistory[]>([
    {
      id: 'hist-demo',
      quizId: 'quiz-1',
      quizTitle: 'Kiểm Tra Học Kỳ 1: Chữ cái và Âm vần',
      grade: '1',
      score: 10,
      totalQuestions: 3,
      date: '2026-07-03',
      timeSpentSeconds: 120
    }
  ]);

  // Transparent Firestore Synchronization Wrappers
  const setResources = (updateFn: React.SetStateAction<Resource[]>) => {
    rawSetResources((prev) => {
      const next = typeof updateFn === 'function' ? (updateFn as Function)(prev) : updateFn;
      setTimeout(() => {
        // Deletions
        prev.forEach((oldItem) => {
          if (!next.some((newItem: Resource) => newItem.id === oldItem.id)) {
            deleteResourceFromDb(oldItem.id).catch((err) => {
              console.warn("Delete resource failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
        // Additions or Edits
        next.forEach((newItem: Resource) => {
          const oldItem = prev.find((o) => o.id === newItem.id);
          if (!oldItem || JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            saveResourceToDb(newItem).catch((err) => {
              console.warn("Save resource failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
      }, 0);
      return next;
    });
  };

  const setVideos = (updateFn: React.SetStateAction<VideoLesson[]>) => {
    rawSetVideos((prev) => {
      const next = typeof updateFn === 'function' ? (updateFn as Function)(prev) : updateFn;
      setTimeout(() => {
        // Deletions
        prev.forEach((oldItem) => {
          if (!next.some((newItem: VideoLesson) => newItem.id === oldItem.id)) {
            deleteVideoFromDb(oldItem.id).catch((err) => {
              console.warn("Delete video failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
        // Additions or Edits
        next.forEach((newItem: VideoLesson) => {
          const oldItem = prev.find((o) => o.id === newItem.id);
          if (!oldItem || JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            saveVideoToDb(newItem).catch((err) => {
              console.warn("Save video failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
      }, 0);
      return next;
    });
  };

  const setGames = (updateFn: React.SetStateAction<GameItem[]>) => {
    rawSetGames((prev) => {
      const next = typeof updateFn === 'function' ? (updateFn as Function)(prev) : updateFn;
      setTimeout(() => {
        // Deletions
        prev.forEach((oldItem) => {
          if (!next.some((newItem: GameItem) => newItem.id === oldItem.id)) {
            deleteGameFromDb(oldItem.id).catch((err) => {
              console.warn("Delete game failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
        // Additions or Edits
        next.forEach((newItem: GameItem) => {
          const oldItem = prev.find((o) => o.id === newItem.id);
          if (!oldItem || JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            saveGameToDb(newItem).catch((err) => {
              console.warn("Save game failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
      }, 0);
      return next;
    });
  };

  const setQuizzes = (updateFn: React.SetStateAction<Quiz[]>) => {
    rawSetQuizzes((prev) => {
      const next = typeof updateFn === 'function' ? (updateFn as Function)(prev) : updateFn;
      setTimeout(() => {
        // Deletions
        prev.forEach((oldItem) => {
          if (!next.some((newItem: Quiz) => newItem.id === oldItem.id)) {
            deleteQuizFromDb(oldItem.id).catch((err) => {
              console.warn("Delete quiz failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
        // Additions or Edits
        next.forEach((newItem: Quiz) => {
          const oldItem = prev.find((o) => o.id === newItem.id);
          if (!oldItem || JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            saveQuizToDb(newItem).catch((err) => {
              console.warn("Save quiz failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
      }, 0);
      return next;
    });
  };

  const setQuizHistory = (updateFn: React.SetStateAction<QuizHistory[]>) => {
    rawSetQuizHistory((prev) => {
      const next = typeof updateFn === 'function' ? (updateFn as Function)(prev) : updateFn;
      setTimeout(() => {
        next.forEach((newItem: QuizHistory) => {
          const oldItem = prev.find((o) => o.id === newItem.id);
          if (!oldItem) {
            saveQuizHistoryToDb(newItem).catch((err) => {
              console.warn("Save quiz history failed (using local sandbox mode):", err);
              setIsFirebaseBlocked(true);
            });
          }
        });
      }, 0);
      return next;
    });
  };

  const setStats = (updateFn: React.SetStateAction<StudentStats>) => {
    rawSetStats((prev) => {
      const next = typeof updateFn === 'function' ? (updateFn as Function)(prev) : updateFn;
      setTimeout(() => {
        saveStatsToDb('current_student', next).catch((err) => {
          console.warn("Save stats failed (using local sandbox mode):", err);
          setIsFirebaseBlocked(true);
        });
      }, 0);
      return next;
    });
  };

  // 4. Initial Database loading & seeding
  useEffect(() => {
    async function loadFirebaseData() {
      try {
        // First seed Firestore collections if they are completely empty
        await seedDatabaseIfEmpty(
          INITIAL_RESOURCES,
          INITIAL_VIDEOS,
          INITIAL_GAMES,
          INITIAL_QUIZZES
        );

        const loadedResources = await fetchResourcesFromDb();
        if (loadedResources && loadedResources.length > 0) {
          rawSetResources(loadedResources);
        }

        const loadedVideos = await fetchVideosFromDb();
        if (loadedVideos && loadedVideos.length > 0) {
          rawSetVideos(loadedVideos);
        }

        const loadedGames = await fetchGamesFromDb();
        if (loadedGames && loadedGames.length > 0) {
          rawSetGames(loadedGames);
        }

        const loadedQuizzes = await fetchQuizzesFromDb();
        if (loadedQuizzes && loadedQuizzes.length > 0) {
          rawSetQuizzes(loadedQuizzes);
        }

        const loadedHistory = await fetchQuizHistoryFromDb();
        if (loadedHistory && loadedHistory.length > 0) {
          rawSetQuizHistory(loadedHistory);
        }

        const loadedStats = await fetchStatsFromDb('current_student');
        if (loadedStats) {
          rawSetStats(loadedStats);
        }
      } catch (err) {
        console.warn("Failed to load records from Firestore (Operating in Sandbox local mode): ", err);
        setIsFirebaseBlocked(true);
      }
    }
    loadFirebaseData();
  }, []);

  // 5. Playback and active challenge selectors
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  // 5. Utility methods for interactive video tracking
  const toggleFavoriteVideo = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  const toggleCompleteVideo = (id: string) => {
    setVideos((prev) => {
      const target = prev.find((v) => v.id === id);
      if (target && !target.isCompleted) {
        // Track stats
        setStats((s) => ({
          ...s,
          videosWatched: s.videosWatched + 1,
          learningTimeMinutes: s.learningTimeMinutes + 12,
        }));
        playSuccessMelody();
      }
      return prev.map((v) => (v.id === id ? { ...v, isCompleted: !v.isCompleted } : v));
    });
  };

  const toggleFavoriteResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updatedFav = !r.isFavorite;
          // Dynamically award Bookmarking badge if child hits 5 favorites!
          const activeFavoritesCount = prev.filter(item => item.isFavorite).length + (updatedFav ? 1 : -1);
          if (activeFavoritesCount >= 5) {
            setStats(s => ({
              ...s,
              badges: s.badges.map(b => b.id === 'badge-5' ? { ...b, unlockedAt: new Date().toISOString().split('T')[0] } : b)
            }));
          }
          return { ...r, isFavorite: updatedFav };
        }
        return r;
      })
    );
  };

  // Helper selectors to navigate smoothly when clicking "Học ngay" cards
  const handleLaunchVideo = (vid: VideoLesson) => {
    setSelectedVideo(vid);
    setActiveTab('videos');
  };

  const handleLaunchGame = (g: GameItem) => {
    setSelectedGame(g);
    setActiveTab('games');
  };

  const handleLaunchQuiz = (q: Quiz) => {
    setSelectedQuiz(q);
    setActiveTab('quizzes');
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white pb-12">
      {/* Dynamic Header */}
      <Header
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        role={role}
        setRole={setRole}
        stats={stats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Firebase Blocked / Rules Misconfigured banner */}
      {isFirebaseBlocked && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-sm">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="flex items-start sm:items-center gap-2">
              <span className="text-base sm:text-lg shrink-0">⚠️</span>
              <span>
                <strong>Hệ thống đang chạy ở Chế độ Thử nghiệm (Local Sandbox):</strong> Firestore của bạn đang chặn quyền Đọc/Ghi do chưa cài đặt Rules bảo mật. Mọi thay đổi của bạn sẽ chỉ lưu tạm thời trên trình duyệt!
              </span>
            </span>
            <button
              onClick={() => setShowRulesInstructionModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-2xs sm:text-xs transition-all shadow-sm hover:shadow cursor-pointer self-start md:self-auto"
            >
              Xem hướng dẫn thiết lập Rules ↗
            </button>
          </div>
        </div>
      )}

      {/* Rules instruction modal */}
      {showRulesInstructionModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 relative">
              <button 
                onClick={() => setShowRulesInstructionModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-all bg-white/10 hover:bg-white/25 rounded-full p-1.5 cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
              <h3 className="font-display font-extrabold text-base sm:text-lg">Hướng dẫn cập nhật Rules cho Firebase</h3>
              <p className="text-xs text-white/80 mt-1">Cần áp dụng các cấu hình bảo mật này để ứng dụng của bạn có thể đồng bộ hóa dữ liệu thực.</p>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>Mặc định cơ sở dữ liệu Firestore mới khởi tạo sẽ chặn tất cả quyền Đọc và Ghi. Để kích hoạt hệ thống lưu dữ liệu thực tế, vui lòng làm theo hướng dẫn sau:</p>
              
              <ol className="list-decimal list-inside space-y-2 font-medium text-slate-700">
                <li>Mở <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">Firebase Console</a> và chọn dự án của bạn.</li>
                <li>Tìm chọn menu <strong className="text-amber-600">Firestore Database</strong> từ cột bên trái.</li>
                <li>Chọn tab <strong className="text-amber-600">Rules</strong> ở phía bên trên.</li>
                <li>Xóa toàn bộ code cũ và thay thế bằng đoạn mã Rules bảo mật đã tối ưu dưới đây:</li>
              </ol>

              <div className="relative bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-[11px] overflow-x-auto max-h-52 border border-slate-800">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(FIRESTORE_RULES_TEXT);
                    alert("Đã sao chép Rules vào Clipboard!");
                  }}
                  className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-3xs px-2 py-1 rounded font-sans cursor-pointer transition-all active:scale-95"
                >
                  Sao chép Rules
                </button>
                <pre>{FIRESTORE_RULES_TEXT}</pre>
              </div>

              <ol className="list-decimal list-inside space-y-2 font-medium text-slate-700" start={5}>
                <li>Nhấn nút <strong className="text-amber-600">Publish</strong> để cập nhật.</li>
                <li>Tải lại trang ứng dụng (F5) để kiểm tra kết quả đồng bộ thành công!</li>
              </ol>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowRulesInstructionModal(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content stage wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {(() => {
          switch (activeTab) {
            case 'home':
              return (
                <Home
                  resources={resources}
                  videos={videos}
                  games={games}
                  quizzes={quizzes}
                  announcements={INITIAL_ANNOUNCEMENTS}
                  setCurrentTab={setActiveTab}
                  setSelectedGrade={setSelectedGrade}
                  toggleFavoriteResource={toggleFavoriteResource}
                  onSelectVideo={handleLaunchVideo}
                  onSelectGame={handleLaunchGame}
                  onSelectQuiz={handleLaunchQuiz}
                />
              );

            case 'learning-path':
              return (
                <LearningPath
                  stats={stats}
                  setStats={setStats}
                  videos={videos}
                  games={games}
                  quizzes={quizzes}
                  onSelectVideo={handleLaunchVideo}
                  onSelectGame={handleLaunchGame}
                  onSelectQuiz={handleLaunchQuiz}
                  setCurrentTab={setActiveTab}
                />
              );

            case 'grades':
            case 'grade':
              return (
                <GradeDetail
                  selectedGrade={selectedGrade}
                  setSelectedGrade={setSelectedGrade}
                  resources={resources}
                  videos={videos}
                  games={games}
                  quizzes={quizzes}
                  onSelectVideo={handleLaunchVideo}
                  onSelectGame={handleLaunchGame}
                  onSelectQuiz={handleLaunchQuiz}
                  setCurrentTab={setActiveTab}
                />
              );

            case 'resources':
              return (
                <ResourcesStore
                  resources={resources}
                  setResources={setResources}
                  role={role}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              );

            case 'videos':
              return (
                <VideoPlayer
                  selectedVideo={selectedVideo}
                  allVideos={videos}
                  onSelectVideo={setSelectedVideo}
                  toggleFavoriteVideo={toggleFavoriteVideo}
                  toggleCompleteVideo={toggleCompleteVideo}
                />
              );

            case 'games':
              return (
                <GamesCenter
                  games={games}
                  stats={stats}
                  setStats={setStats}
                  selectedGame={selectedGame}
                  setSelectedGame={setSelectedGame}
                />
              );

            case 'quizzes':
              return (
                <QuizCenter
                  quizzes={quizzes}
                  stats={stats}
                  setStats={setStats}
                  quizHistory={quizHistory}
                  setQuizHistory={setQuizHistory}
                  selectedQuiz={selectedQuiz}
                  setSelectedQuiz={setSelectedQuiz}
                />
              );

            case 'analytics':
              return <Analytics stats={stats} />;

            case 'ai-tutor':
            case 'tutor':
              return <AIAssistant selectedGrade={selectedGrade} />;

            case 'dashboard':
              return (
                <TeacherDashboard
                  resources={resources}
                  setResources={setResources}
                  videos={videos}
                  setVideos={setVideos}
                  games={games}
                  setGames={setGames}
                  quizzes={quizzes}
                  setQuizzes={setQuizzes}
                />
              );

            default:
              return (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-slate-100">
                  <h3 className="font-display font-bold text-slate-800">Mục lục này đang được thiết lập!</h3>
                </div>
              );
          }
        })()}
      </main>
    </div>
  );
}
