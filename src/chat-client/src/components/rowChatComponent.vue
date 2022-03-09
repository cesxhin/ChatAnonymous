<template>
    <template v-if="idContactCurrent === idContact">
        {{resetNumberNotRead()}}
        <a @click="useThisChat" class="list-group-item list-group-item-action m-1 active" id="list-settings-list" data-bs-toggle="list" role="tab" aria-controls="list-settings" style="word-wrap: break-word;">
            {{nicknameContact}}
        </a>
    </template>
    <template v-else>
        <a @click="useThisChat" class="list-group-item list-group-item-action m-1 d-flex justify-content-between align-items-start" id="list-settings-list" data-bs-toggle="list" role="tab" aria-controls="list-settings" style="word-wrap: break-word;">
            {{nicknameContact}}
            <template v-if="notread > 0">
                <span class="badge bg-danger rounded-pill">{{notread}}</span>
            </template>
        </a>
    </template>
</template>

<script>
    export default {
        props:{
            nicknameContact: String,
            idContact:String,
            idContactCurrent:String,
            notread:Array
        },
        methods:{
            useThisChat(){
                this.emitter.emit('change-chat', this.idContact)
            },
            resetNumberNotRead(){
                this.emitter.emit('reset-notread', this.idContact)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>