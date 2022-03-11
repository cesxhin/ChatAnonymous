<template>
  <div>
    <div class="background">
      <div class="title">
        <h3 style="word-wrap: break-word;">🧍 {{getNickname}}</h3>
        <hr>
        <h3>🗝️ {{getId}}</h3>
      </div>
      <template class="bar" v-if="showContacts == false">
        <div class="registration">
          <div>
            <h2>Chat Anonymous</h2>
            <h3>Perchè è diverso dagli altri?</h3>
            <p>
              Puoi chattare al massimo 5 persone contemporanamente, una volta che sei uscito
              oppure la persona con cui stai scrivendo è uscita, la chat verrà cancellata senza lasciare
              nessuna traccia
            </p>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" v-model="RegistrationNickname" placeholder="Username...">
            <button @click="sendRegistration"  class="btn btn-outline-primary" type="button" id="button-addon2">Registration</button>
          </div>
        </div>
      </template>
      <template v-else-if="showContacts == true">
        <hr>
        <div class="flex">
          <template v-if="getClients.length > 1">
            <div class="list-contacts">
              <button @click="changeRoom()" class="btn btn-danger">Change Room</button>
              <div class="list-group" id="list-tab" role="tablist" v-for="chat in getClients" :key="chat.id">
                <template v-if="chat.id !== getId">
                  <rowChat :notread="getNotRead(chat.id)" :nicknameContact="chat.nickname" :idContact="chat.id" :idContactCurrent="getIdContactCurrent"/>
                </template>
              </div>
            </div>
            <div class="chat-contact">
              <chat :idContact="getIdContactCurrent" :chat="getChatById" :id="getId"/>
            </div>
          </template>
          <template v-else>
            <div class="container text-center">
              <h4>Sei da solo...aspetta qualcuno che si unisca con te!</h4>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.flex{
  display: flex;
  flex-wrap: wrap;
}
.list-contacts{
  width: 30%;
  min-width: 100px;
}

.chat-contact{
  width: 70%;
  min-width: 300px;
}

.registration{
  width: 400px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  background-color: rgb(212, 212, 212);
  border-radius: 10px;
  text-align: center;
}
</style>

<script>
//library
var WebSocket = require('websocket').w3cwebsocket;
//store
import VuexStore from './store'

//components
import rowChatComponents from './components/rowChatComponent.vue';
import chatComponents from './components/chatComponent.vue';
import console from "./utilities/logger"

export default {
    name: "App",
    data() {
        return {
          //connection socket
          connection: null,

          //only during registration used this
          RegistrationNickname:""
        };
    },
    methods: {
      //send request registraion to WebSocketServer
      sendRegistration() {
          var data = {action: 'registration', nickname: this.RegistrationNickname}
          this.connection.send(JSON.stringify(data));
          console.log('Send request registraion!')
      },
      changeRoom(){
        var data = {action: 'changeRoom', nickname: this.RegistrationNickname}
        console.log(data);
        this.connection.send(JSON.stringify(data))
      }
    },
    created() {
        console.log("Starting connection to WebSocket Server");
        this.connection = new WebSocket(process.env.VUE_APP_IP_SOCKET);
    },
    mounted(){
      //sockets
      this.connection.onopen = function () {
          console.log("Successfully connected to the echo WebSocket Server");
      };
      
      const emitter = this.emitter
      this.connection.onmessage = function(event){
        emitter.emit('socket-message', event);
      }
      
      this.emitter.on('socket-message', (event)=>{
          console.log("Un messaggio arrivato: ");
          console.log(event.data)

          //convert string to object json
          var dataJson = JSON.parse(event.data)

          if(dataJson.action === 'registration'){
            //setup my account
            VuexStore.dispatch('setAccount', dataJson)

            //show contacts
            VuexStore.dispatch('doneRegistration')

          }else if(dataJson.action === 'receive'){
            console.log('new message for me')
            VuexStore.dispatch('putChatMessages', dataJson.data)
          }else if(dataJson.action === 'UpdateRoom'){
            console.log(dataJson.room);
            VuexStore.dispatch('UpdateRoom', dataJson.room)
          }else if(dataJson.action === 'deleteContactFromRoom'){
            console.log(dataJson);
            VuexStore.dispatch('deleteContactFromRoom', dataJson.id)
          }else if(dataJson.action === 'ping'){
            console.log('ping pong');
            this.connection.send(JSON.stringify({action:"pong"}))
          }
      });

      //eventBus
      this.emitter.on('change-chat', (id)=>{
          console.log('change-chat id:'+id)
          VuexStore.dispatch('changeChat', id);
      });
      
      this.emitter.on('reset-notread', (id)=>{
          console.log('reset-notread id:'+id)
          VuexStore.dispatch('resetNotRead', id);
      });

      this.emitter.on('send-message', (data)=>{
          console.log('send message')
          console.log(data)

          //send to contact
          this.connection.send(JSON.stringify({action:'send', data}))

          //send to self
          VuexStore.dispatch('putChatMessagesSelf', data)
      });
    },
    computed:{
      //store
      //show contacts and chat
      showContacts () {
        return VuexStore.getters.getShowState
      },

      //get id current account
      getId(){
        return VuexStore.getters.getID
      },

      //get list clients
      getClients(){
        return VuexStore.getters.getClients
      },

      //get current select contact
      getIdContactCurrent(){
        return VuexStore.getters.getIdContactCurrent
      },

      //get nickname
      getNickname(){
        return VuexStore.getters.getNickname
      },

      //get chat with inside messages by selected contact
      getChatById(){
        return VuexStore.getters.getChatById
      },

      //get number not read messagges
      getNotRead(){
        return id => {
          var temp = VuexStore.getters.getNotRead
          return temp.get(id)
        }
      }
    },
    /* watch:{
      showChats(newState){
        console.log("new state: "+newState)
      },
      getChats(newChats){
        console.log("new chats: "+newChats)
      }
    }, */
    components:{
      'rowChat':rowChatComponents,
      'chat':chatComponents
    }
}
</script>