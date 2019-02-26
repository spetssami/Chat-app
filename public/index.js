const socket = io();


let hasLastMessage = false;
function scrollToBottom() {
	const messages = document.getElementById('messages');
	const newMessage = messages.lastElementChild

	const clientHeight = messages.clientHeight
	const scrollTop = messages.scrollTop
	const scrollHeight= messages.scrollHeight
	const newMessageHeight = turnIntoNumber(newMessage)
	let lastMessageHeight;
	if(hasLastMessage){
		lastMessageHeight = turnIntoNumber(newMessage.previousElementSibling)
	} 
	hasLastMessage = true;
	if(scrollHeight <= clientHeight + scrollTop + newMessageHeight + lastMessageHeight){
		messages.scrollTo(0, scrollHeight)
	}
}

turnIntoNumber = (str) => {
	const hasPixels = window.getComputedStyle(str, null).getPropertyValue("height")
	const number = parseInt(hasPixels.substring(0, hasPixels.length - 2));
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
	// const formattedTime = moment(message.createdAt).format('HH:mm')
	// let li = document.createElement('LI')
	// li.innerHTML = `${message.from} ${formattedTime}: ${message.text}`
	// document.getElementById('messages').appendChild(li)
})

let messageForm = document.getElementById('message-form')

messageForm.addEventListener("submit", (event) => {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: document.getElementById('name').value
	}, (data) => {
		document.getElementById('name').value = '';
	})
})