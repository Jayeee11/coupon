const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// 1. CORS 설정 (모든 origin 허용)
app.use(cors());

// 2. Body Parser 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. 서버 정상 작동 확인용 헬스체크 라우트 (Cannot GET 방지)
app.get('/', (req, res) => {
  res.send('🍪 쿠키런 쿠폰 등록 프록시 서버가 정상 구동 중입니다.');
});

// 4. 쿠폰 등록 처리 라우트
app.post('/register', async (req, res) => {
  let { mid, email, coupon_code } = req.body;

  // mid 또는 email 파라미터 유연하게 수신 및 trim 처리
  const userMid = mid ? String(mid).trim() : (email ? String(email).trim() : '');
  const code = coupon_code ? String(coupon_code).trim().toUpperCase() : '';

  if (!userMid || !code) {
    return res.status(400).json({ 
      message: '회원번호(MID)와 쿠폰 코드가 올바르게 입력되지 않았습니다.' 
    });
  }

  // 데브플레이 쿠폰 사용 엔드포인트
  const devplayUrl = 'https://coupon.devsgb.com/coupon/use';

  try {
    // 폼 데이터 생성 (mid, coupon_code, combo_name)
    const params = new URLSearchParams();
    params.append('mid', userMid);
    params.append('coupon_code', code);
    params.append('combo_name', 'dc_coupon');

    // 데브플레이 API로 요청 전송
    const response = await axios.post(
      devplayUrl,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'ko,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
          // 💡 핵심: 데브플레이 검증 통과를 위한 Origin & Referer 강제 지정
          'Origin': 'https://www.cookierun.com',
          'Referer': 'https://www.cookierun.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        }
      }
    );

    // 데브플레이 성공 응답 반환
    res.json(response.data);

  } catch (error) {
    if (error.response) {
      // 데브플레이에서 반환한 400 Bad Request 등의 상세 에러 사유 반환
      console.error(`[오류 발생 - ${userMid}]`, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('서버 통신 예외:', error.message);
      res.status(500).json({ message: '데브플레이 서버 통신 중 오류가 발생했습니다.' });
    }
  }
});

// 5. 포트 리스닝
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
