const socket = io();

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
	document.getElementById('messages').innerHTML += html
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