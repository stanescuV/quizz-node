const { db } = require("./firestore");

const getFormsData = async () => {
    try {
        const formsRef = db.collection('forms');
        const response = await formsRef.get();
        const formsData = response.docs[0]._fieldsProto;

        console.log(formsData)
    } catch (err) {
        console.log(err);
    }
}

//make endpoint to get form by using the id


module.exports = {getFormsData}