const UploaderService = require('./service');
const Busboy = require('busboy');
const { ResponseMessage } = require('../utils');

class UploadController {
  async add(req, res, next) {
    const busboy = new Busboy({ headers: req.headers });

    let fileUploadID, extension;

    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
      // навешиваем try-catch like a boss
      try {
        [fileUploadID, extension] = await UploaderService.registerFile(
          req.user._id,
          filename,
          fieldname
        );

        await UploaderService.writeFile(file, fileUploadID, extension);

        res.json(ResponseMessage('Файл успешно загружен!', { fileUploadID }));
      } catch (e) {
        next(e);
      }
    });

    req.pipe(busboy);
  }
}

module.exports = new UploadController();
