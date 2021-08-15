import { io } from 'socket.io-client';

class SocketioService {
  
  socket;
  room = Math.floor(Math.random()*1000);
  user = { name: 'userName'+this.room};
  rooms = {  };
  chatMessage;
  message;
  
  // rooms[room] = { users: {} }
  // rooms[room].users[socket.id] = name
  socketCreated(){
    // process.env.VUE_APP_SOCKET_ENDPOINT
  // this.socket = io( process.env.VUE_APP_SOCKET_ENDPOINT);
  this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
                auth: {
                token: 'abc',
                name: this.user.name
                }
  });
  this.socket.on('connection-success', userFromServer =>{
    this.user = userFromServer
  return this.user});
  // this.user['name'] = this.userName
  // console.log('about to emit new-user: '+JSON.stringify(this.user))
  this.socket.emit('new-user', this.user);
  this. socket.on('user-connected',  user => {
    this.user = user
    // console.log('userName: '+this.user.name+' '+JSON.stringify(this.user))
    return this.user
                  })
  this.socket.on('chat-message', (received) => {
    // console.log('SocketioService.on chat-message received:'+received.message)
    // received.user = received.user
    // this.user.name = received.user.name
    // this.user.timeStamp = Date.now()
  // console.log('message from user: '+received.message+' from: '+this.user.name+' at: '+JSON.stringify(this.user))
  // return {message: messageChat.message, user:this.user}
  // return temp
  return received
})                               
  // this.socket.on('chat-message',(chatMessage) => {
  //  this.chatMessage = chatMessage
  //  return this.chatMessage 
  // })
  }
  
  disconnect() {
                // if (socket) {
                              this.socket.disconnect();
                // }
                }

  sendMessage(chatMessage, user){
    // this.user.name = user.name
    // console.log('chatMessage lib: '+chatMessage, user)
    this.user.name = user.name
    this.socket.emit('send-chat-message', chatMessage, this.user);
    return {message:chatMessage, user:this.user}
    // console.log('user from send-chat-message: '+JSON.stringify(user))
  
// return {message: this.messageChat.message, user:this.user}
  }
    
// this.socket.on('chat-message', (data) => {
//   //               //               console.log('from server: '+data)
//   //               // })
// }
  // this.receiveMessage(chatMessage)

// receiveMessage(chatMessage){
//   console.log('mounted ready to receive message'+chatMessage)
// }
//   socket;
//   room = Math.floor(Math.random()*1000);
//   name = 'userName'+this.room;
  

//   constructor() {}

//   setupSocketConnection() {
//     this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    
//               this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
//                             auth: {
//                             token: 'abc'
//                             }
//               });
                       
              
              
//               this.socket.emit('new-user', this.room, this.name);

//               this.socket.on('user-connected',  name => {
//                             console.log(name)
//                             })

//               // this.socket.on('chat-message', (data) => {
//               //               console.log('from server: '+data)
//               // })

//               // this.socket.emit('send-chat-message', this.room, this.message);

// }



//   disconnect() {
//               if (this.socket) {
//                   this.socket.disconnect();
//               }
//           }

}



export default new SocketioService();