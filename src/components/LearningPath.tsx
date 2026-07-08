/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Map,
  User,
  CheckCircle2,
  Lock,
  Trophy,
  Sparkles,
  BookOpen,
  Gamepad2,
  FileText,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  Compass,
  Award,
  Play,
  ArrowRight
} from 'lucide-react';
import { GameItem, StudentStats, Quiz } from '../types';

interface LearningPathProps {
  stats: StudentStats;
  setStats: React.Dispatch<React.SetStateAction<StudentStats>>;
  videos: any[];
  games: GameItem[];
  quizzes: Quiz[];
  onSelectVideo: (v: any) => void;
  onSelectGame: (g: any) => void;
  onSelectQuiz: (q: any) => void;
  setCurrentTab: (tab: string) => void;
}

export default function LearningPath({
  stats,
  setStats,
  videos,
  games,
  quizzes,
  onSelectVideo,
  onSelectGame,
  onSelectQuiz,
  setCurrentTab,
}: LearningPathProps) {
  // Profiles for personalization
  const [selectedLevel, setSelectedLevel] = useState<'co_ban' | 'trung_binh' | 'thu_thach'>('co_ban');
  const [activeNodeId, setActiveNodeId] = useState<number>(1);

  // Simulate unlocking map based on completed counts
  const unlockedNodes = [1];
  if (stats.gamesPlayed >= 1) unlockedNodes.push(2);
  if (stats.gamesPlayed >= 3 || stats.quizzesCompleted >= 1) unlockedNodes.push(3);
  if (stats.gamesPlayed >= 5 || stats.totalQuizScore >= 50) unlockedNodes.push(4);
  if (stats.gamesPlayed >= 8 || stats.totalQuizScore >= 100) unlockedNodes.push(5);

  const completedNodes = [1];
  if (stats.gamesPlayed >= 2) completedNodes.push(1, 2);
  if (stats.gamesPlayed >= 4) completedNodes.push(1, 2, 3);
  if (stats.gamesPlayed >= 7) completedNodes.push(1, 2, 3, 4);

  // Map nodes definitions
  const MAP_NODES = [
    {
      id: 1,
      title: 'Đảo Ngọc Âm Vần',
      focus: 'Âm đầu, Vần, Ghép tiếng Việt',
      emoji: '🏝️',
      description: 'Làm quen với cấu trúc âm tiết cơ bản, vần chính tả l/n, ch/tr, s/x.',
      recs: {
        videoId: 'vid-1', // Vua Tiếng Việt Nhí: Âm Đầu & Vần
        gameId: 'game-ban-bi', // Bắn Bi Sắc Màu
        quizId: 'quiz-1', // Chữ cái & Âm vần Lớp 1
      }
    },
    {
      id: 2,
      title: 'Vương Quốc Từ Vựng',
      focus: 'Từ láy, Từ ghép, Nghĩa của từ',
      emoji: '🏰',
      description: 'Khám phá thế giới từ vựng phong phú: Từ đồng nghĩa, trái nghĩa và phân loại cấu trúc từ.',
      recs: {
        videoId: 'vid-2', // Mẹo Phân Biệt Từ Láy và Từ Ghép
        gameId: 'game-hung-tao', // Hứng Táo Vườn Hồng
        quizId: 'quiz-3', // Từ Đồng Nghĩa & Trái Nghĩa Lớp 5
      }
    },
    {
      id: 3,
      title: 'Rừng Xanh Ngữ Pháp',
      focus: 'Danh từ, Động từ, Trật tự từ',
      emoji: '🌲',
      description: 'Nắm vững quy tắc cấu tạo câu, vai trò các loại từ trong câu tiếng Việt.',
      recs: {
        videoId: 'vid-3', // Luyện từ và câu
        gameId: 'game-merio', // Merio Phiêu Lưu Ký
        quizId: 'quiz-2', // Luyện Từ Và Câu Lớp 3
      }
    },
    {
      id: 4,
      title: 'Thung Lũng Diễn Đạt',
      focus: 'So sánh, Nhân hóa, Ca dao',
      emoji: '🏞️',
      description: 'Học cách sử dụng biện pháp nghệ thuật tu từ để bài văn sinh động, mượt mà hơn.',
      recs: {
        videoId: 'vid-1',
        gameId: 'game-ban-cung', // Bắn Cung Thần Tốc
        quizId: 'quiz-2',
      }
    },
    {
      id: 5,
      title: 'Đỉnh Cao Chinh Phục',
      focus: 'Cảm thụ văn học & Idioms',
      emoji: '🏔️',
      description: 'Phân tích các câu tục ngữ thành ngữ đặc sắc và rèn luyện cảm thụ văn học lớp 5.',
      recs: {
        videoId: 'vid-3',
        gameId: 'game-3', // Vòng quay từ đồng nghĩa
        quizId: 'quiz-3',
      }
    }
  ];

  // Adjust active index or active recommendations depending on level selection
  const getLevelAdjustment = () => {
    switch (selectedLevel) {
      case 'co_ban':
        return {
          title: 'Gà Con Lon Ton 🐥',
          gradeRange: 'Khối lớp 1 - 2',
          desc: 'Tập trung luyện âm vần, nhận diện từ đơn, ghép chữ cái chính tả.',
          color: 'from-amber-400 to-orange-500 text-amber-900',
          borderColor: 'border-amber-300'
        };
      case 'trung_binh':
        return {
          title: 'Sói Con Tinh Nghịch 🦊',
          gradeRange: 'Khối lớp 3 - 4',
          desc: 'Tập trung luyện từ loại, câu đố ca dao tục ngữ và phép so sánh nghệ thuật.',
          color: 'from-sky-400 to-indigo-500 text-sky-900',
          borderColor: 'border-sky-300'
        };
      case 'thu_thach':
        return {
          title: 'Phượng Hoàng Thông Thái 🦅',
          gradeRange: 'Khối lớp 5 / Luyện nâng cao',
          desc: 'Cảm thụ văn học, thành ngữ điển tích phức tạp và cấu trúc câu đặc biệt.',
          color: 'from-purple-500 to-pink-500 text-purple-950',
          borderColor: 'border-purple-300'
        };
    }
  };

  const currentLevelInfo = getLevelAdjustment();
  const selectedNode = MAP_NODES.find(n => n.id === activeNodeId) || MAP_NODES[0];

  // Resolve actual models
  const recommendedVideo = videos.find(v => v.id === selectedNode.recs.videoId) || videos[0];
  const recommendedGame = games.find(g => g.id === selectedNode.recs.gameId) || games[0];
  const recommendedQuiz = quizzes.find(q => q.id === selectedNode.recs.quizId) || quizzes[0];

  const handleLaunchRecGame = (game: GameItem) => {
    onSelectGame(game);
    setCurrentTab('games');
  };

  const handleLaunchRecVideo = (video: any) => {
    onSelectVideo(video);
    setCurrentTab('videos');
  };

  const handleLaunchRecQuiz = (quiz: Quiz) => {
    onSelectQuiz(quiz);
    setCurrentTab('quizzes');
  };

  return (
    <div className="space-y-6" id="learning-path-view">
      
      {/* Upper Personalized Banner */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-500 animate-spin-slow" />
            <h2 className="text-lg font-display font-bold text-slate-800">Lộ Trình Học Tập Cá Nhân Hóa</h2>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xl">
            Hệ thống phân hóa lộ trình học phù hợp với từng khối lớp và năng lực riêng của em. Hoàn thành các chặng phiêu lưu dưới đây để nhận huân chương tri thức!
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <span className="text-4xs font-bold uppercase tracking-wider text-slate-400 self-center">Cấp độ của em:</span>
          <div className="bg-slate-100 p-1 rounded-2xl flex w-full sm:w-auto">
            <button
              onClick={() => { setSelectedLevel('co_ban'); setActiveNodeId(1); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedLevel === 'co_ban' ? 'bg-amber-400 text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Cơ bản 🐥
            </button>
            <button
              onClick={() => { setSelectedLevel('trung_binh'); setActiveNodeId(2); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedLevel === 'trung_binh' ? 'bg-sky-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Trung bình 🦊
            </button>
            <button
              onClick={() => { setSelectedLevel('thu_thach'); setActiveNodeId(3); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedLevel === 'thu_thach' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Thử thách 🦅
            </button>
          </div>
        </div>
      </div>

      {/* Current Profile Card & Analytics */}
      <div className={`bg-gradient-to-r ${currentLevelInfo.color} p-6 rounded-3xl border-2 ${currentLevelInfo.borderColor} shadow-xs flex flex-col md:flex-row gap-6 items-center justify-between text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
            {selectedLevel === 'co_ban' ? '🐥' : selectedLevel === 'trung_binh' ? '🦊' : '🦅'}
          </div>
          <div className="space-y-1">
            <span className="text-3xs uppercase font-extrabold tracking-widest bg-white/20 px-2 py-0.5 rounded-full">{currentLevelInfo.gradeRange}</span>
            <h3 className="text-base font-display font-extrabold">{currentLevelInfo.title}</h3>
            <p className="text-xs text-white/90 leading-normal max-w-md">{currentLevelInfo.desc}</p>
          </div>
        </div>

        {/* Profile Progress */}
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl w-full md:w-56 shrink-0 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Tiến độ bản đồ</span>
            <span className="font-extrabold text-sm">{unlockedNodes.length * 20}%</span>
          </div>
          <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: `${unlockedNodes.length * 20}%` }} />
          </div>
          <p className="text-[10px] text-white/80 leading-snug font-medium">Chơi game và đạt điểm kiểm tra để tự động khai phá thêm bản đồ.</p>
        </div>
      </div>

      {/* Main Map & Recommendations Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Game Map Adventure Stage (3/5 width) */}
        <div className="flex-1 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-2xs flex flex-col justify-between relative overflow-hidden min-h-[480px]">
          
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/20 to-emerald-50/20 pointer-events-none" />

          {/* Stepping Road Background Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-4/5 text-dashed stroke-slate-200" style={{ strokeDasharray: '8,8' }}>
              <path d="M 50 150 Q 200 50 350 200 T 650 100" fill="none" strokeWidth="4" />
            </svg>
          </div>

          <div className="z-10 flex items-center gap-2 pb-6 border-b border-slate-50">
            <Map className="w-5 h-5 text-emerald-500 animate-bounce" />
            <h3 className="font-display font-bold text-sm text-slate-800">Bản Đồ Hành Trình Tiếng Việt</h3>
          </div>

          {/* Interactive Nodes Stage */}
          <div className="relative py-12 flex flex-col md:flex-row items-center justify-around gap-6 z-10">
            {MAP_NODES.map((node, index) => {
              const isUnlocked = unlockedNodes.includes(node.id);
              const isCompleted = completedNodes.includes(node.id);
              const isActive = activeNodeId === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setActiveNodeId(node.id);
                    }
                  }}
                  className={`flex flex-col items-center gap-2 group transition-all duration-300 relative focus:outline-none ${
                    isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  }`}
                >
                  {/* Glowing Pulse for Active Node */}
                  {isActive && (
                    <span className="absolute -inset-2.5 bg-emerald-100 rounded-full animate-ping opacity-60 pointer-events-none" />
                  )}

                  {/* Circle Button Element */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 shadow-sm relative transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-md rotate-6'
                      : isCompleted
                        ? 'bg-sky-50 border-sky-200 hover:bg-sky-100 hover:scale-105'
                        : isUnlocked
                          ? 'bg-white border-amber-300 hover:border-amber-400 hover:scale-105'
                          : 'bg-slate-100 border-slate-200'
                  }`}>
                    {isUnlocked ? (
                      <span>{node.emoji}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-slate-400" />
                    )}

                    {/* Completion Check Bubble */}
                    {isCompleted && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Title labels */}
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Chặng {node.id}</span>
                    <h4 className={`text-xs font-bold leading-tight ${isActive ? 'text-emerald-600 font-extrabold' : 'text-slate-700'}`}>
                      {node.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepping Stone Guide Details */}
          <div className="mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 z-10">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <span>{selectedNode.emoji}</span> {selectedNode.title}: <span className="text-slate-500">{selectedNode.focus}</span>
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              {selectedNode.description}
            </p>
          </div>
        </div>

        {/* Right Side: Adaptive Personalized Recommendations Panel (2/5 width) */}
        <div className="w-full lg:w-2/5 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              <h3 className="font-display font-bold text-sm text-slate-800">Đề Xuất Phù Hợp Cho Em</h3>
            </div>

            <div className="space-y-3.5">
              
              {/* 1. Theory recommendation */}
              {recommendedVideo && (
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex gap-3.5 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Lý Thuyết Học</span>
                      <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1 mt-0.5">{recommendedVideo.title || "Video Bài Giảng Sinh Động"}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold line-clamp-1">Xem video để củng cố gốc kiến thức</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLaunchRecVideo(recommendedVideo)}
                    className="p-2 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-full border border-slate-150 transition-all cursor-pointer shadow-3xs"
                    aria-label="Xem video học liệu"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              )}

              {/* 2. Interactive Game recommendation */}
              {recommendedGame && (
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex gap-3.5 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Trò Chơi Mẫu</span>
                      <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1 mt-0.5">{recommendedGame.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold line-clamp-1">Học thông qua trò chơi tương tác</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLaunchRecGame(recommendedGame)}
                    className="p-2 bg-white hover:bg-emerald-50 hover:text-emerald-500 text-slate-400 rounded-full border border-slate-150 transition-all cursor-pointer shadow-3xs"
                    aria-label="Chơi game"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 3. Quiz assessment recommendation */}
              {recommendedQuiz && (
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex gap-3.5 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Khảo Sát Năng Lực</span>
                      <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1 mt-0.5">{recommendedQuiz.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold line-clamp-1">Bài luyện tập trắc nghiệm nhanh</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLaunchRecQuiz(recommendedQuiz)}
                    className="p-2 bg-white hover:bg-amber-50 hover:text-amber-500 text-slate-400 rounded-full border border-slate-150 transition-all cursor-pointer shadow-3xs"
                    aria-label="Bắt đầu kiểm tra"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Quick Quest Dashboard (Nhiệm vụ tuần) */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100/50 space-y-2.5">
            <h4 className="text-2xs font-extrabold uppercase text-indigo-700 tracking-wider flex items-center gap-1">
              <Award className="w-4 h-4 text-indigo-500 animate-bounce" /> Thử Thách Nhiệm Vụ Tuần
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Xem ít nhất 2 video bài giảng (Đã xong)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold">
                {stats.gamesPlayed >= 3 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full shrink-0" />
                )}
                <span>Trải nghiệm 3 game tương tác ({stats.gamesPlayed}/3)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold">
                {stats.quizzesCompleted >= 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full shrink-0" />
                )}
                <span>Hoàn thành 2 bài khảo sát ({stats.quizzesCompleted}/2)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
