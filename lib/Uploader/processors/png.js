const sharp = require('sharp');
const { createWriteStream } = require('fs');
const Uploader = require('../uploader');

const process = (readStream, fileID) => {
  const writeStream = createWriteStream(Uploader.getUploadPath(fileID, 'jpeg'));

  readStream.pipe(sharp().jpeg()).pipe(writeStream);
};

module.exports = { process, writeExtension: 'jpeg' };
