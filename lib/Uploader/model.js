const { Schema, model } = require('mongoose');

// :)))
// (´• ω •`)
const req = (requirement) => [true, `Необходимо указать ${requirement} файла!`];

let UploadSchema = new Schema(
  {
    extension: String,

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
  },
  { versionKey: false }
);

module.exports = model('Upload', UploadSchema);
