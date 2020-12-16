const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증 처리를 함.

  // 1. 클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth; //x_auth라는 이름으로 넣었었음

  // 2. 토큰을 복호화한 후, User를 찾는다. (findByToken 함수 생성 > User.js)
  User.findByToken(token, (err, user) => {
    // 3. User가 있으면 인증 success
    // 3_1. User가 없으면 인증 failure
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); //middleware니까 계속 진행할 수 있게 다음 단계로 진행하라 이런뜻
  });
};

module.exports = { auth };
