/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Simple mock responses for fallback when Gemini API key is not configured or placeholder
function getMockTutorResponse(message: string, grade?: string, topic?: string): string {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes('chính tả') || msgLower.includes('gh/g') || msgLower.includes('ngh/ng') || msgLower.includes('c/k')) {
    return `### 💡 Quy tắc chính tả Tiếng Việt thú vị đây em ơi!
    
1. **Quy tắc gh và ngh**: 
   - Hai anh chàng "gh" và "ngh" cực kỳ điệu đà, chỉ chịu đứng trước các chữ cái **e, ê, i** thôi nhé!
   - Ví dụ: *ghế gỗ, ghi chép, nghe nhạc, nghĩ ngợi*.
   - Còn các chữ cái khác như **a, o, ô, u, ư** thì sẽ đi với "g" và "ng" thường. Ví dụ: *gà con, cá gỗ, quả ngô*.

2. **Quy tắc c, k, q**:
   - Chữ **k** cũng rất kiêu kỳ, chỉ đi với **e, ê, i** (ví dụ: *kẻ vở, kính mát*).
   - Chữ **q** thì luôn đi kèm với âm đệm **u** để tạo thành **qu** (ví dụ: *quả táo*).
   - Chữ **c** thì đi với các nguyên âm còn lại.

Em có muốn làm thử một câu đố nhỏ về quy tắc này không nào? 😉`;
  }

  if (msgLower.includes('từ ghép') || msgLower.includes('từ láy') || msgLower.includes('từ phức')) {
    return `### 🌸 Phân biệt Từ Ghép và Từ Láy siêu dễ!

Chào em! Trong Tiếng Việt lớp 4 và 5, chúng mình học về **từ phức** (gồm 2 tiếng trở lên). Từ phức được chia làm hai loại:

1. **Từ Ghép**: Là các tiếng ghép lại với nhau và đều có nghĩa rõ ràng.
   - Ví dụ: *nhà cửa* (nhà và cửa đều có nghĩa), *học tập*, *bạn bè*.
   - Từ ghép giúp chúng mình gọi tên sự vật cụ thể hơn.

2. **Từ Láy**: Là các tiếng láy lại âm hoặc vần giống nhau, thường chỉ có một tiếng có nghĩa hoặc cả hai tiếng đều không có nghĩa rõ ràng khi đứng riêng.
   - Ví dụ: *lung linh* (láy âm l), *rào rào* (láy hoàn toàn), *mềm mại* (láy phụ âm m).
   - Từ láy giúp câu văn trở nên sinh động, giàu hình ảnh và cảm xúc!

**Mẹo nhỏ cho em:** Hãy thử tách đôi từ ra xem cả hai tiếng có nghĩa không nhé. Nếu cả hai có nghĩa thì thường là từ ghép, nếu chỉ có một tiếng có nghĩa và âm vần giống nhau thì là từ láy!`;
  }

  if (msgLower.includes('so sánh') || msgLower.includes('nhân hóa')) {
    return `### ✨ Cùng tìm hiểu về So Sánh và Nhân Hóa nhé!

Học sinh lớp 3 ơi, đây là hai phép tu từ giúp câu văn của chúng mình "biết nói" và lung linh hơn rất nhiều:

1. **Phép So Sánh**: Đối chiếu sự vật này với sự vật khác có nét tương đồng.
   - Công thức: **Sự vật 1 + Từ so sánh (như, là, tựa...) + Sự vật 2**
   - Ví dụ: *Mặt trời đỏ rực như một quả bóng lửa.*

2. **Phép Nhân Hóa**: Gọi hoặc tả con vật, đồ vật bằng những từ ngữ vốn dùng cho con người.
   - Ví dụ: *Chị Ong nâu bận rộn bay đi tìm mật*, *Bác trống trường ngủ im lìm trong ba tháng hè*.

Em hãy thử viết một câu tả chú mèo nhà em có dùng phép nhân hóa xem nào! Thầy/Cô sẽ chấm điểm cho em nha! 🐾`;
  }

  if (msgLower.includes('tập làm văn') || msgLower.includes('tả cảnh') || msgLower.includes('tả người')) {
    return `### 📝 Bí kíp làm bài văn đạt điểm 10!

Để viết một bài văn miêu tả thật hay (đặc biệt là đối với các bạn lớp 4, lớp 5), em hãy nhớ quy tắc **3 bước thần thánh** này nha:

1. **Mở bài**: Giới thiệu cảnh vật hoặc người em định tả (ở đâu, vào lúc nào, ấn tượng chung ra sao).
2. **Thân bài**: 
   - *Tả bao quát*: Nhìn từ xa có gì nổi bật? (màu sắc, hình dáng).
   - *Tả chi tiết*: Đi sâu vào từng góc nhỏ, dùng nhiều giác quan (nghe thấy âm thanh gì, ngửi thấy mùi hương gì, cảm nhận thời tiết thế nào).
   - *Hãy dùng phép so sánh và nhân hóa* để bài viết mượt mà hơn nhé!
3. **Kết bài**: Nêu cảm xúc, tình cảm gắn bó của em với cảnh hoặc người đó.

Chúc em có những bài văn thật xuất sắc nhé! Hãy gửi đề bài văn em đang gặp khó khăn cho thầy cô nha.`;
  }

  // General warm friendly response
  const gradeText = grade ? ` lớp ${grade}` : '';
  return `### 👋 Xin chào người bạn nhỏ đáng yêu!
  
Thầy/Cô rất vui được trò chuyện cùng em${gradeText}. Ở đây, thầy cô có thể giúp em:
- Học đánh vần, ghép tiếng lớp 1 cực nhanh.
- Giải nghĩa từ vựng, mở rộng các vốn từ thú vị lớp 2, lớp 3.
- Phân biệt từ đơn, từ phức, từ ghép, từ láy của lớp 4.
- Luyện từ và câu, lập dàn ý tập làm văn sinh động lớp 5.

Em hãy đặt câu hỏi hoặc gõ một từ ngữ, một câu văn mà em đang thắc mắc nhé. Thầy cô luôn ở đây để đồng hành và giúp em học thật tốt môn Tiếng Việt! 🌟🎒`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Shared Gemini client (lazy-initialized inside the endpoint for safety)
  let aiClient: GoogleGenAI | null = null;

  function getAiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Server-side API endpoint for Gemini Tutor
  app.post('/api/tutor', async (req, res) => {
    try {
      const { message, grade, topic } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Nội dung câu hỏi không được trống.' });
      }

      const client = getAiClient();

      if (!client) {
        // Fallback to high-quality simulated response if API Key is not set or placeholder
        const simulatedText = getMockTutorResponse(message, grade, topic);
        return res.json({
          text: simulatedText,
          isSimulated: true,
          note: 'Hệ thống đang chạy chế độ mô phỏng giáo trình chuẩn Bộ Giáo Dục do chưa cấu hình Khóa Secrets.'
        });
      }

      // If active key is available, use real Gemini 3.5 Flash for child-friendly tutor answers
      const systemPrompt = `Bạn là "Trợ lý học tập Tiếng Việt Tiểu học" thông minh, ấm áp và vui nhộn dành cho học sinh Việt Nam.
Nhiệm vụ của bạn là giải đáp thắc mắc về môn Tiếng Việt cho học sinh, giáo viên hoặc phụ huynh.
Đối tượng hiện tại là học sinh lớp ${grade || 'tiểu học'} đang học về chủ đề "${topic || 'Tổng hợp'}".

HÃY TUÂN THỦ CÁC QUY TẮC SAU:
1. Trả lời bằng Tiếng Việt chuẩn mực, đúng ngữ pháp sư phạm tiểu học.
2. Cách xưng hô: Gọi người hỏi là "em", "con" hoặc "bạn nhỏ", tự xưng là "Thầy", "Cô" hoặc "Trợ lý Tiếng Việt".
3. Trình bày sinh động: Sử dụng tiêu đề rõ ràng, gạch đầu dòng ngắn, icon biểu cảm (như 🌟, 💡, 📝, 🐾) để các bé dễ đọc.
4. Ngắn gọn, súc tích: Các bé tiểu học không đọc được bài quá dài. Độ dài tối đa khoảng 300 từ.
5. Giải thích đơn giản kèm ví dụ vui vẻ. Nếu là lỗi chính tả, hãy chỉ rõ quy tắc ghi nhớ. Nếu là làm văn, hãy gợi ý lập dàn ý 3 phần đơn giản.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return res.json({
        text: response.text || 'Thầy cô chưa nghĩ ra câu trả lời phù hợp, em hỏi lại câu khác nhé!',
        isSimulated: false,
      });
    } catch (error: any) {
      console.error('Error generating tutor content:', error);
      // Fallback on real API error
      const { message, grade, topic } = req.body;
      const simulatedText = getMockTutorResponse(message || '', grade, topic);
      return res.json({
        text: simulatedText + `\n\n*(Chú thích: Đã chuyển sang chế độ tự học ngoại tuyến do lỗi kết nối: ${error.message || 'Lỗi API'})*`,
        isSimulated: true,
      });
    }
  });

  // Vite middleware setup for Development vs Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
