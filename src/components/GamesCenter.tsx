/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  Play
} from 'lucide-react';
import { GameItem, StudentStats } from '../types';
import { playSuccessMelody, playCorrectSound } from '../utils/audio';

interface GamesCenterProps {
  games: GameItem[];
  stats: StudentStats;
  setStats: React.Dispatch<React.SetStateAction<StudentStats>>;
  selectedGame: GameItem | null;
  setSelectedGame: (game: GameItem | null) => void;
}

export default function GamesCenter({
  games,
  stats,
  setStats,
  selectedGame,
  setSelectedGame,
}: GamesCenterProps) {
  
  const [activeGameId, setActiveGameId] = useState<string | null>(selectedGame ? selectedGame.id : null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');

  // --- GAME 1: XỨ SỞ GHÉP TIẾNG ---
  const [g1Index, setG1Index] = useState(0);
  const [g1SelectedParts, setG1SelectedParts] = useState<string[]>([]);
  const g1Questions = [
    { emoji: '🐱', word: 'mèo', parts: ['m', 'èo'], distractor: ['n', 'ế', 'ch'] },
    { emoji: '🐟', word: 'cá', parts: ['c', 'á'], distractor: ['g', 'u', 'i'] },
    { emoji: '🍌', word: 'chuối', parts: ['ch', 'uối'], distractor: ['b', 'anh', 'ong'] },
  ];

  // --- GAME 2: THỬ THÁCH ĐIỀN CA DAO ---
  const [g2Index, setG2Index] = useState(0);
  const [g2SelectedAnswer, setG2SelectedAnswer] = useState<string | null>(null);
  const [g2IsCorrect, setG2IsCorrect] = useState<boolean | null>(null);
  const g2Questions = [
    { sentence: 'Ăn quả nhớ kẻ trồng ______', blank: 'cây', options: ['cây', 'hoa', 'quả', 'rừng'], translation: 'Nhắc nhở lòng biết ơn đối với người đã giúp đỡ mình.' },
    { sentence: 'Thương người như thể thương ______', blank: 'thân', options: ['thân', 'bạn', 'mẹ', 'cha'], translation: 'Khuyên răn chúng ta nên biết yêu thương đùm bọc lẫn nhau.' },
    { sentence: 'Có công mài sắt, có ngày nên ______', blank: 'kim', options: ['kim', 'đồng', 'bạc', 'khoa'], translation: 'Khuyên nhủ đức tính kiên trì, nhẫn nại sẽ gặt hái thành công.' },
  ];

  // --- GAME 3: VÒNG QUAY TỪ ĐỒNG NGHĨA ---
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [wheelWord, setWheelWord] = useState<string | null>(null);
  const [g3Options, setG3Options] = useState<string[]>([]);
  const [g3Selected, setG3Selected] = useState<string | null>(null);
  const [g3IsCorrect, setG3IsCorrect] = useState<boolean | null>(null);

  const wheelWords = [
    { word: 'Chăm chỉ', synonym: 'Cần cù', options: ['Cần cù', 'Nhát gan', 'Hiền lành', 'Thông minh'] },
    { word: 'Dũng cảm', synonym: 'Gan dạ', options: ['Gan dạ', 'Yếu ớt', 'Thật thà', 'Kiêu ngạo'] },
    { word: 'Nhân hậu', synonym: 'Hiền từ', options: ['Hiền từ', 'Hung dữ', 'Chăm chỉ', 'Sáng tạo'] },
    { word: 'Thông minh', synonym: 'Sáng dạ', options: ['Sáng dạ', 'Lười biếng', 'Khỏe mạnh', 'Lễ phép'] },
  ];

  // --- GAME HỨNG TÁO VƯỜN HỒNG ---
  const [appleIndex, setAppleIndex] = useState(0);
  const [appleSelectedResult, setAppleSelectedResult] = useState<boolean | null>(null);
  const appleList = [
    { word: 'ngoan ngoãn', type: 'lay', explanation: 'Từ láy toàn bộ có biến điệu vần.' },
    { word: 'bàn ghế', type: 'ghep', explanation: 'Từ ghép tổng hợp.' },
    { word: 'lung linh', type: 'lay', explanation: 'Từ láy âm đầu l.' },
    { word: 'chăm chỉ', type: 'ghep', explanation: 'Từ ghép đẳng lập.' },
    { word: 'ấm áp', type: 'lay', explanation: 'Từ láy khuyết âm đầu.' },
    { word: 'sách vở', type: 'ghep', explanation: 'Từ ghép tổng hợp.' },
  ];

  // --- GAME PIKACHU KẾT ĐÔI ---
  const [pikachuSelected, setPikachuSelected] = useState<string | null>(null);
  const [pikachuMatched, setPikachuMatched] = useState<string[]>([]);
  const [pikachuLaser, setPikachuLaser] = useState<{ from: string; to: string } | null>(null);
  const pikachuCards = [
    { id: 'p1', word: 'bao la', pairId: 'pair-1' },
    { id: 'p2', word: 'rộng lớn', pairId: 'pair-1' },
    { id: 'p3', word: 'siêng năng', pairId: 'pair-2' },
    { id: 'p4', word: 'chăm chỉ', pairId: 'pair-2' },
    { id: 'p5', word: 'nhân hậu', pairId: 'pair-3' },
    { id: 'p6', word: 'hiền từ', pairId: 'pair-3' },
    { id: 'p7', word: 'trung thực', pairId: 'pair-4' },
    { id: 'p8', word: 'thật thà', pairId: 'pair-4' },
  ];

  // --- GAME GẤU TRÚC LEO CÂY ---
  const [pandaStep, setPandaStep] = useState(0);
  const [pandaResult, setPandaResult] = useState<boolean | null>(null);
  const pandaQuestions = [
    { sentence: 'Gần mực thì đen, gần đèn thì ______', blank: 'sáng', options: ['sáng', 'tối', 'đỏ', 'vàng'], explanation: 'Cánh cửa tốt đẹp mở ra khi ta ở môi trường lành mạnh.' },
    { sentence: 'Bầu ơi thương lấy bí cùng, tuy rằng khác ______ nhưng chung một giàn', blank: 'giống', options: ['loài', 'giống', 'quả', 'dây'], explanation: 'Tinh thần đùm bọc, đoàn kết đồng bào Việt Nam.' },
    { sentence: 'Ăn quả nhớ kẻ ______ cây', blank: 'trồng', options: ['leo', 'chặt', 'tưới', 'trồng'], explanation: 'Lòng biết ơn công lao người đi trước đã gầy dựng.' },
  ];

  // --- GAME BẮN CUNG THẦN TỐC ---
  const [archeryIndex, setArcheryIndex] = useState(0);
  const [archeryArrowState, setArcheryArrowState] = useState<'idle' | 'shooting' | 'hit'>('idle');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [archeryIsCorrect, setArcheryIsCorrect] = useState<boolean | null>(null);
  const archeryQuestions = [
    {
      prompt: 'Hãy bắn trúng từ viết SAI CHÍNH TẢ!',
      targets: [
        { id: 't1', word: 'quả soài', isCorrect: true },
        { id: 't2', word: 'quả xoài', isCorrect: false },
        { id: 't3', word: 'sương rồng', isCorrect: false },
        { id: 't4', word: 'tròn xoe', isCorrect: false }
      ]
    },
    {
      prompt: 'Hãy bắn trúng câu có sử dụng PHÉP SO SÁNH!',
      targets: [
        { id: 't5', word: 'Trăng tròn như quả bóng', isCorrect: true },
        { id: 't6', word: 'Chị ong nâu bận rộn', isCorrect: false },
        { id: 't7', word: 'Cây dừa dang tay bơi', isCorrect: false },
        { id: 't8', word: 'Mưa rơi tí tách bập bùng', isCorrect: false }
      ]
    },
    {
      prompt: 'Hãy bắn trúng câu có sử dụng PHÉP NHÂN HÓA!',
      targets: [
        { id: 't9', word: 'Dòng sông xanh mát mẻ', isCorrect: false },
        { id: 't10', word: 'Bác mặt trời đạp xe qua núi', isCorrect: true },
        { id: 't11', word: 'Bé đang nỗ lực học bài', isCorrect: false },
        { id: 't12', word: 'Cánh đồng lúa rộng bao la', isCorrect: false }
      ]
    }
  ];

  // --- GAME MERIO PHIÊU LƯU KÝ ---
  const [merioIndex, setMerioIndex] = useState(0);
  const [merioAssembled, setMerioAssembled] = useState<string[]>([]);
  const [merioState, setMerioState] = useState<'idle' | 'jumping' | 'win'>('idle');
  const merioLevels = [
    { words: ['Em', 'Tiếng', 'yêu', 'Việt'], target: ['Em', 'yêu', 'Tiếng', 'Việt'], original: 'Em / yêu / Tiếng / Việt' },
    { words: ['chăm', 'Bé', 'bài', 'chỉ', 'học'], target: ['Bé', 'chăm', 'chỉ', 'học', 'bài'], original: 'Bé / chăm / chỉ / học / bài' },
    { words: ['em', 'rất', 'Trường', 'đẹp'], target: ['Trường', 'em', 'rất', 'đẹp'], original: 'Trường / em / rất / đẹp' }
  ];

  // --- GAME BẮN BI SẮC MÀU ---
  const [marbleIndex, setMarbleIndex] = useState(0);
  const [marbleLauncherState, setMarbleLauncherState] = useState<'idle' | 'shooting' | 'hit'>('idle');
  const [selectedMarbleId, setSelectedMarbleId] = useState<string | null>(null);
  const [marbleIsCorrect, setMarbleIsCorrect] = useState<boolean | null>(null);
  const marbleLevels = [
    {
      prefix: 'tr',
      targets: [
        { id: 'm1', rime: '-on', word: 'tron', isCorrect: false },
        { id: 'm2', rime: '-uông', word: 'truông', isCorrect: false },
        { id: 'm3', rime: '-òn', word: 'tròn', isCorrect: true, wordComplete: 'tròn xoe' }
      ],
      prompt: 'Hãy chọn và bắn bi mang vần thích hợp để điền khuyết: "____òn xoe"'
    },
    {
      prefix: 'l',
      targets: [
        { id: 'm4', rime: '-anh', word: 'lanh', isCorrect: true, wordComplete: 'nhanh lanh' },
        { id: 'm5', rime: '-on', word: 'lon', isCorrect: false },
        { id: 'm6', rime: '-ong', word: 'long', isCorrect: false }
      ],
      prompt: 'Hãy chọn và bắn bi mang vần thích hợp để điền khuyết: "nhanh ___anh"'
    }
  ];

  // Sync state if selectedGame changes from home or grade view
  useEffect(() => {
    if (selectedGame) {
      setActiveGameId(selectedGame.id);
      setGameState('idle');
      resetAllGames();
    }
  }, [selectedGame]);

  const resetAllGames = () => {
    setScore(0);
    setG1Index(0);
    setG1SelectedParts([]);
    setG2Index(0);
    setG2SelectedAnswer(null);
    setG2IsCorrect(null);
    setWheelWord(null);
    setG3Selected(null);
    setG3IsCorrect(null);

    // Reset new games
    setAppleIndex(0);
    setAppleSelectedResult(null);

    setPikachuSelected(null);
    setPikachuMatched([]);
    setPikachuLaser(null);

    setPandaStep(0);
    setPandaResult(null);

    setArcheryIndex(0);
    setArcheryArrowState('idle');
    setSelectedTargetId(null);
    setArcheryIsCorrect(null);

    setMerioIndex(0);
    setMerioAssembled([]);
    setMerioState('idle');

    setMarbleIndex(0);
    setMarbleLauncherState('idle');
    setSelectedMarbleId(null);
    setMarbleIsCorrect(null);
  };

  const handleStartGame = () => {
    setGameState('playing');
    resetAllGames();
  };

  // --- GAME 1 LOGIC ---
  const handleG1PartClick = (part: string) => {
    if (g1SelectedParts.includes(part)) {
      setG1SelectedParts(prev => prev.filter(p => p !== part));
    } else {
      const newParts = [...g1SelectedParts, part];
      setG1SelectedParts(newParts);

      // Check if correct word is formed
      const formedWord = newParts.join('');
      const target = g1Questions[g1Index].word;

      if (formedWord === target) {
        setScore(prev => prev + 30);
        playCorrectSound();
        setTimeout(() => {
          if (g1Index + 1 < g1Questions.length) {
            setG1Index(idx => idx + 1);
            setG1SelectedParts([]);
          } else {
            handleCompleteGame();
          }
        }, 1200);
      } else if (formedWord.length >= target.length) {
        // Wrong combination, auto reset after 800ms
        setTimeout(() => {
          setG1SelectedParts([]);
        }, 800);
      }
    }
  };

  // --- GAME 2 LOGIC ---
  const handleG2Answer = (ans: string) => {
    const correct = ans === g2Questions[g2Index].blank;
    setG2SelectedAnswer(ans);
    setG2IsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 30);
      playCorrectSound();
    }

    setTimeout(() => {
      setG2SelectedAnswer(null);
      setG2IsCorrect(null);
      if (g2Index + 1 < g2Questions.length) {
        setG2Index(idx => idx + 1);
      } else {
        handleCompleteGame();
      }
    }, 1500);
  };

  // --- GAME 3 LOGIC ---
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setG3Selected(null);
    setG3IsCorrect(null);
    
    // Create random rotations
    const extraRotations = 1440 + Math.floor(Math.random() * 360);
    const newRotation = spinRotation + extraRotations;
    setSpinRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Select a random word from dataset
      const randomIdx = Math.floor(Math.random() * wheelWords.length);
      const chosen = wheelWords[randomIdx];
      setWheelWord(chosen.word);
      setG3Options(chosen.options.sort(() => Math.random() - 0.5));
    }, 2500);
  };

  const handleG3Answer = (ans: string) => {
    const currentWordData = wheelWords.find(w => w.word === wheelWord);
    const correct = ans === currentWordData?.synonym;
    setG3Selected(ans);
    setG3IsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 40);
      playCorrectSound();
    }

    setTimeout(() => {
      handleCompleteGame();
    }, 1800);
  };

  // --- GAME HỨNG TÁO VƯỜN HỒNG LOGIC ---
  const handleAppleAnswer = (selectedType: 'lay' | 'ghep') => {
    if (appleSelectedResult !== null) return;
    const currentApple = appleList[appleIndex];
    const isCorrect = selectedType === currentApple.type;
    setAppleSelectedResult(isCorrect);
    if (isCorrect) {
      setScore(prev => prev + 30);
      playCorrectSound();
    }
    setTimeout(() => {
      setAppleSelectedResult(null);
      if (appleIndex + 1 < appleList.length) {
        setAppleIndex(prev => prev + 1);
      } else {
        handleCompleteGame();
      }
    }, 1500);
  };

  // --- GAME PIKACHU KẾT ĐÔI LOGIC ---
  const handlePikachuClick = (card: { id: string; word: string; pairId: string }) => {
    if (pikachuMatched.includes(card.id) || pikachuLaser) return;
    if (pikachuSelected === null) {
      setPikachuSelected(card.id);
    } else {
      if (pikachuSelected === card.id) {
        setPikachuSelected(null);
        return;
      }
      const firstCard = pikachuCards.find(c => c.id === pikachuSelected);
      if (firstCard && firstCard.pairId === card.pairId) {
        // Matched!
        playCorrectSound();
        setScore(prev => prev + 40);
        setPikachuLaser({ from: firstCard.id, to: card.id });
        setTimeout(() => {
          setPikachuMatched(prev => [...prev, firstCard.id, card.id]);
          setPikachuSelected(null);
          setPikachuLaser(null);
          // Check if all matched
          if (pikachuMatched.length + 2 === pikachuCards.length) {
            handleCompleteGame();
          }
        }, 800);
      } else {
        // Wrong match, switch selection to new card
        setPikachuSelected(card.id);
      }
    }
  };

  // --- GAME GẤU TRÚC LEO CÂY LOGIC ---
  const handlePandaAnswer = (option: string) => {
    if (pandaResult !== null) return;
    const currentQ = pandaQuestions[pandaStep];
    const isCorrect = option === currentQ.blank;
    setPandaResult(isCorrect);
    if (isCorrect) {
      setScore(prev => prev + 35);
      playCorrectSound();
    }
    setTimeout(() => {
      setPandaResult(null);
      if (isCorrect) {
        if (pandaStep + 1 < pandaQuestions.length) {
          setPandaStep(prev => prev + 1);
        } else {
          handleCompleteGame();
        }
      }
    }, 1500);
  };

  // --- GAME BẮN CUNG THẦN TỐC LOGIC ---
  const handleArcheryShoot = (target: { id: string; word: string; isCorrect: boolean }) => {
    if (archeryArrowState !== 'idle') return;
    setSelectedTargetId(target.id);
    setArcheryArrowState('shooting');
    setTimeout(() => {
      setArcheryArrowState('hit');
      setArcheryIsCorrect(target.isCorrect);
      if (target.isCorrect) {
        setScore(prev => prev + 40);
        playCorrectSound();
      }
      setTimeout(() => {
        setArcheryArrowState('idle');
        setSelectedTargetId(null);
        setArcheryIsCorrect(null);
        if (archeryIndex + 1 < archeryQuestions.length) {
          setArcheryIndex(prev => prev + 1);
        } else {
          handleCompleteGame();
        }
      }, 1500);
    }, 600);
  };

  // --- GAME MERIO PHIÊU LƯU KÝ LOGIC ---
  const handleMerioWordClick = (word: string) => {
    if (merioState === 'jumping' || merioState === 'win') return;
    const currentLevel = merioLevels[merioIndex];
    const nextAssembled = [...merioAssembled, word];
    setMerioAssembled(nextAssembled);

    // Validate sequence
    const isCurrentSequenceCorrect = nextAssembled.every((w, idx) => w === currentLevel.target[idx]);

    if (!isCurrentSequenceCorrect) {
      setTimeout(() => {
        setMerioAssembled([]);
      }, 800);
      return;
    }

    setMerioState('jumping');
    playCorrectSound();
    setTimeout(() => {
      setMerioState('idle');

      if (nextAssembled.length === currentLevel.target.length) {
        setScore(prev => prev + 30);
        setMerioState('win');
        setTimeout(() => {
          setMerioState('idle');
          setMerioAssembled([]);
          if (merioIndex + 1 < merioLevels.length) {
            setMerioIndex(prev => prev + 1);
          } else {
            handleCompleteGame();
          }
        }, 1200);
      }
    }, 400);
  };

  // --- GAME BẮN BI SẮC MÀU LOGIC ---
  const handleMarbleShoot = (target: { id: string; rime: string; word: string; isCorrect: boolean }) => {
    if (marbleLauncherState !== 'idle') return;
    setSelectedMarbleId(target.id);
    setMarbleLauncherState('shooting');
    setTimeout(() => {
      setMarbleLauncherState('hit');
      setMarbleIsCorrect(target.isCorrect);
      if (target.isCorrect) {
        setScore(prev => prev + 45);
        playCorrectSound();
      }
      setTimeout(() => {
        setMarbleLauncherState('idle');
        setSelectedMarbleId(null);
        setMarbleIsCorrect(null);
        if (marbleIndex + 1 < marbleLevels.length) {
          setMarbleIndex(prev => prev + 1);
        } else {
          handleCompleteGame();
        }
      }, 1500);
    }, 600);
  };

  // Finalize stats
  const handleCompleteGame = () => {
    setGameState('completed');
    playSuccessMelody();
    
    // Save points to user stats
    setStats(prev => {
      // Unlock Game badge if they played a game
      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'badge-3') {
          return { ...b, unlockedAt: new Date().toISOString().split('T')[0] };
        }
        return b;
      });

      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        totalQuizScore: prev.totalQuizScore + score,
        badges: updatedBadges
      };
    });
  };

  const activeGame = games.find(g => g.id === activeGameId) || games[0];

  return (
    <div className="space-y-6" id="games-center">
      
      {/* 1. Header and Quick Game Select Panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar: Select Game Cards */}
        <div className="w-full lg:w-1/3 bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <Gamepad2 className="w-5 h-5 text-emerald-500 animate-bounce" />
            <h3 className="font-display font-bold text-sm text-slate-800">Chọn trò chơi của em</h3>
          </div>

          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-2 lg:pb-0 scrollbar-none lg:space-y-3">
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGameId(g.id);
                  setGameState('idle');
                  resetAllGames();
                }}
                className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 min-w-[240px] lg:min-w-0 w-[280px] lg:w-full shrink-0 lg:shrink ${
                  activeGameId === g.id
                    ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Lớp {g.grade}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px]">{g.difficulty}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-800 mt-1">{g.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 lg:line-clamp-2 mt-0.5 font-medium">{g.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Stage: Playing Screen */}
        <div className="flex-1 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-2xs min-h-[450px] flex flex-col justify-between">
          
          {/* Game Title Bar */}
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <span className="text-4xs font-bold bg-sky-100 text-sky-700 px-2.5 py-0.5 rounded-full">Lớp {activeGame.grade}</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-1">{activeGame.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" /> {score} Điểm
              </span>
            </div>
          </div>

          {/* GAME SCREENS CONTROL */}

          {/* IDLE SCREEN (Rules / Preview) */}
          {gameState === 'idle' && (
            <div className="py-12 flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-500 animate-pulse">
                <Gamepad2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-display font-bold text-slate-800">Sẵn sàng trải nghiệm!</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {activeGame.description} Vượt qua tất cả các câu hỏi thử thách để tích luỹ thêm nhiều sao học tập nhé!
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-display font-bold text-sm shadow-md shadow-emerald-100 transform active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Bắt đầu chơi <Play className="w-4 h-4 fill-white" />
              </button>
            </div>
          )}

          {/* COMPLETED SCREEN */}
          {gameState === 'completed' && (
            <div className="py-12 flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 animate-bounce shadow-sm">
                <Award className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold text-slate-800">🏆 Chúc Mừng Em Hoàn Thành!</h3>
                <p className="text-sm text-slate-500 font-bold">
                  Em đã xuất sắc giành được <span className="text-amber-500 font-extrabold text-lg">{score}</span> điểm cộng học tập Tiếng Việt!
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-display font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Chơi Lại
                </button>
                <button
                  onClick={() => setGameState('idle')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-display font-bold text-xs cursor-pointer"
                >
                  Thoát Trò Chơi
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE PLAYING SCREEN */}
          {gameState === 'playing' && (
            <div className="py-6 flex-1 flex flex-col justify-center">

              {/* Game 1: Xứ Sở Ghép Tiếng */}
              {activeGame.gameType === 'ghep_chu' && (
                <div className="space-y-8 flex flex-col items-center text-center">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400">Câu hỏi {g1Index + 1} / {g1Questions.length}</span>
                    <div className="text-6xl animate-pulse">{g1Questions[g1Index].emoji}</div>
                    <p className="text-xs text-slate-500 font-bold">Hãy nhấp vào các mảnh ghép âm chữ dưới đây để ghép thành tên con vật/đồ vật trên!</p>
                  </div>

                  {/* Assembled parts display box */}
                  <div className="min-h-16 w-full max-w-sm border-2 border-dashed border-sky-200 rounded-2xl flex items-center justify-center gap-2.5 p-3 bg-sky-50/25">
                    {g1SelectedParts.length === 0 ? (
                      <span className="text-xs text-slate-400 font-bold">Lắp ráp từ vựng của em...</span>
                    ) : (
                      g1SelectedParts.map((part, idx) => (
                        <span key={idx} className="px-4 py-2 bg-sky-500 text-white font-display font-bold text-lg rounded-xl animate-fade-in shadow-xs">
                          {part}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Letters block selection */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {[...g1Questions[g1Index].parts, ...g1Questions[g1Index].distractor]
                      .sort()
                      .map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleG1PartClick(p)}
                          className={`px-5 py-3 border-2 rounded-2xl font-display font-bold text-base transition-all transform active:scale-95 cursor-pointer ${
                            g1SelectedParts.includes(p)
                              ? 'bg-slate-100 border-slate-300 text-slate-400'
                              : 'bg-white border-sky-100 text-sky-600 hover:border-sky-400'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Game 2: Thử Thách Điền Ca Dao */}
              {activeGame.gameType === 'dien_tu' && (
                <div className="space-y-6 text-center max-w-md mx-auto">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400">Câu ca dao {g2Index + 1} / {g2Questions.length}</span>
                    <h3 className="text-lg md:text-xl font-display font-extrabold text-slate-800 leading-relaxed bg-amber-50 p-4 rounded-2xl border border-amber-100">
                      {g2Questions[g2Index].sentence.replace('______', g2SelectedAnswer ? `[ ${g2SelectedAnswer} ]` : '______')}
                    </h3>
                  </div>

                  {/* Option Choices */}
                  <div className="grid grid-cols-2 gap-3">
                    {g2Questions[g2Index].options.map((opt) => {
                      const isSelected = g2SelectedAnswer === opt;
                      return (
                        <button
                          key={opt}
                          disabled={g2SelectedAnswer !== null}
                          onClick={() => handleG2Answer(opt)}
                          className={`p-3 border-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            isSelected
                              ? g2IsCorrect
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : 'bg-rose-500 border-rose-600 text-white'
                              : 'bg-white border-slate-200 hover:border-sky-400 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedbacks */}
                  {g2SelectedAnswer && (
                    <div className="space-y-1.5 animate-fade-in bg-slate-50 p-3 rounded-xl border">
                      <div className="flex items-center justify-center gap-1">
                        {g2IsCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600">Đúng rồi! +30 điểm</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-rose-600">Opps! Đáp án là: "{g2Questions[g2Index].blank}"</span>
                          </>
                        )}
                      </div>
                      <p className="text-3xs text-slate-400 font-bold italic leading-relaxed">Giải nghĩa: {g2Questions[g2Index].translation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Game 3: Vòng Quay Từ Đồng Nghĩa */}
              {activeGame.gameType === 'vong_quay' && (
                <div className="space-y-6 flex flex-col items-center text-center">
                  
                  {/* Lucky Wheel Canvas Graphic */}
                  <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                    {/* Spin Pointer */}
                    <div className="absolute top-0 z-20 transform -translate-y-2 text-xl">🔻</div>
                    {/* Spinner wheel */}
                    <div
                      className="w-full h-full rounded-full border-8 border-amber-400 bg-amber-50 relative flex items-center justify-center shadow-md transform"
                      style={{
                        transform: `rotate(${spinRotation}deg)`,
                        transition: isSpinning ? 'transform 2.5s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none'
                      }}
                    >
                      {/* Wheel dividing graphic lines */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-200/40 via-blue-200/40 to-emerald-200/40 rounded-full" />
                      <div className="text-sm font-extrabold text-amber-600 rotate-0">🎁 Quà</div>
                      <div className="absolute text-sm font-extrabold text-blue-600 rotate-90 translate-x-12">⭐ 50</div>
                      <div className="absolute text-sm font-extrabold text-emerald-600 rotate-180 -translate-y-12">🎉 Lớn</div>
                      <div className="absolute text-sm font-extrabold text-pink-600 -rotate-90 -translate-x-12">✨ 100</div>
                    </div>
                    {/* Spin Trigger Center Button */}
                    <button
                      onClick={handleSpinWheel}
                      disabled={isSpinning || gameState === 'completed'}
                      className="absolute w-14 h-14 bg-rose-500 text-white font-display font-extrabold text-2xs rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-rose-600 cursor-pointer active:scale-95"
                    >
                      QUAY
                    </button>
                  </div>

                  {/* Spin Word Challenge Pop-up */}
                  {wheelWord ? (
                    <div className="space-y-4 max-w-sm w-full animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-3xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Thử thách từ vựng</span>
                        <h4 className="text-sm font-bold text-slate-800">
                          Hãy tìm TỪ ĐỒNG NGHĨA với từ: <span className="text-rose-500 font-extrabold">"{wheelWord}"</span>
                        </h4>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-2 gap-2">
                        {g3Options.map((opt) => {
                          const isSelected = g3Selected === opt;
                          return (
                            <button
                              key={opt}
                              disabled={g3Selected !== null}
                              onClick={() => handleG3Answer(opt)}
                              className={`p-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? g3IsCorrect
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-rose-500 text-white'
                                  : 'bg-white border-slate-200 hover:border-emerald-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {g3Selected && (
                        <div className="text-xs font-bold text-slate-500">
                          {g3IsCorrect ? '🎉 Hoàn hảo! +40 điểm học tập!' : 'Opps! Bạn chọn chưa đúng rồi.'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-bold">Hãy nhấp nút "QUAY" để chọn từ khóa ngẫu nhiên!</p>
                  )}

                </div>
              )}

              {/* Game: Hứng Táo Vườn Hồng (phan_loai) */}
              {activeGame.gameType === 'phan_loai' && (
                <div className="space-y-6 flex flex-col items-center text-center">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">Từ vựng {appleIndex + 1} / {appleList.length}</span>
                    <h3 className="text-xs font-bold text-slate-500">Hãy đưa từ sau đây vào đúng sọt loại từ tương ứng!</h3>
                  </div>

                  {/* Falling Apple Visual Container */}
                  <div className="h-44 w-full max-w-sm bg-gradient-to-b from-rose-50/50 to-emerald-50/50 rounded-2xl relative overflow-hidden border border-slate-100 flex items-center justify-center shadow-xs">
                    {/* Sky clouds */}
                    <div className="absolute top-2 left-4 text-xs opacity-40">☁️</div>
                    <div className="absolute top-4 right-6 text-xs opacity-40">☁️</div>

                    {/* Falling Apple Block */}
                    <div className={`flex flex-col items-center space-y-1 transition-all duration-500 ${
                      appleSelectedResult === null
                        ? 'translate-y-[-10px] scale-100 animate-bounce'
                        : appleSelectedResult
                          ? 'translate-y-[40px] scale-110 opacity-0'
                          : 'translate-y-[20px] rotate-12 scale-90 opacity-40'
                    }`}>
                      <div className="text-5xl">🍎</div>
                      <div className="bg-white/90 backdrop-blur-xs border-2 border-rose-300 px-4 py-1.5 rounded-full font-display font-extrabold text-sm text-rose-600 shadow-sm">
                        {appleList[appleIndex].word}
                      </div>
                    </div>

                    {/* Left Basket (Từ Láy) & Right Basket (Từ Ghép) */}
                    <div className="absolute bottom-2 inset-x-4 flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className="text-xl">🧺</div>
                        <span className="bg-sky-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-2xs">Từ Láy</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xl">🧺</div>
                        <span className="bg-amber-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-2xs">Từ Ghép</span>
                      </div>
                    </div>
                  </div>

                  {/* Interaction Buttons */}
                  <div className="flex gap-4 w-full max-w-xs">
                    <button
                      onClick={() => handleAppleAnswer('lay')}
                      disabled={appleSelectedResult !== null}
                      className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-2xl font-display font-bold text-xs shadow-xs transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      👈 Sọt Từ Láy
                    </button>
                    <button
                      onClick={() => handleAppleAnswer('ghep')}
                      disabled={appleSelectedResult !== null}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-2xl font-display font-bold text-xs shadow-xs transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Sọt Từ Ghép 👉
                    </button>
                  </div>

                  {/* Explanatory Message */}
                  {appleSelectedResult !== null && (
                    <div className="p-3 bg-white border rounded-xl shadow-2xs w-full max-w-sm animate-fade-in">
                      <div className="flex items-center justify-center gap-1.5">
                        {appleSelectedResult ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600">Tuyệt vời! +30 điểm</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-rose-600">Sai rồi bé ơi! Đọc kỹ giải thích nhé.</span>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold italic mt-1">{appleList[appleIndex].explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Game: Pikachu Kết Đôi (noi_pikachu) */}
              {activeGame.gameType === 'noi_pikachu' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-slate-400">Kết nối các cặp đồng nghĩa / trái nghĩa</span>
                    <p className="text-xs text-slate-500 font-bold">Hãy nhấp chọn hai thẻ bài tương đương nghĩa để giải phóng chúng bằng sấm sét!</p>
                  </div>

                  {/* The grid of cards */}
                  <div className="grid grid-cols-4 gap-3 w-full max-w-md">
                    {pikachuCards.map((card) => {
                      const isMatched = pikachuMatched.includes(card.id);
                      const isSelected = pikachuSelected === card.id;
                      const hasLaser = pikachuLaser?.from === card.id || pikachuLaser?.to === card.id;

                      return (
                        <button
                          key={card.id}
                          disabled={isMatched}
                          onClick={() => handlePikachuClick(card)}
                          className={`h-16 rounded-xl border-2 font-display font-bold text-2xs transition-all relative overflow-hidden flex items-center justify-center text-center p-1.5 ${
                            isMatched
                              ? 'bg-slate-50 border-slate-100 text-slate-300 opacity-20'
                              : isSelected
                                ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-xs scale-105 ring-2 ring-amber-300 animate-pulse'
                                : hasLaser
                                  ? 'bg-yellow-400 border-yellow-500 text-white scale-110 shadow-md ring-2 ring-yellow-400 animate-ping'
                                  : 'bg-white border-slate-200 hover:border-sky-400 text-slate-700 cursor-pointer shadow-2xs'
                          }`}
                        >
                          {/* Laser Electric Storm Graphic */}
                          {hasLaser && (
                            <div className="absolute inset-0 bg-yellow-300/40 flex items-center justify-center animate-pulse">
                              <span className="text-xs animate-bounce">⚡</span>
                            </div>
                          )}
                          <span>{card.word}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Progress Info */}
                  <div className="text-xs font-bold text-slate-500">
                    Đã ghép được: {pikachuMatched.length / 2} / {pikachuCards.length / 2} cặp ⚡
                  </div>
                </div>
              )}

              {/* Game: Gấu Trúc Leo Cây (dien_khuyet_gau_truc) */}
              {activeGame.gameType === 'dien_khuyet_gau_truc' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full">

                  {/* Left Column: Climbing Tree Map (1/3 width) */}
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 flex flex-col items-center relative min-h-[220px]">
                    <div className="absolute top-2 font-bold text-[9px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Bamboo Climb</div>
                    {/* Bamboo Pole Trunk Graphic */}
                    <div className="w-4 bg-emerald-500 rounded-full h-44 relative mt-6 flex flex-col justify-between items-center py-2 shadow-xs">
                      {/* Tree leaves branches */}
                      <div className="absolute -left-3 top-4 text-sm">🍃</div>
                      <div className="absolute -right-3 top-16 text-sm">🍃</div>
                      <div className="absolute -left-3 top-28 text-sm">🍃</div>
                      <div className="absolute -right-3 top-36 text-sm">🍃</div>

                      {/* Giant Star on Top */}
                      <div className="absolute -top-6 text-xl animate-bounce">🌟</div>

                      {/* Panda Icon - Position changes based on pandaStep */}
                      <div
                        className="absolute text-3xl transition-all duration-700 ease-out z-10"
                        style={{
                          bottom: `${pandaStep * 35 + 10}px`,
                          transform: pandaResult === false ? 'rotate(15deg) scale(0.9)' : 'none'
                        }}
                      >
                        🐼
                      </div>
                    </div>
                  </div>

                  {/* Right Columns: Question Content & Options (2/3 width) */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-400">Chặng leo tre {pandaStep + 1} / {pandaQuestions.length}</span>
                      <h4 className="text-xs font-bold text-slate-500">Giúp Gấu Trúc hái Sao bằng cách điền từ đúng!</h4>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-h-[70px] flex items-center justify-center">
                        <p className="font-display font-extrabold text-sm text-slate-800 leading-relaxed text-center">
                          {pandaQuestions[pandaStep].sentence}
                        </p>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-2 gap-2">
                      {pandaQuestions[pandaStep].options.map((opt) => {
                        return (
                          <button
                            key={opt}
                            disabled={pandaResult !== null}
                            onClick={() => handlePandaAnswer(opt)}
                            className="p-2.5 bg-white border-2 border-slate-100 hover:border-emerald-400 font-bold text-xs text-slate-700 rounded-xl transition-all cursor-pointer transform active:scale-95"
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedbacks */}
                    {pandaResult !== null && (
                      <div className="p-3 bg-white border rounded-xl shadow-2xs animate-fade-in">
                        <div className="flex items-center justify-center gap-1">
                          {pandaResult ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-600">Chính xác! Panda vọt lên cao! +35 điểm</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-500" />
                              <span className="text-xs font-bold text-rose-600">Sai rồi! Panda bị tuột nhẹ.</span>
                            </>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold italic mt-1 leading-normal text-center">
                          Ý nghĩa: {pandaQuestions[pandaStep].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Game: Bắn Cung Thần Tốc (xac_dinh_ban_cung) */}
              {activeGame.gameType === 'xac_dinh_ban_cung' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-slate-400">Mục tiêu {archeryIndex + 1} / {archeryQuestions.length}</span>
                    <h3 className="text-sm font-display font-extrabold text-slate-800 bg-red-50 text-red-700 border border-red-100 px-4 py-2 rounded-2xl">
                      {archeryQuestions[archeryIndex].prompt}
                    </h3>
                  </div>

                  {/* Archery Area Graphic with Floating Balloons */}
                  <div className="h-48 w-full max-w-md bg-gradient-to-b from-sky-50 to-blue-50/40 rounded-2xl relative overflow-hidden border border-slate-100 flex flex-col justify-between p-4">

                    {/* Floating target bubbles */}
                    <div className="grid grid-cols-4 gap-2 z-10">
                      {archeryQuestions[archeryIndex].targets.map((tgt) => {
                        const isSelected = selectedTargetId === tgt.id;
                        const isHit = isSelected && archeryArrowState === 'hit';

                        return (
                          <button
                            key={tgt.id}
                            disabled={archeryArrowState !== 'idle'}
                            onClick={() => handleArcheryShoot(tgt)}
                            className={`h-16 rounded-full border-2 p-1.5 flex flex-col items-center justify-center text-center font-bold text-[9px] cursor-pointer transition-all ${
                              isHit
                                ? tgt.isCorrect
                                  ? 'bg-emerald-500 border-emerald-600 text-white scale-110 shadow-md animate-ping'
                                  : 'bg-rose-500 border-rose-600 text-white opacity-40'
                                : isSelected
                                  ? 'bg-sky-200 border-sky-400 text-sky-700 animate-bounce'
                                  : 'bg-white/80 border-slate-200 hover:border-red-400 hover:scale-105 text-slate-700 shadow-2xs'
                            }`}
                          >
                            <span className="text-sm">🎈</span>
                            <span className="line-clamp-2 leading-tight">{tgt.word}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Archer Bow & Shooting Arrow Simulation */}
                    <div className="relative w-full flex justify-center h-16">
                      {/* Arrow Graphic */}
                      <div
                        className="absolute text-2xl transition-all duration-500 z-20"
                        style={{
                          bottom: archeryArrowState === 'shooting' ? '120px' : '5px',
                          opacity: archeryArrowState === 'hit' ? 0 : 1,
                          transform: 'rotate(-45deg)'
                        }}
                      >
                        🏹
                      </div>
                    </div>
                  </div>

                  {/* Feedback Details */}
                  {archeryArrowState === 'hit' && archeryIsCorrect !== null && (
                    <div className="p-3 bg-white border rounded-xl shadow-2xs animate-fade-in w-full max-w-sm text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {archeryIsCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600">Bắn trúng hồng tâm! Xuất sắc! +40 điểm</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-rose-600">Bắn chệch mục tiêu rồi bé ơi! Lần sau cố lên nhé.</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Game: Merio Phiêu Lưu Ký (sap_xep_merio) */}
              {activeGame.gameType === 'sap_xep_merio' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-slate-400">Hành trình {merioIndex + 1} / {merioLevels.length}</span>
                    <h3 className="text-xs font-bold text-slate-500">Giúp Merio ghép các từ xáo trộn để tạo thành câu hoàn chỉnh!</h3>
                  </div>

                  {/* Merio Running Stage Graphic */}
                  <div className="h-32 w-full max-w-md bg-sky-50 rounded-2xl relative overflow-hidden border border-slate-100 flex flex-col justify-between p-4">
                    {/* Clouds */}
                    <div className="absolute top-2 left-6 text-sm opacity-40">☁️</div>
                    <div className="absolute top-3 right-10 text-sm opacity-40">☁️</div>

                    {/* Castle Flagpole on the right */}
                    <div className="absolute right-4 bottom-2 flex flex-col items-center">
                      <div className="text-base animate-bounce">🚩</div>
                      <div className="w-1.5 bg-slate-400 h-8 rounded-full" />
                    </div>

                    {/* Assembled sentence placeholder brick */}
                    <div className="bg-amber-100/60 border border-amber-200 rounded-xl p-2 min-h-10 flex items-center justify-center gap-1.5 z-10 w-4/5">
                      {merioAssembled.length === 0 ? (
                        <span className="text-[10px] text-amber-700 font-bold">Hãy nhấp vào các từ để sắp xếp...</span>
                      ) : (
                        merioAssembled.map((w, idx) => (
                          <span key={idx} className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                            {w}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Merio Character Simulation */}
                    <div className="relative h-12 w-full flex items-end">
                      <div
                        className="text-3xl transition-all duration-300"
                        style={{
                          marginLeft: `${merioAssembled.length * 35 + 10}px`,
                          transform: merioState === 'jumping' ? 'translateY(-30px)' : merioState === 'win' ? 'scale(1.2) translateY(-10px)' : 'none'
                        }}
                      >
                        {merioState === 'win' ? '🤴' : '🍄'}
                      </div>
                      <div className="w-full h-1 bg-emerald-600 rounded-full" />
                    </div>
                  </div>

                  {/* Word brick buttons to select */}
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {merioLevels[merioIndex].words.map((w, idx) => {
                      const isUsed = merioAssembled.includes(w);

                      return (
                        <button
                          key={idx}
                          disabled={isUsed}
                          onClick={() => handleMerioWordClick(w)}
                          className={`px-4 py-2 border-2 rounded-2xl font-display font-bold text-xs transition-all transform active:scale-95 ${
                            isUsed
                              ? 'bg-slate-100 border-slate-200 text-slate-300'
                              : 'bg-white border-amber-300 hover:border-amber-500 text-amber-700 cursor-pointer shadow-xs'
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>

                  {/* Winner Effect */}
                  {merioState === 'win' && (
                    <p className="text-xs font-bold text-emerald-600 animate-bounce">
                      🚀 Câu ghép hoàn chỉnh cực tốt! Cứu quốc thành công! +30 điểm
                    </p>
                  )}
                </div>
              )}

              {/* Game: Bắn Bi Sắc Màu (ban_bi) */}
              {activeGame.gameType === 'ban_bi' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-slate-400">Thử thách {marbleIndex + 1} / {marbleLevels.length}</span>
                    <h3 className="text-xs font-bold text-slate-500 bg-sky-50 text-sky-700 border border-sky-100 px-4 py-2 rounded-2xl">
                      {marbleLevels[marbleIndex].prompt}
                    </h3>
                  </div>

                  {/* Bubble Shooter Stage Graphic */}
                  <div className="h-48 w-full max-w-md bg-gradient-to-b from-purple-50 to-indigo-50/40 rounded-2xl relative overflow-hidden border border-slate-100 flex flex-col justify-between p-4">

                    {/* Falling marble rimes */}
                    <div className="grid grid-cols-3 gap-3 z-10">
                      {marbleLevels[marbleIndex].targets.map((tgt) => {
                        const isSelected = selectedMarbleId === tgt.id;
                        const isHit = isSelected && marbleLauncherState === 'hit';

                        return (
                          <button
                            key={tgt.id}
                            disabled={marbleLauncherState !== 'idle'}
                            onClick={() => handleMarbleShoot(tgt)}
                            className={`h-14 rounded-full border-2 flex flex-col items-center justify-center font-bold text-[10px] cursor-pointer transition-all ${
                              isHit
                                ? tgt.isCorrect
                                  ? 'bg-emerald-500 border-emerald-600 text-white scale-110 shadow-md animate-ping'
                                  : 'bg-rose-500 border-rose-600 text-white opacity-40'
                                : isSelected
                                  ? 'bg-purple-200 border-purple-400 text-purple-700 animate-bounce'
                                  : 'bg-white/80 border-slate-200 hover:border-purple-400 hover:scale-105 text-slate-700 shadow-2xs'
                            }`}
                          >
                            <span className="text-sm">🔮</span>
                            <span className="font-extrabold">{tgt.rime}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bubble launcher gun at the bottom center */}
                    <div className="relative w-full flex flex-col items-center h-16">
                      <div className="absolute top-2 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        Đang nạp: <span className="font-extrabold text-xs">{marbleLevels[marbleIndex].prefix}</span>
                      </div>
                      {/* Shot projectile simulation */}
                      <div
                        className="absolute w-5 h-5 bg-purple-600 rounded-full border border-white text-white font-bold text-[8px] flex items-center justify-center transition-all duration-500 shadow-sm"
                        style={{
                          bottom: marbleLauncherState === 'shooting' ? '120px' : '5px',
                          opacity: marbleLauncherState === 'hit' ? 0 : 1,
                        }}
                      >
                        {marbleLevels[marbleIndex].prefix}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Details */}
                  {marbleLauncherState === 'hit' && marbleIsCorrect !== null && (
                    <div className="p-3 bg-white border rounded-xl shadow-2xs animate-fade-in w-full max-w-sm text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {marbleIsCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600">
                              Đúng rồi! Từ ghép hoàn chỉnh là: <span className="font-extrabold text-sm text-emerald-700">"{marbleLevels[marbleIndex].targets.find(t => t.id === selectedMarbleId)?.wordComplete}"</span> (+45 điểm)
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-rose-600">Sai rồi! Hãy chọn vần ghép khác nhé.</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Bottom helper card info */}
          <div className="mt-4 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <p className="text-4xs text-slate-400 font-bold leading-normal">
              Lời khuyên: Trò chơi tương tác giúp rèn luyện khả năng phản xạ từ vựng và khắc sâu quy tắc ngữ âm Tiếng Việt một cách tự nhiên mà không cần nhồi nhét.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
