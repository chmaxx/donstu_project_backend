const Uploader = require('../uploader');
const UploadSchema = require('../model');
const sharp = require('sharp');

const { rmSync } = require('fs');

// TODO: пофиксить удаление png
const process = async (fileData) => {
  const sharpFile = sharp(Uploader.getUploadPath(fileData._id, 'png')).jpeg();
  await sharpFile.toFile(Uploader.getUploadPath(fileData._id, 'jpg'));

  rmSync(Uploader.getUploadPath(fileData._id, 'png'));

  fileData.extension = 'jpg';
  fileData.isSafe = true;
  fileData.save();
};

module.exports = process;
