const path = require('path');
const UploadSchema = require('./model');
const { uploadPath, uploadPathArray } = require('./index');
const { avaliableProcessors } = require('./processor');

class Uploader {
  static async registerFile(author, filename, uploadKey) {
    const registeredFileSchema = new UploadSchema({
      filename,
      uploadKey,
      author,
      uploadTime: new Date(),
    });

    const registeredFile = await registeredFileSchema.save();

    return registeredFile;
  }

  static async writeFile(readStream, fileID, extension) {
    const processor = avaliableProcessors[extension];

    /* хотя у нас есть Uploader.extensionAllowed, здесь проще
     * использовать "сырую" версию проверки (иначе будет три отрицания)
     */
    if (!processor) {
      throw new Error('Данный формат файлов не поддерживается!');
    }

    const registeredFile = await UploadSchema.findById(fileID);

    if (!registeredFile) {
      throw new Error('Файл не зарегистрирован в базе!');
    }

    processor.process(readStream, fileID);
    registeredFile.extension = processor.writeExtension;

    await registeredFile.save();
  }

  static getUploadPath(file = undefined, extension = undefined) {
    return file
      ? path.join(...uploadPathArray, `${file}.${extension}`)
      : uploadPath;
  }

  static extensionAllowed(extension) {
    /* из существования функции-процессора следует, что данный тип
     * поддерживается, однако мы должны возвращать bool, а не функцию
     * тогда, поскольку существующая функция "truly" (и undefined "falsy"),
     * мы можем дважды отрицать значение и прийти к его bool-представлению
     * именно это нам и нужно
     * это также вводит своего рода инкапсуляцию - функция-процессор
     * не выходит за рамки модуля
     */
    return !!avaliableProcessors[extension];
  }
}

module.exports = Uploader;
