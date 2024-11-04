// const express = require('express');
const WebSocket = require('ws');
// const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: port });

wss.on('connection', (connection) => {
    console.log('A client has connected.')
    connection.on('message', (msg) => {
        try {
            const parsedMessage = JSON.parse(msg); 
            console.log('Received message:', parsedMessage); 
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
})



