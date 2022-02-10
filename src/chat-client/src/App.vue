<template>
  <div class="container">
    <div class="background">
      <div class="title">
        <div class="text-center">
          <h1>Chat</h1>
        </div>
        <h3>your nickname: {{getNickname}}</h3>
        <h3>your id: {{getId}}</h3>
      </div>
      <template class="bar" v-if="showContacts == false">
        <input type="text" class="me-2" v-model="RegistrationNickname" placeholder="nickname...">
        <button @click="sendRegistration" class="btn btn-primary">Registration</button>
      </template>
      <template v-else-if="showContacts == true">
        <hr>
        <div class="row">
          <template v-if="getClients.length > 1">
            <div class="col-4">
              <div class="list-group" id="list-tab" role="tablist" v-for="chat in getClients" :key="chat.id">
                <template v-if="chat.id !== getId">
                  <rowChat :nicknameContact="chat.nickname" :idContact="chat.id" :idContactCurrent="getIdContactCurrent"/>
                </template>
              </div>
            </div>
            <div class="col-8">
              <chat :idContact="getIdContactCurrent" :chat="getChatById" :id="getId"/>
            </div>
          </template>
          <template v-else>
            <div class="container">
              Non c'è nessuno! Aspetta!
            </div>
          </template>
        </div>
      </template> 
    </div>
  </div>
</template>

<script>
//library
var WebSocket = require('websocket').w3cwebsocket;
//store
import VuexStore from './store'

//components
import rowChatComponents from './components/rowChatComponent.vue';
import chatComponents from './components/chatComponent.vue';

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
      }
    },
    created() {
        console.log("Starting connection to WebSocket Server");
        this.connection = new WebSocket("ws://localhost:12345/chat");
    },
    mounted(){
      //sockets
      this.connection.onopen = function () {
          console.log("Successfully connected to the echo WebSocket Server");
      };

      this.connection.onmessage = function (event) {
          console.log("Un messaggio arrivato: ");
          console.log(event.data)

          //convert string to object json
          var dataJson = JSON.parse(event.data)

          if(dataJson.action === 'registration'){
            //setup my account
            VuexStore.dispatch('setAccount', dataJson)

            //show contacts
            VuexStore.dispatch('doneRegistration')

          }else if(dataJson.action === 'newContact')
          {            
            //new contact
            VuexStore.dispatch('newContacts', dataJson.chatClients)
            console.log("new contacts!")

          }else if(dataJson.action === 'receive'){
            console.log('new message for me')
            VuexStore.dispatch('putChatMessages', dataJson.data)
          }else if(dataJson.action === 'deleteContact')
          {
            console.log('delete this id: '+dataJson.id)
            VuexStore.dispatch('deleteContact', dataJson.id)
          }
      };

      //eventBus
      this.emitter.on('change-chat', (id)=>{
          console.log('change-chat id:'+id)
          VuexStore.dispatch('changeChat', id);
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