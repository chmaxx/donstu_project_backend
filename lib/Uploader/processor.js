let avaliableProcessors = {};

const loadProcessors = () => {
  const { readdir } = require('fs');
  const path = require('path');

  readdir(
    'lib/Uploader/processors/',
    { withFileTypes: true },
    (err, contents) => {
      if (err) return;

      contents.forEach((matchDirent) => {
        if (matchDirent.isDirectory()) return;

        const filename = matchDirent.name.split('.').shift();
        /* Поскольку для нескольких расширений у нас один принцип
         * обработки, во избежание копирования кода я решил ввести возможность
         * определять один файл для нескольких расширений,
         * разделяя их нижним подчеркиванием.
         * Возможно это не самый красивый или правильный метод,
         * но это явно лучше, чем иметь три файла с полностью идентичным кодом
         */
        const processorData = require(`./processors/${matchDirent.name}`);
        filename.split('_').forEach((extension) => {
          avaliableProcessors[extension] = processorData;
        });
      });
    }
  );
};

loadProcessors();

module.exports = { avaliableProcessors };
