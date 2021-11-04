const UploaderService = require('./service');
const Busboy = require('busboy');

class UploadController {
  async add(req, res, next) {
    const busboy = new Busboy({ headers: req.headers });
    let fileUploadID;

    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
      try {
        fileUploadID = await UploaderService.writeFileFromStream(
          file,
          filename,
          fieldname,
          req.user.id
        );
      } catch (e) {
        next(e);
      }
    });

    busboy.on('finish', async () => {
      await UploaderService.processFile(fileUploadID);
      res.sendStatus(200);
    });

    req.pipe(busboy);
  }
}

module.exports = new UploadController();
