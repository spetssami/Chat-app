const socket = io();

socket.on('connect', () => {
	console.log('connected')

	socket.emit('createMessage', {
		from: 'message@email.com',
		text: 'Blaahaskj'
	});
});

socket.on('disconnect', () => {
	console.log('disconnected')
});

socket.on('newMessage', (message) => {
	console.log('newMessage', message)
});