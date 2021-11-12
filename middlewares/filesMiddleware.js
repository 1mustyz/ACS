const multer = require('multer');
const storage = require('../config/multerConfig');

const singleUpload = multer({
    storage: storage.storage,
    limits: {fileSize: 1024 * 1024 }
  }).single('profile_pic');

const singleFileUpload = multer({
    storage: storage.storageFile,
    limits: {fileSize: 10024 * 10024 }
}).single('file');



  module.exports = {
      singleUpload,
      singleFileUpload
     
  }