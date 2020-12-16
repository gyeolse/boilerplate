const mongoose = require("mongoose");
//1. bcrypt 호출
const bcrypt = require("bcrypt");
const saltRounds = 10;

//2. jwt
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // aaa @ naver.com 이런 식으로 있을 때 space를 없애주는 역할
    unique: 1, //
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    //관리자 같은것
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    //유효성 관리
    type: String,
  },
  tokenExp: {
    //토큰 만료 기한
    type: Number,
  },
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //cb == callback
  //plain 12341234이고, db에는 암호화된 pwd일 것. 같은지 체크해야함.
  //plain을 암호화하고, db에서 비교해야함. (복호화는 불가능)
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

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

userSchema.statics.findByToken = function (token, cb) {
  //statics로 안해서 오류남.
  var user = this;

  //token을 decode
  jwt.verify(token, "secretToken", function (err, decoded) {
    //decode된 것은 user id일 것
    //유저 아이디를 이용해서 유저를 찾고, client에서 가져온 token과 db에 보관된 token이 일치하는지 비교

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};
//비밀번호를 바꿀 때에만 암호화를 시켜주어야 함.
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
  } else {
    //비밀번호가 아닌 다른 것을 바꿀 때에는 그냥 next 처리를 해줘야함.
    next();
  }
});
const User = mongoose.model("User", userSchema);

module.exports = { User };
