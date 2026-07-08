/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  PlayCircle,
  Gamepad2,
  FileCheck2,
  FileText,
  Bookmark,
  Share2,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeftRight
} from 'lucide-react';
import { GradeType, Resource, VideoLesson, GameItem, Quiz } from '../types';

interface GradeDetailProps {
  selectedGrade: GradeType;
  setSelectedGrade: (grade: GradeType) => void;
  resources: Resource[];
  videos: VideoLesson[];
  games: GameItem[];
  quizzes: Quiz[];
  onSelectVideo: (video: VideoLesson) => void;
  onSelectGame: (game: GameItem) => void;
  onSelectQuiz: (quiz: Quiz) => void;
  setCurrentTab: (tab: string) => void;
}

// Pre-defined syllabus curriculum lesson data for each Grade
const SYLLABUS_LESSONS: Record<GradeType, { title: string; desc: string; keyPoints: string[] }[]> = {
  '1': [
    { title: 'Chủ đề 1: Âm vần cơ bản và Thanh điệu', desc: 'Làm quen các nguyên âm, phụ âm và dấu thanh huyền, sắc, hỏi, ngã, nặng.', keyPoints: ['Chữ cái a, b, c', 'Thanh điệu và cách ghép vần ba, ca', 'Cách viết nét cơ bản'] },
    { title: 'Chủ đề 2: Các cặp âm dễ nhầm lẫn', desc: 'Học phân biệt âm đầu tr/ch, s/x, r/d/gi.', keyPoints: ['Phân biệt tr và ch', 'Ghép chữ rổ, rễ, da, giỏ', 'Chính tả câu ngắn'] },
    { title: 'Chủ đề 3: Đánh vần vần ghép phức tạp', desc: 'Đánh vần các vần có âm cuối như anh, ach, uôi, uya, oai.', keyPoints: ['Học vần uôi, uôi', 'Tập đọc bài thơ hai khổ', 'Chữ hoa cơ bản'] },
  ],
  '2': [
    { title: 'Bài 1: Từ chỉ Sự vật, Hoạt động, Đặc điểm', desc: 'Mở rộng vốn từ chỉ người, vật, việc làm và tính chất màu sắc.', keyPoints: ['Nhận diện từ chỉ sự vật', 'Từ chỉ hoạt động thường ngày', 'Luyện tập đặt câu kiểu Ai làm gì?'] },
    { title: 'Bài 2: Từ ngữ về Gia đình và Thầy cô', desc: 'Trau dồi lòng hiếu thảo, biết ơn thông qua vốn từ và bài đọc về gia đình.', keyPoints: ['Mở rộng vốn từ Gia đình', 'Đặt câu hỏi Ai thế nào?', 'Đọc bài thơ "Mẹ và con"'] },
    { title: 'Bài 3: Viết đoạn văn kể ngắn', desc: 'Phương pháp viết 3 - 5 câu kể về một con vật nuôi hoặc một việc em đã làm.', keyPoints: ['Câu mở đoạn thu hút', 'Sắp xếp ý theo thứ tự thời gian', 'Sử dụng dấu chấm, dấu phẩy'] },
  ],
  '3': [
    { title: 'Bài học: Nghệ thuật tu từ So Sánh', desc: 'Giúp học sinh viết câu sinh động bằng cách đối chiếu sự vật tương đồng.', keyPoints: ['Từ so sánh thông dụng', 'Các kiểu so sánh (ngang bằng, hơn kém)', 'Ứng dụng viết đoạn văn tả bầu trời'] },
    { title: 'Bài học: Biện pháp tu từ Nhân Hóa', desc: 'Học cách biến các con vật, đồ vật xung quanh thành người bạn ngộ nghĩnh.', keyPoints: ['Ba cách nhân hóa phổ biến', 'Xưng hô thân mật cho loài vật', 'Đặt câu miêu tả chú trống trường'] },
    { title: 'Bài học: Mở rộng vốn từ Quê Hương, Đất Nước', desc: 'Khám phá từ vựng về vẻ đẹp danh lam thắng cảnh, di tích lịch sử.', keyPoints: ['Đặc sản vùng miền', 'Đặt câu ghép đơn giản', 'Đọc bài kể chuyện quê hương'] },
  ],
  '4': [
    { title: 'Chuyên đề 1: Cấu tạo của Tiếng', desc: 'Phân tích âm đầu, vần và thanh điệu tạo nên tiếng trong tiếng Việt.', keyPoints: ['Âm đầu, Vần, Thanh', 'Tiếng bắt buộc có vần và thanh', 'Trò chơi ghép tiếng'] },
    { title: 'Chuyên đề 2: Từ đơn và Từ phức (Từ ghép, Từ láy)', desc: 'Phân biệt rạch ròi giữa các từ cấu tạo để viết văn đúng ngữ pháp.', keyPoints: ['Định nghĩa từ đơn', 'Phân biệt Từ ghép và Từ láy', 'Tác dụng của từ láy trong văn miêu tả'] },
    { title: 'Chuyên đề 3: Viết bài văn miêu tả Đồ vật, Cây cối', desc: 'Hướng dẫn lập dàn ý chi tiết mở bài, thân bài, kết bài.', keyPoints: ['Quan sát chi tiết bằng 5 giác quan', 'Gợi ý mở bài gián tiếp', 'Kết bài mở rộng đầy cảm xúc'] },
  ],
  '5': [
    { title: 'Ngữ pháp nâng cao: Từ đồng nghĩa, Trái nghĩa', desc: 'Khảo sát quan hệ ngữ nghĩa phức tạp để tăng vốn từ vựng phong phú.', keyPoints: ['Từ đồng nghĩa hoàn toàn và không hoàn toàn', 'Cặp từ trái nghĩa thông dụng', 'Luyện viết câu đối lập sắc thái'] },
    { title: 'Ngữ pháp nâng cao: Từ đồng âm và Từ nhiều nghĩa', desc: 'Chuyên đề khó nhất chương trình tiểu học giúp nhận diện nghĩa chuyển.', keyPoints: ['Phân biệt từ nhiều nghĩa (nghĩa gốc - nghĩa chuyển)', 'Phân biệt từ đồng âm', 'Đặt câu làm rõ các nghĩa khác nhau'] },
    { title: 'Tập làm văn: Viết văn tả cảnh thiên nhiên', desc: 'Miêu tả cảnh sông nước, cánh đồng, công viên theo mùa hoặc thời điểm.', keyPoints: ['Lập dàn ý tả cơn mưa', 'Lựa chọn hình ảnh tiêu biểu', 'Sử dụng liên kết câu linh hoạt'] },
  ],
};

const WORKSHEETS_MOCK: Record<GradeType, { title: string; desc: string; url: string }[]> = {
  '1': [
    { title: 'Phiếu Bài Tập 1: Ôn tập chữ in thường và chữ in hoa', desc: 'Luyện tô chữ, nối chữ cái in thường với chữ cái viết hoa tương ứng.', url: '#' },
    { title: 'Phiếu Tập Đọc 2: Đánh vần vần trơn các từ đơn', desc: 'Phiếu đọc tại nhà có kèm chữ ký của phụ huynh.', url: '#' }
  ],
  '2': [
    { title: 'Phiếu Bài Tập Tuần: Phân biệt c/k/q và g/gh', desc: 'Điền từ vào chỗ trống dưới hình ảnh sinh động.', url: '#' },
    { title: 'Phiếu Luyện Viết Đoạn Văn: Tả chiếc bút chì của em', desc: 'Dàn ý gợi ý bằng sơ đồ hình ảnh kích thích tư duy.', url: '#' }
  ],
  '3': [
    { title: 'Phiếu Ôn Tập Giữa Kỳ: So sánh & Nhân hóa', desc: 'Bài tập nối cột, tìm câu có phép so sánh trong thơ.', url: '#' },
    { title: 'Phiếu Viết Văn Lớp 3: Kể về người hàng xóm', desc: 'Phiếu tự luyện viết đoạn văn ngắn từ 7 đến 10 câu.', url: '#' }
  ],
  '4': [
    { title: 'Phiếu Luyện Từ và Câu: Nhận diện từ ghép và từ láy', desc: 'Bảng phân loại 20 từ phức khác nhau cực hay.', url: '#' },
    { title: 'Phiếu Tập Làm Văn Lớp 4: Lập dàn ý tả cây bóng mát', desc: 'Dàn bài chi tiết gợi mở ý tưởng thông qua bento-grid.', url: '#' }
  ],
  '5': [
    { title: 'Phiếu Tổng Ôn Lớp 5: Phân biệt Từ Nhiều Nghĩa và Từ Đồng Âm', desc: 'Bài tập nâng cao giúp học sinh chinh phục kỳ thi cuối cấp.', url: '#' },
    { title: 'Phiếu Viết Bài Văn Nghị Luận Đơn Giản: Ý nghĩa của sự sẻ chia', desc: 'Gợi ý lập dàn bài nghị luận xã hội tiểu học.', url: '#' }
  ]
};

export default function GradeDetail({
  selectedGrade,
  setSelectedGrade,
  resources,
  videos,
  games,
  quizzes,
  onSelectVideo,
  onSelectGame,
  onSelectQuiz,
  setCurrentTab,
}: GradeDetailProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<'bai_hoc' | 'video' | 'hoc_lieu' | 'tro_choi' | 'kiem_tra' | 'phieu_tap' | 'bo_tro'>('bai_hoc');

  const gradesList: { num: GradeType; label: string }[] = [
    { num: '1', label: 'Lớp 1' },
    { num: '2', label: 'Lớp 2' },
    { num: '3', label: 'Lớp 3' },
    { num: '4', label: 'Lớp 4' },
    { num: '5', label: 'Lớp 5' },
  ];

  // Filtering data according to current grade selection
  const filteredResources = resources.filter(r => r.grade === selectedGrade);
  const filteredVideos = videos.filter(v => v.grade === selectedGrade);
  const filteredGames = games.filter(g => g.grade === selectedGrade);
  const filteredQuizzes = quizzes.filter(q => q.grade === selectedGrade);
  
  const subTabs = [
    { id: 'bai_hoc' as const, label: '📚 Bài học', count: SYLLABUS_LESSONS[selectedGrade]?.length || 0 },
    { id: 'video' as const, label: '📹 Video bài giảng', count: filteredVideos.length },
    { id: 'hoc_lieu' as const, label: '🌐 Học liệu số', count: filteredResources.length },
    { id: 'tro_choi' as const, label: '🎮 Trò chơi', count: filteredGames.length },
    { id: 'kiem_tra' as const, label: '📝 Bài kiểm tra', count: filteredQuizzes.length },
    { id: 'phieu_tap' as const, label: '📄 Phiếu bài tập', count: WORKSHEETS_MOCK[selectedGrade]?.length || 0 },
    { id: 'bo_tro' as const, label: '⭐ Tài liệu bổ trợ', count: 2 },
  ];

  const gradeColors: Record<GradeType, string> = {
    '1': 'bg-gradient-to-br from-[#00D2FF] to-[#0066FF] text-white shadow-md shadow-[#0066FF]/25',
    '2': 'bg-gradient-to-br from-[#2ECC71] to-[#11998E] text-white shadow-md shadow-[#2ECC71]/25',
    '3': 'bg-gradient-to-br from-[#FFD000] to-[#FF8C00] text-white shadow-md shadow-[#FF8C00]/25',
    '4': 'bg-gradient-to-br from-[#FF5E62] to-[#FF9966] text-white shadow-md shadow-[#FF5E62]/25',
    '5': 'bg-gradient-to-br from-[#A55EEA] to-[#8854D0] text-white shadow-md shadow-[#8854D0]/25',
  };

  const gradeTextColors: Record<GradeType, string> = {
    '1': 'text-[#0066FF]',
    '2': 'text-[#11998E]',
    '3': 'text-[#FF8C00]',
    '4': 'text-[#FF5E62]',
    '5': 'text-[#8854D0]',
  };

  return (
    <div className="space-y-6 animate-fade-in" id="grade-detail-view">
      
      {/* Grade Selector Strip */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white/95 backdrop-blur-md p-5 rounded-[32px] border border-blue-100/60 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500">Đang chọn Khối lớp:</span>
          <div className="flex items-center gap-1.5">
            {gradesList.map((g) => (
              <button
                key={g.num}
                onClick={() => {
                  setSelectedGrade(g.num);
                  setActiveSubTab('bai_hoc'); // Reset to default sub-tab
                }}
                className={`w-11 h-10 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center ${
                  selectedGrade === g.num
                    ? gradeColors[g.num]
                    : 'bg-gray-100 hover:bg-gray-200/50 text-slate-600'
                }`}
              >
                {g.num}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-right">
          <h2 className={`text-lg font-display font-bold ${gradeTextColors[selectedGrade]}`}>Khối Lớp {selectedGrade}</h2>
          <p className="text-[10px] text-gray-400 font-medium">Chương trình Tiếng Việt chuẩn 2018</p>
        </div>
      </div>

      {/* Grid Layout: Left Sidebar tabs + Right Content stage */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar Sub-tabs */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white/95 rounded-[32px] p-5 shadow-sm border border-blue-50/60 space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">Thư mục học tập</h3>
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-display font-bold transition-all flex items-center justify-between ${
                  activeSubTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-100/50'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                    activeSubTab === tab.id ? 'bg-[#0984E3] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-5 bg-white/95 p-6 rounded-[32px] border border-blue-50/60 shadow-sm min-h-[450px]">
          
          {/* Sub-tab Title Indicator */}
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-base font-display font-bold text-slate-800">
              {subTabs.find(t => t.id === activeSubTab)?.label} - Lớp {selectedGrade}
            </h3>
            <span className="text-xs font-semibold text-[#0984E3] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/30">
              Khám phá kiến thức
            </span>
          </div>

          {/* Render Sub-tab Contents */}

          {/* 1. BÀI HỌC (Syllabus Units) */}
          {activeSubTab === 'bai_hoc' && (
            <div className="space-y-4">
              {SYLLABUS_LESSONS[selectedGrade]?.map((lesson, idx) => (
                <div key={idx} className="bg-slate-50/50 hover:bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-base text-slate-800">{lesson.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{lesson.desc}</p>
                    </div>
                    <span className="bg-sky-100 text-sky-700 text-2xs font-bold px-2.5 py-1 rounded-md">Bài {idx + 1}</span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-3 border border-slate-100/50 space-y-1.5">
                    <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Trọng tâm kiến thức:</span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 font-semibold pl-2">
                      {lesson.keyPoints.map((kp, kIdx) => (
                        <li key={kIdx} className="flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. VIDEO (Lecture Videos) */}
          {activeSubTab === 'video' && (
            <div className="space-y-4">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-bold text-sm">Chưa có video nào cho khối lớp này. Thầy cô đang bổ sung em nhé!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVideos.map((vid) => (
                    <div key={vid.id} className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xs transition-shadow flex flex-col">
                      <div className="h-40 bg-slate-100 relative group flex items-center justify-center">
                        {/* Static video card visual style */}
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/0.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // fallback placeholder image if video thumbnail fails
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                          <PlayCircle className="w-14 h-14 text-white hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer" />
                        </div>
                        <span className="absolute bottom-2 right-2 bg-slate-900/70 text-white font-mono text-2xs px-2 py-0.5 rounded-md font-bold">
                          {vid.duration}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-3xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                            {vid.topic}
                          </span>
                          <h4 className="font-display font-bold text-sm text-slate-800 line-clamp-2 mt-2 leading-snug">{vid.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{vid.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            onSelectVideo(vid);
                            setCurrentTab('grades'); // This stays here but updates focus to video player!
                          }}
                          className="w-full py-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
                        >
                          Phát bài giảng trực tiếp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. HỌC LIỆU SỐ (Links Store redirection) */}
          {activeSubTab === 'hoc_lieu' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-center">
                <p className="text-sm text-sky-700 font-bold">
                  🎒 Đã tìm thấy {filteredResources.length} học liệu số hữu ích được thiết kế trên Canva, Wordwall, Liveworksheets... cho Lớp {selectedGrade}!
                </p>
                <button
                  onClick={() => setCurrentTab('resources')}
                  className="mt-3 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-display font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Mở Kho Học Liệu & Lọc
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.slice(0, 4).map((res) => (
                  <div key={res.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-3xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                        {res.type.toUpperCase()}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-800 mt-1.5">{res.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 font-medium mt-1">{res.description}</p>
                    </div>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 self-start"
                    >
                      Truy cập học liệu <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TRÒ CHƠI (Interactive playable educational games) */}
          {activeSubTab === 'tro_choi' && (
            <div className="space-y-4">
              {filteredGames.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-bold text-sm">Chưa tìm thấy trò chơi nào cho lớp {selectedGrade}. Vui lòng xem ở tab Trò Chơi chung nhé!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGames.map((game) => (
                    <div key={game.id} className="border-2 border-slate-100 p-5 rounded-2xl flex flex-col justify-between gap-4 hover:shadow-xs transition-shadow">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-3xs font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                            {game.topic}
                          </span>
                          <span className="text-3xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {game.difficulty}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-base text-slate-800 mt-2">{game.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">{game.description}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          onSelectGame(game);
                          setCurrentTab('games'); // Switch tab to Games Center
                        }}
                        className="w-full py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Chơi ngay <Gamepad2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. BÀI KIỂM TRA (Exams & tests list) */}
          {activeSubTab === 'kiem_tra' && (
            <div className="space-y-4">
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-bold text-sm">Chưa tìm thấy bài kiểm tra nào được thiết kế cho lớp {selectedGrade}.</div>
              ) : (
                <div className="space-y-3">
                  {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-sm text-slate-800">{quiz.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">Thời gian tự luyện: {quiz.durationMinutes} phút | Số câu hỏi: {quiz.questions.length}</p>
                      </div>
                      <button
                        onClick={() => {
                          onSelectQuiz(quiz);
                          setCurrentTab('quizzes');
                        }}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Bắt đầu làm bài <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. PHIẾU HỌC TẬP (Download worksheets) */}
          {activeSubTab === 'phieu_tap' && (
            <div className="space-y-4">
              {WORKSHEETS_MOCK[selectedGrade]?.map((sheet, idx) => (
                <div key={idx} className="border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-800">{sheet.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{sheet.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Đang tải phiếu học tập: ${sheet.title}. Hệ thống tự động mở bản in PDF!`);
                    }}
                    className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Tải về PDF
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 7. TÀI LIỆU BỔ TRỢ (Extra reading references) */}
          {activeSubTab === 'bo_tro' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
                <h4 className="font-display font-bold text-sm text-emerald-800 flex items-center gap-1.5">
                  🌟 Cẩm nang ôn luyện Trạng Nguyên Tiếng Việt
                </h4>
                <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
                  Tài liệu mở rộng bao gồm các câu đố dân gian, các quy tắc ngữ nghĩa thơ ca cổ điển và kỹ năng mở rộng ngôn từ được biên soạn đặc biệt cho Lớp {selectedGrade}.
                </p>
                <div className="pt-2">
                  <span className="text-2xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Dành riêng cho Lớp {selectedGrade}</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
                <h4 className="font-display font-bold text-sm text-purple-800 flex items-center gap-1.5">
                  📚 Bộ 100 đề tự luận cảm thụ văn học lớp {selectedGrade}
                </h4>
                <p className="text-xs text-purple-700 leading-relaxed font-semibold">
                  Sổ tay các đoạn văn mẫu tả người, tả cảnh, kể chuyện xuất sắc tuyển chọn từ các kỳ thi học sinh giỏi, kèm lời giải thích của hội đồng sư phạm.
                </p>
                <div className="pt-2">
                  <span className="text-2xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">PDF tải miễn phí</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
