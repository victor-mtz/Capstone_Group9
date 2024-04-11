const express = require('express');
const multer = require('multer');
const pool = require('../../db/client');
const { uploadImage, getUserImages, uploadText } = require('../../db/DBUtils');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/upload-image',
  upload.single('uploaded-file'),
  async (req, res) => {
    try {
      const userId = 1; // Assuming userId is sent in the request body
      // Assuming you want to save the image data as a Buffer directly
      const imageData = Buffer.from(req.file?.buffer).toString('hex');

      // Code to save imageData to the database for the specified userId
      const response = await uploadImage(userId, imageData);

      if (response) {
        res.status(200).json({ message: 'Image uploaded successfully' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post('/upload-text', async (req, res) => {
  try {
    const userId = 1;
    const imageText = req.body.text;
    console.log(imageText);

    const response = await uploadText(userId, imageText);

    if (response) {
      res.status(200).json({ message: 'Image uploaded successfully' });
    }
  } catch (error) {
    console.error('Error uploading text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// router.get('/user/:userId', async (req, res) => {
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const result = await getUserImages(userId);

    if (result !== 'NA') {
      res.status(200).json({ images: result.rows });
    } else {
      res.status(200).json({ images: 'none available' });
    }
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
