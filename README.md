# Chat Anonymous
In default possono partecipare al massimo 5 persone per ogni stanza che viene generata in automatico, si possono parlare con 5 persone contemporanamente per conoscere e fare le nuove amicizie senza lasciare la traccia dei messaggi scambiati una volta chiuso la pagina.

## Struttura del progetto
Il progetto si suddivide in 3 progetti:
- 📄Web (vuejs)
- 🖥️Web Socket (hapi)
- 🧱Gateway Proxy (Nodejs)

## 📄Web
Questo progetto verrà utilizzato per gli utenti normali per usare le chat

## 🖥️Web Socket
Questo progetto verrà utilizzato per scambiare i messaggi tra gli utenti e gestione utenti

## 🧱Gateway Proxy
Questo progetto permette di usare unico endpoint che verrà esposto pubblicamente per contattare sia web e web socket

## Installation
Installare Nodejs e npm poi installare tutte le sue dipendenze per ogni progetto
```sh
cd name_project
npm install
```