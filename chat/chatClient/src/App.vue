<template>
       
        <form>
          <label for="chat">Message</label>
          <!-- <input id="userName" type="text" autocomplete="off" v-model="userName"/> -->
          <input id="chatMessage" type="text" autocomplete="off" v-model="chatMessage"/>
          <button v-on:click.prevent="submit(chatMessage, userName)">Send</button>
        </form>
         <ul id="messages">
          <li v-for="(message, index) in messages" :key="index">
            <!-- {{index }} index {{ message.message }} from {{message.user.name}} on {{moment(message.user.timeStamp).format('HH:mm:ss')}} -->
              <p> {{ message.message }} <br/>
              <sub>{{ message.user.name}} at {{moment(message.user.timeStamp).format('HH:mm:ss')}} </sub></p>
              <p v-if="index==messages.length-1"  id="indexLast">User name is: {{ userName }}</p>
          </li>
        </ul>
        <br />
<p> room: {{ room }} </p>
  <!-- <p>Message is: {{ messages }}</p> -->
  <p id="indexs">User name is: {{ userName }}</p>
<br />
  <!-- <p>Store: {{ JSON.stringify(store) }}</p> -->
 
</template>

<script>
import { reactive, ref, nextTick } from 'vue';
// import ChatInput from './components/ChatInput.vue';
// import AppBar from './components/AppBar.vue'
// import Chats from './components/Chats.vue'
import moment from 'moment';
import { io } from 'socket.io-client';

let room = ref('');
let messages = reactive([]);
let user = {name:'someName'+Math.random()*1000}
let userName = user.name
let socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
                auth: {
                token: 'abc',
                name: 'start'
                }
                
  });


  socket.emit('new-user', userName, 'start');
   socket.on('user-connected',  usr => {
    console.log('usr: '+usr)
    // store.user = usr});
   });
    socket.on('connection-success', userFromServer =>{
    console.log('user from server: '+JSON.stringify(userFromServer))
    // store.user.name= userFromServer});
    socket.emit('new-user', user);
    })
    socket.on('messages', mssages =>{
     console.log('messages received: '+mssages.result.length)
    //  let i = 0
    // const el = document.getElementById('indexs');
      messages.push(...mssages.result)
     nextTick(() =>{ document.getElementById('indexs').scrollIntoView({behavior:'smooth'})})
      // document.getElementById('indexs').scrollIntoView({behavior:'smooth'})
   })
     socket.on('chat-message', received => {
      console.log('received chatInput: '+JSON.stringify(received))
    //  let messages = []
    console.log('received.user.name: '+received.user.name+ ' userName: '+userName)
    if(received.user.name==userName){
      received.user.name='you'
    }
    if(received.message=='received your message'){
      return
    }
     messages.push(received)
     console.log(messages.length)
     
    const el = document.getElementById('indexs');
      if (el) {
        el.scrollIntoView({behavior: 'smooth'});
        el.scrollIntoView({behavior: 'smooth'});
      }
      
     return messages
     
      })
  
export default {
  name:'App',
  store:{},
  socket:socket,
  user:user,
  messages:messages,
  room:'',
  created: function () {
    this.moment = moment;
    fetch("http://localhost:3010/room/")
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    console.log(data);
    room = data
    console.log(room)
    return room.value
  });
  },
  data() {
    return{
    store:{},
    user:user,
    room:'',
    userName:userName,
    socket:{},
    message:{},
    chatMessage:'',
    messages:messages,
  }},
  methods: {
   
    submit (chatMessage,userName){ 
   console.log(chatMessage+' '+userName)
   socket.emit('send-chat-message',chatMessage, {name:userName})
      // user.name = user
      
       this.chatMessage = '';
      document.getElementById('chatMessage').focus()
  },
  //  
  // document.addEventListener("DOMContentLoaded", function(){
  //  console.log('DOMContentLoaded')
      // document.getElementById('indexs').scrollIntoView({behavior:'smooth'})
      // })
//   document.getElementById('chatMessage').focus()
//  const el = document.getElementById('indexs');
//       if (el) {
//         el.scrollIntoView({behavior: 'smooth'});
//         el.scrollIntoView({behavior: 'smooth'});
//       }
     
// },
unmounted(){
socket.disconnect()
},
}
}

</script>
<style>
      body { margin: 0rem; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

      form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 3rem; margin: 0.25rem; } 
      input:focus { outline: none; }
      form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

      ul { list-style-type: none; margin: 0; padding: 0; }
      ul > li { padding: 0.25rem 1rem; }
      ul > li:nth-child(odd) { background: #efefef; }
      /* ul > li:nth-last-child(1):focus { outline:none;} */
    </style>