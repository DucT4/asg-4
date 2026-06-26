const path = require('path');
const multer = require('multer');

const restoreUploadDir = path.join(process.cwd(), 'uploads', 'restore');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, restoreUploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const safeOriginalName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${safeOriginalName}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.toLowerCase().endsWith('.zip')) {
    return cb(new Error('Only .zip backup files are allowed'));
  }

  return cb(null, true);
};

const restoreUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

module.exports = {
  restoreUpload
};
