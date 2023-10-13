import { useEffect, useState } from 'react';
import './App.css';
import { GoogleLoginBtn } from './components/GoogleLoginBtn';
import { Logout, authenticate, getToken } from './utils/Authenticate';

function App() {
	const ACCESS_TOKEN = getToken()
	const [events, setEvents] = useState([]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [location, setLocation] = useState('');

	const get_data = async () => {
		try {
			const response = await authenticate(ACCESS_TOKEN.access_token).get(`/events`);
			setEvents(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const event = { title, description , date , location};
		await authenticate(getToken().access_token).post(`/events`, event)
		setTitle('')
		setDescription('')
		setDate('')
		setLocation('')
		get_data()
	};

	const handleDelete = async (e) => {
		try {
			await authenticate(ACCESS_TOKEN.access_token).delete(`/events/${e.target.dataset.id}`);
			get_data()
		} catch(error) {
			console.log(error)
		}
	}
	useEffect(()=>{
		if (ACCESS_TOKEN){
			get_data();
		}
	},[])
	return (
		<div className="App">
		{!ACCESS_TOKEN &&
			<GoogleLoginBtn />
		}
		{ACCESS_TOKEN &&
			<>
				<button onClick={Logout}>로그아웃</button>
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Date</th>
							<th>Location</th>
						</tr>
					</thead>
					<tbody>
						{events.map(event => (
							<tr key={event.id}>
								<td>{event.title}</td>
								<td>{event.description}</td>
								<td>{event.date}</td>
								<td>{event.location}</td>
								<td><button onClick={handleDelete} data-id={event.id}>삭제</button></td>
							</tr>
						))}
					</tbody>
				</table>
				<form onSubmit={handleSubmit}>
					Title:
					<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
					<br/>
					Description:
					<input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
					<br/>
					Date:
					<input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value+":00")} />
					<br/>
					Location:
					<input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
					<button type="submit" disabled={!title || !description || !date || !location}>Submit</button>
				</form>
			</>
		}
		</div>
	);
}

export default App;
