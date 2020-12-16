const express = require("express");
const app = express();
const port = 5001;
//3. bodyParser 호출 후, option 부여
const bodyParser = require("body-parser");

//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 하는데,
//application/x-www-form-urlencoded를 분석해서 가져올 수 있도록 함
app.use(bodyParser.urlencoded({ extended: true }));
//application/json을 분석해서 가져올 수 있도록 함
app.use(bodyParser.json());

//2. User 불러옴
const { User } = require("./models/User");
const mongoose = require("mongoose");

//4. config로 DB key값 불러옴
const config = require("./config/key");

//cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//미들웨어 추가
const { auth } = require("./middleware/auth");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongoDB connected..."))
  .catch((err) => console.log(err));

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
  res.send("boiler plate server code");
});

app.post("/api/users/register", (req, res) => {
  //1. 회원가입 때 필요한 정보들을 client에서 가져오면, DB에 저장하도록 함
  //bodyParser를 이용했으므로, 지금 parse 가 가능한 것.
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err }); //성공 못했다고, 클라이언트에 전달
    return res.status(200).json({ success: true }); //성공했다고 200을 보냄
  });
});

app.post("/api/users/login", (req, res) => {
  //1. 요청한 email이 DB안에 있는지 찾기
  //findOne이라는 mongoDB 메서드
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Can't find User.",
      });
    }
    //2. 요청한 비밀번호가 같은지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "PWD isn't correct" });

      //3. 비밀번호 까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err); //err message 전달

        //user안에 일단 token이 있고, token을 어딘가에 저장할거임. 쿠키에 저장할수도 있고 로컬스토리지에 할 수도 있고
        //cookie에 저장
        //express에서 제공되는 cookieparser 설치
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id }); //x_auth란 이름으로 쿠키 내에 user의 token이 저장된다.
      });
    });
  });

  //3. 비밀번호 맞다면 토큰 생성하기
});

//role이 0이면 일반 유저, role이 0이 아니면, 관리자.
//isAuth : true
app.get("/api/users/auth", auth, (req, res) => {
  //여기에 도착했다는 것 : 미들웨어를 성공적으로 통과했다.
  res.status(200).json({
    //전달하고자 하는 정보 전달. id나 Admin이나
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      token: "",
    },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});
app.listen(port, () => console.log(`example app listeining on port  ${port}`));
