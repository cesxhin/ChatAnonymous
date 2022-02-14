<template>
    <div class="form">
        <div>
            chat di {{idContact}}
        </div>
        <div class="messages">
            <template v-if="chat != null">
                <div style="flex-direction: column;">
                    <div v-for="message in chat.messages" :key="message.id">
                        <message :id="message.id" :idContact="message.idContact" :message="message.body" :time="message.time" :idCurrent="id"/>
                    </div>
                </div>
            </template>
        </div>
        <div class="d-flex">
            <input v-model="body" @keypress="keyHandler($event)" class="form-control me-2" type="text" placeholder="Text...">
            <button @click="sendMessage" class="btn btn-outline-success">Send</button>
      </div>
    </div>
</template>
<style>
.form{
    max-width: 100%;
    margin: 10px 10px;
}
.messages{
    overflow: auto;
    display: flex;
    flex-direction: column-reverse;
    bottom:35%;
    height: 300px;
    margin-bottom: 5px;
}
</style>
<script>
import messageComponent from "./messageComponent.vue"
    export default {
        props:{
            id:String,
            idContact:String,
            chat:Array
        },
        data(){
            return{
                body:""
            }
        },
        methods:{
            keyHandler(event){
                if(event.code === 'Enter')
                    this.sendMessage()
            },
            sendMessage(){
                //base structure data
                if(this.idContact == null)
                {
                    alert('Non hai selezionato nessun contatto!')
                    return
                }else if(this.body.length <= 0 || this.body.match(/^ *$/) !== null){
                    return
                }
                const data = {
                    id:this.id,
                    idContact:this.idContact,
                    time:new Date().toLocaleTimeString(),
                    body:this.body
                }
                this.emitter.emit('send-message', data)

                //reset text input
                this.body = ""
            },
        },
        components:{
            'message':messageComponent
        }
    }
</script>