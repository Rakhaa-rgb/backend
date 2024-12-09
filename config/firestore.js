const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

const PREDICTIONS_COLLECTION = 'predictions'; 

const savePrediction = async (data) => {
    const docRef = firestore.collection(PREDICTIONS_COLLECTION).doc(data.id);
    await docRef.set(data);
};

module.exports = { savePrediction };
