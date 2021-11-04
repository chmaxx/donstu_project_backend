const Uploader = require('./uploader');

let proccessors = {};

const loadProcessors = () => {
  const { readdir } = require('fs');
  const { join } = require('path');
  const originPath = join('.', 'lib', 'Uploader', 'processors');

  readdir(originPath, { withFileTypes: true }, (err, contents) => {
    if (err) return;

    contents.forEach((matchDirent) => {
      if (matchDirent.isDirectory()) return;

      proccessors[
        matchDirent.name.split('.').shift()
      ] = require('./processors/' + matchDirent.name);
    });
  });
};

loadProcessors();

const processFile = async (fileID) => {
  const { path, fileData } = await Uploader.getFileFromID(fileID);

  if (!Uploader.allowedExtensions[fileData.extension]) return;
  if (!proccessors[fileData.extension]) return;

  proccessors[fileData.extension](fileData);
};
module.exports = { processFile };
