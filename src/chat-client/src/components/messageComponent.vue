<template>
    <template v-if="id === idCurrent">
        <div class="container flex" style="justify-content: flex-end;">
            <div class="message right">
                {{message}}
            </div>
            <div class="message-time">
                {{time}}
            </div>
        </div>
    </template> 
    <template v-else>
        <div class="container flex" style="justify-content: flex-start;">
            <div class="message-time">
                {{time}}
            </div>
            <div class="message left">
                {{message}}
            </div>
        </div>
    </template>
</template>

<script>
    export default {
        props:{
            id:String,
            idContact:String,
            message:String,
            time:String,
            idCurrent:String
        }
    }
</script>
<style>
.flex{
    display: flex;
    flex-wrap: nowrap;
}
.message-time{
    font-family: Arial, Helvetica, sans-serif;
    font-size: small;
    padding: 10px 0px;
}
.message{
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    color: white;
    max-width: 500px;
    min-width: 10px;
    margin: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 10px;
    word-wrap: break-word;
}
.right{
    background-color: rgb(37, 150, 190);
    text-align: end;
}
.left{
    background-color: rgb(190, 77, 37);
}
</style>