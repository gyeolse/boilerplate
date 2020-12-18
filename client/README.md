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
- `index.js`에서 Router 관련 설정

  ```javascript
  <Switch>
    <Route exact path="/" component={LandingPage} />
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/register" component={RegisterPage} />
  </Switch>
  ```

  **문제** : 선언은 `import { BrowserRouter as Router, Route, Switch } from "react-router-dom";`로 해주어야 한다!

## [4] Axios 및 CORS issue, proxy 설정

- `npm i axios`
- CORS policy에 의해 막힌 이유
  - 서버 포트 5000, 클라이언트는 3000. 포트가 다름. 다른 웹에서 서버에 request를 보내면 보안적 이슈가 생기므로 CORS 정책이 필요함.
  - origin이 다른데 resource를 sharing할 때, 설정을 해주어야함.
  - 해결하는 방법 중 `proxy 설정`을 사용함. 임의로 proxy 설정. 모듈 다운로드가 필요함
    - client 부분에서 `npm install http-proxy-middleware --save` 설치
    - src/setupProxy.js 파일 생성
    ```javascript
    const proxy = require("http-proxy-middleware");
    module.exports = function (app) {
      app.use(
        "/api",
        proxy({
          target: "http://localhost:5000",
          changeOrigin: true,
        })
      );
    };
    ```
  - proxy가 무엇인가?
    - User <=> Proxy Server <=> 인터넷
    - 아이피를 프록시 서버에서 임의로 변경 간으. 인터넷에 접근하는 사람의 IP를 모르게됨. 보내는 데이터도 임의로 바꿀수 있음. 방화벽/ 웹 필터/ 캐쉬 데이터/ 공유 데이터 제공 기능 등...
    - 그 외, 직원/집안에서 아이들인터넷 제어, 캐쉬를 이용한 더 빠른 인터넷 제공, 더 나은 보안 제공, 이용 제한된 사이트 접근 가능 등...

## [5] Concurrently

- 서버와 프론트를 한 번에 키도록 함
- `npm install concurrently`
- 서버 쪽 `package.json`에서 concurrently 관련 설정
  `"dev": "concurrently \"npm run backend\" \"cd ../client && npm run start\""`
- `npm run dev`

## [6] Antd CSS Framework

- MaterialUI / React Bootstrap / Semantic / Ant..etc
- size가 크지만, 깔끔하고, Enterprise 환경에서도 어울리는 디자인 만들어내기 가능. 쓰기 편리함
- `npm install antd --save`
- `import 'antd/dist/antd.css'` 를 index.js에 넣기

## [7] Redux

- 상태 관리 라이브러리. 한 방향
- `{type: '' , articleId: value}` 이런 식으로 사용
- 이전 state, action object를 받은 후, next state를 return
- `npm i redux, react-redux, redux-promise, redux-thunk --save`
- redux middleware : 리덕스를 유용하게 쓰기 위한 역할. redux store안에 모든 state를 관리하는데, state를 변경하고 싶을 때, dispath를 이용해서 action으로 변경을 시킬 수 있음.
- action은 객체 형식이어야 함. store에서 객체 형식을 언제나 받는 것이 아니라, promise 형식으로 된 것/ function으로 된 것을 받을 때도 있음. 이럴 때는 store가 받지를 못하니. **`middleware`**가 필요한 것
- redux-promise : promise가 왔을 때의 대처법
- redux-thunk : function이 왔을 때의 대처법
- `index.js`에서 redux 적용 및 middleware 적용

  ```javascript
  import { Provider } from "react-redux";
  import { applyMiddleware, createStore } from "redux";
  import promiseMiddleware from "redux-promise"; //middle ware
  import ReduxThunk from "redux-thunk"; //middle ware
  const createStoreWithMiddleware = applyMiddleware(
    promiseMiddleware,
    ReduxThunk
  )(createStore);
  ```

  ```javascript
    <Provider
    store={createStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <App />
    </Provider>,
  ```

  - `_reducers/index.js`에 해당 코드 입력

  ```javascript

  ```

  - combineReducer => Root Reducer로 하나로 합쳐줌. login, logout 기능들,,,, 하나로 합쳐주는 그런 기능

- | `npm` | `npx` |
  | ----- | ----- |

## [8] LoginPage
