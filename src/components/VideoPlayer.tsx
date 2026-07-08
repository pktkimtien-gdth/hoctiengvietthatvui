/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  Heart,
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { VideoLesson, GradeType } from '../types';

interface VideoPlayerProps {
  selectedVideo: VideoLesson | null;
  allVideos: VideoLesson[];
  onSelectVideo: (video: VideoLesson) => void;
  toggleFavoriteVideo: (id: string) => void;
  toggleCompleteVideo: (id: string) => void;
}

export default function VideoPlayer({
  selectedVideo,
  allVideos,
  onSelectVideo,
  toggleFavoriteVideo,
  toggleCompleteVideo,
}: VideoPlayerProps) {
  
  // If no video is selected yet, choose the first available one as default
  const activeVideo = selectedVideo || allVideos[0];

  if (!activeVideo) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border-2 border-slate-100">
        <p className="text-slate-400 font-bold">Không tìm thấy video bài giảng nào!</p>
      </div>
    );
  }

  // Filter related videos (excluding the current one, preferring the same grade or topic)
  const relatedVideos = allVideos
    .filter((v) => v.id !== activeVideo.id)
    .sort((a, b) => {
      // Prioritize same grade
      if (a.grade === activeVideo.grade && b.grade !== activeVideo.grade) return -1;
      if (b.grade === activeVideo.grade && a.grade !== activeVideo.grade) return 1;
      return 0;
    })
    .slice(0, 4);

  // Suggest the next sequential lesson
  const nextVideo = allVideos.find(
    (v) => v.grade === activeVideo.grade && parseInt(v.id.split('-')[1]) > parseInt(activeVideo.id.split('-')[1])
  ) || relatedVideos[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="video-lecture-view">
      
      {/* Left Stage: Active Video Player & Metadata Details */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Playback Stage Container */}
        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-md relative border-4 border-slate-900">
          <iframe
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
            title={activeVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Information panel */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-3xs space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold bg-sky-500 text-white px-2.5 py-0.5 rounded-full">
                  Lớp {activeVideo.grade}
                </span>
                <span className="text-2xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full">
                  📚 {activeVideo.topic}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 leading-tight">
                {activeVideo.title}
              </h3>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Toggle Favorite */}
              <button
                onClick={() => toggleFavoriteVideo(activeVideo.id)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold cursor-pointer ${
                  activeVideo.isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                aria-label="Lưu vào yêu thích"
              >
                <Heart className={`w-4 h-4 ${activeVideo.isFavorite ? 'fill-rose-500' : ''}`} />
                {activeVideo.isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </button>

              {/* Toggle Complete */}
              <button
                onClick={() => toggleCompleteVideo(activeVideo.id)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  activeVideo.isCompleted
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {activeVideo.isCompleted ? 'Đã học xong' : 'Đánh dấu đã học'}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {activeVideo.description}
          </p>

          <div className="flex items-center gap-4 text-2xs font-bold text-slate-400 pt-3 border-t border-slate-50">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Thời lượng: {activeVideo.duration}</span>
            <span>•</span>
            <span>Nguồn: Kênh Giáo Dục Tiểu Học Việt Nam</span>
          </div>
        </div>

        {/* Suggest next lesson */}
        {nextVideo && (
          <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-200 rounded-xl flex items-center justify-center text-sky-600 shrink-0">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-4xs font-bold text-sky-600 uppercase tracking-wide">Bài tiếp theo gợi ý</span>
                <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1">{nextVideo.title}</h4>
              </div>
            </div>
            <button
              onClick={() => onSelectVideo(nextVideo)}
              className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-display font-bold text-xs rounded-lg transition-colors flex items-center gap-1 self-end sm:self-auto cursor-pointer"
            >
              Học tiếp <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Right Stage: Related Videos List Sidebar */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <h3 className="font-display font-bold text-sm text-slate-800">Danh sách bài giảng</h3>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {allVideos.map((vid) => {
              const isActive = vid.id === activeVideo.id;
              return (
                <button
                  key={vid.id}
                  onClick={() => onSelectVideo(vid)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-rose-50 border-rose-200 shadow-xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-20 aspect-video rounded-lg overflow-hidden bg-slate-100 shrink-0 relative">
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/0.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    {vid.isCompleted && (
                      <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-2xs">
                        <CheckCircle className="w-3 h-3 fill-emerald-500 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-4xs font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded-full">Lớp {vid.grade}</span>
                      <span className="text-4xs font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full line-clamp-1">{vid.topic}</span>
                    </div>
                    <h4 className="font-display font-bold text-2xs text-slate-800 line-clamp-2 leading-snug">{vid.title}</h4>
                    <span className="text-4xs text-slate-400 font-bold">{vid.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
