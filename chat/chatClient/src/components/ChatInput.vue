<template>
 <div>efwef</div>
</template>
  
<script>
// import { Socket } from 'socket.io-client';
import SocketioService from '../../services/socketio.service';
import moment from 'moment';

// console.log('user from SocketioService: '+JSON.stringify(SocketioService.user))
export default {
  name: 'ChatInput',
  
  created() {
    this.moment = moment;
  },
  data()  {
    return { 
      chatMessage:'',
        room: Math.floor(Math.random()*1000),
        userName:'',
        // user: SocketioService.user,
        message:SocketioService.message,
        messages: []
      
    }
  },
  methods:{
    setup(){
    const message = SocketioService.socketCreated().socket.on('chat-message')
    console.log(message)
    if(message){
      this.messages.push(message)
    }
    return this.messages},
    // unmounted(){
    // SocketioService.disconnect()
    // },
    submit (chatMessage,user){ 
      this.user.name = user.name
      const received = SocketioService.sendMessage(chatMessage, this.user)
      console.log('received chatInput: '+JSON.stringify(received))
      console.log(user)
      this.chatMessage = '';
      document.getElementById('chatMessage').focus()
      }
  }
}
</script>
