const Boom          = require("@hapi/boom")
const HAPI          = require("@hapi/hapi")
const WebSocket     = require('ws');
const uuid          = require('uuid');
const schedule      = require('node-schedule');

require('dotenv').config();
;(async () => {
    /*  create new HAPI service  */
    //const server = new HAPI.Server({ address: "localhost", port: 12345 })
    //socket
    const wss = new WebSocket.Server({
        port: process.env.PORT,
        host: process.env.HOST,
        path: process.env.PATH_URL
    });
    console.log("Settings:")
    console.log("Host: "+wss.options.host);
    console.log("Port: "+wss.options.port);
    console.log("Path: "+wss.options.path);

    //variables global
    const clients = new Map();

    //rooms
    const rooms = []
    /*
    {
        id_room:'balbalblabla',
        clients:[
            {
                id:'81298dj19jd1',
                nickname:'pippo'
            },
            {
                ...
            }
        ]
    }
    */
    const MAX_NUMBER_CLIETNS_ROOM = process.env.MAX_NUM
    wss.on('connection', (ws) =>{
        const id = uuid.v4();
        clients.set(ws, id)
        //console.log(clients)

        ws.on('message', (message)=>{
            var dataJson = JSON.parse(message)
            if(dataJson.action === 'pong'){
                //nothing
            }else if(dataJson.action === 'registration'){//registration
                var id_room_client = insertIntoRoom(ws, dataJson.nickname)

                //send confirm registration
                ws.send(JSON.stringify({action: 'registration', id:clients.get(ws), nickname: dataJson.nickname}))
                alertNewMember(id_room_client)

            }else if(dataJson.action === 'send'){
                console.log('un messagio da inoltrare')
                console.log(dataJson)
                
                const wsContact = [...clients].find(([key, val]) => val == dataJson.data.idContact)[0]
                const data = dataJson.data
                wsContact.send(JSON.stringify({action:'receive', data}))
            }else if(dataJson.action === 'changeRoom'){
                var id = clients.get(ws)

                //find id room
                var id_room_client = getIdRoomByIdClient(id)
                removeClientIntoRoom(id_room_client, id)

                var id_room_client = insertIntoRoom(ws, dataJson.nickname, id_room_client)
                alertNewMember(id_room_client)
            }
        })

        ws.on("close", () => {
            var id = clients.get(ws)

            //find id room
            var id_room_client = getIdRoomByIdClient(id)
            removeClientIntoRoom(id_room_client, id)

            //remove client
            clients.delete(ws);

            console.log(rooms)
            console.log(clients);
        });
    })

    //methods
    function getIdRoomByIdClient(id){
        var id_room_client = null
        for(var i=0; i<rooms.length; i++)
        {
            const find = rooms[i].clients.find(element => element.id === id) || null
            if(find != null)
            {
                id_room_client=rooms[i].id_room
                break
            }
        }
        return id_room_client;
    }

    function removeClientIntoRoom(idRoom, id)
    {
        //if this user not exist in rooms
        if(idRoom != undefined)
        {
            //get class room            
            const room = rooms.find(element => element.id_room === idRoom)

            room.clients.forEach(item =>{
                const ws = [...clients].find(([key, val]) => val == item.id)[0]
                const find = room.clients.find(element => element.id !== id) || null

                //send clients that one client is closed
                if(find != null)
                    ws.send(JSON.stringify({action: 'deleteContactFromRoom', id}))
            })

            //delete client
            rooms.forEach((room )=>{
                room.clients.find((client, index)=>{
                    if(client != undefined && client.id === id)
                    {
                        room.clients.splice(index, 1);
                    }
                })
            })

            //delete room if aren't contacts
            for(var i=0; i<rooms.length; i++)
            {
                if(rooms[i].clients.length == 0){
                    rooms.slice(i, 1)
                }
            }
        }
    }

    function insertIntoRoom(ws, nickname){
        const client = {
            id: clients.get(ws),
            nickname: nickname
        }
        
        //room
        var insert_done = false
        var id_room_client = null;
        do
        {

            //try insert
            for(var i=0; i<rooms.length; i++)
            {
                if(rooms[i].clients.length < MAX_NUMBER_CLIETNS_ROOM)
                {
                    id_room_client = rooms[i].id_room
                    rooms[i].clients.push(client)
                    insert_done = true
                    break
                }
            }

            //check
            if(rooms.length <= 0 || insert_done == false)
            {
                id_room_client = uuid.v4()
                rooms.push({
                    id_room:id_room_client,
                    clients:[]
                })
            }
        }while(insert_done == false)
        return id_room_client
    }

    function insertIntoRoom(ws, nickname, ignoreIdRoom){
        const client = {
            id: clients.get(ws),
            nickname: nickname
        }
        
        //room
        var insert_done = false
        var id_room_client = null;
        do
        {

            //try insert
            for(var i=0; i<rooms.length; i++)
            {
                if(rooms[i].clients.length < MAX_NUMBER_CLIETNS_ROOM && rooms[i].id_room != ignoreIdRoom)
                {
                    id_room_client = rooms[i].id_room
                    rooms[i].clients.push(client)
                    insert_done = true
                    break
                }
            }

            //check
            if(rooms.length <= 0 || insert_done == false)
            {
                id_room_client = uuid.v4()
                rooms.push({
                    id_room:id_room_client,
                    clients:[]
                })
            }
        }while(insert_done == false)
        return id_room_client
    }
    
    function alertNewMember(id_room_client){
        //sent other contacts for room
        const room = rooms.find(element => element.id_room === id_room_client)
        room.clients.forEach(item =>{
            const ws = [...clients].find(([key, val]) => val == item.id)[0]
            const find = room.clients.find(element => element.id === item.id) || null
            if(find != null)
                ws.send(JSON.stringify({action: 'UpdateRoom', room}))
        })
    }

    /*  start the HAPI service  */
    //await server.start()

    //schedule
    const job = schedule.scheduleJob('*/5 * * * *', function(){
        clients.forEach(client_id => {
            const ws = [...clients].find(([key, val]) => val == client_id)[0]
            ws.send(JSON.stringify({action:"ping"}))
        });
    });
})().catch((err) => {
    console.log(`ERROR: ${err}`)
})