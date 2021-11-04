const ApiError = require('../../middlewares/ApiErrorException');
const Uploader = require('../../lib/Uploader/uploader');
const { processFile } = require('../../lib/Uploader/processor');

class UploadService {
  static async writeFileFromStream(stream, filename, uploadKey, author) {
    const filenameSplitted = filename.split('.');
    const extension = filenameSplitted.pop();

    if (!Uploader.allowedExtensions[extension])
      throw new ApiError(400, 'Данный формат файлов не поддерживается!');

    const { fileUploadID } = await Uploader.registerFile(
      stream,
      filenameSplitted.shift(),
      author,
      uploadKey,
      extension
    );

    return fileUploadID;
  }

  static async processFile(fileUploadID) {
    await processFile(fileUploadID);
  }
}

module.exports = UploadService;
