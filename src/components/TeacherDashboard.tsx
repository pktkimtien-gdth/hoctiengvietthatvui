/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  FileText,
  PlayCircle,
  Gamepad2,
  FileCheck2,
  LineChart,
  BarChart,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Link,
  Wrench,
  Video,
  Layers,
  Globe,
  HelpCircle,
  Check,
  CheckSquare,
  ListPlus,
  BookOpen
} from 'lucide-react';
import { Resource, VideoLesson, GameItem, Quiz, GradeType, ResourceType } from '../types';

interface TeacherDashboardProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  videos: VideoLesson[];
  setVideos: React.Dispatch<React.SetStateAction<VideoLesson[]>>;
  games: GameItem[];
  setGames: React.Dispatch<React.SetStateAction<GameItem[]>>;
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

export default function TeacherDashboard({
  resources,
  setResources,
  videos,
  setVideos,
  games,
  setGames,
  quizzes,
  setQuizzes,
}: TeacherDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<'stats' | 'videos' | 'games' | 'quizzes' | 'designer'>('stats');

  // Form management states
  const [vTitle, setVTitle] = useState('');
  const [vDesc, setVDesc] = useState('');
  const [vGrade, setVGrade] = useState<GradeType>('1');
  const [vDuration, setVDuration] = useState('10:00');
  const [vYoutubeId, setVYoutubeId] = useState('');
  const [vTopic, setVTopic] = useState('Chữ cái & Âm vần');

  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');
  const [gGrade, setGGrade] = useState<GradeType>('1');
  const [gTopic, setGTopic] = useState('Chữ cái & Âm vần');
  const [gType, setGType] = useState<GameItem['gameType']>('ghep_chu');
  const [gDiff, setGDiff] = useState<'Dễ' | 'Trung bình' | 'Khó'>('Dễ');

  const [qTitle, setQTitle] = useState('');
  const [qDesc, setQDesc] = useState('');
  const [qGrade, setQGrade] = useState<GradeType>('1');
  const [qTopic, setQTopic] = useState('Chữ cái & Âm vần');
  const [qDuration, setQDuration] = useState(15);

  // --- DESIGNER HUB STATE VARIABLES ---
  const [designType, setDesignType] = useState<'link' | 'video' | 'game' | 'quiz'>('link');

  // 1. External Link Designer States
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<ResourceType>('wordwall');
  const [linkGrade, setLinkGrade] = useState<GradeType>('1');
  const [linkTopic, setLinkTopic] = useState('Chữ cái & Âm vần');
  const [linkDesc, setLinkDesc] = useState('');
  const [linkThumb, setLinkThumb] = useState('');

  // 2. Interactive Video Designer States
  const [vTitleNew, setVTitleNew] = useState('');
  const [vYoutubeIdNew, setVYoutubeIdNew] = useState('');
  const [vGradeNew, setVGradeNew] = useState<GradeType>('1');
  const [vDurationNew, setVDurationNew] = useState('10:00');
  const [vTopicNew, setVTopicNew] = useState('Chữ cái & Âm vần');
  const [vDescNew, setVDescNew] = useState('');

  // 3. Game Designer States
  const [gTitleNew, setGTitleNew] = useState('');
  const [gTypeNew, setGTypeNew] = useState<GameItem['gameType']>('ghep_chu');
  const [gGradeNew, setGGradeNew] = useState<GradeType>('1');
  const [gDiffNew, setGDiffNew] = useState<'Dễ' | 'Trung bình' | 'Khó'>('Dễ');
  const [gTopicNew, setGTopicNew] = useState('Chữ cái & Âm vần');
  const [gDescNew, setGDescNew] = useState('');
  const [gWordList, setGWordList] = useState('quả xoài, con trâu, trường học, cô giáo');

  // 4. Quiz Builder States
  const [qTitleNew, setQTitleNew] = useState('');
  const [qGradeNew, setQGradeNew] = useState<GradeType>('1');
  const [qTopicNew, setQTopicNew] = useState('Chữ cái & Âm vần');
  const [qDurationNew, setQDurationNew] = useState(15);
  const [qDescNew, setQDescNew] = useState('');
  const [designedQuestions, setDesignedQuestions] = useState<any[]>([
    {
      id: 'q-init-1',
      type: 'trac_nghiem',
      questionText: 'Từ nào sau đây viết đúng chính tả tiếng Việt?',
      options: ['Quyển vở', 'Kiển vở', 'Kuyển vở', 'Quyển vỡ'],
      correctAnswer: 'Quyển vở',
      explanation: 'Từ "Quyển vở" viết đúng với âm đầu "q" vần "uyên" và "v" vần "ơ" thanh hỏi.',
    }
  ]);
  const [currQText, setCurrQText] = useState('');
  const [currQOptA, setCurrQOptA] = useState('');
  const [currQOptB, setCurrQOptB] = useState('');
  const [currQOptC, setCurrQOptC] = useState('');
  const [currQOptD, setCurrQOptD] = useState('');
  const [currQCorrect, setCurrQCorrect] = useState('A');
  const [currQExpl, setCurrQExpl] = useState('');

  // --- DESIGNER HANDLERS ---
  const getPlaceholderThumbnail = (type: ResourceType) => {
    switch (type) {
      case 'wordwall':
        return 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&auto=format&fit=crop&q=60';
      case 'kahoot':
        return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=60';
      case 'quizizz':
        return 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&auto=format&fit=crop&q=60';
      case 'google_forms':
        return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=60';
      case 'google_slides':
        return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60';
      case 'youtube':
        return 'https://images.unsplash.com/photo-1526698905402-e1a019af529f?w=400&auto=format&fit=crop&q=60';
      default:
        return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&auto=format&fit=crop&q=60';
    }
  };

  const handlePublishLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle || !linkUrl) {
      alert('Vui lòng nhập đầy đủ tiêu đề và đường dẫn liên kết học liệu!');
      return;
    }
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      title: linkTitle,
      description: linkDesc || 'Tài liệu học tập tương tác được thiết kế trực quan bởi Giáo viên.',
      grade: linkGrade,
      topic: linkTopic,
      keywords: [linkTopic, 'liên kết', 'thiết kế', linkType],
      type: linkType,
      thumbnailUrl: linkThumb || getPlaceholderThumbnail(linkType),
      link: linkUrl,
      createdAt: new Date().toISOString().split('T')[0],
      creator: 'Giáo viên Admin',
      isFavorite: false
    };

    setResources((prev) => [newResource, ...prev]);
    setLinkTitle('');
    setLinkUrl('');
    setLinkDesc('');
    setLinkThumb('');
    alert('🎉 Liên kết học liệu tương tác đã xuất bản thành công! Học sinh đã có thể truy cập ở mục "Kho học liệu".');
  };

  const handlePublishVideoNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitleNew || !vYoutubeIdNew) {
      alert('Vui lòng nhập tiêu đề và ID YouTube!');
      return;
    }
    const newVideo: VideoLesson = {
      id: `vid-${Date.now()}`,
      title: vTitleNew,
      description: vDescNew || 'Bài giảng video tương tác cao thiết kế giúp các con tiếp thu âm vần Tiếng Việt một cách tự nhiên.',
      grade: vGradeNew,
      duration: vDurationNew || '10:00',
      youtubeId: vYoutubeIdNew,
      topic: vTopicNew,
      isCompleted: false,
      isFavorite: false
    };

    setVideos((prev) => [newVideo, ...prev]);
    setVTitleNew('');
    setVYoutubeIdNew('');
    setVDescNew('');
    alert('🎉 Bài giảng video tương tác đã xuất bản thành công! Các con học sinh có thể học bài ở mục "Khối lớp" hoặc "Bài giảng video".');
  };

  const handlePublishGameNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gTitleNew) {
      alert('Vui lòng điền tiêu đề trò chơi!');
      return;
    }
    const newGame: GameItem = {
      id: `game-${Date.now()}`,
      title: gTitleNew,
      description: `${gDescNew || 'Trò chơi tương tác Tiếng Việt.'} (Bộ từ vựng thiết kế: ${gWordList})`,
      grade: gGradeNew,
      topic: gTopicNew,
      gameType: gTypeNew,
      difficulty: gDiffNew,
      completedCount: 0,
      highScore: 0
    };

    setGames((prev) => [newGame, ...prev]);
    setGTitleNew('');
    setGDescNew('');
    alert('🎉 Trò chơi tương tác mới đã xuất bản thành công! Trò chơi đã sẵn sàng tại phần "Trò chơi".');
  };

  const handleAddQuestionToQuiz = () => {
    if (!currQText || !currQOptA || !currQOptB) {
      alert('Vui lòng nhập câu hỏi và ít nhất 2 đáp án lựa chọn!');
      return;
    }
    const options = [currQOptA, currQOptB];
    if (currQOptC) options.push(currQOptC);
    if (currQOptD) options.push(currQOptD);

    let correctValue = currQOptA;
    if (currQCorrect === 'B') correctValue = currQOptB;
    if (currQCorrect === 'C') correctValue = currQOptC || currQOptA;
    if (currQCorrect === 'D') correctValue = currQOptD || currQOptA;

    const newQ = {
      id: `q-${Date.now()}-${designedQuestions.length + 1}`,
      type: 'trac_nghiem',
      questionText: currQText,
      options: options,
      correctAnswer: correctValue,
      explanation: currQExpl || 'Chính xác! Lựa chọn này tuân thủ đúng quy tắc chính tả và ngữ pháp Tiếng Việt.',
    };

    setDesignedQuestions([...designedQuestions, newQ]);
    // Reset fields
    setCurrQText('');
    setCurrQOptA('');
    setCurrQOptB('');
    setCurrQOptC('');
    setCurrQOptD('');
    setCurrQCorrect('A');
    setCurrQExpl('');
  };

  const handleRemoveQuestion = (id: string) => {
    setDesignedQuestions(designedQuestions.filter(q => q.id !== id));
  };

  const handlePublishQuizNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitleNew) {
      alert('Vui lòng nhập tiêu đề bài kiểm tra!');
      return;
    }
    if (designedQuestions.length === 0) {
      alert('Bài kiểm tra cần có ít nhất 1 câu hỏi! Hãy thiết kế câu hỏi bên dưới.');
      return;
    }

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: qTitleNew,
      description: qDescNew || 'Đề kiểm tra ôn luyện kỹ năng đọc hiểu và chính tả dành cho các bé.',
      grade: qGradeNew,
      topic: qTopicNew,
      durationMinutes: qDurationNew || 15,
      questions: designedQuestions
    };

    setQuizzes((prev) => [newQuiz, ...prev]);
    setQTitleNew('');
    setQDescNew('');
    setDesignedQuestions([
      {
        id: 'q-init-1',
        type: 'trac_nghiem',
        questionText: 'Từ nào sau đây viết đúng chính tả tiếng Việt?',
        options: ['Quyển vở', 'Kiển vở', 'Kuyển vở', 'Quyển vỡ'],
        correctAnswer: 'Quyển vở',
        explanation: 'Từ "Quyển vở" viết đúng với âm đầu "q" vần "uyên" và "v" vần "ơ" thanh hỏi.',
      }
    ]);
    alert('🎉 Đề kiểm tra khảo sát chất lượng đã xuất bản thành công! Học sinh có thể làm bài thi ngay tại mục "Bài kiểm tra".');
  };

  // Counters
  const totalResources = resources.length;
  const totalVideos = videos.length;
  const totalGames = games.length;
  const totalQuizzes = quizzes.length;

  // Grade distributions calculations
  const getGradeCount = (grade: GradeType) => {
    return (
      resources.filter(r => r.grade === grade).length +
      videos.filter(v => v.grade === grade).length +
      games.filter(g => g.grade === grade).length +
      quizzes.filter(q => q.grade === grade).length
    );
  };

  // Add video
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitle || !vYoutubeId) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và YouTube ID!');
      return;
    }
    const newVideo: VideoLesson = {
      id: `vid-${Date.now()}`,
      title: vTitle,
      description: vDesc || 'Không có mô tả bài giảng.',
      grade: vGrade,
      duration: vDuration,
      youtubeId: vYoutubeId,
      topic: vTopic,
    };
    setVideos(prev => [newVideo, ...prev]);
    setVTitle('');
    setVDesc('');
    setVYoutubeId('');
    alert('Thêm video bài giảng thành công!');
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa video này không?')) {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  // Add game
  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gTitle) {
      alert('Vui lòng nhập Tiêu đề trò chơi!');
      return;
    }
    const newGame: GameItem = {
      id: `game-${Date.now()}`,
      title: gTitle,
      description: gDesc || 'Không có mô tả.',
      grade: gGrade,
      topic: gTopic,
      gameType: gType,
      difficulty: gDiff,
    };
    setGames(prev => [newGame, ...prev]);
    setGTitle('');
    setGDesc('');
    alert('Thêm trò chơi thành công!');
  };

  const handleDeleteGame = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa trò chơi này không?')) {
      setGames(prev => prev.filter(g => g.id !== id));
    }
  };

  // Add quiz
  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle) {
      alert('Vui lòng nhập Tiêu đề bài kiểm tra!');
      return;
    }
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: qTitle,
      description: qDesc || 'Không có mô tả.',
      grade: qGrade,
      topic: qTopic,
      durationMinutes: qDuration,
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: 'trac_nghiem',
          questionText: 'Câu hỏi mẫu: Từ nào viết đúng chính tả?',
          options: ['Quả xoài', 'Quả soài', 'Quả xoày', 'Quả xoài'],
          correctAnswer: 'Quả xoài',
          explanation: '"xoài" được viết với âm đầu "x" và vần "oai", thanh huyền.',
        }
      ]
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    setQTitle('');
    setQDesc('');
    alert('Tạo bài kiểm tra thành công! (Bao gồm 1 câu hỏi mẫu chuẩn hóa)');
  };

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bài kiểm tra này không?')) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-6" id="teacher-dashboard">
      
      {/* Top Selector buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-display font-bold text-emerald-600 flex items-center gap-1.5">
            <Settings className="w-5 h-5 text-emerald-500 animate-spin-slow" /> Giao diện Giáo viên & Quản lý
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Cập nhật giáo trình, thêm bớt video bài giảng, quản lý trò chơi và đề thi trực tiếp.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs cursor-pointer ${
              activeTab === 'stats' ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            📊 Thống kê chung
          </button>
          <button
            onClick={() => setActiveTab('designer')}
            className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs cursor-pointer ${
              activeTab === 'designer' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            🎨 Thiết kế & Liên kết
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs cursor-pointer ${
              activeTab === 'videos' ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            📹 Quản lý Videos
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs cursor-pointer ${
              activeTab === 'games' ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            🎮 Quản lý Trò Chơi
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs cursor-pointer ${
              activeTab === 'quizzes' ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            📝 Quản lý Đề Thi
          </button>
        </div>
      </div>

      {/* A. GENERAL STATS & OVERVIEWS */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in" id="stats-tab">
          
          {/* bento grid counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 border-2 border-slate-100 rounded-2xl shadow-3xs text-center space-y-1">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Học liệu số</span>
              <p className="font-display font-extrabold text-xl text-slate-800">{totalResources} liên kết</p>
            </div>
            <div className="bg-white p-5 border-2 border-slate-100 rounded-2xl shadow-3xs text-center space-y-1">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Bài giảng video</span>
              <p className="font-display font-extrabold text-xl text-slate-800">{totalVideos} bài học</p>
            </div>
            <div className="bg-white p-5 border-2 border-slate-100 rounded-2xl shadow-3xs text-center space-y-1">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Trò chơi tương tác</span>
              <p className="font-display font-extrabold text-xl text-slate-800">{totalGames} trò chơi</p>
            </div>
            <div className="bg-white p-5 border-2 border-slate-100 rounded-2xl shadow-3xs text-center space-y-1">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide">Đề thi khảo sát</span>
              <p className="font-display font-extrabold text-xl text-slate-800">{totalQuizzes} đề thi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Grade breakdown */}
            <div className="bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-2xs space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-2">
                <BarChart className="w-5 h-5 text-emerald-500" />
                <h3 className="font-display font-bold text-sm text-slate-800 font-sans">Mật độ học liệu theo khối lớp</h3>
              </div>

              <div className="space-y-3 font-semibold text-xs">
                {['1', '2', '3', '4', '5'].map((g) => {
                  const count = getGradeCount(g as GradeType);
                  return (
                    <div key={g} className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Khối lớp {g}</span>
                        <span>{count} học liệu</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${Math.min((count / 15) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick tips */}
            <div className="bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 border-b pb-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-display font-bold text-sm text-slate-800">Lời khuyên Quản lý Sư phạm</h3>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed font-semibold space-y-2">
                  <p>1. **Chuẩn hóa nội dung**: Hãy đảm bảo liên kết YouTube sử dụng ID chính xác để học sinh xem được mượt mà trên trình phát của bé.</p>
                  <p>2. **Tương tác**: Phân bổ đều đặn các trò chơi đi kèm với phiếu học tập để trẻ có thêm động lực học tập.</p>
                  <p>3. **Đánh giá**: Thiết kế bài kiểm tra từ 5-10 câu với lời giải thích sư phạm chi tiết giúp phụ huynh ôn tập cho con hiệu quả.</p>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex items-center gap-2">
                <div className="text-xs font-bold text-emerald-800">💡 Mẹo nhanh: Hãy chuyển sang tab "Kho Học Liệu" ngoài menu chính để Sửa và Xóa nhanh các liên kết URL bài học!</div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* DESIGNER HUB / STUDIO PANEL */}
      {activeTab === 'designer' && (
        <div className="space-y-6 animate-fade-in" id="designer-tab">
          {/* Sub-selector Header for Design Tools */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100 rounded-3xl p-6">
            <h3 className="text-base sm:text-lg font-display font-bold text-teal-800 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-500 animate-bounce-slow" /> Studio Thiết Kế & Liên Kết Học Liệu Số
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Tạo lập nội dung giảng dạy của riêng bạn. Hỗ trợ liên kết tài liệu từ các nền tảng phổ biến (Wordwall, Kahoot, Google Drive, YouTube) hoặc tự thiết kế Trò chơi & Đề thi trực tiếp cho các con học sinh ôn luyện.
            </p>

            {/* Design Type Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <button
                type="button"
                onClick={() => setDesignType('link')}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer flex items-start gap-3 ${
                  designType === 'link'
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                    : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Link className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm text-slate-800">Liên kết ngoài</span>
                  <span className="text-3xs text-slate-400 font-bold block mt-0.5">Wordwall, Kahoot, Slides, Forms...</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDesignType('video')}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer flex items-start gap-3 ${
                  designType === 'video'
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                    : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm text-slate-800">Video Bài Giảng</span>
                  <span className="text-3xs text-slate-400 font-bold block mt-0.5">Bài học YouTube, bài giảng số...</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDesignType('game')}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer flex items-start gap-3 ${
                  designType === 'game'
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                    : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm text-slate-800">Thiết kế Trò Chơi</span>
                  <span className="text-3xs text-slate-400 font-bold block mt-0.5">Vòng quay, điền từ, ghép chữ...</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDesignType('quiz')}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer flex items-start gap-3 ${
                  designType === 'quiz'
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                    : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm text-slate-800">Thiết kế Đề Thi</span>
                  <span className="text-3xs text-slate-400 font-bold block mt-0.5">Bài kiểm tra trắc nghiệm số hóa...</span>
                </div>
              </button>
            </div>
          </div>

          {/* Core Workspaces based on designType */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. LINK DESIGNER WORKSPACE */}
            {designType === 'link' && (
              <>
                {/* Form fields */}
                <form onSubmit={handlePublishLink} className="lg:col-span-2 bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Link className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-extrabold text-sm text-slate-800">Cấu hình liên kết tài liệu ngoài</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="link-title">Tiêu đề học liệu *</label>
                      <input
                        id="link-title"
                        type="text"
                        required
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="Ví dụ: Ôn tập quy tắc chính tả d/gi/r"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="link-url">Đường dẫn liên kết (URL) *</label>
                      <input
                        id="link-url"
                        type="url"
                        required
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://wordwall.net/play/..."
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-emerald-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="link-type">Nền tảng học tập</label>
                      <select
                        id="link-type"
                        value={linkType}
                        onChange={(e) => setLinkType(e.target.value as ResourceType)}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-emerald-400 focus:outline-none bg-white"
                      >
                        <option value="wordwall">🎪 Wordwall (Trò chơi tương tác)</option>
                        <option value="kahoot">💜 Kahoot! (Đố vui thi đua)</option>
                        <option value="quizizz">🦄 Quizizz (Khảo sát tương tác)</option>
                        <option value="google_forms">📝 Google Forms (Bài tập khảo sát)</option>
                        <option value="google_slides">📊 Google Slides / PowerPoint</option>
                        <option value="google_docs">📄 Google Docs / Phiếu ôn tập</option>
                        <option value="canva">🎨 Canva Presentation</option>
                        <option value="liveworksheets">✍️ Liveworksheets (Phiếu tương tác)</option>
                        <option value="website">🌐 Website giáo dục khác</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="link-grade">Dành cho Khối lớp</label>
                      <select
                        id="link-grade"
                        value={linkGrade}
                        onChange={(e) => setLinkGrade(e.target.value as GradeType)}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-emerald-400 focus:outline-none bg-white"
                      >
                        <option value="1">Lớp 1</option>
                        <option value="2">Lớp 2</option>
                        <option value="3">Lớp 3</option>
                        <option value="4">Lớp 4</option>
                        <option value="5">Lớp 5</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="link-topic">Chủ đề phân loại</label>
                      <input
                        id="link-topic"
                        type="text"
                        value={linkTopic}
                        onChange={(e) => setLinkTopic(e.target.value)}
                        placeholder="Chính tả, Tập đọc, Âm vần..."
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="link-thumb">Ảnh bìa (URL) - Tuỳ chọn</label>
                      <input
                        id="link-thumb"
                        type="url"
                        value={linkThumb}
                        onChange={(e) => setLinkThumb(e.target.value)}
                        placeholder="Để trống để sử dụng ảnh mặc định của nền tảng"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-bold" htmlFor="link-desc">Mô tả sư phạm, hướng dẫn học sinh làm bài</label>
                      <textarea
                        id="link-desc"
                        rows={3}
                        value={linkDesc}
                        onChange={(e) => setLinkDesc(e.target.value)}
                        placeholder="Ví dụ: Các con nhấp vào đường link để chơi trò chơi ghép chữ, nhớ chụp lại kết quả gửi cô nhé!"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-display font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-[0.99] transition-all cursor-pointer text-center"
                    >
                      🚀 Xuất Bản Liên Kết Lên Kho Học Liệu
                    </button>
                  </div>
                </form>

                {/* Interactive live preview */}
                <div className="lg:col-span-1 bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Xem trước hiển thị (Học sinh)</span>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">LIVE PREVIEW</span>
                    </div>

                    {/* Card Preview */}
                    <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden transform hover:scale-[1.02] transition-transform">
                      <div className="h-32 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={linkThumb || getPlaceholderThumbnail(linkType)}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full capitalize">
                          {linkType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Lớp {linkGrade}</span>
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{linkTopic}</span>
                        </div>
                        <h5 className="font-sans font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{linkTitle || 'Chưa nhập tiêu đề...'}</h5>
                        <p className="text-3xs text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                          {linkDesc || 'Chưa có mô tả học liệu từ giáo viên.'}
                        </p>
                        
                        <div className="pt-2 flex items-center justify-between text-3xs font-extrabold text-slate-400 border-t border-slate-50">
                          <span>👤 Giáo viên Admin</span>
                          <span className="text-emerald-600 flex items-center gap-0.5 hover:underline">
                            Học ngay <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-3xs font-bold text-amber-800 space-y-1">
                    <p>💡 **Cách liên kết hiệu quả:**</p>
                    <p className="font-semibold text-slate-600">Bạn có thể tạo trò chơi miễn phí trên Wordwall.net hoặc Kahoot.it, sau đó copy đường dẫn chơi của học sinh dán vào đây để tích hợp nhanh vào bài học!</p>
                  </div>
                </div>
              </>
            )}

            {/* 2. VIDEO DESIGNER WORKSPACE */}
            {designType === 'video' && (
              <>
                <form onSubmit={handlePublishVideoNew} className="lg:col-span-2 bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
                      <Video className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-extrabold text-sm text-slate-800">Cấu hình bài giảng video tương tác</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="vid-title-new">Tiêu đề bài giảng *</label>
                      <input
                        id="vid-title-new"
                        type="text"
                        required
                        value={vTitleNew}
                        onChange={(e) => setVTitleNew(e.target.value)}
                        placeholder="Ví dụ: Luyện đọc âm vần uôi - ươi"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="vid-ytid-new">YouTube Video ID hoặc URL *</label>
                      <input
                        id="vid-ytid-new"
                        type="text"
                        required
                        value={vYoutubeIdNew}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.includes('youtube.com/watch?v=')) {
                            const parsed = val.split('v=')[1]?.split('&')[0];
                            setVYoutubeIdNew(parsed || val);
                          } else if (val.includes('youtu.be/')) {
                            const parsed = val.split('youtu.be/')[1]?.split('?')[0];
                            setVYoutubeIdNew(parsed || val);
                          } else {
                            setVYoutubeIdNew(val);
                          }
                        }}
                        placeholder="Ví dụ: W-U83tHHeN4"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-sky-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="vid-dur-new">Thời lượng hiển thị</label>
                      <input
                        id="vid-dur-new"
                        type="text"
                        value={vDurationNew}
                        onChange={(e) => setVDurationNew(e.target.value)}
                        placeholder="Ví dụ: 08:35"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="vid-grade-new">Dành cho lớp</label>
                      <select
                        id="vid-grade-new"
                        value={vGradeNew}
                        onChange={(e) => setVGradeNew(e.target.value as GradeType)}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-sky-400 focus:outline-none bg-white"
                      >
                        <option value="1">Lớp 1</option>
                        <option value="2">Lớp 2</option>
                        <option value="3">Lớp 3</option>
                        <option value="4">Lớp 4</option>
                        <option value="5">Lớp 5</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="vid-topic-new">Chủ đề bài học</label>
                      <input
                        id="vid-topic-new"
                        type="text"
                        value={vTopicNew}
                        onChange={(e) => setVTopicNew(e.target.value)}
                        placeholder="Từ vựng & Ngữ pháp, Học âm vần..."
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-bold" htmlFor="vid-desc-new">Mô tả bài giảng, nội dung tóm tắt</label>
                      <textarea
                        id="vid-desc-new"
                        rows={3}
                        value={vDescNew}
                        onChange={(e) => setVDescNew(e.target.value)}
                        placeholder="Tóm tắt ngắn giúp phụ huynh và học sinh nắm được bé sẽ học được gì sau video này..."
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-display font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] transition-all cursor-pointer text-center"
                    >
                      📹 Đăng Tải Bài Giảng Video
                    </button>
                  </div>
                </form>

                <div className="lg:col-span-1 bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Minh họa trình phát (Player Preview)</span>
                    
                    {vYoutubeIdNew ? (
                      <div className="space-y-3">
                        <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow relative">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${vYoutubeIdNew}`}
                            title="YouTube video player preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border">
                          <h6 className="font-bold text-xs text-slate-800 line-clamp-1">{vTitleNew || 'Video Chưa có tên'}</h6>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">Chủ đề: {vTopicNew} | Lớp {vGradeNew}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-4 text-center border-2 border-dashed border-slate-300">
                        <PlayCircle className="w-8 h-8 opacity-40 mb-2 animate-pulse" />
                        <span className="text-3xs font-extrabold">Nhập ID YouTube chính xác để hiển thị video minh họa tại đây!</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-2xl text-3xs font-bold text-sky-800">
                    💡 **Mẹo sư phạm:** ID YouTube là chuỗi ký tự đứng sau `v=` trên link (Ví dụ với link `youtube.com/watch?v=W-U83tHHeN4`, ID chính là `W-U83tHHeN4`). Ứng dụng sẽ tự bóc tách nếu bạn dán toàn bộ đường dẫn!
                  </div>
                </div>
              </>
            )}

            {/* 3. GAME DESIGNER WORKSPACE */}
            {designType === 'game' && (
              <>
                <form onSubmit={handlePublishGameNew} className="lg:col-span-2 bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-extrabold text-sm text-slate-800">Thiết kế Trò chơi tương tác thực hành</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="game-title-new">Tên trò chơi sinh động *</label>
                      <input
                        id="game-title-new"
                        type="text"
                        required
                        value={gTitleNew}
                        onChange={(e) => setGTitleNew(e.target.value)}
                        placeholder="Ví dụ: Vương quốc của bé"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="game-type-new">Lựa chọn Mô hình mẫu thiết kế</label>
                      <select
                        id="game-type-new"
                        value={gTypeNew}
                        onChange={(e) => setGTypeNew(e.target.value as any)}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:outline-none bg-white"
                      >
                        <option value="ghep_chu">🧩 Ghép âm vần / Ghép từ ngữ (Syllable Constructor)</option>
                        <option value="dien_tu">✍️ Điền vào chỗ trống (Fill-in-the-blank)</option>
                        <option value="vong_quay">🎡 Vòng quay ngữ pháp kì diệu (Spinning Wheel Trivia)</option>
                        <option value="trac_nghiem">⚡ Đố vui phản xạ nhanh (Speedy Multiple Choice)</option>
                        <option value="phan_loai">🍎 Phân loại từ - Trò chơi Hứng Táo</option>
                        <option value="noi_pikachu">⚡ Nối cặp thông minh - Trò chơi Pikachu</option>
                        <option value="dien_khuyet_gau_truc">🐼 Điền khuyết chính tả - Gấu Trúc Leo Núi</option>
                        <option value="xac_dinh_ban_cung">🏹 Xác định thành phần câu - Bắn Cung Thần Tốc</option>
                        <option value="sap_xep_merio">🏃 Sắp xếp trật tự từ - Mario Phiêu Lưu</option>
                        <option value="ban_bi">🔮 Nhận diện lỗi chính tả - Bắn Bi Sắc Màu</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="game-grade-new">Khối lớp áp dụng</label>
                      <select
                        id="game-grade-new"
                        value={gGradeNew}
                        onChange={(e) => setGGradeNew(e.target.value as GradeType)}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:outline-none bg-white"
                      >
                        <option value="1">Lớp 1</option>
                        <option value="2">Lớp 2</option>
                        <option value="3">Lớp 3</option>
                        <option value="4">Lớp 4</option>
                        <option value="5">Lớp 5</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="game-diff-new">Thiết lập độ khó</label>
                      <select
                        id="game-diff-new"
                        value={gDiffNew}
                        onChange={(e) => setGDiffNew(e.target.value as any)}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:outline-none bg-white"
                      >
                        <option value="Dễ">Dễ (Hỗ trợ nhiều gợi ý)</option>
                        <option value="Trung bình">Trung bình (Phổ thông)</option>
                        <option value="Khó">Khó (Đếm ngược thời gian)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold" htmlFor="game-topic-new">Phạm vi chủ đề từ vựng</label>
                      <input
                        id="game-topic-new"
                        type="text"
                        value={gTopicNew}
                        onChange={(e) => setGTopicNew(e.target.value)}
                        placeholder="Gia đình, Động vật, Thực vật..."
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-bold" htmlFor="game-words">Bộ từ vựng trò chơi (Cung cấp cơ sở dữ liệu từ)</label>
                      <input
                        id="game-words"
                        type="text"
                        value={gWordList}
                        onChange={(e) => setGWordList(e.target.value)}
                        placeholder="quả xoài, con trâu, học sinh, giáo viên (cách nhau bằng dấu phẩy)"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                      />
                      <p className="text-[10px] text-slate-400 font-bold">Mô hình trò chơi tương tác sẽ tự động phân rã chuỗi từ vựng của bạn để xáo trộn chữ, tạo chữ trống hoặc gài bẫy chính tả tương ứng!</p>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-bold" htmlFor="game-desc-new">Mô tả và Hướng dẫn cách chơi</label>
                      <textarea
                        id="game-desc-new"
                        rows={2}
                        value={gDescNew}
                        onChange={(e) => setGDescNew(e.target.value)}
                        placeholder="Ví dụ: Bé hãy kéo các chữ cái về đúng vị trí để ghép thành các từ chỉ loài hoa quen thuộc nhé!"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-display font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-[0.99] transition-all cursor-pointer text-center"
                    >
                      🎮 Xuất Bản Trò Chơi Tương Tác
                    </button>
                  </div>
                </form>

                <div className="lg:col-span-1 bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Xem trước cấu hình trò chơi</span>
                    
                    <div className="bg-white p-5 rounded-2xl border shadow-xs space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full capitalize">
                          {gTypeNew.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-slate-400">Độ khó: {gDiffNew}</span>
                      </div>
                      
                      <h6 className="font-display font-extrabold text-sm text-slate-800">{gTitleNew || 'Trò chơi mới'}</h6>
                      <p className="text-3xs text-slate-500 leading-relaxed font-semibold">{gDescNew || 'Đang chờ nhập hướng dẫn trò chơi...'}</p>
                      
                      <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100">
                        <span className="text-4xs font-bold text-slate-400 uppercase tracking-wide block">Từ vựng nạp vào ({gWordList.split(',').length} từ):</span>
                        <div className="flex flex-wrap gap-1">
                          {gWordList.split(',').map((w, idx) => (
                            <span key={idx} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border">
                              {w.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-3xs font-bold text-amber-800">
                    🎡 **Mẹo thiết kế:** Trò chơi sau khi tạo sẽ tích hợp hoàn toàn cơ sở dữ liệu từ vựng động vào trang "Trò chơi" ngoài màn hình chính để bé click chơi ngay lập tức mà không cần bất cứ dòng code nào thêm!
                  </div>
                </div>
              </>
            )}

            {/* 4. QUIZ BUILDER WORKSPACE */}
            {designType === 'quiz' && (
              <>
                {/* Visual Quiz Setup Form */}
                <div className="lg:col-span-2 space-y-6">
                  <form onSubmit={handlePublishQuizNew} className="bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                      <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <h4 className="font-display font-extrabold text-sm text-slate-800">Bước 1: Cấu hình thông tin Đề thi</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                      <div className="space-y-1.5">
                        <label className="block font-bold" htmlFor="quiz-title-new">Tiêu đề bộ đề thi *</label>
                        <input
                          id="quiz-title-new"
                          type="text"
                          required
                          value={qTitleNew}
                          onChange={(e) => setQTitleNew(e.target.value)}
                          placeholder="Ví dụ: Khảo sát Tiếng Việt Giữa Kỳ II"
                          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-bold" htmlFor="quiz-dur-new">Thời gian làm bài (Phút)</label>
                        <input
                          id="quiz-dur-new"
                          type="number"
                          value={qDurationNew}
                          onChange={(e) => setQDurationNew(parseInt(e.target.value) || 15)}
                          placeholder="15"
                          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-bold" htmlFor="quiz-grade-new">Dành cho Khối lớp</label>
                        <select
                          id="quiz-grade-new"
                          value={qGradeNew}
                          onChange={(e) => setQGradeNew(e.target.value as GradeType)}
                          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none bg-white"
                        >
                          <option value="1">Lớp 1</option>
                          <option value="2">Lớp 2</option>
                          <option value="3">Lớp 3</option>
                          <option value="4">Lớp 4</option>
                          <option value="5">Lớp 5</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-bold" htmlFor="quiz-topic-new">Phạm vi nội dung ôn tập</label>
                        <input
                          id="quiz-topic-new"
                          type="text"
                          value={qTopicNew}
                          onChange={(e) => setQTopicNew(e.target.value)}
                          placeholder="Chữ cái, Đọc hiểu, Ngữ pháp..."
                          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="block font-bold" htmlFor="quiz-desc-new">Mô tả và Hướng dẫn đề thi</label>
                        <textarea
                          id="quiz-desc-new"
                          rows={2}
                          value={qDescNew}
                          onChange={(e) => setQDescNew(e.target.value)}
                          placeholder="Ví dụ: Đề thi khảo sát kỹ năng ghép vần chính tả, giúp các con rèn luyện tư duy ngôn ngữ..."
                          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-3xs font-extrabold text-slate-400">Số câu đã thiết kế: {designedQuestions.length} câu hỏi</span>
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-display font-extrabold text-xs shadow-md hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all cursor-pointer"
                      >
                        ✅ Xuất Bản Đề Thi Hoàn Tất
                      </button>
                    </div>
                  </form>

                  {/* Question Visual Builder Form */}
                  <div className="bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                      <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                        <ListPlus className="w-4 h-4" />
                      </div>
                      <h4 className="font-display font-extrabold text-sm text-slate-800">Bước 2: Thiết kế từng câu hỏi (Trắc nghiệm 4 lựa chọn)</h4>
                    </div>

                    <div className="space-y-3 text-xs font-semibold text-slate-600">
                      <div className="space-y-1.5">
                        <label className="block font-bold">Nội dung câu hỏi muốn hỏi trẻ *</label>
                        <input
                          type="text"
                          value={currQText}
                          onChange={(e) => setCurrQText(e.target.value)}
                          placeholder="Ví dụ: Từ nào viết đúng chính tả?"
                          className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-500">Lựa chọn A *</label>
                          <input
                            type="text"
                            value={currQOptA}
                            onChange={(e) => setCurrQOptA(e.target.value)}
                            placeholder="Nhập phương án A"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-500">Lựa chọn B *</label>
                          <input
                            type="text"
                            value={currQOptB}
                            onChange={(e) => setCurrQOptB(e.target.value)}
                            placeholder="Nhập phương án B"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-500">Lựa chọn C (Không bắt buộc)</label>
                          <input
                            type="text"
                            value={currQOptC}
                            onChange={(e) => setCurrQOptC(e.target.value)}
                            placeholder="Nhập phương án C"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-500">Lựa chọn D (Không bắt buộc)</label>
                          <input
                            type="text"
                            value={currQOptD}
                            onChange={(e) => setCurrQOptD(e.target.value)}
                            placeholder="Nhập phương án D"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block font-bold">Đáp án đúng chính xác là</label>
                          <select
                            value={currQCorrect}
                            onChange={(e) => setCurrQCorrect(e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none bg-white font-extrabold"
                          >
                            <option value="A">Đáp án A</option>
                            <option value="B">Đáp án B</option>
                            <option value="C">Đáp án C (chỉ áp dụng nếu đã điền)</option>
                            <option value="D">Đáp án D (chỉ áp dụng nếu đã điền)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block font-bold">Lời giải thích sư phạm cho bé</label>
                          <input
                            type="text"
                            value={currQExpl}
                            onChange={(e) => setCurrQExpl(e.target.value)}
                            placeholder="Ví dụ: Vần uôi viết đúng với u-ô-i chứ không phải u-i."
                            className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-purple-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleAddQuestionToQuiz}
                          className="w-full py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold transition-all active:scale-95 cursor-pointer text-center"
                        >
                          ➕ Thêm câu hỏi này vào danh sách đề thi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Preview List (Sidebar) */}
                <div className="lg:col-span-1 bg-slate-50 p-5 rounded-3xl border-2 border-dashed border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-sans block">Cấu trúc đề thi hiện tại</span>
                    <span className="text-3xs font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {designedQuestions.length} câu hỏi
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                    {designedQuestions.map((q, idx) => (
                      <div key={q.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-lg border border-slate-100 cursor-pointer"
                          title="Xóa câu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex gap-1.5 items-center">
                          <span className="text-[10px] font-black bg-purple-100 text-purple-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Trắc nghiệm</span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 pr-6 line-clamp-2">{q.questionText}</p>
                        
                        <div className="space-y-1 pt-1">
                          {q.options?.map((opt: string, optIdx: number) => {
                            const isCorrect = opt === q.correctAnswer;
                            return (
                              <div
                                key={optIdx}
                                className={`text-[10px] p-1.5 rounded-lg border flex items-center gap-1.5 font-semibold ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                    : 'bg-slate-50 border-slate-100 text-slate-600'
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                ) : (
                                  <span className="w-3 h-3 text-slate-300 text-center text-4xs shrink-0 font-bold">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                )}
                                <span className="truncate">{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {designedQuestions.length === 0 && (
                      <div className="text-center py-10 bg-white border rounded-2xl p-4 text-slate-400">
                        <HelpCircle className="w-8 h-8 opacity-30 mx-auto mb-2" />
                        <span className="text-3xs font-extrabold">Đề thi chưa có câu hỏi nào. Bé sẽ không thể thi nếu bạn chưa thêm câu hỏi.</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

          </div>

        </div>
      )}

      {/* B. MANAGE VIDEOS PANEL */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="videos-tab">
          {/* Add form */}
          <form onSubmit={handleAddVideo} className="lg:col-span-1 bg-white p-5 rounded-2xl border-2 border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-sm text-slate-800 border-b pb-2">📹 Thêm Video Mới</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="vid-title">Tiêu đề bài giảng *</label>
                <input
                  id="vid-title"
                  type="text"
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  placeholder="Ví dụ: Luyện viết chữ đẹp"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="vid-youtube-id">YouTube Video ID *</label>
                <input
                  id="vid-youtube-id"
                  type="text"
                  value={vYoutubeId}
                  onChange={(e) => setVYoutubeId(e.target.value)}
                  placeholder="W-U83tHHeN4"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="vid-duration">Thời lượng</label>
                <input
                  id="vid-duration"
                  type="text"
                  value={vDuration}
                  onChange={(e) => setVDuration(e.target.value)}
                  placeholder="10:00"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="vid-grade">Khối lớp</label>
                <select
                  id="vid-grade"
                  value={vGrade}
                  onChange={(e) => setVGrade(e.target.value as GradeType)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="1">Lớp 1</option>
                  <option value="2">Lớp 2</option>
                  <option value="3">Lớp 3</option>
                  <option value="4">Lớp 4</option>
                  <option value="5">Lớp 5</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="vid-topic">Chủ đề</label>
                <input
                  id="vid-topic"
                  type="text"
                  value={vTopic}
                  onChange={(e) => setVTopic(e.target.value)}
                  placeholder="Từ vựng & Ngữ pháp"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="vid-desc">Mô tả tóm tắt</label>
                <textarea
                  id="vid-desc"
                  value={vDesc}
                  onChange={(e) => setVDesc(e.target.value)}
                  placeholder="Chi tiết bài giảng..."
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-display font-bold shadow-sm cursor-pointer"
            >
              Lưu video mới
            </button>
          </form>

          {/* List videos */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border-2 border-slate-100 space-y-3">
            <h3 className="font-display font-extrabold text-sm text-slate-800 border-b pb-2">Danh sách video hiện tại ({totalVideos})</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {videos.map((vid) => (
                <div key={vid.id} className="bg-slate-50 p-3 rounded-xl border flex justify-between items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="truncate">
                    <span className="text-4xs font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded-full mr-2">Lớp {vid.grade}</span>
                    <span className="font-bold text-slate-800">{vid.title}</span>
                    <p className="text-4xs text-slate-400 font-bold mt-1">Topic: {vid.topic} | Thời lượng: {vid.duration}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100 shrink-0 cursor-pointer"
                    aria-label="Xóa video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* C. MANAGE GAMES PANEL */}
      {activeTab === 'games' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="games-tab">
          {/* Add form */}
          <form onSubmit={handleAddGame} className="lg:col-span-1 bg-white p-5 rounded-2xl border-2 border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-sm text-slate-800 border-b pb-2">🎮 Thêm Trò Chơi Mới</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="game-title">Tiêu đề trò chơi *</label>
                <input
                  id="game-title"
                  type="text"
                  value={gTitle}
                  onChange={(e) => setGTitle(e.target.value)}
                  placeholder="Ví dụ: Ô chữ diệu kỳ"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="game-type">Loại trò chơi tương tác</label>
                <select
                  id="game-type"
                  value={gType}
                  onChange={(e) => setGType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="ghep_chu">Ghép chữ (Forming syllables)</option>
                  <option value="dien_tu">Điền từ (Blank filler)</option>
                  <option value="vong_quay">Vòng quay may mắn (Synonym/antonym trivia)</option>
                  <option value="trac_nghiem">Trắc nghiệm nhanh</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="game-diff">Độ khó</label>
                <select
                  id="game-diff"
                  value={gDiff}
                  onChange={(e) => setGDiff(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="game-grade">Khối lớp</label>
                <select
                  id="game-grade"
                  value={gGrade}
                  onChange={(e) => setGGrade(e.target.value as GradeType)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="1">Lớp 1</option>
                  <option value="2">Lớp 2</option>
                  <option value="3">Lớp 3</option>
                  <option value="4">Lớp 4</option>
                  <option value="5">Lớp 5</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="game-topic">Chủ đề</label>
                <input
                  id="game-topic"
                  type="text"
                  value={gTopic}
                  onChange={(e) => setGTopic(e.target.value)}
                  placeholder="Ca dao & Tục ngữ"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="game-desc">Mô tả chi tiết</label>
                <textarea
                  id="game-desc"
                  value={gDesc}
                  onChange={(e) => setGDesc(e.target.value)}
                  placeholder="Cách thức chơi..."
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-display font-bold shadow-sm cursor-pointer"
            >
              Lưu trò chơi mới
            </button>
          </form>

          {/* List games */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border-2 border-slate-100 space-y-3">
            <h3 className="font-display font-extrabold text-sm text-slate-800 border-b pb-2">Danh sách trò chơi hiện có ({totalGames})</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {games.map((game) => (
                <div key={game.id} className="bg-slate-50 p-3 rounded-xl border flex justify-between items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="truncate">
                    <span className="text-4xs font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full mr-2">Lớp {game.grade}</span>
                    <span className="font-bold text-slate-800">{game.title}</span>
                    <p className="text-4xs text-slate-400 font-bold mt-1">Độ khó: {game.difficulty} | Thể loại: {game.gameType}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteGame(game.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100 shrink-0 cursor-pointer"
                    aria-label="Xóa trò chơi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* D. MANAGE QUIZZES PANEL */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="quizzes-tab">
          {/* Add form */}
          <form onSubmit={handleAddQuiz} className="lg:col-span-1 bg-white p-5 rounded-2xl border-2 border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-sm text-slate-800 border-b pb-2">📝 Tạo Đề Thi Mới</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="quiz-title">Tiêu đề đề thi *</label>
                <input
                  id="quiz-title"
                  type="text"
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder="Ví dụ: Đề khảo sát Tiếng Việt Lớp 1 học kỳ I"
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="quiz-duration">Thời lượng làm bài (phút)</label>
                <input
                  id="quiz-duration"
                  type="number"
                  value={qDuration}
                  onChange={(e) => setQDuration(parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="quiz-grade">Khối lớp</label>
                <select
                  id="quiz-grade"
                  value={qGrade}
                  onChange={(e) => setQGrade(e.target.value as GradeType)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="1">Lớp 1</option>
                  <option value="2">Lớp 2</option>
                  <option value="3">Lớp 3</option>
                  <option value="4">Lớp 4</option>
                  <option value="5">Lớp 5</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="quiz-topic">Chủ đề kiểm tra</label>
                <input
                  id="quiz-topic"
                  type="text"
                  value={qTopic}
                  onChange={(e) => setQTopic(e.target.value)}
                  placeholder="Chữ cái & Âm vần"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600" htmlFor="quiz-desc">Mô tả tóm tắt</label>
                <textarea
                  id="quiz-desc"
                  value={qDesc}
                  onChange={(e) => setQDesc(e.target.value)}
                  placeholder="Hướng dẫn học sinh làm bài thi..."
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-display font-bold shadow-sm cursor-pointer"
            >
              Lưu đề thi mới
            </button>
          </form>

          {/* List quizzes */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border-2 border-slate-100 space-y-3">
            <h3 className="font-display font-extrabold text-sm text-slate-800 border-b pb-2">Danh sách đề thi hiện có ({totalQuizzes})</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-slate-50 p-3 rounded-xl border flex justify-between items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="truncate">
                    <span className="text-4xs font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded-full mr-2">Lớp {quiz.grade}</span>
                    <span className="font-bold text-slate-800">{quiz.title}</span>
                    <p className="text-4xs text-slate-400 font-bold mt-1">Thời gian: {quiz.durationMinutes} phút | Số câu hỏi: {quiz.questions.length}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100 shrink-0 cursor-pointer"
                    aria-label="Xóa đề thi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
