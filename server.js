// const express = require('express');
const { verifyAnswers } = require("./formsLogic");
const WebSocket = require("ws");

//firestore
const {
    insertIntoCookies,
    getFormsDataWithId,
    insertNewAnswersIntoSessionTable,
    insertIntoErrors,
    getSessionDataWithId,
    isCookieExist
} = require("./formService");

// const app = express();
const port = 3001;
const wss = new WebSocket.Server({ port: port });

const allConnections = { adminConnections: {}, clientConnections: {} };

//TODO: Create folder and move this function somwhere else idk


wss.on("connection", async (connection) => {
    connection.on("message", async (msg) => {
        if (typeof msg === undefined) {
            return console.log("message is undefined");
        }

        let userAnswer;

        try {
            userAnswer = JSON.parse(msg); // {question1: {}}
        } catch {
            console.log("Message is not JSON format");
            return;
        }
        //not safe if msg is json
        // console.log(userAnswer);

        ///////////////----------- IF ADMIN -----------\\\\\\\\\\\\\\\\\\
        if (userAnswer.adminId) {
            console.log("An admin has connected");

            //TODO: CHANGE IN O(1) because now it s O(N)
            const sessionId = userAnswer.adminSession;

            if (typeof sessionId !== "string") {
                console.log("Session Id is not a string !! ");
                return;
            }

            connection.sessionId = sessionId;
            allConnections.adminConnections[sessionId] = connection;

            const session = await getSessionDataWithId(sessionId);
            const studentAnswers = session.answers;

            // console.log(studentAnswers);

            connection.send(JSON.stringify(studentAnswers));

            return console.log(`Admin sent this : + `, userAnswer);
        }

        ///////////////----------- IF USER -----------\\\\\\\\\\\\\\\\\\
        else {
            console.log("A client has connected");
            console.log(userAnswer);

            const sessionId = userAnswer.id;

            if (typeof sessionId !== "string") {
                console.log("Session Id is not a string !! ");
                return;
            }

            connection.sessionId = sessionId;
            allConnections.clientConnections[sessionId] = connection;

            try {
                // const cookieString = Object.keys(userAnswer.formDbCookie)[0];
                // console.log(cookieString);


                // if (!(await isCookieExist(cookieString))) {

                    insertIntoCookies(userAnswer.formDbCookie);

                    const session = await getSessionDataWithId(sessionId);
                    const hostAnswerForm = await getFormsDataWithId(
                        session.idForm
                    );

                    const responseToAnswers = verifyAnswers(
                        userAnswer,
                        hostAnswerForm
                    );

                    await insertNewAnswersIntoSessionTable(
                        sessionId,
                        responseToAnswers.formReadyToSend
                    );

                    //send the correct number of answers to the user
                    console.log( "This is Correct answer number", responseToAnswers.correctAnswersNumber);
                    connection.send(JSON.stringify(responseToAnswers.correctAnswersNumber));

                    // tell host page data has been modified
                    const hostPageDataConnectionAdmin =
                        allConnections?.adminConnections?.[sessionId];

                    if (!hostPageDataConnectionAdmin) {
                        console.log(
                            "Connection admin was not found for this session id"
                        );
                        return;
                    }

                    

                    hostPageDataConnectionAdmin.send(
                        JSON.stringify({ refresh: true })
                    );


                //     return;
                // }

                // return connection.send("You already answered these questions");
                
            } catch (err) {
                //inserts error log into db on firestore
                insertIntoErrors(err);
                console.log(err);

                return connection.send("Error while sending the answers");
            }
        }
    });
});
