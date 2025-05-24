const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

// Upload route - protected, requires authentication
router.post('/', authenticationMiddleware, (req, res) => {
    uploadImage(req, res);
});

module.exports = router; 