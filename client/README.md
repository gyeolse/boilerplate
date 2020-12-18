# Client Code

### 목적 : 전반적인 웹 개발에서 기본적으로 제공하는 기능들을 미리 구현해 놓은 boiler-plate 소스코드 제작

<br>

### 구현 기간 : 2020.12.18 ~ 진행중

<br>

### 기능

- 회원가입 기능
- 로그인/로그아웃 기능
- 인증처리 기능
  <br>

<hr>

### 전반적인 과정 및 배운 내용 (순서대로)

## [1] CRA

- `npx create-react-app .` : Babel 설정, webpack 설정 자동으로 세팅됨
- Babel : 자바스크립트의 문법을 최신 브라우저 및 구형 브라우저에서도 구동될 수 있도록 변환시켜줌
- Webpack : 웹사이트를 만들 때, JS/HTML/CSS파일 뿐만 아니라, 라이브러리를 쓰다보니, 복잡해짐 => 많은 모듈들을 번들을 시켜주는 역할.
- `npm`와 `npx`
  - npm : 라이브러리들을 담고 있는 역할. build. `package.json`에 정의되어있음. `-g`를 하면 globally
  - npx : registry에 있는 `create-react-app`을 이용할 수 있도록 함. disk space를 절약할 수 있음
- `npm run start` || `yarn start`
- public은 `webpack`이 관리를 안함. 이미지를 넣을 때는 `src` 부분에서 처리해주는 것이 좋음

## [2] 구조 설명

- \_actions, reducer : 리듀서를 위한 폴더
- componenet
  - view
    - Footer
    - LandingPage
    - LoadingPage
    - NavBar
  - App.js : 라우팅 관련 처리
  - Config.js : 환경 변수 설정
  - Auth (hoc) : 컴포넌트 안에, 해당 유저가 해당 페이지를 들어갈 자격이 되는지 알아 낸후에, 자격이 된다면 Admin Component에 가게 해주고, 아니라면 다른 페이지로 보내버린다. 자격 외에 다른 기능들도, 넣을 수 있음
  - utils : 예를 들어, 랜딩페이지에서 쓰는게 다른 곳에서도 쓰이는 경우, 같이 쓰이므로, 한 곳에서 넣어서 관리함.
- extension es7 검색하면 `rfce` 하면 자동생성됨

## [3] routing 처리

- `npm i react-router-dom`

| `npm` | `npx` |
| ----- | ----- |
