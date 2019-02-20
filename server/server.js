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
	socket.on('disconnect', () => {
		console.log('client disconnected')
	})
})

server.listen(port, (req, res) => {
	console.log(`Server is up in port ${port}`)
})