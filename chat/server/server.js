const { throws } = require('assert');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser= require('body-parser')
const fetch = require("node-fetch");
// app.use(cors({
//   origin: ['http://localhost:8080',
//   'http://localhost:3000']
// }));
const app2 = express();
app2.use(cors({
  origin: ['http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:2700',
  'http://localhost:3010']
}));
app2.get('/room/', (req, res) => {
  console.log('req: '+req+' res: '+res)
  const payload = { room:defRoom}
  res.type('json')
  res.send(JSON.stringify(payload));
});
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
              cors: {
                            origin: ['http://localhost:8080',
                            'http://localhost:3000',
                            'http://localhost:2700',
                            'http://localhost:3010']
              }
});

let history = {}
let rooms = {  }
let name = { }
let userName = ''
let messages = []
let defRoom = 'start'
app.use(bodyParser.json())
app.use(express.json()) // for parsing application/json
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
  // socket.join(defRoom)
  let token = socket.handshake.auth.token;
  if(token){console.log('handshake succes '+token.toString())}
  // console.log(socket.handshake.auth.name)
  let user = newUser(socket.handshake.auth.name)
  // console.log('userFromServer: '+JSON.stringify(user))
  // socket.to(defRoom).emit('connection-success', user)
  socket.emit('connection-succes', user)
  // io.emit('connection-succes', user)
  
  //user joins a room
  socket.on('new-user', (userName, room) => {
                console.log('new-user event on server: '+userName)
              user.name = userName
              user.timeStamp = Date.now()

              getData('http://localhost:2700/messages/')
                .then(data => {
                  // console.log('obj keys data:'+Object.keys(data))
                  // console.log(JSON.stringify(data))
                  // console.log(data); // JSON data parsed by `data.json()` call
                  // console.log(room)
                  console.log(data.result)
                  // messages = data.result
                  // socket.emit('messages', data)
                  return data
                })
                // .finally((data) => socket.emit('messages', data));
                
              //  console.log(user.id)
                // socket.join(room)
                // rooms[room] = { users: {} }
                // rooms[room].users[socket.id] = name
                // socket.to(room).emit('user-connected', user)
                // socket.to(room).broadcast.emit('user-connected', name)
                // socket.broadcast.emit('user-connected',name)
                // if(room){console.log('rooms'+rooms[0].toString())}
                // return rooms
                // console.log('user object: '+Object.keys(user))
                return user
              })
              
  //message that a user has sent
  socket.on('send-chat-message', (message, usr) => {
                // if(message){
                user.timeStamp = Date.now()
                user.name = usr.name
                user.rooms = usr.rooms
                // defRoom = room
                console.log('message received on server: '+message+'from: '+user.name+' '+Object.keys(user))
                // socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
                // socket.emit('chat-message',{message: message, user: user})
                
                const received = {message: message, user: user}
                console.log('received.message: '+received.message)
                postData('http://localhost:2700/messages/', received)
                .then(data => {
                  // console.log(received)
                  console.log(data); // JSON data parsed by `data.json()` call
                });
                io.emit('chat-message', received)
                socket.emit('chat-message',{message:'received your message',user:received.user})
                // }
                return user
              });

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Example GET method implementation:
async function getData(url = '') {
  // Default options are marked with *
  const response = await fetch(url)
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    // console.log(type(data));
    
    messages = JSON.parse(data)
    socket.emit('messages', messages)
    // console.log(messages.result)
    return messages
  });
  // console.log(r)
// console.log(response.statusText)
// console.log(response.body)

// const output = {}

// if(response.body.json()){
  // response = response.body.json()
// }
return messages
  // return response.body.json(); // parses JSON response into native JavaScript objects
}



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
app2.listen(3010, () => {
  console.log('listening for api calls on *:3010')
})

//Find the rooms where the current user is in
// function getUserRooms(socket) {
//               return Object.entries(rooms).reduce((names, [name, room]) => {
//                 if (room.users[socket.id] != null) names.push(name)
//                 return names
//               }, [])
//             }
          // } 

function newUser(userName){
  let  user = {
    id: uuidv4(),
    name: userName,
    status: 'online',
    typing: false,
    timeStamp: Date.now(),
    rooms: {}
  }
    // console.log(Object.keys(user))
  return user
}

const TYPES = {
  'undefined'        : 'undefined',
  'number'           : 'number',
  'boolean'          : 'boolean',
  'string'           : 'string',
  '[object Function]': 'function',
  '[object RegExp]'  : 'regexp',
  '[object Array]'   : 'array',
  '[object Date]'    : 'date',
  '[object Error]'   : 'error'
},
TOSTRING = Object.prototype.toString;

function type(o) {
  return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};