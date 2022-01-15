const multer  = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const storageFile = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, '');
  },

  // By default, multer removes files extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname);
  }
});



module.exports = {
  storage,
  storageFile
}