const { db, FieldValue } = require("./firestore");

const formsRef = db.collection('forms');
const sessionsRef = db.collection('sessions');
const errorsRef = db.collection('errors');

//get all forms from the DB // no use case ftm 
const getFormsData = async () => {
    try {

        const response = (await formsRef.get()).docs;

        const formsData = response[0]._fieldsProto;

        console.log(formsData)
    } catch (err) {
        console.log(err);
    }
}

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

const getSessionWithId = async (idSession) => {
    try {
        const sessionRef = sessionsRef.doc(idSession);
        const docSnapshot = await sessionRef.get();

        if (!docSnapshot.exists) {
            console.log(`No document found with ID: ${id}`);
            return null;
        }

        const sessionData = docSnapshot.data();
        return sessionData;
    } 
    catch (error) {
        console.error("Error fetching form by ID:", error);
        return null;
    }
};


const insertNewAnswersIntoSessionTable = async (idSession, answers ) => {

    /*
    *
    answers = {
    '9jqqgVqGd02su29BA6eb': {
        question1: { question: 'qqq', isCorrect: false, selectedOption: 'option1' },
        question2: { question: 'qqq', isCorrect: true, selectedOption: 'option1' }
    }
    */
    const sessionRef = sessionsRef.doc(idSession);
    const session = Object.values(answers);
    try{
        await sessionRef.update({
            answers: FieldValue.arrayUnion(...session)
          });
    } catch(err){
        console.log('There was an error while inserting the answers', err)

    }
 
}


const insertIntoErrors = async (err) => {


    const error = { date: (new Date()).toString(), errMessage: JSON.stringify(err)}

    try{
        sessionsRef.add(error)
    } catch(err){
        console.log('There was an error while inserting the error', err)

    }
 
}


module.exports = {getFormsData, getFormsDataWithId, insertNewAnswersIntoSessionTable, insertIntoErrors, getSessionWithId}