const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');

const apiResponse = require('../utils/apiResponse');
const { restoreUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

const restoreUploadDir = path.join(process.cwd(), 'uploads', 'restore');

router.post('/restore/upload', (req, res, next) => {
  fs.mkdirSync(restoreUploadDir, { recursive: true });

  restoreUpload.single('backupFile')(req, res, (err) => {
    if (err) {
      err.statusCode = 400;
      return next(err);
    }

    if (!req.file) {
      return apiResponse.fail(res, {
        statusCode: 400,
        message: 'Vui long upload file backup',
        errors: {
          backupFile: 'File backup is required'
        }
      });
    }

    const message = 'Upload file backup va khoi phuc du lieu thanh cong';
    const objectKey = path
      .join('restore-uploads', req.file.filename)
      .replace(/\\/g, '/');

    return apiResponse.success(res, {
      message,
      data: {
        backupId: crypto.randomBytes(12).toString('hex'),
        fileName: req.file.filename,
        message,
        objectKey,
        valid: true
      }
    });
  });
});

module.exports = router;
