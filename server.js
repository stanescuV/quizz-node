// const express = require('express');
const {verifyAnswers} = require('./formsLogic');
const WebSocket = require('ws');


//firestore
const {getFormsData, getFormsDataWithId} = require('./formService');

// const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: port });


const allConnections = {adminConnections: [], clientConnections: []};


wss.on('connection', async (connection) => {
    console.log('A client has connected.');
    
    connection.on('message', async (msg) => {
        
        if(typeof msg === undefined){
            return console.log('message is undefined'); 
        }
    
        const userAnswer = JSON.parse(msg); // {question1: {}}
        // console.log(userAnswer);

        ///////////////----------- IF ADMIN -----------\\\\\\\\\\\\\\\\\\
        if(userAnswer.adminId){
            
            // console.log(adminConnection);
            allConnections.adminConnections.push(connection);
        
            return console.log(`Admin sent this : + `, userAnswer);
        }  

        ///////////////----------- IF USER -----------\\\\\\\\\\\\\\\\\\
        else{

            allConnections.clientConnections.push(connection);

            try {
                const idForm = userAnswer.id; 
                const hostAnswerForm = await getFormsDataWithId(idForm);
                // console.log(userAnswer, hostAnswerForm);
                
                const responseToAnswers = verifyAnswers(userAnswer, hostAnswerForm);
                return connection.send(JSON.stringify(responseToAnswers));
                
                
            } catch (error) {
                console.error('Error parsing message:', error);
            }
            
        }
    });
})



