/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Trophy,
  Award,
  Clock,
  PlayCircle,
  Gamepad2,
  CheckCircle,
  Calendar,
  Sparkles,
  BookOpen,
  Zap,
  Heart
} from 'lucide-react';
import { StudentStats, Badge } from '../types';

interface AnalyticsProps {
  stats: StudentStats;
}

export default function Analytics({ stats }: AnalyticsProps) {
  
  // Quick calculations
  const totalItemsCount = stats.quizzesCompleted + stats.videosWatched + stats.gamesPlayed;
  const averageScore = stats.quizzesCompleted > 0 
    ? (stats.totalQuizScore / stats.quizzesCompleted).toFixed(1) 
    : '0';

  const completionRate = Math.min(Math.round((totalItemsCount / 15) * 100), 100);

  // Helper to map dynamic lucide icons safely
  const renderBadgeIcon = (name: string, unlocked: boolean) => {
    const cls = `w-8 h-8 ${unlocked ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`;
    switch(name) {
      case 'BookOpen': return <BookOpen className={cls} />;
      case 'Award': return <Award className={cls} />;
      case 'Gamepad2': return <Gamepad2 className={cls} />;
      case 'Zap': return <Zap className={cls} />;
      case 'Heart': return <Heart className={cls} />;
      default: return <Sparkles className={cls} />;
    }
  };

  return (
    <div className="space-y-6" id="analytics-view">
      
      {/* 1. Bento Grid Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Score */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-3xs text-center space-y-1">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Điểm Tích Luỹ</span>
          <p className="font-display font-extrabold text-lg text-slate-800">{stats.totalQuizScore} sao</p>
        </div>

        {/* Avg Quiz Score */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-3xs text-center space-y-1">
          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Điểm thi trung bình</span>
          <p className="font-display font-extrabold text-lg text-slate-800">{averageScore}/10 đ</p>
        </div>

        {/* Learning duration */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-3xs text-center space-y-1">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Thời gian học tập</span>
          <p className="font-display font-extrabold text-lg text-slate-800">{stats.learningTimeMinutes} phút</p>
        </div>

        {/* Progress Rate */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-3xs text-center space-y-1">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Tỷ lệ hoàn thành</span>
          <p className="font-display font-extrabold text-lg text-slate-800">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Visual Progress Charts (Left Column) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-2xs space-y-5">
          <div className="border-b pb-2 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-800">Biểu đồ tiến độ chi tiết</h3>
            <span className="text-4xs font-bold text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Cập nhật hôm nay</span>
          </div>

          <div className="space-y-4">
            {/* Horizontal progress bar widgets */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>📹 Video bài giảng lý thuyết đã xem</span>
                <span>{stats.videosWatched} / 5 video</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.videosWatched / 5) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>🎮 Trò chơi luyện tập đã hoàn thành</span>
                <span>{stats.gamesPlayed} / 4 trò chơi</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.gamesPlayed / 4) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>📝 Bài kiểm tra tự luyện đã hoàn thành</span>
                <span>{stats.quizzesCompleted} / 3 đề kiểm tra</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.quizzesCompleted / 3) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Grade progress stats column charts modeled in pure css */}
          <div className="pt-4 border-t border-slate-50 space-y-3">
            <span className="text-3xs font-bold text-slate-400 uppercase block tracking-wider">Tiến trình theo khối lớp:</span>
            <div className="grid grid-cols-5 gap-3 h-28 items-end text-center pt-2">
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-full bg-amber-100 hover:bg-amber-200 border-t border-amber-300 rounded-t-md h-12 flex items-center justify-center text-4xs font-bold text-amber-800">40%</div>
                <span className="text-4xs font-bold text-slate-400">Lớp 1</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-full bg-rose-100 hover:bg-rose-200 border-t border-rose-300 rounded-t-md h-8 flex items-center justify-center text-4xs font-bold text-rose-800">20%</div>
                <span className="text-4xs font-bold text-slate-400">Lớp 2</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-full bg-emerald-100 hover:bg-emerald-200 border-t border-emerald-300 rounded-t-md h-16 flex items-center justify-center text-4xs font-bold text-emerald-800">60%</div>
                <span className="text-4xs font-bold text-slate-400">Lớp 3</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-full bg-sky-100 hover:bg-sky-200 border-t border-sky-300 rounded-t-md h-10 flex items-center justify-center text-4xs font-bold text-sky-800">30%</div>
                <span className="text-4xs font-bold text-slate-400">Lớp 4</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-full bg-violet-100 hover:bg-violet-200 border-t border-violet-300 rounded-t-md h-20 flex items-center justify-center text-4xs font-bold text-violet-800">80%</div>
                <span className="text-4xs font-bold text-slate-400">Lớp 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Achievements Badges Shelf (Right Column) */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-2xs space-y-4">
          <div className="border-b pb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 animate-bounce" />
            <h3 className="font-display font-bold text-sm text-slate-800">Khu vườn Huy hiệu</h3>
          </div>

          <div className="space-y-3">
            {stats.badges.map((badge) => {
              const isUnlocked = !!badge.unlockedAt;
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isUnlocked
                      ? 'bg-amber-50/50 border-amber-200 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-2xs ${
                    isUnlocked ? 'bg-amber-100' : 'bg-slate-100'
                  }`}>
                    {renderBadgeIcon(badge.iconName, isUnlocked)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display font-extrabold text-xs text-slate-800 truncate">{badge.title}</h4>
                      {isUnlocked && (
                        <span className="text-4xs font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded">Unlocked</span>
                      )}
                    </div>
                    <p className="text-4xs text-slate-400 font-bold leading-normal mt-0.5">{badge.description}</p>
                    {isUnlocked && (
                      <span className="text-4xs text-slate-400 font-medium block mt-1">Khóa mở lúc: {badge.unlockedAt}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
