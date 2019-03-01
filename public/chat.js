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

socket.on('connect', () => {
	console.log('connected')

});

socket.on('disconnect', () => {
	console.log('disconnected')
});

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
		from: 'User',
		text: document.getElementById('name').value
	}, (data) => {
		document.getElementById('name').value = '';
	})
})