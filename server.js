const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('서버가 정상 작동 중입니다!');
});

app.post('/register', async (req, res) => {
  const { email, coupon_code } = req.body;

  // 확인하신 진짜 API 주소
  const devplayUrl = 'https://coupon.devsgb.com/coupon/use';

  try {
    const response = await axios.post(
      devplayUrl,
      new URLSearchParams({
        mid: email,                       // user_id / email 대신 mid 사용
        coupon_code: coupon_code,         // 쿠폰 코드
        combo_name: 'dc_coupon'           // 데브플레이 구분 키 값
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Origin': 'https://coupon.devsgb.com',
          'Referer': 'https://coupon.devsgb.com/'
        }
      }
    );

    // 성공 결과 반환
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // 실패 시 데브플레이가 보낸 에러 메시지 반환
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 오류' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
