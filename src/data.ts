/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resource, VideoLesson, GameItem, Quiz, Announcement, Badge } from './types';

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Bảng Chữ Cái Tiếng Việt Vui Nhộn',
    description: 'Bảng chữ cái tiếng Việt tương tác kèm âm thanh chuẩn, hình ảnh sinh động giúp học sinh lớp 1 dễ dàng ghi nhớ âm vần.',
    grade: '1',
    topic: 'Chữ cái & Âm vần',
    keywords: ['bảng chữ cái', 'lớp 1', 'âm vần', 'tập đọc'],
    type: 'canva',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    link: 'https://canva.com/design/example-bang-chu-cai',
    createdAt: '2026-06-15',
    creator: 'Cô Minh Thư',
    isFavorite: true,
  },
  {
    id: 'res-2',
    title: 'Luyện Tập Ghép Tiếng và Đánh Vần',
    description: 'Trò chơi kéo thả ghép các phụ âm đầu với vần và thanh điệu để tạo thành từ có nghĩa.',
    grade: '1',
    topic: 'Chữ cái & Âm vần',
    keywords: ['đánh vần', 'ghép chữ', 'tương tác'],
    type: 'wordwall',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    link: 'https://wordwall.net/play/example-ghep-van',
    createdAt: '2026-06-20',
    creator: 'Thầy Hoàng Nam',
  },
  {
    id: 'res-3',
    title: 'Vườn Từ Vựng Chỉ Sự Vật - Lớp 2',
    description: 'Kho từ vựng sinh động về người, đồ vật, con vật, cây cối xung quanh em.',
    grade: '2',
    topic: 'Từ vựng & Ngữ pháp',
    keywords: ['sự vật', 'từ vựng', 'lớp 2', 'slides'],
    type: 'google_slides',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80',
    link: 'https://docs.google.com/presentation/example-tu-su-vat',
    createdAt: '2026-06-18',
    creator: 'Cô Mai Hiên',
  },
  {
    id: 'res-4',
    title: 'Phiếu Bài Tập So Sánh và Nhân Hóa',
    description: 'Tài liệu PDF ôn tập kiến thức về phép so sánh và nhân hóa trong chương trình Tiếng Việt lớp 3.',
    grade: '3',
    topic: 'Luyện từ và câu',
    keywords: ['so sánh', 'nhân hóa', 'phiếu bài tập', 'pdf'],
    type: 'google_drive',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    link: 'https://drive.google.com/file/example-bai-tap-so-sanh',
    createdAt: '2026-06-22',
    creator: 'Cô Lê Vy',
    isFavorite: true,
  },
  {
    id: 'res-5',
    title: 'Thử Thách Phân Biệt Từ Đơn và Từ Phức',
    description: 'Bộ câu hỏi Quizizz giúp học sinh ôn tập nhanh và phân biệt chính xác từ đơn, từ ghép, từ láy.',
    grade: '4',
    topic: 'Luyện từ và câu',
    keywords: ['từ đơn', 'từ phức', 'từ ghép', 'từ láy', 'quizz'],
    type: 'quizizz',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80',
    link: 'https://quizizz.com/join?gc=example-tu-don-tu-phuc',
    createdAt: '2026-06-28',
    creator: 'Thầy Nguyễn Trung',
  },
  {
    id: 'res-6',
    title: 'Tập Làm Văn: Cấu Tạo Bài Văn Tả Cảnh',
    description: 'Sơ đồ tư duy trực quan hướng dẫn lập dàn ý chi tiết cho bài văn miêu tả cảnh đẹp quê hương.',
    grade: '5',
    topic: 'Tập làm văn',
    keywords: ['tập làm văn', 'tả cảnh', 'dàn ý', 'sơ đồ tư duy'],
    type: 'genially',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
    link: 'https://view.genial.ly/example-ta-canh-lop-5',
    createdAt: '2026-06-30',
    creator: 'Cô Minh Thư',
  },
  {
    id: 'res-7',
    title: 'Học Đi đôi Với Hành - Đố Vui Ca Dao Tục Ngữ',
    description: 'Kahoot tương tác ôn tập các câu ca dao, tục ngữ quen thuộc về gia đình, thầy cô và quê hương đất nước.',
    grade: '4',
    topic: 'Ca dao & Tục ngữ',
    keywords: ['ca dao', 'tục ngữ', 'đố vui', 'kahoot'],
    type: 'kahoot',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518133680790-3985ded3a54a?auto=format&fit=crop&w=600&q=80',
    link: 'https://kahoot.it/challenge/example-ca-dao',
    createdAt: '2026-07-01',
    creator: 'Thầy Hoàng Nam',
    isFavorite: true,
  }
];

export const INITIAL_VIDEOS: VideoLesson[] = [
  {
    id: 'vid-1',
    title: 'Học đánh vần tiếng Việt chuẩn - Bài 1: Âm "a", "b" và thanh huyền, sắc',
    description: 'Video hướng dẫn học sinh lớp 1 nhận biết chữ cái a, b và tập ghép vần với các thanh cơ bản.',
    grade: '1',
    duration: '08:45',
    youtubeId: 'W-U83tHHeN4', // Standard public educational video ID placeholder
    topic: 'Chữ cái & Âm vần',
  },
  {
    id: 'vid-2',
    title: 'Từ chỉ hoạt động, trạng thái - Tiếng Việt Lớp 2',
    description: 'Bài giảng sinh động giúp học sinh tìm các từ chỉ hoạt động của người, con vật và trạng thái của sự vật.',
    grade: '2',
    duration: '12:30',
    youtubeId: 'q8U7U6ZgZ7A',
    topic: 'Từ vựng & Ngữ pháp',
    isCompleted: true,
  },
  {
    id: 'vid-3',
    title: 'Biện pháp nghệ thuật Nhân hóa - Tiếng Việt Lớp 3',
    description: 'Tìm hiểu 3 cách nhân hóa thường gặp và cách đặt câu có sử dụng phép nhân hóa để bài văn thêm hay.',
    grade: '3',
    duration: '10:15',
    youtubeId: 'pXpYpY6ZgZA',
    topic: 'Luyện từ và câu',
  },
  {
    id: 'vid-4',
    title: 'Cấu tạo của Tiếng - Tiếng Việt Lớp 4',
    description: 'Phân tích 3 bộ phận cấu tạo nên một tiếng: Âm đầu, Vần và Thanh điệu. Tiếng nào bắt buộc phải có bộ phận nào?',
    grade: '4',
    duration: '14:20',
    youtubeId: 'abc123xyz',
    topic: 'Luyện từ và câu',
  },
  {
    id: 'vid-5',
    title: 'Từ nhiều nghĩa và phân biệt với Từ đồng âm - Lớp 5',
    description: 'Phân biệt từ nhiều nghĩa (có nghĩa gốc và nghĩa chuyển liên quan đến nhau) và từ đồng âm (phát âm giống nhưng nghĩa hoàn toàn khác nhau).',
    grade: '5',
    duration: '15:50',
    youtubeId: 'def456uvw',
    topic: 'Luyện từ và câu',
  }
];

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'game-1',
    title: 'Xứ Sở Ghép Tiếng',
    description: 'Em hãy kéo các âm đầu và vần vào đúng vị trí để tạo nên tiếng tương ứng với hình ảnh gợi ý nhé!',
    grade: '1',
    topic: 'Chữ cái & Âm vần',
    gameType: 'ghep_chu',
    difficulty: 'Dễ',
    completedCount: 5,
    highScore: 100,
  },
  {
    id: 'game-2',
    title: 'Thử Thách Điền Ca Dao',
    description: 'Điền những từ còn thiếu vào các câu ca dao, tục ngữ quen thuộc của Việt Nam để hoàn thành bức tranh dân gian.',
    grade: '3',
    topic: 'Ca dao & Tục ngữ',
    gameType: 'dien_tu',
    difficulty: 'Trung bình',
    completedCount: 3,
    highScore: 90,
  },
  {
    id: 'game-3',
    title: 'Vòng Quay Từ Đồng Nghĩa',
    description: 'Quay chiếc nón kỳ diệu để chọn từ khóa, sau đó tìm từ đồng nghĩa hoặc trái nghĩa tương ứng để nhận điểm thưởng lớn!',
    grade: '5',
    topic: 'Luyện từ và câu',
    gameType: 'vong_quay',
    difficulty: 'Khó',
    completedCount: 1,
    highScore: 120,
  },
  {
    id: 'game-4',
    title: 'Ai Là Triệu Phú Từ Vựng',
    description: 'Trả lời nhanh các câu hỏi trắc nghiệm ngữ pháp thú vị để chinh phục đỉnh núi tri thức và giành vương miện.',
    grade: '4',
    topic: 'Từ vựng & Ngữ pháp',
    gameType: 'trac_nghiem',
    difficulty: 'Trung bình',
    completedCount: 0,
  },
  {
    id: 'game-hung-tao',
    title: '🍎 Hứng Táo Vườn Hồng',
    description: 'Game phân loại từ ngữ cực kỳ nhanh tay! Đón những quả táo rơi mang từ vựng và phân loại vào đúng sọt Từ Láy hay Từ Ghép nhé!',
    grade: '4',
    topic: 'Phân loại Từ Láy - Từ Ghép',
    gameType: 'phan_loai',
    difficulty: 'Trung bình',
    completedCount: 4,
    highScore: 150,
  },
  {
    id: 'game-pikachu',
    title: '⚡ Pikachu Kết Đôi',
    description: 'Mô phỏng trò chơi Pikachu nối hình kinh điển! Hãy tìm các cặp thẻ bài chứa từ đồng nghĩa hoặc trái nghĩa và kết nối chúng bằng luồng sấm sét.',
    grade: '5',
    topic: 'Từ Đồng Nghĩa & Trái Nghĩa',
    gameType: 'noi_pikachu',
    difficulty: 'Khó',
    completedCount: 2,
    highScore: 180,
  },
  {
    id: 'game-gau-truc',
    title: '🎋 Gấu Trúc Leo Cây',
    description: 'Hãy giúp chú gấu trúc Panda đáng yêu leo lên ngọn tre cao vút bằng cách điền đúng các từ khuyết trong câu ca dao tục ngữ hoặc câu thơ nhé!',
    grade: '3',
    topic: 'Điền từ khuyết ngữ cảnh',
    gameType: 'dien_khuyet_gau_truc',
    difficulty: 'Dễ',
    completedCount: 3,
    highScore: 120,
  },
  {
    id: 'game-ban-cung',
    title: '🎯 Bắn Cung Thần Tốc',
    description: 'Hóa thân thành cung thủ thiện xạ! Hãy nhắm và bắn trúng bong bóng mang yếu tố ngôn ngữ chính xác theo yêu cầu để nổ bừng sao thưởng!',
    grade: '3',
    topic: 'Xác định phép so sánh & nhân hóa',
    gameType: 'xac_dinh_ban_cung',
    difficulty: 'Trung bình',
    completedCount: 1,
    highScore: 140,
  },
  {
    id: 'game-merio',
    title: '🍄 Merio Phiêu Lưu Ký',
    description: 'Đồng hành cùng chú nấm Merio vượt qua các thử thách nhảy bậc, sắp xếp các từ lộn xộn theo đúng trật tự cú pháp Tiếng Việt để giải cứu vương quốc!',
    grade: '2',
    topic: 'Sắp xếp trật tự từ thành câu',
    gameType: 'sap_xep_merio',
    difficulty: 'Trung bình',
    completedCount: 2,
    highScore: 110,
  },
  {
    id: 'game-ban-bi',
    title: '🔮 Bắn Bi Sắc Màu',
    description: 'Một trò chơi bắn bi bùng nổ! Sử dụng bệ phóng bi mang âm đầu (l/n, ch/tr, s/x) để bắn trúng viên bi mang vần phù hợp nhằm tạo nên từ đúng chính tả!',
    grade: '1',
    topic: 'Chính tả & Ghép âm vần chuẩn',
    gameType: 'ban_bi',
    difficulty: 'Dễ',
    completedCount: 0,
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Kiểm Tra Âm Vần & Thanh Điệu Lớp 1',
    description: 'Bài kiểm tra ngắn 5 câu giúp học sinh lớp 1 củng cố khả năng nhận biết âm, vần và dấu thanh điệu cơ bản.',
    grade: '1',
    topic: 'Chữ cái & Âm vần',
    durationMinutes: 10,
    questions: [
      {
        id: 'q1-1',
        type: 'trac_nghiem',
        questionText: 'Tiếng nào sau đây chứa vần "uôi"?',
        options: ['Con muỗi', 'Nải chuối', 'Trái đu đủ', 'Cây tre'],
        correctAnswer: 'Nải chuối',
        explanation: 'Trong từ "Nải chuối", tiếng "chuối" có âm đầu "ch", vần "uôi" và thanh sắc.',
      },
      {
        id: 'q1-2',
        type: 'dung_sai',
        questionText: 'Từ "con mèo" có chứa vần "eo". Đúng hay Sai?',
        options: ['Đúng', 'Sai'],
        correctAnswer: 'Đúng',
        explanation: 'Tiếng "mèo" gồm âm đầu "m", vần "eo" và thanh huyền. Do đó nhận định này là Đúng.',
      },
      {
        id: 'q1-3',
        type: 'dien_khuyet',
        questionText: 'Điền chữ cái thích hợp vào chỗ trống để được từ đúng dưới bức tranh "___ quả khế": (c/k/q)',
        correctAnswer: 'q',
        explanation: 'Vần "uả" đi với âm "q" thành "quả". Chữ cái cần điền là "q".',
      },
      {
        id: 'q1-4',
        type: 'trac_nghiem',
        questionText: 'Từ nào viết đúng chính tả?',
        options: ['Quả xoài', 'Quả soài', 'Quả xoày', 'Quả xoài'],
        correctAnswer: 'Quả xoài',
        explanation: '"xoài" được viết với âm đầu "x" và vần "oai", thanh huyền.',
      },
      {
        id: 'q1-5',
        type: 'tu_luan_ngan',
        questionText: 'Hãy viết lại từ "Học sinh" bằng chữ in thường.',
        correctAnswer: 'học sinh',
        explanation: '"Học sinh" chuyển sang in thường hoàn toàn là "học sinh".',
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Luyện Từ Và Câu: Biện pháp Tu Từ - Lớp 3',
    description: 'Đánh giá khả năng hiểu và sử dụng phép so sánh và nhân hóa để viết câu sinh động hơn.',
    grade: '3',
    topic: 'Luyện từ và câu',
    durationMinutes: 15,
    questions: [
      {
        id: 'q3-1',
        type: 'trac_nghiem',
        questionText: 'Trong câu "Trăng tròn như quả bóng thả trên trời", sự vật nào được so sánh với nhau?',
        options: [
          'Trăng và trời',
          'Trăng và quả bóng',
          'Quả bóng và trời',
          'Quả bóng và ngôi sao'
        ],
        correctAnswer: 'Trăng và quả bóng',
        explanation: 'Từ so sánh là "như". Sự vật 1 là "Trăng" được so sánh với sự vật 2 là "quả bóng" dựa trên đặc điểm hình dáng tròn trịa.',
      },
      {
        id: 'q3-2',
        type: 'trac_nghiem',
        questionText: 'Câu nào dưới đây sử dụng biện pháp NHÂN HÓA?',
        options: [
          'Chú chó vàng sủa gâu gâu.',
          'Chị ong nâu bận rộn bay đi tìm mật.',
          'Cánh hoa đào hồng thắm.',
          'Bé đang học bài chăm chỉ.'
        ],
        correctAnswer: 'Chị ong nâu bận rộn bay đi tìm mật.',
        explanation: 'Tác giả dùng từ xưng hô của người "chị" và trạng thái "bận rộn" cho con vật "ong nâu", đây chính là biện pháp nhân hóa.',
      },
      {
        id: 'q3-3',
        type: 'dung_sai',
        questionText: 'Câu "Cây dừa sải tay bơi cùng gió" sử dụng cả biện pháp nhân hóa. Đúng hay Sai?',
        options: ['Đúng', 'Sai'],
        correctAnswer: 'Đúng',
        explanation: '"sải tay bơi" là hoạt động của con người được gán cho "cây dừa", do đó đây là phép nhân hóa cực kỳ sinh động.',
      },
      {
        id: 'q3-4',
        type: 'dien_khuyet',
        questionText: 'Hoàn thành câu so sánh sau: "Trẻ em như búp măng ___"',
        correctAnswer: 'non',
        explanation: 'Câu tục ngữ/thành ngữ ví von trọn vẹn là "Trẻ em như búp măng non".',
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'Khảo Sát Từ Đồng Nghĩa & Từ Trái Nghĩa - Lớp 5',
    description: 'Đánh giá sâu kiến thức về cấu trúc từ vựng Tiếng Việt ở khối lớp cuối cấp tiểu học.',
    grade: '5',
    topic: 'Từ vựng & Ngữ pháp',
    durationMinutes: 15,
    questions: [
      {
        id: 'q5-1',
        type: 'trac_nghiem',
        questionText: 'Nhóm từ nào dưới đây là các từ đồng nghĩa hoàn toàn?',
        options: [
          'Học tập, học hỏi, học hành',
          'Tổ quốc, giang sơn, đất nước, non sông',
          'Chăm chỉ, cần cù, lười biếng',
          'Đỏ tươi, đỏ thắm, xanh lơ'
        ],
        correctAnswer: 'Tổ quốc, giang sơn, đất nước, non sông',
        explanation: 'Tất cả các từ trong nhóm "Tổ quốc, giang sơn, đất nước, non sông" đều chỉ chủ thể quốc gia, giang sơn đất nước của mình.',
      },
      {
        id: 'q5-2',
        type: 'trac_nghiem',
        questionText: 'Cặp từ nào dưới đây có quan hệ TRÁI NGHĨA?',
        options: [
          'Chăm chỉ - Cần cù',
          'Đoàn kết - Chia rẽ',
          'Gấp gáp - Vội vã',
          'Thông minh - Sáng tạo'
        ],
        correctAnswer: 'Đoàn kết - Chia rẽ',
        explanation: '"Đoàn kết" mang ý nghĩa chung tay, gắn kết; còn "chia rẽ" mang nghĩa chia tách, bất hòa. Đây là hai khái niệm trái ngược nhau hoàn toàn.',
      },
      {
        id: 'q5-3',
        type: 'dien_khuyet',
        questionText: 'Tìm từ trái nghĩa trong câu tục ngữ sau: "Gần mực thì đen, gần đèn thì ___"',
        correctAnswer: 'sáng',
        explanation: '"Đen" đối lập trái nghĩa với "sáng" (biểu trưng cho sự sáng lạn, tốt đẹp). Từ thích hợp là "sáng".',
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🎉 Ra mắt Hệ thống Học Liệu Số Mới',
    content: 'Chào mừng các em học sinh, phụ huynh và quý thầy cô đến với Hệ thống học liệu số môn Tiếng Việt Tiểu Học cực kỳ hấp dẫn! Hãy trải nghiệm các trò chơi ghép chữ, vòng quay từ vựng và bài giảng sinh động ngay hôm nay.',
    date: '2026-07-02',
    type: 'success',
  },
  {
    id: 'ann-2',
    title: '🏆 Tuần Lễ "Vua Tiếng Việt" Nhí',
    content: 'Bắt đầu từ thứ Hai tuần tới, trường phát động cuộc thi Vua Tiếng Việt online thông qua các bài kiểm tra trắc nghiệm trên nền tảng. Các em hãy luyện tập chăm chỉ để rinh huy hiệu độc quyền nhé!',
    date: '2026-07-01',
    type: 'event',
  },
  {
    id: 'ann-3',
    title: '💡 Gợi ý dành cho Phụ huynh',
    content: 'Phụ huynh có thể sử dụng góc "Đánh giá học tập" để quan sát biểu đồ tiến bộ, thời gian học và điểm số chi tiết của con để kịp thời hỗ trợ và khích lệ các bé học tốt hơn.',
    date: '2026-06-29',
    type: 'info',
  }
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Chăm Chỉ Học Tập',
    description: 'Xem liên tiếp 3 video bài giảng Tiếng Việt để nắm vững lý thuyết.',
    iconName: 'BookOpen',
  },
  {
    id: 'badge-2',
    title: 'Nhà Thông Thái Nhí',
    description: 'Đạt điểm tuyệt đối (10 điểm) trong bất kỳ bài kiểm tra nào.',
    iconName: 'Award',
  },
  {
    id: 'badge-3',
    title: 'Vua Trò Chơi',
    description: 'Hoàn thành tất cả các trò chơi ghép tiếng và điền từ vựng.',
    iconName: 'Gamepad2',
  },
  {
    id: 'badge-4',
    title: 'Kỷ Lục Gia',
    description: 'Có thời gian tự học trên hệ thống đạt trên 60 phút.',
    iconName: 'Zap',
  },
  {
    id: 'badge-5',
    title: 'Nhà Sưu Tầm',
    description: 'Đánh dấu yêu thích 5 học liệu số hữu ích trong thư viện.',
    iconName: 'Heart',
  }
];
