/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  RotateCcw,
  Calendar,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Quiz, QuizQuestion, QuizHistory, StudentStats } from '../types';
import { playSuccessMelody, playCorrectSound } from '../utils/audio';

interface QuizCenterProps {
  quizzes: Quiz[];
  stats: StudentStats;
  setStats: React.Dispatch<React.SetStateAction<StudentStats>>;
  quizHistory: QuizHistory[];
  setQuizHistory: React.Dispatch<React.SetStateAction<QuizHistory[]>>;
  selectedQuiz: Quiz | null;
  setSelectedQuiz: (quiz: Quiz | null) => void;
}

export default function QuizCenter({
  quizzes,
  stats,
  setStats,
  quizHistory,
  setQuizHistory,
  selectedQuiz,
  setSelectedQuiz,
}: QuizCenterProps) {
  
  const [activeQuizId, setActiveQuizId] = useState<string | null>(selectedQuiz ? selectedQuiz.id : null);
  const [quizState, setQuizState] = useState<'intro' | 'testing' | 'results'>('intro');

  // Testing session state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Result metrics state
  const [latestScore, setLatestScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Sync state if selectedQuiz changes from outer tabs
  useEffect(() => {
    if (selectedQuiz) {
      setActiveQuizId(selectedQuiz.id);
      setQuizState('intro');
    }
  }, [selectedQuiz]);

  const activeQuiz = quizzes.find(q => q.id === activeQuizId) || quizzes[0];

  // Active Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      handleCompleteQuiz(); // Auto submit on timeout
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleStartQuiz = () => {
    setQuizState('testing');
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setTimeLeft(activeQuiz.durationMinutes * 60);
    setTimerActive(true);
    setStartTime(Date.now());
  };

  const handleSelectOption = (questionId: string, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIdx(idx => idx + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    setTimerActive(false);
    playSuccessMelody();
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    setTimeSpentSeconds(elapsedSeconds);

    // Score calculations
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      const userAnswerRaw = userAnswers[q.id] || '';
      const targetAns = (q.correctAnswer as string).trim().toLowerCase();
      const userAnsClean = userAnswerRaw.trim().toLowerCase();
      
      if (userAnsClean === targetAns) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / activeQuiz.questions.length) * 10);
    setCorrectAnswersCount(correct);
    setLatestScore(calculatedScore);
    setQuizState('results');

    // Save history attempt
    const newHistoryItem: QuizHistory = {
      id: `hist-${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      grade: activeQuiz.grade,
      score: calculatedScore,
      totalQuestions: activeQuiz.questions.length,
      date: new Date().toISOString().split('T')[0],
      timeSpentSeconds: elapsedSeconds
    };

    setQuizHistory(prev => [newHistoryItem, ...prev]);

    // Update global student progress
    setStats(prev => {
      const isPerfectScore = calculatedScore === 10;
      
      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'badge-2' && isPerfectScore) {
          return { ...b, unlockedAt: new Date().toISOString().split('T')[0] };
        }
        return b;
      });

      return {
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        totalQuizScore: prev.totalQuizScore + calculatedScore,
        badges: updatedBadges
      };
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="quiz-center-view">
      
      {/* 1. Left Sidebar: Tests catalog and histories */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Quiz Catalog */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <FileCheck2 className="w-5 h-5 text-sky-500" />
            <h3 className="font-display font-bold text-sm text-slate-800">Danh mục bài thi</h3>
          </div>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2.5 pb-2 lg:pb-0 scrollbar-none lg:space-y-2">
            {quizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => {
                  setActiveQuizId(quiz.id);
                  setQuizState('intro');
                }}
                className={`text-left p-3 rounded-xl border transition-all text-xs font-bold cursor-pointer flex flex-col gap-1 min-w-[180px] lg:min-w-0 w-[220px] lg:w-full shrink-0 lg:shrink ${
                  activeQuizId === quiz.id
                    ? 'bg-sky-50 border-sky-300 text-sky-700'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Lớp {quiz.grade}</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {quiz.durationMinutes}m</span>
                </div>
                <h4 className="font-display font-bold text-slate-800 line-clamp-1 lg:line-clamp-2 leading-snug">{quiz.title}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation History logs */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-sm text-slate-800">Lịch sử làm bài</h3>
          </div>

          {quizHistory.length === 0 ? (
            <p className="text-4xs text-slate-400 font-bold text-center py-4">Em chưa thực hiện bài thi nào. Hãy bắt đầu ôn tập nhé!</p>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {quizHistory.slice(0, 5).map((item) => (
                <div key={item.id} className="bg-slate-50 border p-2.5 rounded-xl space-y-1 text-2xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800 truncate max-w-[120px]">{item.quizTitle}</span>
                    <span className={`px-2 py-0.5 rounded-full text-3xs ${
                      item.score >= 8 ? 'bg-emerald-100 text-emerald-700' : item.score >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.score}/10 Điểm
                    </span>
                  </div>
                  <div className="flex justify-between text-3xs text-slate-400 font-semibold">
                    <span>⏱️ {item.timeSpentSeconds} giây</span>
                    <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 2. Middle Column: Core Testing / Results Stage */}
      <div className="lg:col-span-3 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-2xs min-h-[450px] flex flex-col justify-between">
        
        {/* A. INTRO SCREEN */}
        {quizState === 'intro' && (
          <div className="py-8 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center text-sky-500 mx-auto">
              <FileCheck2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <span className="text-3xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Luyện tập Lớp {activeQuiz.grade}</span>
              <h2 className="text-xl font-display font-extrabold text-slate-800 leading-snug">{activeQuiz.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{activeQuiz.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
              <div className="text-center">
                <span className="text-3xs font-bold text-slate-400 uppercase">Thời gian</span>
                <p className="font-display font-extrabold text-sm text-slate-800">{activeQuiz.durationMinutes} phút</p>
              </div>
              <div className="text-center">
                <span className="text-3xs font-bold text-slate-400 uppercase">Số câu hỏi</span>
                <p className="font-display font-extrabold text-sm text-slate-800">{activeQuiz.questions.length} câu tự luận/trắc nghiệm</p>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-display font-bold text-sm rounded-full shadow-md shadow-sky-100 transform active:scale-95 transition-all cursor-pointer"
            >
              Bắt đầu làm bài thi
            </button>
          </div>
        )}

        {/* B. ACTIVE TESTING CONVAS */}
        {quizState === 'testing' && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            {/* Top Stats */}
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-xs font-bold text-slate-400">
                Câu hỏi {currentQuestionIdx + 1} / {activeQuiz.questions.length}
              </span>
              <div className="flex items-center gap-1 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full text-xs font-bold text-rose-600 animate-pulse">
                <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
              </div>
            </div>

            {/* Core Question Block */}
            <div className="space-y-6 py-4 flex-1 flex flex-col justify-center">
              {(() => {
                const q: QuizQuestion = activeQuiz.questions[currentQuestionIdx];
                return (
                  <div className="space-y-5">
                    <h3 className="text-base md:text-lg font-display font-bold text-slate-800 leading-snug bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      {q.questionText}
                    </h3>

                    {/* RENDER TRẮC NGHIỆM OR ĐÚNG SAI (Options) */}
                    {(q.type === 'trac_nghiem' || q.type === 'dung_sai') && q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt) => {
                          const isSelected = userAnswers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`p-3.5 border-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-sky-500 border-sky-600 text-white shadow-sm'
                                  : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                              }`}
                            >
                              <span>{opt}</span>
                              <div className={`w-4 h-4 rounded-full border shrink-0 ${isSelected ? 'bg-white' : 'border-slate-300'}`} />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* RENDER ĐIỀN KHUYẾT (Inline Input) */}
                    {q.type === 'dien_khuyet' && (
                      <div className="space-y-2 max-w-sm">
                        <label className="text-3xs font-bold text-slate-400 uppercase tracking-wide" htmlFor={`input-q-${q.id}`}>Gõ từ còn thiếu của em:</label>
                        <input
                          id={`input-q-${q.id}`}
                          type="text"
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => handleSelectOption(q.id, e.target.value)}
                          placeholder="Nhập câu trả lời..."
                          className="w-full px-4 py-2.5 border-2 border-slate-200 focus:border-sky-500 focus:outline-none rounded-xl font-bold text-sm"
                        />
                      </div>
                    )}

                    {/* RENDER TỰ LUẬN NGẮN (Short answer textarea) */}
                    {q.type === 'tu_luan_ngan' && (
                      <div className="space-y-2">
                        <label className="text-3xs font-bold text-slate-400 uppercase tracking-wide" htmlFor={`textarea-q-${q.id}`}>Viết câu trả lời ngắn bằng chữ viết thường:</label>
                        <textarea
                          id={`textarea-q-${q.id}`}
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => handleSelectOption(q.id, e.target.value)}
                          placeholder="Viết đáp án của em tại đây..."
                          rows={3}
                          className="w-full px-4 py-2.5 border-2 border-slate-200 focus:border-sky-500 focus:outline-none rounded-2xl font-semibold text-xs leading-relaxed"
                        />
                      </div>
                    )}

                  </div>
                );
              })()}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-slate-50 pt-4">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(idx => idx - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
              >
                Câu trước
              </button>
              
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-display font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {currentQuestionIdx + 1 === activeQuiz.questions.length ? 'Nộp Bài Thi' : 'Câu tiếp theo'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* C. EVALUATION RESULTS & REVIEWS */}
        {quizState === 'results' && (
          <div className="space-y-6" id="results-sheet">
            <div className="bg-sky-50 p-5 rounded-3xl border border-sky-100 text-center space-y-4">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-500 mx-auto shadow-sm">
                <Award className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-display font-extrabold text-slate-800">Hoàn thành bài ôn luyện!</h3>
                <p className="text-2xs text-slate-400 font-bold">Thời gian hoàn thành: {timeSpentSeconds} giây | Số câu đúng: {correctAnswersCount} / {activeQuiz.questions.length}</p>
              </div>

              {/* Core Score Badge */}
              <div className="inline-block px-6 py-2.5 bg-sky-500 text-white rounded-full shadow-md shadow-sky-100">
                <span className="text-3xs font-bold uppercase block tracking-wider">ĐIỂM SỐ CHỮ</span>
                <span className="font-display font-extrabold text-2xl">{latestScore} / 10 Điểm</span>
              </div>
            </div>

            {/* Answer Explanations Sheet list */}
            <div className="space-y-4">
              <div className="flex items-center gap-1 border-b pb-2">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <h4 className="font-display font-bold text-xs text-slate-800">Review Lời Giải & Đáp Án Chi Tiết:</h4>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {activeQuiz.questions.map((q, idx) => {
                  const uAns = userAnswers[q.id] || '';
                  const correctVal = q.correctAnswer as string;
                  const isCorrect = uAns.trim().toLowerCase() === correctVal.trim().toLowerCase();

                  return (
                    <div key={idx} className="bg-slate-50 border p-4 rounded-2xl space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="font-display font-bold text-2xs text-slate-500 mt-0.5">Câu {idx + 1}:</span>
                        <h5 className="font-display font-bold text-xs text-slate-800 leading-snug">{q.questionText}</h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-3xs font-bold">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-semibold">Đáp án của em:</span>
                          <span className={`flex items-center gap-0.5 ${isCorrect ? 'text-emerald-600' : uAns ? 'text-rose-600' : 'text-slate-400'}`}>
                            {isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                            {uAns || 'Chưa trả lời'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 font-semibold">Đáp án chuẩn: </span>
                          <span className="text-emerald-600 font-extrabold">{correctVal}</span>
                        </div>
                      </div>

                      {/* Explanation box */}
                      <div className="bg-white p-2.5 rounded-xl border border-dashed text-4xs font-bold text-slate-500 leading-relaxed flex items-start gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                        <p><span className="text-slate-700 font-extrabold">Sư phạm giải thích:</span> {q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom tools */}
            <div className="flex gap-3 justify-center pt-3 border-t">
              <button
                onClick={handleStartQuiz}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-display font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Làm Lại Bài Thi
              </button>
              <button
                onClick={() => setQuizState('intro')}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Đóng Kết Quả
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
