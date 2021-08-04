const { throws } = require('assert');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
              cors: {
                            origin: ['http://localhost:8080']
              }
});

const rooms = {  }
const name = newUser('start')
const userName = ''

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  console.log('req: '+req+' res: '+res)
  res.send('<h1>Hey Socket.io</h1>');
});

app.post('/',  (req, res) => {
  res.send('<h1></h1>POST request to the homepage</h1>')
  console.log('received post: '+req+'with res: '+res)
});

io.on('connection', (socket) => {
  //receive token from client
  let token = socket.handshake.auth.token;
  if(token){console.log('handshake succes '+token.toString())}
  let user = newUser(socket.handshake.name)
  socket.emit('connection-success', user)
  //user joins a room
  socket.on('new-user', (userName) => {
                console.log('new-user event on server: '+userName.name)
                // room = Math.floor(Math.random()*10000)
              user.name = userName.name
              user.timeStamp = Date.now()
              //  console.log(user.id)
                // socket.join(room)
                // rooms[room] = { users: {} }
                // rooms[room].users[socket.id] = name
                socket.emit('user-connected', user)
                // socket.to(room).broadcast.emit('user-connected', name)
                // socket.broadcast.emit('user-connected',name)
                // if(room){console.log('rooms'+rooms[0].toString())}
                // return rooms
                return user
              })
              
  //message that a user has sent
  socket.on('send-chat-message', (message, user) => {
                // if(message){
                user.timeStamp = Date.now()
                console.log('message received on server: '+message+'from: '+user.name)
                // socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
                // socket.emit('chat-message',{message: message, user: user})
                io.emit('chat-message',{message: message, user: user})
                // }
              });

  //when user disconnects
  socket.on('disconnect', () => {
                console.log('user disconnected');
                socket.emit('user-disconnected')
  //               getUserRooms(socket).forEach(room => {
  //                             socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
  //                             delete rooms[room].users[socket.id]
  //                           })
  });
});
// }
http.listen(3000, () => {
  console.log('listeninghttp on *:3000');
});

//Find the rooms where the current user is in
// function getUserRooms(socket) {
//               return Object.entries(rooms).reduce((names, [name, room]) => {
//                 if (room.users[socket.id] != null) names.push(name)
//                 return names
//               }, [])
//             }
          // } 

function newUser(userName){
  const user = {}
    user.id = uuidv4(),
    user.name = userName,
    user.status = 'online',
    user.typing = false,
    user.timeStamp = Date.now(),
    user.rooms = {}
  return user
}