// const express = require('express');
const {verifyAnswers} = require('./formsLogic');
const WebSocket = require('ws');


//firestore
const {getFormsData, isCookieExist, insertIntoCookies, getFormsDataWithId, insertNewAnswersIntoSessionTable, insertIntoErrors, getSessionDataWithId} = require('./formService');

// const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: port });


const allConnections = {adminConnections: [], clientConnections: []};


wss.on('connection', async (connection) => {
    
    connection.on('message', async (msg) => {
        
        if(typeof msg === undefined){
            return console.log('message is undefined'); 
        }
    
        const userAnswer = JSON.parse(msg); // {question1: {}}
        // console.log(userAnswer);

        ///////////////----------- IF ADMIN -----------\\\\\\\\\\\\\\\\\\
        if(userAnswer.adminId){
            console.log("An admin has connected");
            
            //add adminConnection
            connection.sessionId = userAnswer.adminSession;
            allConnections.adminConnections.push(connection);

            const sessionId = userAnswer.adminSession;

            const session = await getSessionDataWithId(sessionId);
            const studentAnswers = session.answers; 

            // console.log(studentAnswers);

            connection.send(JSON.stringify(studentAnswers));
        
            return console.log(`Admin sent this : + `, userAnswer);
        }  

        ///////////////----------- IF USER -----------\\\\\\\\\\\\\\\\\\
        else{

            console.log("A client has connected")
            console.log(userAnswer)
            connection.sessionId = userAnswer.id;
            allConnections.clientConnections.push(connection);
            
            try{
                
                const cookieString = Object.keys(userAnswer.formDbCookie)[0];
                console.log(cookieString);

                if(!(await isCookieExist(cookieString))){
                    insertIntoCookies(userAnswer.formDbCookie)
                
                    //TODO: make connection {}
                    const idSession = userAnswer.id; 
                    const session = await getSessionDataWithId(idSession);
                    const hostAnswerForm = await getFormsDataWithId(session.idForm);
                    
                    const responseToAnswers = verifyAnswers(userAnswer, hostAnswerForm);
                    
                    insertNewAnswersIntoSessionTable(idSession, responseToAnswers)
                    return connection.send(JSON.stringify(responseToAnswers));
                };  

                return connection.send('You already answered these questions')
            
            } catch (err){
                
                //inserts error log into db on firestore
                insertIntoErrors(err);
                return connection.send('Error while sending the answers');
            }
            
        }
    });
})



