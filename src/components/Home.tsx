/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  BookOpen,
  PlayCircle,
  Gamepad2,
  FileCheck2,
  Bell,
  ArrowRight,
  Heart,
  ChevronRight,
  Calendar,
  UserCheck
} from 'lucide-react';
import { Resource, VideoLesson, GameItem, Quiz, Announcement, GradeType } from '../types';

interface HomeProps {
  resources: Resource[];
  videos: VideoLesson[];
  games: GameItem[];
  quizzes: Quiz[];
  announcements: Announcement[];
  setCurrentTab: (tab: string) => void;
  setSelectedGrade: (grade: GradeType) => void;
  toggleFavoriteResource: (id: string) => void;
  onSelectVideo: (video: VideoLesson) => void;
  onSelectGame: (game: GameItem) => void;
  onSelectQuiz: (quiz: Quiz) => void;
}

export default function Home({
  resources,
  videos,
  games,
  quizzes,
  announcements,
  setCurrentTab,
  setSelectedGrade,
  toggleFavoriteResource,
  onSelectVideo,
  onSelectGame,
  onSelectQuiz,
}: HomeProps) {
  
  // Custom theme styling for each Grade card with vibrant, high-contrast, beautiful organic colors
  const gradeCards = [
    { num: '1' as GradeType, label: 'Lớp 1', borderCol: 'border-[#005cbf]', bgCol: 'bg-gradient-to-br from-[#00D2FF] to-[#0066FF] text-white', badgeBg: 'bg-white text-[#0066FF]', hoverShadow: 'hover:shadow-[0_15px_30px_rgba(0,102,255,0.45)]', emoji: '🌱', desc: 'Chữ cái & Âm vần' },
    { num: '2' as GradeType, label: 'Lớp 2', borderCol: 'border-[#1b9e54]', bgCol: 'bg-gradient-to-br from-[#2ECC71] to-[#11998E] text-white', badgeBg: 'bg-white text-[#11998E]', hoverShadow: 'hover:shadow-[0_15px_30px_rgba(46,204,113,0.45)]', emoji: '🌿', desc: 'Từ vựng & Ngữ pháp' },
    { num: '3' as GradeType, label: 'Lớp 3', borderCol: 'border-[#d68910]', bgCol: 'bg-gradient-to-br from-[#FFD000] to-[#FF8C00] text-white', badgeBg: 'bg-white text-[#FF8C00]', hoverShadow: 'hover:shadow-[0_15px_30px_rgba(255,208,0,0.45)]', emoji: '🌳', desc: 'So sánh & Nhân hóa' },
    { num: '4' as GradeType, label: 'Lớp 4', borderCol: 'border-[#ba4a00]', bgCol: 'bg-gradient-to-br from-[#FF5E62] to-[#FF9966] text-white', badgeBg: 'bg-white text-[#FF5E62]', hoverShadow: 'hover:shadow-[0_15px_30px_rgba(255,94,98,0.45)]', emoji: '🍂', desc: 'Từ ghép & Từ láy' },
    { num: '5' as GradeType, label: 'Lớp 5', borderCol: 'border-[#6c3483]', bgCol: 'bg-gradient-to-br from-[#A55EEA] to-[#8854D0] text-white', badgeBg: 'bg-white text-[#8854D0]', hoverShadow: 'hover:shadow-[0_15px_30px_rgba(165,94,234,0.45)]', emoji: '🍎', desc: 'Từ đồng âm, đồng nghĩa' },
  ];

  const featuredResources = resources.filter(r => r.isFavorite).slice(0, 3);
  const activeAnnouncements = announcements.slice(0, 3);

  const getResourceTypeLabel = (type: string) => {
    switch(type) {
      case 'youtube': return '📹 YouTube Video';
      case 'google_drive': return '📁 Google Drive';
      case 'google_slides': return '📊 Google Slides';
      case 'canva': return '🎨 Canva Design';
      case 'wordwall': return '🎮 Wordwall Game';
      case 'quizizz': return '⚡ Quizizz Quizz';
      case 'kahoot': return '🔥 Kahoot Quizz';
      default: return '🌐 Website';
    }
  };

  const getAnnBadgeStyle = (type: string) => {
    switch(type) {
      case 'success': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'event': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-sky-100 text-sky-700 border-sky-200';
    }
  };

  return (
    <div className="space-y-10" id="home-view">
      {/* 1. Creative Welcome Hero Banner in Warm Sunset Coral/Peach gradient */}
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#FF7675] via-[#FAB1A0] to-amber-400 text-white p-8 md:p-12 shadow-md border border-[#FF7675]/10" id="welcome-hero">
        <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-yellow-200/20 rounded-full blur-xl animate-pulse" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Kho học liệu số phiên bản mới 2026</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight drop-shadow-sm">
            Khám phá Tiếng Việt <br />Bản sắc bốn phương!
          </h2>
          <p className="text-base md:text-lg text-white/90 leading-relaxed font-medium">
            Học tập thông qua video tương tác sinh động, tranh ảnh đầy màu sắc và các trò chơi lý thú. Giúp các em tự tin làm chủ tiếng mẹ đẻ và rinh vạn điểm 10 học kỳ!
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('grades')}
              className="px-6 py-3 bg-white text-[#FF7675] hover:text-[#e85a58] rounded-full font-display font-bold shadow-sm hover:bg-gray-50 transition-all duration-200 transform active:scale-95 flex items-center gap-2"
            >
              Vào học ngay <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('ai-tutor')}
              className="px-6 py-3 bg-[#0984E3] hover:bg-[#0873c4] border border-[#0984E3]/30 text-white rounded-full font-display font-bold shadow-sm transition-all duration-200 transform active:scale-95 flex items-center gap-2"
            >
              Hỏi Trợ lý AI <Sparkles className="w-4 h-4 text-yellow-300" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Grade Card Selector */}
      <section className="space-y-4" id="grade-selector-sec">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-8 bg-[#0984E3] rounded-full" />
            <h3 className="text-xl font-display font-bold text-blue-900">Chọn khối lớp của bé</h3>
          </div>
          <button onClick={() => setCurrentTab('grades')} className="text-[#0984E3] text-xs font-bold hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {gradeCards.map((grade) => (
            <button
              key={grade.num}
              onClick={() => {
                setSelectedGrade(grade.num);
                setCurrentTab('grades');
              }}
              className={`p-5 rounded-[32px] border-b-4 ${grade.borderCol} ${grade.bgCol} ${grade.hoverShadow} relative overflow-hidden flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group min-h-[190px] shadow-sm`}
            >
              {/* Decorative light circle in background */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-300" />
              
              {/* Emoji header row */}
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-3xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {grade.emoji}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-80 px-2 py-0.5 bg-black/10 rounded-full">
                  Tiếng Việt
                </span>
              </div>

              {/* Huge popping circle for the GRADE NUMBER */}
              <div className="my-2 relative z-10">
                <div className={`w-14 h-14 rounded-full ${grade.badgeBg} shadow-md flex items-center justify-center font-display font-black text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ring-4 ring-white/30`}>
                  {grade.num}
                </div>
              </div>

              {/* Grade Label and description with high readability */}
              <div className="w-full relative z-10">
                <h4 className="font-display font-extrabold text-base tracking-tight leading-tight text-white drop-shadow-xs">
                  Khối Lớp {grade.num}
                </h4>
                <p className="text-[10px] text-white/90 font-medium mt-1 line-clamp-1 leading-normal">
                  {grade.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Notification Corner & Featured Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-dashboard-grid">
        {/* Featured Learning Resources (Left & Center) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-8 bg-[#FF7675] rounded-full" />
              <h3 className="text-xl font-display font-bold text-blue-900">Học liệu số nổi bật</h3>
            </div>
            <button
              onClick={() => setCurrentTab('resources')}
              className="text-sm font-bold text-[#0984E3] hover:text-[#0873c4] flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredResources.map((res) => (
              <div key={res.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md hover:translate-y-[-4px] border border-blue-50/60 transition-all duration-300 flex flex-col group">
                <div className="h-40 relative overflow-hidden bg-slate-50">
                  <img
                    src={res.thumbnailUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'}
                    alt={res.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#FF7675] text-white font-display text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                    Lớp {res.grade}
                  </div>
                  <button
                    onClick={() => toggleFavoriteResource(res.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-transform duration-200 shadow-sm"
                    aria-label={res.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                  >
                    <Heart className={`w-4 h-4 ${res.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#0984E3] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/40">
                      {getResourceTypeLabel(res.type)}
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-800 line-clamp-1 mt-2">{res.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{res.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold">Người tạo: {res.creator}</span>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#FAB1A0]/10 text-orange-600 hover:bg-[#FAB1A0] hover:text-white rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1"
                    >
                      Mở liên kết
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Corner (Right Side Panel matching Design aside elements) */}
        <div className="space-y-6 flex flex-col">
          {/* Week Challenge Banner */}
          <div className="bg-[#FAB1A0] rounded-[40px] p-6 text-white relative overflow-hidden flex flex-col gap-2 shadow-sm">
            <div className="absolute top-[-10px] right-[-10px] text-6xl opacity-20">🎁</div>
            <h4 className="font-bold text-lg leading-tight font-display">Quà tặng tuần mới!</h4>
            <p className="text-xs opacity-90 font-medium leading-relaxed">Hoàn thành 5 bài học để nhận ngay huy hiệu "Ong Chăm Chỉ"</p>
            <button 
              onClick={() => setCurrentTab('grades')} 
              className="bg-white text-orange-500 font-bold text-xs py-2 px-4 rounded-full w-fit mt-2 shadow-2xs hover:bg-orange-50 active:scale-95 transition-all"
            >
              Tham gia ngay
            </button>
          </div>

          {/* Real Notification Sidebar */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-blue-50/60 flex flex-col flex-1">
            <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 font-display">
              🔔 Góc thông báo <span className="bg-red-500 w-2 h-2 rounded-full animate-pulse"></span>
            </h4>
            <div className="space-y-4">
              {activeAnnouncements.map((ann, idx) => {
                const emojis = ['👨‍🏫', '🏆', '📑'];
                const bgs = ['bg-blue-50', 'bg-yellow-50', 'bg-green-50'];
                const emoji = emojis[idx % emojis.length];
                const bg = bgs[idx % bgs.length];
                return (
                  <div key={ann.id} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-xs flex-shrink-0`}>
                      {emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{ann.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{ann.date} • {ann.content.slice(0, 45)}...</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Features Summary Row (Videos, Games, Quizzes) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" id="features-highlights">
        {/* Videos highlight */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-blue-50/60 hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-[#FF7675]">
              <PlayCircle className="w-7 h-7" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-800">Video bài giảng lý thú</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Tuyển tập video sinh động giảng giải chi tiết về âm, vần, ngữ pháp và các quy tắc từ vựng Tiếng Việt tiểu học.
            </p>
          </div>
          <button
            onClick={() => {
              if (videos.length > 0) onSelectVideo(videos[0]);
              setCurrentTab('grades');
            }}
            className="w-full py-2.5 bg-rose-50 text-[#FF7675] hover:bg-[#FF7675] hover:text-white rounded-full text-xs font-bold transition-all duration-200"
          >
            Học qua Video ngay
          </button>
        </div>

        {/* Games highlight */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-blue-50/60 hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-800">Trò chơi học tập bổ ích</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Vừa học vừa chơi cùng xứ sở ghép vần, đố vui ca dao tục ngữ và vòng quay từ đồng nghĩa siêu cuốn hút!
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('games')}
            className="w-full py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-full text-xs font-bold transition-all duration-200"
          >
            Chơi trò chơi học tập
          </button>
        </div>

        {/* Quizzes highlight */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-blue-50/60 hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0984E3]">
              <FileCheck2 className="w-7 h-7" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-800">Bài kiểm tra tự luyện</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Thử thách bản thân với câu hỏi trắc nghiệm, đúng sai, điền khuyết và nhận chấm điểm kèm lời giải chi tiết tức thì.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('quizzes')}
            className="w-full py-2.5 bg-blue-50 text-[#0984E3] hover:bg-[#0984E3] hover:text-white rounded-full text-xs font-bold transition-all duration-200"
          >
            Tự luyện kiểm tra
          </button>
        </div>
      </section>
    </div>
  );
}
