const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const BUCKET_NAME = 'submission-frontend'; 
const MODEL_FILE = 'submission-frontend/model.json'; 

const getModelFile = async () => {
    const file = storage.bucket(BUCKET_NAME).file(MODEL_FILE);
    return file;
};

module.exports = { getModelFile };
