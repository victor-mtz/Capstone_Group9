const express = require('express');
const multer = require('multer');
const pool = require('../../db/client');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('uploaded-file'), async (req, res) => {
    try {
        const { userId } = req.body; // Assuming userId is sent in the request body
        // Assuming you want to save the image data as a Buffer directly
        const imageData = req.file.buffer; 
        
        // Code to save imageData to the database for the specified userId
        
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const result = await pool.query('SELECT * FROM user_images WHERE user_id = $1', [userId]);

        res.status(200).json({ images: result.rows });
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
