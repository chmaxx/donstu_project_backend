const UploaderService = require('./service');
const Busboy = require('busboy');
const ApiError = require('../../lib/ApiError');
const { ResponseMessage, formatUser, formatUpload, parseProjection } = require('../utils');

const Logger = require('log-my-ass');
const log = new Logger(API_CONFIG.logger, 'Uploader');

class UploadController {
  async add(req, res, next) {
    if (req.ability.cannot('write', 'Upload')) {
      return next(ApiError.Forbidden('Вы не можете загружать файлы!'));
    }

    const busboy = new Busboy({ headers: req.headers });

    let fileUploadId, extension;

    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
      // навешиваем try-catch like a boss
      try {
        [fileUploadId, extension] = await UploaderService.registerFile(
          req.user._id,
          filename,
          fieldname
        );

        await UploaderService.writeFile(file, fileUploadId, extension);

        log.info(
          `Пользователь ${formatUser(req.user)} загрузил файл ${formatUpload(
            fileUploadId.toString()
          )}`
        );

        res.json(ResponseMessage('Файл успешно загружен!', { fileUploadId }));
      } catch (e) {
        next(e);
      }
    });

    req.pipe(busboy);
  }

  async delete(req, res, next) {
    if (req.ability.cannot('write', 'Upload')) {
      return next(ApiError.Forbidden('Вы не можете удалять файлы!'));
    }

    try {
      await UploaderService.delete(req.user._id, req.body.uploadId);

      log.info(
        `Пользователь ${formatUser(req.user)} удалил файл ${formatUpload(req.body.uploadId)}`
      );

      res.json(ResponseMessage('Файл успешно удален!'));
    } catch (e) {
      next(e);
    }
  }

  async userUploads(req, res, next) {
    const uploads = await UploaderService.getMyUploads(
      req.user._id,
      parseProjection(req.body.projection)
    );

    return res.json(uploads);
  }
}

module.exports = new UploadController();
