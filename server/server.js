const path =require('path'),
	  http = require('http'),
	  express = require('express'),
	  app = express(),
	  socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {


	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		})
	})

	socket.on('disconnect', () => {
		console.log('client disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server is up in port ${port}`)
})