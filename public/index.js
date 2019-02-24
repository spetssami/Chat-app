const socket = io();

socket.on('connect', () => {
	console.log('connected')

});

socket.on('disconnect', () => {
	console.log('disconnected')
});

socket.on('newUser', (message) => {
	console.log('newUser', message )
	let li = document.createElement('LI')
	li.innerHTML = `${message.from}: ${message.text}`
	document.getElementById('messages').appendChild(li)
})

let messageForm = document.getElementById('message-form')

messageForm.addEventListener("submit", (event) => {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: document.getElementById('name').value
	}, (data) => {
		console.log(data)
	})
})