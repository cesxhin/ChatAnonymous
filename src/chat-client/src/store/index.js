import { createStore } from 'vuex'
/*

clients:[
  {
    id:String,
    nickname:String
  }
]

chats:[
  idContact:{
    id:String from
    idContact:String to
    time:Date,
    body:String
  }
]
*/
export default createStore({
  state: {
    showState: false,
    id : null,
    nickname: null,
    idContactCurrent:null,
    chats:[],
    room:null
  },
  
  mutations: {
    DONE_REGISTRATION(state){
      state.showState = true
    },
    SET_ACCOUNT(state, data){
      state.id = data.id
      state.nickname = data.nickname
    },
    UPDATE_ROOM(state, room){
      state.room = room
    },
    PUT_CHAT_MESSAGES(state, data){
      var foundIdContact = false
      console.log('try search contact')
      if(state.chats.length > 0){
        for(var i=0; i<state.chats.length;i++)
        {
          if(state.chats[i].id === data.id){
            console.log('find!')
            state.chats[i].messages.push(data)
            foundIdContact = true
          }
        }
      }
      
      if(state.chats.length <= 0 || foundIdContact == false){
        console.log('create new contact for messages')
        var id = data.id
        state.chats.push({id, messages:[]})
        state.chats.map(item => {
          if(item.id === id)
          {
            item.messages.push(data)
            console.log('Ok! create it!')
          }
        })
      }
    },
    PUT_CHAT_MESSAGES_SELF(state, data){
      var foundIdContact = false
      console.log('try search contact')
      if(state.chats.length > 0){
        for(var i=0; i<state.chats.length;i++)
        {
          if(state.chats[i].id === data.idContact){
            console.log('find!')
            state.chats[i].messages.push(data)
            foundIdContact = true
          }
        }
      }
      
      if(state.chats.length <= 0 || foundIdContact == false){
        console.log('create new contact for messages')
        var idContact = data.idContact
        state.chats.push({id: idContact, messages:[]})
        state.chats.map(item => {
          if(item.id === idContact)
          {
            item.messages.push(data)
            console.log('Ok! create it!')
          }
        })
      }
    },
    CHANGE_CHAT(state, idContact)
    {
      state.idContactCurrent = idContact
    },
    DELETE_CONTACT_ROOM(state, idContact){
      if(state.idContactCurrent === idContact)
        state.idContactCurrent = null

      //delete room
      state.room.clients.find((client, index)=>{
        if(client != undefined && client.id === idContact){
          state.room.clients.splice(index, 1)
        }
      })

      //delete from chats
      var pos = 0
      state.chats.forEach(item => {
        if(item.id === idContact)
        {
            state.chats.splice(pos, 1); 
        }
        ++pos
      })
    }
  },
  actions: {
    doneRegistration(context){
      context.commit('DONE_REGISTRATION')
    },
    setAccount(context, data){
      context.commit('SET_ACCOUNT', data)
    },
    putChatMessages(context, data){
      context.commit('PUT_CHAT_MESSAGES', data)
    },
    changeChat(context, idContact){
      context.commit('CHANGE_CHAT', idContact)
    },
    putChatMessagesSelf(context, data){
      context.commit('PUT_CHAT_MESSAGES_SELF', data)
    },
    UpdateRoom(context, room){
      context.commit('UPDATE_ROOM', room)
    },
    deleteContactFromRoom(context, id){
      context.commit('DELETE_CONTACT_ROOM', id)
    }
  },
  modules: {
  },
  getters:{
    getShowState(state){
      return state.showState;
    },
    getID(state){
      return state.id;
    },
    getNickname(state){
      return state.nickname;
    },
    getClients(state){
      return state.room.clients;
    },
    getIdContactCurrent(state){
      return state.idContactCurrent;
    },
    getChatById(state){
      return state.chats.find(item => item.id === state.idContactCurrent)
    }
  }
})
