# Server Code

### 목적 : 전반적인 웹 개발에서 기본적으로 제공하는 기능들을 미리 구현해 놓은 boiler-plate 소스코드 제작

<br>

### 구현 기간 : 2020.12.16 ~ 진행중

<br>

### 기능

- 회원가입 기능
- 로그인/로그아웃 기능
- 인증처리 기능
  <br>

<hr>

### 전반적인 과정 및 배운 내용 (순서대로)

## [1] Node.js 환경설정

- node 설치, express 설치

## [2] mongoDB 환경설정

1. mongodb 회원가입 후 클러스터 만들기 (Free Tier로 제공되는 가장 가까운 region 선택). M0 Sandbox 선택. 5~7분 정도 소요
2. mongoDB 유저 생성. `connect` 누르고, 진행.
3. Mongoose 설치. `npm i mongoose --save`
4. mongoose를 통한 DB 연결

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

## [3] MongoDB Model & Schema

1. userSchema
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
2. model에 `userSchema` 넣기

   ```javascript
   const User = mongoose.model("User", userSchema);
   ```

## [4] 회원가입기능

`npm install body-parser save`

1. postman 다운로드
2. register route 만들기
3. `post`로 전송할 때, postman을 이용해서 request를 전송함
4. `post`에 대해서 성공했을 때 success true, 실패했을때, success false 전송

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

## [5] nodemon

1. 서버를 내리지 않아도, 소스의 변화를 감지하고, 변화한 부분을 반영된다.

`npm install nodemon --save-dev`

- dev 붙이는 이유? : local, production mode 중 local에서만 사용하겠다는 의미. dev dependency로 추가된 것을 볼 수 있음.
- script에서 스크립트 추가 : `backend : "nodemon index.js"`
  <br>
  <br>

## [6] 소스 내 Secret-Code 별도 관리

- local 환경과 deploy 한 후, 두 가지 경우를 따로 생각해야함
- heroku 서비스를 사용한다고 치면, 따로, value를 주고, mongoDB 정보를 따로 넣어줘야함. 각각의 환경 분기처리를 해주어야 함.
- `dev.js`와 `prod.js` 두 개 설정. `key.js`도 만듦
- `key.js`에서 분기처리를 해줌

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

## [7] `BCrypt`를 이용한 비밀번호 암호화

```
npm i bcrypt --save
```

- register route에서 save 전에 암호화를 시켜줘야함.
- User model에서 user 스키마를 불러와야함. `userSchema.pre('save)`를 User.js에 입력
- BCrypt 사용법 : salt를 생성, salt로 비밀번호를 암호화 시킴. 홈페이지 참고
- `const saltRounds = 10` 10자리인 salt를 말함.
- 비밀번호가 변경될 때에만 암호화가 진행되어야 하므로, 해당 경우에만 처리되도록 분기 처리

  ```javascript
  userSchema.pre("save", function (next) {
  var user = this; //지금 가리키는게 User이 됨
  //비밀번호를 암호화시키기. salt 생성 후 saltround 이용
  if (user.isModified("password")) {
      //비밀번호 변경 시에만
      bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); // 바로 다음 분기로 보내버림

      //찐 비밀번호 입력, req.body를 model에 넣었었고, 거기서 password를 가져오면 됨.
      // user = this, 한 후, user.password 입력. salt 넣고,
      bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
          user.password = hash; //replace
          next();
      });
      });
  } else { //비밀번호가 아닌 다른 것을 바꿀 때에는 그냥 next 처리를 해줘야함.
      next();
  }
  ```

## [8] Login 기능

#### 과정

- `post("/login")`
- mongoose에서 제공하는 `findOne` 함수 사용해서, DB안에서 존재하는지 찾기. email이 존재하지 않는 것에 대한 분기처리.

  ```javascript
  User.findOne({email: req.body.email}, (err,user) => {
          if(!user) {
              return res.json({
                  loginSuccess : false,
                  message: "Can't find User."
              })
          }
  ```

- 요청한 비밀번호가 같은지에 대한 로직 처리. `comparePassword`함수를 User Model 내에 만들기

  ```javascript
  userSchema.methods.comparePassword = function (plainPassword, cb) {
    //cb == callback
    //plain 12341234이고, db에는 암호화된 pwd일 것. 같은지 체크해야함.
    //plain을 암호화하고, db에서 비교해야함. (복호화는 불가능)
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
      if (err) return cb(err), cb(null, isMatch);
    });
  };
  ```

- 비밀번호가 같을 때 토큰 생성해주기 -> JSONWEBTOKEN 라이브러리 사용

## [9] JWT 사용

과정

- `npm install jsonwebtoken --save`
- 사용방법 npm 사이트에서 검색

```javascript
userSchema.methods.generateToken = function (cb) {
  //token을 가지고, 이 사람이 누군지 알 수 있음.
  //호출할때, 매개변수로 cb 하나만 들어있었음
  var user = this;

  //jwt 생성하기. sign에서 받을때, user._id에서 toHexString으로 세팅
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  //token field에 넣어줌
  user.token = token;

  user.save(function (err, user) {
    if (err) return cb(err); //cb으로 err 전달
    cb(null, user); //error는 없고, user정보만 전달
  });
};
```

- cookie parser 설치
- `npm install cookie-parser --save`

```javascript
res
  .cookie("x_auth", user.token)
  .status(200)
  .json({ loginSuccess: true, userId: user._id }); //x_auth란 이름으로 쿠키 내에 user의 token이 저장된다.
```

## [10] Authentication 기능

```
auth route 만들기
```

사이트를 들어갔을 때, 여러 페이지가 있을텐데, 로그인된 유저와 로그아웃된 유저, 관리자에 따른 페이지처리 위함.

- `index.js`에 auth 관련 라우트 추가하고, auth 매개변수로 추가

- auth middleware 추가 : 인증처리를 진행할 js파일 (`auth.js`)

- 쿠키에 저장된 Token을 서버에서 가져와서 `decode`처리함.

- 복호화 처리를 했을 때, userID가 나오는데, User collection에서 유저를 찾고, 쿠키에서 받아온 token을 유저도 가지고 있는지 확인함

- 쿠키가 일치하지 않으면 Authentication false 처리

- 쿠키가 일치하면 Authentication true 처리. 해당하는 유저 정보를 클라이언트에 보내줌

```javascript
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
```

```javascript
  User.findByToken(token, (err, user) => {
    // 3. User가 있으면 인증 success
    // 3_1. User가 없으면 인증 failure
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); //middleware니까 계속 진행할 수 있게 다음 단계로 진행하라 이런뜻
```

## [11] logout 처리

- 로그아웃 route 만들고, 로그아웃 하려는 유저를 DB에서 찾아서, 유저의 토큰을 지워줌 (토큰만 지워주면 로그인이 풀려버리기 때문 (auth 미들웨어를 생각해보면 됨))

<hr>
<hr>
<hr>

## Reference

[강의 github 링크](https://github.com/jaewonhimnae/boiler-plate-ko)
