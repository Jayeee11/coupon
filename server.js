const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', async (req, res) => {
  // 프론트엔드에서 보낸 mid, coupon_code, game 받기
  const { mid, email, coupon_code, game } = req.body;
  
  // mid 파라미터 우선 사용 (email로 넘어왔을 경우 대비 예외처리)
  const userMid = mid || email;
  const devplayUrl = 'https://coupon.devsgb.com/coupon/use';

  try {
    const response = await axios.post(
      devplayUrl,
      new URLSearchParams({
        mid: userMid,                                      // 9자리 회원번호 (MID)
        coupon_code: coupon_code,                          // 쿠폰 코드
        combo_name: game || 'cookierun-ovenbreak'         // 게임 구분값
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

    // 성공 응답 전송
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // 400 에러 발생 시 데브플레이가 보낸 상세 세부 에러 메시지 반환
      console.error('Devplay Error Body:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '데브플레이 서버 통신 오류' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
