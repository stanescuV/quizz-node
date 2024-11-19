const { db } = require("./firestore");

const formsRef = db.collection('forms');

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


const insertAnswersIntoFormsTable = async (idForm, answers ) => {
    const form = formsRef.doc(idForm);

    try{

    } catch{

    }
    
   
    
    
}


module.exports = {getFormsData, getFormsDataWithId}