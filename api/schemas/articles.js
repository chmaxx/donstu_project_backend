const mongoose = require('mongoose');

// Создаем схему статьи
let ArticleSchema = new mongoose.Schema({
	/* Тип контента
	 * TODO: по хорошему у каждого контента должен быть свой маршрут 
	 */
	content_type: {
		type: String, 
		default: 'article'
	},

	// Заголовок - обязателен
	header: {
		type: String, 
		required: [true, 'Необходимо ввести название статьи!']
	}, 

	// ID автора - обязателен 
	// MongoDB хранит _id как обьекты, но мы будем сравнивать их строчные версии
	author_id: {
		type: String, 
		required: [true, 'Необходимо указать автора поста!']
	},

	// Контент и теги - любой тип данных, но мы будем хранить там списки
	contents: {}, 
	tags: {},

	// Время создания так же будет объектом
	// Задается единожды - при создании новой записи в базу
	create_time: Date, 

	// Время последнего редактирования будет меняться при каждом обновлении записи 
	// Пыри создании записи будет идентично create_time  
	last_update_time: Date
}, {versionKey: false})

ArticleSchema.pre('save', (next, done) => {
	next();

	var currentDate = new Date();
	if (!this.create_time || this.create_time == undefined) { 
		this.create_time = currentDate;
	}

	this.last_update_time = currentDate;

	done();
})

module.exports = mongoose.model('Article', ArticleSchema);
