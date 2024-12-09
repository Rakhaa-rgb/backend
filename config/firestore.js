const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

const PREDICTIONS_COLLECTION = 'predictions'; 

const savePrediction = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Data to save must be an object');
        }

        if (data.id) {
            const docRef = firestore.collection(PREDICTIONS_COLLECTION).doc(data.id);
            await docRef.set(data, { merge: true }); 
            console.log(`Document with ID ${data.id} successfully written.`);
        } else {
            const docRef = await firestore.collection(PREDICTIONS_COLLECTION).add(data);
            console.log(`Document successfully created with ID: ${docRef.id}`);
        }
    } catch (error) {
        console.error('Error saving prediction to Firestore:', error.message);
        throw new Error('Failed to save prediction to Firestore');
    }
};

module.exports = { savePrediction };
