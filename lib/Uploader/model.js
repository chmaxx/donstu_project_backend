const { Schema, model } = require('mongoose');

// :)))
const req = (requirement) => [true, `Необходимо указать ${requirement} файла!`];

let UploadSchema = new Schema(
  {
    extension: {
      type: String,
      required: req('расширение'),
    },

    filename: {
      type: String,
      required: req('название'),
    },

    // ключ файла в form-data
    uploadKey: {
      type: String,
      required: req('ключ'),
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: req('владельца'),
    },

    uploadTime: {
      type: Date,
      required: req('время загрузки'),
    },

    // была ли произведена проверка файла
    isSafe: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

module.exports = model('Upload', UploadSchema);
