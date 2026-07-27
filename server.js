const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { game, email, coupon_code } = req.body;

  // 데브플레이 실제 쿠폰 등록 API 엔드포인트
  const devplayUrl = `https://coupon.devplay.com/coupon/${game}/ko`;

  try {
    const response = await axios.post(
      devplayUrl,
      new URLSearchParams({
        email: email,             // 계정 ID (MID)
        coupon_code: coupon_code  // 쿠폰 번호
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://coupon.devplay.com/coupon/${game}/ko`,
          'Origin': 'https://coupon.devplay.com'
        }
      }
    );

    // 성공 시 데브플레이 응답 데이터 전달
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // 실패 시(이미 사용된 쿠폰, 존재하지 않는 아이디 등) 데브플레이 응답 그대로 전달
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 오류' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
