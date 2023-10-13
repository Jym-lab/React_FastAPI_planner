import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React from 'react'

export const GoogleLoginBtn = () => {
	const loginHandle = (response) => {
		const decode_token = jwtDecode(response.credential)
		// FastAPI 서버로 보낼 데이터 폼
		const data = {
			email: decode_token.email,
			username: decode_token.family_name + decode_token.given_name,
			exp: decode_token.exp
		}
		//post 요청을 보낸다.
		axios.post("http://localhost:8000/user/login", data,
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
		.then(response => {
			// 성공적인 요청시 response 값을 localStorage에 저장한다.
			const myToken = {
				token: response.data,
				expire: Date.now() + 60 * 60 * 1000
			};
			localStorage.setItem('token', JSON.stringify(myToken));
			window.location.reload()
		})
		.catch(error => {
			// 실패시 에러 메시지 출력
			console.log(error)
		})
	}
	return (
		<>
			<GoogleLogin
				onSuccess={loginHandle}
				onError={() => {
					console.log("Login Failed");
				}}
				width='300px' //버튼 크기 지정
				/>
		</>
	)
}

export default GoogleLoginBtn
