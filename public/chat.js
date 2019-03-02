const socket = io();


let hasLastMessage = false;
scrollToBottom = () => {
	const messages = document.getElementById('messages');
	const newMessage = messages.lastElementChild

	const clientHeight = messages.clientHeight
	const scrollTop = messages.scrollTop
	const scrollHeight= messages.scrollHeight
	const newMessageHeight = turnIntoNumber(newMessage)
	let lastMessageHeight;
	hasLastMessage ? (lastMessageHeight = turnIntoNumber(newMessage.previousElementSibling)) : (hasLastMessage = true)
	
	if(scrollHeight <= clientHeight + scrollTop + newMessageHeight + lastMessageHeight){
		messages.scrollTo(0, scrollHeight)
	}
}

turnIntoNumber = (str) => {
	const string = window.getComputedStyle(str, null).getPropertyValue("height")
	const number = parseInt(string.substring(0, string.length - 2));
	return number;
}

urlParser = (url) => {
	const roomStart = url.lastIndexOf("&room=")
	const username = url.substring(6, roomStart)
	const room = url.substring(roomStart+6)
	return {
		username,
		room
	}
}

socket.on('connect', () => {
	const {username, room} = urlParser(window.location.search)
	socket.emit('join', {username, room}, (err) => {
		err ? (alert(err), window.location.href = '/') : console.log('No error')
	})
});

socket.on('disconnect', () => {
	console.log('disconnected')
});

const sidebar = document.getElementById('sidebar').innerHTML
socket.on('roomData', ({ room, users}) => {
	const html = Mustache.render(sidebar, {
		room,
		users
	})
	document.getElementById('users').innerHTML = html
})

socket.on('newUser', (message) => {
	const creationTime = moment(message.createdAt).format('HH:mm')
	const messageField = document.getElementById('message-field').innerHTML
	const html = Mustache.render(messageField, {
		text: message.text,
		from: message.from,
		createdAt: creationTime
	})
	document.getElementById('messages').innerHTML += html;
	scrollToBottom();
})

const messageForm = document.getElementById('message-form')

messageForm.addEventListener("submit", (event) => {
	event.preventDefault();

	socket.emit('createMessage', {
		text: document.getElementById('name').value
	}, (data) => {
		document.getElementById('name').value = '';
	})
})