const { v4: uuidv4 } = require('uuid');
const { savePrediction } = require('../config/firestore');
const tf = require('@tensorflow/tfjs-node');

const predictImage = async (imageBuffer, model) => {
    const tensor = tf.node.decodeImage(imageBuffer, 3)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();

    const prediction = await model.predict(tensor).data();
    const result = prediction[0] > 0.5 ? 'Cancer' : 'Non-cancer';
    const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const data = { id, result, suggestion, createdAt };
    await savePrediction(data);

    return data;
};

module.exports = { predictImage };
