const ApiError = require('../../lib/ApiError');
const Uploader = require('../../lib/Uploader/uploader');
const UploadModel = require('../../lib/Uploader/model');

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

  static async delete(ability, authorId, uploadId) {
    const upload = await UploadModel.findById(uploadId);

    if (!upload) throw ApiError.BadRequest('Данного файла не существует!');

    if (ability.cannot('delete', upload)) {
      throw ApiError.Forbidden('У Вас недостаточно прав для удаления данного файла!');
    }

    await Uploader.deleteFile(upload._id, upload.extension);
    await upload.delete();
  }

  static async getMyUploads(author, projection) {
    return await UploadModel.find({ author }, projection);
  }
}

module.exports = UploadService;
