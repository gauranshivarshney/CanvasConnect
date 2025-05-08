const multer = require('multer');
const { storage } = require('./cloudinary');

module.exports = multer({ storage });