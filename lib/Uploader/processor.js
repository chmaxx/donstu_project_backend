let avaliableProcessors = {};

const loadProcessors = () => {
  const { readdir } = require('fs');
  const { join } = require('path');
  const originPath = join('.', 'lib', 'Uploader', 'processors');

  readdir(originPath, { withFileTypes: true }, (err, contents) => {
    if (err) return;

    contents.forEach((matchDirent) => {
      if (matchDirent.isDirectory()) return;

      avaliableProcessors[
        matchDirent.name.split('.').shift()
      ] = require('./processors/' + matchDirent.name);
    });
  });
};

loadProcessors();

module.exports = { avaliableProcessors };
