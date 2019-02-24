const path =require('path'),
	  http = require('http'),
	  express = require('express'),
	  app = express(),
	  socketIO = require('socket.io'),
	  {generateMessage} = require('./utils/message')


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {

	socket.emit('newUser', generateMessage('Admin', 'Welcome to my first "real" chat app'))
	socket.broadcast.emit('newUser', generateMessage('Admin', 'New user joined chat'))

	socket.on('createMessage', (message, callback) => {
		io.emit('newUser', generateMessage(message.from, message.text));
		callback(`Server got your message, ${message.text}`)
	})

	socket.on('disconnect', () => {
		console.log('client disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server is up in port ${port}`)
})