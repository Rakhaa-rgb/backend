const express = require('express');
const multer = require('multer');
const { loadModel } = require('./services/modelLoader');
const { predictImage } = require('./services/predictionService');
const winston = require('winston');

// Setup logger
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: 'logs/app.log' }),
        new winston.transports.Console()
    ]
});

const app = express();
const upload = multer({ limits: { fileSize: 1000000 } }); // Batas ukuran file 1MB

app.post('/predict', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'Gambar tidak ditemukan' });
        }

        // Log the file information (optional, for debugging)
        logger.info(`File uploaded: ${req.file.originalname}, size: ${req.file.size} bytes`);

        const model = await loadModel();
        if (!model) {
            return res.status(500).json({
                status: 'fail',
                message: 'Model gagal dimuat'
            });
        }

        const prediction = await predictImage(req.file.buffer, model);
        
        if (!prediction) {
            return res.status(500).json({
                status: 'fail',
                message: 'Prediksi gagal dilakukan'
            });
        }

        return res.json({
            status: 'success',
            message: 'Model is predicted successfully',
            data: prediction,
        });
    } catch (error) {
        // Logging the error for debugging
        logger.error(`Error occurred: ${error.message}`);
        
        // Check for file size error
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
