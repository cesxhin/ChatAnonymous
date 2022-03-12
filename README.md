# Chat Anonymous 🕵️
Questo servizio ti offre di comunicare con le persone in modo anonimo e senza lasciare le traccie dei vostri messaggi.
Si possono partecipare al massimo 5 persone contemporaneamente per ogni stanza che viene generato in automatico, ogni persona può parlare con altri partecipanti presenti nella stessa stanza e c'è anche la possibilità di cambiare la stanza per fare altre nuove conoscenze.
Una volta che un partecipante cambia stanza o chiude il browser tutte le chat dei partecipanti verranno eliminati in automatico senza lasciare nessuna traccia.

## Struttura del progetto
Il progetto si suddivide in 3 progetti:
- 📄Web Client (vuejs)
- 🖥️Web Socket (hapi)
- 🧱Gateway Proxy (Nodejs)

## 📄Web Client
Questo progetto verrà utilizzato per gli utenti che vorranno usare la chat per divertirsi e conoscere con altre persone

## 🖥️Web Socket
Questo progetto verrà utilizzato per connettere e scambiare i messaggi tra gli utenti

## 🧱Gateway Proxy
Questo progetto permette di usare unico endpoint che verrà esposto pubblicamente per contattare sia web e web socket

## Installazione
Installare Nodejs e successivamente tutte le sue dipendenze per ogni progetto
```sh
cd name_project
npm install
```

## Come avviare i progetti?
🖥️Web Socket
```sh
cd chat-server
node main.js
```

🧱Gateway Proxy
```sh
cd gateway
node main.js
```

📄Web Client
```sh
cd chat-client
npm run serve
```