import axios from "axios";

export const getToken = () => {
	const myToken = JSON.parse(localStorage.getItem('token'));
	if (!myToken)
		return null;
	if (myToken.expire <= Date.now()){
		localStorage.removeItem('token')
		return null;
	}
	return myToken.token
}

export const Logout = () => {
	localStorage.removeItem('token');
	window.location.reload();
}

export const authenticate = (token) => axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});
