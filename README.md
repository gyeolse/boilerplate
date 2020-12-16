# 1. 전반적인 환경설정

### 1) Node.js 환경설정

- node 설치, express 설치

### 2) mongoDB 환경설정

- mongodb 회원가입 후 클러스터 만들기 (Free Tier로 제공되는 가장 가까운 region 선택). M0 Sandbox 선택. 5~7분 정도 소요
- mongoDB 유저 생성. `connect` 누르고, 진행.
- Mongoose 설치. `npm i mongoose --save`
- Mmongoose를 통한 DB 연결

```javascript
mongoose
  .connect(
    "mongodb+srv://threewave:<pwd>@boilerplate.tioou.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("mongoDB connected..."))
  .catch((err) => console.log(err));
```

### 3) MongoDB Model & Schema

- Schema : 정보 지정
- Model은 스키마를 감싼다
- user model 만들기
  (1) userSchema
  ```javascript
  const userSchema = mongoose.Schema({
  name: {
      type: String,
      maxlength : 50,
  },
  email : {
      type:String,
      trim: true, // aaa @ naver.com 이런 식으로 있을 때 space를 없애주는 역할
      unique : 1, //
  },
  password: {
      type : String,
      minlength : 5,
  }
  lastname : {
      type: String,
      maxlength : 50
  }
  role: { //관리자 같은것
      type : Number,
      default : 0
  },
  image : String,
  token : { //유효성 관리
      type : String,
  },
  tokenExp : { //토큰 만료 기한
      type : Number
  }
  })
  ```
  (2) model에 `userSchema` 넣기
  `const User = mongoose.model('User', userSchema)`

### 4. 회원가입기능

`npm install body-parser save`

- postman 다운로드
- register route 만들기
- `post`로 전송할 때, postman을 이용해서 request를 전송함
- `post`에 대해서 성공했을 때 success true, 실패했을때, success false 전송

```javascript
app.post("/register", (req, res) => {
  //1. 회원가입 때 필요한 정보들을 client에서 가져오면, DB에 저장하도록 함
  //bodyParser를 이용했으므로, 지금 parse 가 가능한 것.
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err }); //성공 못했다고, 클라이언트에 전달
    return res.status(200).json({ success: true }); //성공했다고 200을 보냄
  });
});
```

### 5. nodemon

- 서버를 내리지 않아도, 소스의 변화를 감지하고, 변화한 부분을 반영된다.
- `npm install nodemon --save-dev`
- dev 붙이는 이유? : local, production mode 중 local에서만 사용하겠다는 의미. dev dependency로 추가된 것을 볼 수 있음.
- script에서 스크립트 추가 : `backend : "nodemon index.js"`

### 6. 소스 내 Secret-Code 별도 관리

- local 환경과 deploy 한 후, 두 가지 경우를 따로 생각해야함
- heroku 서비스를 사용한다고 치면, 따로, value를 주고, mongoDB 정보를 따로 넣어줘야함. 각각의 환경 분기처리를 해주어야 함.
- `dev.js`와 `prod.js` 두 개 서렂ㅇ
- `key.js`도 만듦
- key.js에서 분기처리를 해줌

```javascript
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
```

- prod.js에서는 추후 heroku 서비스에서 설정해줄 변수에 세팅해줌

```javascript
module.exports = {
  mongoURI: process.env.MONGO_URI,
};
//heroku 내에서 MONGO_URI라고 설정해둘 것이므로
```

- dev.js에서는 현재 mongoDB URI를 설정

```javascript
module.exports = {
  DB_URL: "mongodb+srv://~~",
};
```
