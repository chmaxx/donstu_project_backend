const { createWriteStream } = require('fs');
const Uploader = require('../uploader');

const process = (readStream, fileID) => {
  const writeStream = createWriteStream(Uploader.getUploadPath(fileID, 'webp'));

  readStream.pipe(writeStream);
};

module.exports = { process, writeExtension: 'webp' };
