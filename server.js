const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { game, email, coupon_code } = req.body;

  // 데브플레이 쿠폰 등록 진짜 API 주소
  const devplayUrl = 'https://coupon.devplay.com/api/coupon/reg';

  try {
    const response = await axios.post(
      devplayUrl,
      new URLSearchParams({
        game_app_id: game,          // 예: cookierun-ovenbreak
        email: email,               // 사용자 ID (MID)
        coupon_code: coupon_code,   // 쿠폰 번호
        lang: 'ko'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://coupon.devplay.com/coupon/${game}/ko`,
          'Origin': 'https://coupon.devplay.com'
        }
      }
    );

    // 성공 시 데이터 반환
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // 데브플레이에서 보내준 에러 메시지(응답) 반환
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 오류' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
