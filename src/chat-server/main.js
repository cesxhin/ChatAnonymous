const Boom          = require("@hapi/boom")
const HAPI          = require("@hapi/hapi")
const WebSocket     = require('ws');
const uuid          = require('uuid');
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
            //registration
            if(dataJson.action === 'registration'){
                const client = {
                    id: clients.get(ws),
                    nickname: dataJson.nickname
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

                //send confirm registration
                ws.send(JSON.stringify({action: 'registration', id:clients.get(ws), nickname: dataJson.nickname}))
                
                //sent other contacts for room
                const room = rooms.find(element => element.id_room === id_room_client)
                room.clients.forEach(item =>{
                    const ws = [...clients].find(([key, val]) => val == item.id)[0]
                    const find = room.clients.find(element => element.id === item.id) || null
                    if(find != null)
                        ws.send(JSON.stringify({action: 'UpdateRoom', room}))
                })
            }else if(dataJson.action === 'send'){
                console.log('un messagio da inoltrare')
                console.log(dataJson)
                
                const wsContact = [...clients].find(([key, val]) => val == dataJson.data.idContact)[0]
                const data = dataJson.data
                wsContact.send(JSON.stringify({action:'receive', data}))
            }
        })

        ws.on("close", () => {
            var id = clients.get(ws)
            //find id room
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

            //get class room
            const room = rooms.find(element => element.id_room === id_room_client)
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
            //remove client
            clients.delete(ws);

            console.log(rooms)
            console.log(clients);
          });
    })
    /*  start the HAPI service  */
    //await server.start()
})().catch((err) => {
    console.log(`ERROR: ${err}`)
})