const Boom          = require("@hapi/boom")
const HAPI          = require("@hapi/hapi")
const WebSocket     = require('ws');
const uuid          = require('uuid');
;(async () => {
    /*  create new HAPI service  */
    //const server = new HAPI.Server({ address: "localhost", port: 12345 })

    //socket
    const wss = new WebSocket.Server({
        port: 12345,
        host: "localhost",
        path: "/chat"
    });
    const clients = new Map();

    //id_chats
    const chatClients = []

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
                chatClients.push(client)
                ws.send(JSON.stringify({action: 'registration', id:clients.get(ws), nickname: dataJson.nickname}))
                
                //sent other contacts
                chatClients.forEach(item => {
                    const ws = [...clients].find(([key, val]) => val == item.id)[0]
                    ws.send(JSON.stringify({action: 'newContact', chatClients}))
                });
            }else if(dataJson.action === 'send'){
                console.log('un messagio da inoltrare')
                console.log(dataJson)
                
                const wsContact = [...clients].find(([key, val]) => val == dataJson.data.idContact)[0]
                const data = dataJson.data
                wsContact.send(JSON.stringify({action:'receive', data}))
            }
        })

        ws.on("close", () => {
            var pos = 0

            chatClients.forEach(item => {
                if(item.id === clients.get(ws))
                {
                    chatClients.splice(pos, 1); 
                }
                ++pos
            })
            var id = clients.get(ws)

            chatClients.forEach(item => {
                const ws = [...clients].find(([key, val]) => val == item.id)[0]
                ws.send(JSON.stringify({action: 'deleteContact', id}))
            });

            clients.delete(ws);
          });
    })
    /*  start the HAPI service  */
    //await server.start()
})().catch((err) => {
    console.log(`ERROR: ${err}`)
})