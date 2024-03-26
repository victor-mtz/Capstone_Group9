const express = require('express');
const multer = require('multer');
const pool = require('../../db/client');
const { query } = require('../../db/client');
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { userId } = req.body;
        const imageData = Buffer.from(req.file.buffer).toString('hex');

       
        await pool.query('INSERT INTO user_images (user_id, image_data) VALUES ($1, $2)', [userId, imageData]);

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