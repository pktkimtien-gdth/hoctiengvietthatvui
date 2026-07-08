/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GradeType = '1' | '2' | '3' | '4' | '5';

export type ResourceType =
  | 'google_ai_studio'
  | 'youtube'
  | 'google_drive'
  | 'google_docs'
  | 'google_slides'
  | 'google_forms'
  | 'canva'
  | 'genially'
  | 'wordwall'
  | 'quizizz'
  | 'kahoot'
  | 'liveworksheets'
  | 'website';

export interface Resource {
  id: string;
  title: string;
  description: string;
  grade: GradeType;
  topic: string;
  keywords: string[];
  type: ResourceType;
  thumbnailUrl?: string;
  link: string;
  createdAt: string;
  creator: string;
  isFavorite?: boolean;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  grade: GradeType;
  duration: string;
  youtubeId: string;
  topic: string;
  isCompleted?: boolean;
  isFavorite?: boolean;
}

export interface GameItem {
  id: string;
  title: string;
  description: string;
  grade: GradeType;
  topic: string;
  gameType:
    | 'ghep_chu'
    | 'dien_tu'
    | 'vong_quay'
    | 'trac_nghiem'
    | 'phan_loai'
    | 'noi_pikachu'
    | 'dien_khuyet_gau_truc'
    | 'xac_dinh_ban_cung'
    | 'sap_xep_merio'
    | 'ban_bi';
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  completedCount?: number;
  highScore?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'trac_nghiem' | 'dien_khuyet' | 'ghep_doi' | 'dung_sai' | 'tu_luan_ngan';
  questionText: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[] | { [key: string]: string }; // string for simple answers, or mapping for matching
  pairs?: { left: string[]; right: string[] }; // For matching games
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  grade: GradeType;
  topic: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizHistory {
  id: string;
  quizId: string;
  quizTitle: string;
  grade: GradeType;
  score: number;
  totalQuestions: number;
  date: string;
  timeSpentSeconds: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success' | 'event';
}

export interface StudentStats {
  learningTimeMinutes: number;
  totalQuizScore: number;
  quizzesCompleted: number;
  videosWatched: number;
  gamesPlayed: number;
  completedResourceIds: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export type UserRole = 'student' | 'teacher' | 'parent';
