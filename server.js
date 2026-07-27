const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 루트 접속 테스트용
app.get('/', (req, res) => {
  res.send('쿠키런 쿠폰 프록시 서버 작동 중');
});

app.post('/register', async (req, res) => {
  // 프론트엔드에서 mid와 coupon_code만 전달받음
  const { mid, coupon_code } = req.body;

  const devplayUrl = 'https://coupon.devsgb.com/coupon/use';

  try {
    const response = await axios.post(
      devplayUrl,
      new URLSearchParams({
        mid: mid,                       // 회원 MID (예: WWKJC1213)
        coupon_code: coupon_code,       // 쿠폰 코드 (예: MEETALLULOSENOVA)
        combo_name: 'dc_coupon'         // 확인된 데브플레이 고유 키값
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Origin': 'https://coupon.devsgb.com',
          'Referer': 'https://coupon.devsgb.com/'
        }
      }
    );

    // 데브플레이 성공 결과 전달
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // 데브플레이 에러 응답 전달
      console.error('Devplay Error:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 오류가 발생했습니다.' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
