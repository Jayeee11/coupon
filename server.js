const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// 모든 브라우저의 접속 및 CORS 허용
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 쿠폰 등록 처리 요청 수신
app.post('/register', async (req, res) => {
  const { game, email, coupon_code } = req.body;
  const devplayUrl = `https://coupon.devplay.com/coupon/${game}/ko`;

  try {
    const response = await axios.post(
      devplayUrl,
      new URLSearchParams({ email, coupon_code }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    // 데브플레이 성공 응답을 그대로 전달
    res.json(response.data);
  } catch (error) {
    // 데브플레이 실패 응답("이미 등록된 계정입니다" 등)을 그대로 전달
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 오류' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 쿠폰 프록시 서버가 실행되었습니다! (포트: ${PORT})`);
});