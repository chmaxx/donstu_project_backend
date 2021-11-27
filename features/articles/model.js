const { Schema, model } = require('mongoose');

let ArticleSchema = new Schema(
  {
    header: {
      type: String,
      required: [true, 'Необходимо ввести название статьи!'],
    },

    authorID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Необходимо указать автора поста!'],
    },

    contents: {
      type: String,
      default: 'У статьи нет содержимого!',
    },

    description: {
      type: String,
      default: 'У статьи нет описания!',
    },

    thumbnailURL: {
      type: String,
      required: [true, 'Необходимо указать ссылку на превью!'],
    },

    tags: {},

    createTime: Date,
    lastUpdateTime: Date,
  },
  { versionKey: false }
);

module.exports = model('Article', ArticleSchema);
