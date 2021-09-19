const {Schema, model} = require('mongoose');

let ArticleSchema = new Schema({
	content_type: {
		type: String, 
		default: 'article'
	},

	header: {
		type: String, 
		required: [true, 'Необходимо ввести название статьи!']
	}, 

	author_id: {
		type: String, 
		required: [true, 'Необходимо указать автора поста!']
	},

	contents: {}, 
	tags: {},

	create_time: Date, 
	last_update_time: Date,

	is_archived: {
		type: Boolean, 
		default: false
	}

}, {versionKey: false})

// TODO: почему-то не работает!!!
ArticleSchema.pre('save', (next, done) => {
	next();

	var currentDate = new Date();
	if (!this.create_time || this.create_time == undefined) { 
		this.create_time = currentDate;
	}

	this.last_update_time = currentDate;

	done();
})

module.exports = model('Article', ArticleSchema);
