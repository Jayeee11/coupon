const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('쿠키런 쿠폰 등록 프록시 서버 작동 중');
});

app.post('/register', async (req, res) => {
  let { mid, coupon_code } = req.body;

  // 1. 공백 제거 (trim) 및 대문자 변환으로 오타 방지
  mid = mid ? String(mid).trim() : '';
  coupon_code = coupon_code ? String(coupon_code).trim().toUpperCase() : '';

  if (!mid || !coupon_code) {
    return res.status(400).json({ message: 'MID와 쿠폰 코드를 모두 입력해 주세요.' });
  }

  const devplayUrl = 'https://coupon.devsgb.com/coupon/use';

  try {
    // 2. Exact Payload 구성
    const params = new URLSearchParams();
    params.append('mid', mid);
    params.append('coupon_code', coupon_code);
    params.append('combo_name', 'dc_coupon');

    const response = await axios.post(
      devplayUrl,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Origin': 'https://www.cookierun.com',
          'Referer': 'https://www.cookierun.com/'
        }
      }
    );

    // 성공 응답 반환 (Status 200)
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // 3. 400 에러 시 데브플레이가 돌려준 진짜 에러 데이터(예: "이미 사용된 쿠폰입니다")를 프론트로 전달
      console.log('❌ Devplay Error Response:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 실패' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
