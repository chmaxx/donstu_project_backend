const ApiError = require('../../middlewares/ApiErrorException');
const Uploader = require('../../lib/Uploader/uploader');

class UploadService {
  static async registerFile(author, filename, fieldname) {
    const filenameSplitted = filename.split('.');
    const extension = filenameSplitted.pop();

    if (!Uploader.extensionAllowed(extension))
      throw new ApiError(400, 'Данный формат файлов не поддерживается!');

    const registeredFile = await Uploader.registerFile(
      author,
      filenameSplitted.shift(),
      fieldname
    );

    return [registeredFile._id, extension];
  }

  static writeFile = Uploader.writeFile;
}

module.exports = UploadService;
