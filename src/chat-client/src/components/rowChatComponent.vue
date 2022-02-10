<template>
    <template v-if="idContactCurrent === idContact">
        <a @click="useThisChat" class="list-group-item list-group-item-action m-1 active" id="list-settings-list" data-bs-toggle="list" role="tab" aria-controls="list-settings">{{nicknameContact}}</a>
    </template>
    <template v-else>
        <a @click="useThisChat" class="list-group-item list-group-item-action m-1" id="list-settings-list" data-bs-toggle="list" role="tab" aria-controls="list-settings">{{nicknameContact}}</a>
    </template>
</template>

<script>
    export default {
        props:{
            nicknameContact: String,
            idContact:String,
            idContactCurrent:String
        },
        methods:{
            useThisChat(){
                this.emitter.emit('change-chat', this.idContact)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>