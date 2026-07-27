const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { game, email, coupon_code } = req.body;

  // 데브플레이 쿠폰 실제 등록 API 주소
  const devplayUrl = `https://coupon.devplay.com/coupon/${game}/coupon`;

  try {
    const response = await axios.post(
      devplayUrl,
      new URLSearchParams({
        email: email,
        coupon_code: coupon_code
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    // 성공 응답 반환
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // 데브플레이에서 반환된 에러 메시지 그대로 반환
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 오류' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
