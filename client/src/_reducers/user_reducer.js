import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types";

export default function (state = {}, action) {
  //다른 type이 올떄마다 , 다른 처리를 해주어야 하므로
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      break;

    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload }; //user 데이터이므로
    default:
      return state;
  }
}

//전 state, action =>
