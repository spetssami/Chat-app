const path =require('path'),
	  http = require('http'),
	  express = require('express'),
	  app = express(),
	  socketIO = require('socket.io'),
	  {generateMessage} = require('./utils/message'),
	  {isRealString} = require('./utils/validation'),
{addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
	
	socket.on('join', ({username, room}, callback) => {
		const {error, user } = addUser({id: socket.id, username, room})
		if(error){
			return callback(error)
		}

		socket.join(user.room)


		socket.emit('newUser', generateMessage('Admin', `Welcome to ${user.room}`))
		socket.broadcast.to(user.room).emit('newUser', generateMessage('Admin', `${user.username} has joined.`))
		
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		})
		callback()
	})
	socket.on('createMessage', (message, callback) => {
		const user = getUser(socket.id)
		io.to(user.room).emit('newUser', generateMessage(user.username, message.text));
		callback()
	})

	socket.on('disconnect', () => {
		const user = removeUser(socket.id)
		if(user){
			io.to(user.room).emit('newUser', generateMessage(`${user.username} has left`))
			
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room)
			})
		}
	})
})

server.listen(port, () => {
	console.log(`Server is up in port ${port}`)
})