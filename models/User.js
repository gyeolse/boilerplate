const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);

module.exports = { User };
