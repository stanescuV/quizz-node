const { db, FieldValue} = require("./firestore");

const formsRef = db.collection("forms");
const sessionsRef = db.collection("sessions");
const errorsRef = db.collection("errors");
const cookiesRef = db.collection("cookies");


//get all forms from the DB // no use case ftm
const getFormsData = async () => {
    try {
        const response = (await formsRef.get()).docs;

        const formsData = response[0]._fieldsProto;

        console.log(formsData);
    } catch (err) {
        console.log(err);
    }
};

//make endpoint to get form by using the id
const getFormsDataWithId = async (id) => {
    try {
        const formRef = formsRef.doc(id); // Reference to specific document by ID
        const docSnapshot = await formRef.get();

        if (!docSnapshot.exists) {
            console.log(`No document found with ID: ${id}`);
            return null;
        }

        const formData = docSnapshot.data();
        return formData;
    } catch (error) {
        console.error("Error fetching form by ID:", error);
        return null;
    }
};

const getSessionDataWithId = async (idSession) => {
    try {
        const sessionRef = sessionsRef.doc(idSession);
        const docSnapshot = await sessionRef.get();

        if (!docSnapshot.exists) {
            console.log(`No document found with ID: ${id}`);
            return null;
        }

        const sessionData = docSnapshot.data();
        return sessionData;
    } catch (error) {
        console.error("Error fetching form by ID:", error);
        return null;
    }
};

const vedemDupa = async (idSession) =>{

    //TODO: De cautat in documentatie firestore cum sa accedezi la o sub colectie !
    const answersFromSession = db.doc("sessions/" + idSession )
    console.log({answersFromSession})

}

const getCookieDataFromSessionWithIdSession = async (idSession) => {
    try {
        const sessionRef = sessionsRef.doc(idSession);
    
        const docSnapshot = await sessionRef.get();

        if (!docSnapshot.exists) {
            console.log(`No document found with ID: ${id}`);
            return null;
        }

        const sessionData = docSnapshot.data();
        const cokieData = sessionData.cookieUser;
        return cokieData;
    } catch (error) {
        console.error("Error fetching form by ID:", error);
        return null;
    }
};

const insertNewAnswersIntoSessionTable = async (idSession, answers, cookieId) => {
    /*
    *
    answers = {
    '9jqqgVqGd02su29BA6eb': {
        question1: { question: 'qqq', isCorrect: false, selectedOption: 'option1' },
        question2: { question: 'qqq', isCorrect: true, selectedOption: 'option1', date:"2025qwds" }
    }
    */

    try {
        const sessionRef = sessionsRef.doc(idSession);

       
        const sessionsAnswers = Object.values(answers);
        sessionsAnswers.forEach((answer) => {
            answer.date = new Date().toString();
            answer.cookieUser = cookieId;
        });
        console.log({ sessionsAnswers });
        await sessionRef.update({
            answers: FieldValue.arrayUnion(...sessionsAnswers),
        });

        console.log('New answer has been added in the database ')
    } catch (err) {
        console.log("There was an error while inserting the answers", err);
    }
};

const insertIntoErrors = async (err) => {
    const error = {
        date: new Date().toString(),
        errMessage: JSON.stringify(err),
    };

    try {
        errorsRef.add(error);
    } catch (err) {
        console.log("There was an error while inserting the error", err);
    }
};

const insertIntoCookies = async (data) => {
    try {
        cookieString = Object.keys(data)[0];

        // Insert a new document with cookieUUID as the document ID
        await cookiesRef.doc(cookieString).set(data[cookieString]);

        console.log(
            `Document with ID '${cookieString}' added/updated in 'cookies' collection.`
        );
    } catch (error) {
        console.error("Error adding document:", error);
    }
};

const isCookieExist = async (stringCookie) => {
    const cookieRef = (await cookiesRef.doc(stringCookie).get()).data();
    // console.log(cookieRef);

    if (!cookieRef) {
        return false;
    }

    return true;
};


module.exports = {
    getFormsData,
    getFormsDataWithId,
    insertNewAnswersIntoSessionTable,
    insertIntoErrors,
    getSessionDataWithId,
    insertIntoCookies,
    isCookieExist,
    getCookieDataFromSessionWithIdSession,
    vedemDupa,
};
