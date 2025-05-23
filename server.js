// const express = require('express');
const { verifyAnswers } = require('./formsLogic');


const args = process.argv.slice(2);
console.log(args);


//HTTP Server OPEN AI 
const { startServer } = require('./openAiCall');

//WS
const WebSocket = require('ws');

//firestore
const {
  insertIntoCookies,
  getFormsDataWithId,
  insertNewAnswersIntoSessionTable,
  insertIntoErrors,
  getSessionDataWithId,
  isCookieExist,
  getCookieDataFromSessionWithIdSession,
  vedemDupa
} = require('./formService');

startServer();
// const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: port });

const allConnections = { adminConnections: {}, clientConnections: {} };

//TODO: Create folder and move this function somwhere else idk

wss.on('connection', async (connection) => {
  connection.on('message', async (msg) => {
    if (typeof msg === undefined) {
      return console.log('message is undefined');
    }

    let message;

    try {
      message = JSON.parse(msg); // {question1: {}}
    } catch {
      console.log('Message is not JSON format');
      return;
    }
    //not safe if msg is json
    console.log({ message });

    let sessionId;

    switch (message.type) {
      ///////////////----------- IF ADMIN -----------\\\\\\\\\\\\\\\\\\
      case 'AdminMessage':
        console.log('An admin has connected');

        //TODO: CHANGE IN O(1) because now it s O(N)
        sessionId = message.adminSession;

        if (typeof sessionId !== 'string') {
          console.log('Session Id is not a string !! ');
          return;
        }

        connection.sessionId = sessionId;
        allConnections.adminConnections[sessionId] = connection;

        const session = await getSessionDataWithId(sessionId);
        const studentAnswers = session.answers;

        // console.log(studentAnswers);

        connection.send(JSON.stringify(studentAnswers));

        return console.log(`Admin sent this : + `, message);
        break;

      ///////////////----------- IF USER -----------\\\\\\\\\\\\\\\\\\
      case 'UserAnswer':
        console.log('A client has connected');
        console.log(message);

        sessionId = message.idSession;

        if (typeof sessionId !== 'string') {
          console.log('Session Id is not a string !! ');
          return;
        }

        connection.sessionId = sessionId;
        allConnections.clientConnections[sessionId] = connection;

        try {
          insertIntoCookies(message.formDbCookie);
          const cookieId = message.cookieId;

          const session = await getSessionDataWithId(sessionId);
          const hostAnswerForm = await getFormsDataWithId(session.idForm);

          const responseToAnswers = verifyAnswers(message, hostAnswerForm);

          await insertNewAnswersIntoSessionTable(
            sessionId,
            responseToAnswers.formReadyToSend,
            cookieId
          );

          //send the correct number of answers to the user
          console.log(
            'This is Correct answer number',
            responseToAnswers.correctAnswersNumber
          );

          connection.send(
            JSON.stringify({
              type: 'CorrecAnswersQuestionCount',
              correctAnswersNumber: responseToAnswers.correctAnswersNumber,
              allQuestions: responseToAnswers.allQuestionsCount
            })
          );
          
          // tell host page data has been modified
          const hostPageDataConnectionAdmin =
            allConnections?.adminConnections?.[sessionId];

          if (!hostPageDataConnectionAdmin) {
            console.log('Connection admin was not found for this session id');
            return;
          }

          hostPageDataConnectionAdmin.send(JSON.stringify({ refresh: true }));
        } catch (err) {
          //inserts error log into db on firestore
          insertIntoErrors(err);
          console.log(err);

          return connection.send(
            JSON.stringify({ err: 'Error while sending the answers' })
          );
        }

        break;

      //////////////------------IF COOKIE FROM USER --------\\\\\\\\\\\\\\\\
      case 'CookieQuery':
        //TODO: Arata i user ului ce intrebari a gresit si care erau raspunsurile corecte

        // insert new function firestore
        if (await isCookieExist(message.cookie)) {
          const sessionId = message.idSession;

          //get all the session data
          const sessionData = vedemDupa(sessionId);

          // sessionData.answers.map((answer)=>{
          //    if(answer[cookieUser] === message.cookie){

          //    }
          // })

          connection.send(
            JSON.stringify({
              type: 'CookieExistsAlready',
              cookieMessageToShowOnFrontend:
                'You have already answered this form !'
            })
          );
        }
        break;

      default:
        console.log('hello world from default');
        return connection.send(
          JSON.stringify({
            err: 'The message type was either missing or empty'
          })
        );
    }
  });
});
