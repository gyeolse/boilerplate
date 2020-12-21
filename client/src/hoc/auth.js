import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  //option : null, true, false (null은 아무나 , true는 login한 유저, false는 로그인 유저는 출입 불가능)
  //backend에 request를 날리고, 사용자의 상태를 가져옴
  //admin 설정해주고 싶으면, adminRoute 설정해주면 됨
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      //auth에 get. token을 통해서
      dispatch(auth()).then((response) => {
        console.log(response);
        //분기처리. (막아주는 역할)

        //1. 로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            //true인 페이지
            props.history.push("/login");
          }
        } else {
          //2. 로그인한 상태
          //adminRoute가 트루
          if (adminRoute == true && response.payload.isAdmin == false) {
            props.history.push("/");
          } else {
            //3. option이 false, 로그인한 유저가 register, login 페이지 접근할 때
            props.history.push("/");
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
