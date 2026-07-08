/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Share2,
  Copy,
  Heart,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  Youtube,
  CloudLightning,
  Palette,
  FileCheck2,
  Globe
} from 'lucide-react';
import { Resource, ResourceType, GradeType, UserRole } from '../types';

interface ResourcesStoreProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  role: UserRole;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function ResourcesStore({
  resources,
  setResources,
  role,
  searchTerm,
  setSearchTerm,
}: ResourcesStoreProps) {
  
  // Filtering states
  const [selectedGrade, setSelectedGrade] = useState<GradeType | 'All'>('All');
  const [selectedType, setSelectedType] = useState<ResourceType | 'All'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string | 'All'>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Form management states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New/Editing Resource State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formGrade, setFormGrade] = useState<GradeType>('1');
  const [formTopic, setFormTopic] = useState('Chữ cái & Âm vần');
  const [formType, setFormType] = useState<ResourceType>('canva');
  const [formLink, setFormLink] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formThumbUrl, setFormThumbUrl] = useState('');
  const [formCreator, setFormCreator] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available metadata definitions
  const resourceTypes: { id: ResourceType; label: string; icon: string }[] = [
    { id: 'google_ai_studio', label: 'Google AI Studio', icon: '🤖' },
    { id: 'youtube', label: 'YouTube Video', icon: '📹' },
    { id: 'google_drive', label: 'Google Drive', icon: '📁' },
    { id: 'google_docs', label: 'Google Docs', icon: '📄' },
    { id: 'google_slides', label: 'Google Slides', icon: '📊' },
    { id: 'google_forms', label: 'Google Forms', icon: '📝' },
    { id: 'canva', label: 'Canva Design', icon: '🎨' },
    { id: 'genially', label: 'Genially', icon: '✨' },
    { id: 'wordwall', label: 'Wordwall Game', icon: '🎮' },
    { id: 'quizizz', label: 'Quizizz Quiz', icon: '⚡' },
    { id: 'kahoot', label: 'Kahoot Game', icon: '🔥' },
    { id: 'liveworksheets', label: 'Liveworksheets', icon: '📝' },
    { id: 'website', label: 'Trang Web khác', icon: '🌐' },
  ];

  const topicsList = [
    'Chữ cái & Âm vần',
    'Từ vựng & Ngữ pháp',
    'Tập đọc & Kể chuyện',
    'Chính tả & Tập viết',
    'Luyện từ và câu',
    'Tập làm văn',
    'Ca dao & Tục ngữ',
  ];

  // Action: Add or Save edited resource
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formLink) {
      alert('Vui lòng điền đầy đủ Tiêu đề và Liên kết học liệu!');
      return;
    }

    const keywordArray = formKeywords
      ? formKeywords.split(',').map((k) => k.trim().toLowerCase())
      : ['tiếng việt', `lớp ${formGrade}`];

    const finalThumb = formThumbUrl.trim() || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80';

    if (editingId) {
      // Edit mode
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                title: formTitle,
                description: formDesc,
                grade: formGrade,
                topic: formTopic,
                type: formType,
                link: formLink,
                keywords: keywordArray,
                thumbnailUrl: finalThumb,
                creator: formCreator || r.creator,
              }
            : r
        )
      );
      setEditingId(null);
    } else {
      // Create mode
      const newResource: Resource = {
        id: `res-${Date.now()}`,
        title: formTitle,
        description: formDesc,
        grade: formGrade,
        topic: formTopic,
        type: formType,
        link: formLink,
        keywords: keywordArray,
        thumbnailUrl: finalThumb,
        createdAt: new Date().toISOString().split('T')[0],
        creator: formCreator || 'Thầy Cô Giáo',
        isFavorite: false,
      };
      setResources((prev) => [newResource, ...prev]);
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormGrade('1');
    setFormTopic('Chữ cái & Âm vần');
    setFormType('canva');
    setFormLink('');
    setFormKeywords('');
    setFormThumbUrl('');
    setFormCreator('');
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEditClick = (res: Resource) => {
    setEditingId(res.id);
    setFormTitle(res.title);
    setFormDesc(res.description);
    setFormGrade(res.grade);
    setFormTopic(res.topic);
    setFormType(res.type);
    setFormLink(res.link);
    setFormKeywords(res.keywords.join(', '));
    setFormThumbUrl(res.thumbnailUrl || '');
    setFormCreator(res.creator);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa liên kết học liệu này khỏi kho lưu trữ không?')) {
      setResources((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const handleCopyLink = (res: Resource) => {
    navigator.clipboard.writeText(res.link);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareLink = (res: Resource) => {
    const shareMessage = `Hãy tham gia học Tiếng Việt cùng bài học: "${res.title}" tại liên kết: ${res.link}`;
    navigator.clipboard.writeText(shareMessage);
    alert(`Đã tạo liên kết chia sẻ cho bài "${res.title}"! Tin nhắn mẫu đã được sao chép vào bộ nhớ tạm để gửi cho học sinh/phụ huynh.`);
  };

  // Perform multi-filter algorithm
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.keywords.some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase())) ||
      res.creator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'All' || res.grade === selectedGrade;
    const matchesType = selectedType === 'All' || res.type === selectedType;
    const matchesTopic = selectedTopic === 'All' || res.topic === selectedTopic;
    const matchesFav = !showOnlyFavorites || res.isFavorite;

    return matchesSearch && matchesGrade && matchesType && matchesTopic && matchesFav;
  });

  const getResourceTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'google_docs': return <FileSpreadsheet className="w-4 h-4 text-sky-500" />;
      case 'google_slides': return <FileSpreadsheet className="w-4 h-4 text-amber-500" />;
      case 'wordwall': return <CloudLightning className="w-4 h-4 text-emerald-500" />;
      case 'canva': return <Palette className="w-4 h-4 text-purple-500" />;
      case 'quizizz': return <FileCheck2 className="w-4 h-4 text-violet-500" />;
      default: return <Globe className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6" id="resources-store">
      
      {/* 1. Header Banner & Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-display font-bold text-sky-600">Thư Viện Học Liệu Số Môn Tiếng Việt</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Tổng hợp và quản lý liên kết bài giảng, sơ đồ tư duy, phiếu ôn tập chuẩn quốc gia.</p>
        </div>
        
        {role === 'teacher' && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-display font-bold text-sm flex items-center gap-1.5 shadow-md shadow-emerald-50 active:scale-95 transition-all cursor-pointer"
          >
            {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isFormOpen ? 'Hủy' : 'Thêm Học Liệu'}
          </button>
        )}
      </div>

      {/* 2. Collaborative Add / Edit Resource Form (Teacher/Admin only) */}
      {isFormOpen && role === 'teacher' && (
        <form onSubmit={handleFormSubmit} className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200/60 shadow-xs space-y-4 max-w-4xl mx-auto" id="resource-form">
          <div className="border-b border-slate-200 pb-2.5">
            <h3 className="text-base font-display font-bold text-slate-800 flex items-center gap-1.5">
              💡 {editingId ? 'Chỉnh Sửa Học Liệu Số' : 'Cập Nhật Học Liệu Số Mới'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-title">Tiêu đề học liệu *</label>
              <input
                id="res-title"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ví dụ: Luyện ghép tiếng và đánh vần chữ 'e'"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            {/* Link URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-link">Đường dẫn liên kết (Link) *</label>
              <input
                id="res-link"
                type="url"
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                placeholder="https://canva.com/... hoặc https://wordwall.net/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-desc">Mô tả tóm tắt</label>
              <textarea
                id="res-desc"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Gợi ý cách dùng hoặc sơ lược kiến thức bài tập..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Grade Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-grade">Khối Lớp</label>
              <select
                id="res-grade"
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value as GradeType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              >
                <option value="1">Lớp 1</option>
                <option value="2">Lớp 2</option>
                <option value="3">Lớp 3</option>
                <option value="4">Lớp 4</option>
                <option value="5">Lớp 5</option>
              </select>
            </div>

            {/* Topic Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-topic">Chủ Đề</label>
              <select
                id="res-topic"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              >
                {topicsList.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Resource Type Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-type">Loại học liệu (Nguồn)</label>
              <select
                id="res-type"
                value={formType}
                onChange={(e) => setFormType(e.target.value as ResourceType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              >
                {resourceTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                ))}
              </select>
            </div>

            {/* Creator */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-creator">Người thiết kế / Sáng lập</label>
              <input
                id="res-creator"
                type="text"
                value={formCreator}
                onChange={(e) => setFormCreator(e.target.value)}
                placeholder="Ví dụ: Cô Minh Thư"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Thumbnail Image URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-thumb">Ảnh đại diện (Link hình ảnh Unsplash)</label>
              <input
                id="res-thumb"
                type="url"
                value={formThumbUrl}
                onChange={(e) => setFormThumbUrl(e.target.value)}
                placeholder="Để trống hệ thống sẽ tự động tạo ảnh đẹp"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Keywords */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600" htmlFor="res-keywords">Từ khóa (Ngăn cách bằng dấu phẩy)</label>
              <input
                id="res-keywords"
                type="text"
                value={formKeywords}
                onChange={(e) => setFormKeywords(e.target.value)}
                placeholder="ghép chữ, âm vần, trò chơi"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-display font-bold shadow-sm cursor-pointer"
            >
              🚀 {editingId ? 'Lưu chỉnh sửa' : 'Lưu học liệu mới'}
            </button>
          </div>
        </form>
      )}

      {/* 3. Deep Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-3xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 border-b border-slate-50 pb-2">
          <Filter className="w-5 h-5 text-sky-500" />
          <h3 className="font-display font-bold text-sm">Tìm kiếm & Bộ lọc thông minh</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filter by Grade */}
          <div className="space-y-1">
            <label className="text-3xs font-bold text-slate-400 uppercase tracking-wide" htmlFor="filter-grade">Lọc theo Khối Lớp</label>
            <select
              id="filter-grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as GradeType | 'All')}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-400 focus:outline-none text-xs font-semibold bg-slate-50/50"
            >
              <option value="All">Tất cả Khối Lớp</option>
              <option value="1">Lớp 1</option>
              <option value="2">Lớp 2</option>
              <option value="3">Lớp 3</option>
              <option value="4">Lớp 4</option>
              <option value="5">Lớp 5</option>
            </select>
          </div>

          {/* Filter by Topic */}
          <div className="space-y-1">
            <label className="text-3xs font-bold text-slate-400 uppercase tracking-wide" htmlFor="filter-topic">Lọc theo Chủ đề</label>
            <select
              id="filter-topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-400 focus:outline-none text-xs font-semibold bg-slate-50/50"
            >
              <option value="All">Tất cả Chủ Đề</option>
              {topicsList.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Filter by Resource Type */}
          <div className="space-y-1">
            <label className="text-3xs font-bold text-slate-400 uppercase tracking-wide" htmlFor="filter-type">Lọc theo Nguồn / Loại</label>
            <select
              id="filter-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ResourceType | 'All')}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-400 focus:outline-none text-xs font-semibold bg-slate-50/50"
            >
              <option value="All">Tất cả Nguồn liên kết</option>
              {resourceTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Bookmark Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                showOnlyFavorites
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-500' : ''}`} />
              {showOnlyFavorites ? 'Hiện tất cả học liệu' : 'Chỉ xem Yêu Thích ⭐'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Display Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="resources-grid">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-3xl border-2 border-slate-100 text-center space-y-2">
            <p className="text-slate-400 font-bold">Không tìm thấy tài liệu học tập phù hợp!</p>
            <p className="text-xs text-slate-400">Em hãy thử tìm với từ khóa khác hoặc điều chỉnh lại bộ lọc lớp nhé.</p>
          </div>
        ) : (
          filteredResources.map((res) => (
            <div key={res.id} className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
              
              {/* Card Thumbnail Head */}
              <div className="h-44 bg-slate-50 relative overflow-hidden">
                <img
                  src={res.thumbnailUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'}
                  alt={res.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Float Grade badge */}
                <div className="absolute top-3 left-3 bg-sky-500 text-white font-display text-xs font-bold px-3 py-1 rounded-full border border-sky-400 shadow-sm">
                  Lớp {res.grade}
                </div>

                {/* Favorite Bookmark */}
                <button
                  onClick={() => toggleFavorite(res.id)}
                  className="absolute top-3 right-3 w-8.5 h-8.5 bg-white/95 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-transform duration-150 shadow-sm"
                  aria-label={res.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                >
                  <Heart className={`w-5 h-5 ${res.isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="inline-flex items-center gap-1 text-3xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                      {getResourceTypeIcon(res.type)}
                      {res.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-3xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                      {res.topic}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-800 line-clamp-2 leading-snug">{res.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">{res.description}</p>
                  
                  {/* Keywords bubble */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {res.keywords.map((kw, idx) => (
                      <span key={idx} className="text-4xs font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer and interactive triggers */}
                <div className="pt-3 border-t border-slate-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-3xs text-slate-400 font-bold">Người tạo: {res.creator}</span>
                    <span className="text-3xs text-slate-400 font-semibold">{res.createdAt}</span>
                  </div>

                  <div className="flex justify-between items-center gap-1.5">
                    {/* Access Link */}
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-display font-bold shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      Mở học liệu <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(res)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors border border-slate-100 relative group"
                      title="Sao chép link"
                      aria-label="Sao chép liên kết"
                    >
                      {copiedId === res.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-3xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {copiedId === res.id ? 'Đã sao chép' : 'Sao chép'}
                      </span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShareLink(res)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors border border-slate-100"
                      title="Chia sẻ học liệu"
                      aria-label="Chia sẻ liên kết"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Teacher specific Admin controls */}
                    {role === 'teacher' && (
                      <>
                        <button
                          onClick={() => handleEditClick(res)}
                          className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors border border-amber-100"
                          title="Sửa"
                          aria-label="Sửa học liệu"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(res.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-100"
                          title="Xóa"
                          aria-label="Xóa học liệu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
