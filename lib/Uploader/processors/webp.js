const { createWriteStream } = require('fs');
const Uploader = require('../uploader');

const process = (readStream, fileId) => {
  const writeStream = createWriteStream(Uploader.getUploadPath(fileId, 'webp'));

  readStream.pipe(writeStream);
};

module.exports = { process, writeExtension: 'webp' };
