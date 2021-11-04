const path = require('path');
const UploadSchema = require('./model');
const { createWriteStream, open } = require('fs');
const { uploadPath, uploadPathArray } = require('./index');

class Uploader {
  static allowedExtensions = {
    png: true,
    jpg: true,
    jpeg: true,
    gif: true,
    webp: true,
  };

  static async registerFile(stream, filename, author, uploadKey, extension) {
    const registeredFile = new UploadSchema({
      extension,
      filename,
      uploadKey,
      author,
      uploadTime: new Date(),
    });

    const savedFile = await registeredFile.save();
    const fileUploadPath = Uploader.getUploadPath(
      savedFile._id,
      savedFile.extension
    );

    stream.pipe(createWriteStream(fileUploadPath));

    return { fileUploadID: savedFile._id, fileUploadPath };
  }

  static getFileIDFromPath(path) {
    const fileID = path.split('/').pop().split('.').shift();
    return fileID;
  }

  static async getFileFromID(id) {
    const fileData = await UploadSchema.findOne({ _id: id });

    if (!fileData) return;

    const path = Uploader.getUploadPath(id, fileData.extension);

    await open(path, (err, data) => {
      if (err) {
        throw new Error(`Невозможно получить доступ к ${path}!`);
      }
    });
    return { path, fileData };
  }

  static getUploadPath(file = undefined, extension = undefined) {
    return file
      ? path.join(...uploadPathArray, `${file}.${extension}`)
      : uploadPath;
  }
}

module.exports = Uploader;
