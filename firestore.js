//firestore
const admin = require('firebase-admin');
const credentials = require('./key.json');
const FieldValue = admin.firestore.FieldValue;


admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

//collection
const db = admin.firestore();

module.exports = { db, FieldValue };