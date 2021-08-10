<template>
       <div id="side-bar" class="side-bar">
            <ul class="usersUl" id="usersL">
                <li class="usersLi" v-for="(user, index) in userList" :key="index">
                   <p> {{ user.name }} <br/>
                  <sub>{{ user.status}} at {{moment(user.timeStamp).format('HH:mm:ss')}} </sub></p>
              </li>
              </ul>


       </div>
       <div id="main" class="main">
        <form>
          <label for="chat">Message</label>
          <input id="userName" type="text" autocomplete="off" v-model="userName"/>
          <input id="chatMessage" type="text" autocomplete="off" v-model="chatMessage"/>
          <button v-on:click.prevent="submit(chatMessage, userName)">Send</button>
        </form>
         <ul id="messages">
          <li v-for="(message, index) in messages" :key="index">
            <!-- {{index }} index {{ message.message }} from {{message.user.name}} on {{moment(message.user.timeStamp).format('HH:mm:ss')}} -->
              <p> {{ message.message }} <br/>
              <sub>{{ message.user.name}} at {{moment(message.user.timeStamp).format('HH:mm:ss')}} </sub></p>
              <!-- <p v-if="index==messages.length-1"  id="indexLast">User name is: {{ userName }}</p> -->
          </li>
        </ul>
        <br />
        <p> room: {{ room?room:user.name }} </p>
  <!-- <p>Message is: {{ messages }}</p> -->
  <p id="indexs">User name is: {{ userName }}</p>
        </div>
        
        

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
let userN = '';
let room = ref('');
let messages = reactive([]);
let userList = reactive([]);
let user = reactive({name:'someName'+Math.floor(Math.random()*10000)})
let userName = user.name
let socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
                auth: {
                token: 'abc',
                name: userName?userName:room
                }
                
  });

socket.on('connection-succes', userFromServer =>{
    console.log('user from server: '+JSON.stringify(userFromServer))
    // userFromServer.name = userN!=''?userN:userFromServer.name
    // userList.indexOf(userFromServer.name) === -1 ?userList.push(userFromServer.name) :console.log(JSON.stringify(userFromServer)+' already in'+userList.length);
    // store.user.name= userFromServer});
    
    })
    socket.emit('new-user', user, room);
  // socket.emit('new-user', userName, 'start');
  //  socket.on('user-connected',  usr => {
  //   console.log('usr: '+usr)
  //   // store.user = usr});
  //  });
    
    socket.on('messages', mssages =>{
     console.log('messages received: '+mssages.result)

      messages.push(...mssages.result)
     nextTick(() =>{ document.getElementById('indexs').scrollIntoView({behavior:'smooth'})})  //  return messages
   })
     socket.on('chat-message', received => {
      console.log('received chatInput: '+JSON.stringify(received))
      // userList.indexOf(received.user.name) === -1 ?userList.push(received.user.name) :console.log(JSON.stringify(userList)+' already in'+userList.length);
      // console.log('userList: '+userList.length+' and content of list: '+JSON.stringify(userList))
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
     nextTick(() =>{ document.getElementById('indexs').scrollIntoView({behavior:'smooth'})})
      
     return messages
      })
  
export default {
  name:'App',
  store:{},
  socket:socket,
  user:user,
  userN:'',
  userList:userList,
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
              userList:userList,
              room:'',
              userName:userName,
              userN:userN,
              socket:{},
              message:{},
              chatMessage:'',
              messages:messages,
              }
  },
  methods: {
              submit (chatMessage,userName){ 
              console.log(chatMessage+' '+userName)
              socket.emit('send-chat-message',chatMessage, {name:userName})
              this.chatMessage = '';
              document.getElementById('chatMessage').focus()
              },
              unmounted(){
              socket.disconnect()
              }
},

}

</script>
<style>
      body { margin: 0rem; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
     .side-bar {width: 30%; height: 100%; position: fixed; background: rgba(155, 0, 255, 0.55); padding: 0rem 1rem; box-sizing: border-box; }
      .side-bar > ul.usersUl > { list-style-type: space-counter; margin: 0rem; padding: 0.25rem; }
      .side-bar > ul.usersUl > li.usersLi { background: #e333ef; }
      .main {width: 70%; float:right;}
      form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      form > label { border: 0; padding: 0 2rem;}
      input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 3rem; margin: 0.25rem; } 
      input:focus { outline: none; }
      form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

      ul { list-style-type: none; margin: 0; padding: 0; }
      ul > li { padding: 0.25rem 1rem; }
      ul > li:nth-child(odd) { background: #efefef; }
      /* ul > li:nth-last-child(1):focus { outline:none;} */
    </style>