const tf = require('@tensorflow/tfjs-node');
const { getModelFile } = require('../config/storage');

let model;

const loadModel = async () => {
    if (!model) {
        const file = await getModelFile();
        const [contents] = await file.download();
        model = await tf.loadGraphModel(`file://${contents}`);
    }
    return model;
};

module.exports = { loadModel };
