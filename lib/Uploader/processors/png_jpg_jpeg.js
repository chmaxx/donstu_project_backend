const sharp = require('sharp');
const { createWriteStream } = require('fs');
const Uploader = require('../uploader');

const process = (readStream, fileID) => {
  const writeStream = createWriteStream(Uploader.getUploadPath(fileID, 'webp'));

  readStream.pipe(sharp().webp()).pipe(writeStream);
};

module.exports = { process, writeExtension: 'webp' };
