const express = require('express');
const multer = require('multer');
const { loadModel } = require('./services/modelLoader');
const { predictImage } = require('./services/predictionService');

const app = express();
const upload = multer({ limits: { fileSize: 1000000 } }); // Batas ukuran file 1MB

app.post('/predict', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'Gambar tidak ditemukan' });
        }

        const model = await loadModel();
        const prediction = await predictImage(req.file.buffer, model);

        return res.json({
            status: 'success',
            message: 'Model is predicted successfully',
            data: prediction,
        });
    } catch (error) {
        if (error.message.includes('File size')) {
            return res.status(413).json({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            });
        }
        return res.status(400).json({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
