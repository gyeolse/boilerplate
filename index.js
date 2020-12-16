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

app.post("/register", (req, res) => {
  //1. 회원가입 때 필요한 정보들을 client에서 가져오면, DB에 저장하도록 함
  //bodyParser를 이용했으므로, 지금 parse 가 가능한 것.
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err }); //성공 못했다고, 클라이언트에 전달
    return res.status(200).json({ success: true }); //성공했다고 200을 보냄
  });
});

app.listen(port, () => console.log(`example app listeining on port  ${port}`));
