// const express = require('express');
const WebSocket = require('ws');


//firestore
const {getFormsData, getFormsDataWithId} = require('./formService');

// const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: port });




wss.on('connection', async (connection) => {
    console.log('A client has connected.')
    console.log(await getFormsDataWithId('9jqqgVqGd02su29BA6eb')) 
    
    connection.on('message', (msg) => {
        try {
            const parsedMessage = JSON.parse(msg); // {question1: {}}
            // We have the answer but we don't know admin answer ? 
            
            console.log('Received message:', parsedMessage); 
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
})



