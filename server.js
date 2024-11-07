// const express = require('express');
const {verifyAnswers} = require('./formsLogic');
const WebSocket = require('ws');


//firestore
const {getFormsData, getFormsDataWithId} = require('./formService');

// const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: port });




wss.on('connection', async (connection) => {
    console.log('A client has connected.');
    
    connection.on('message', async (msg) => {
        try {
            const userAnswer = JSON.parse(msg); // {question1: {}}
            const id = userAnswer.id; 
            const hostAnswerForm = await getFormsDataWithId(id);
            console.log(userAnswer, hostAnswerForm)
            verifyAnswers(userAnswer, hostAnswerForm);

            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
})



