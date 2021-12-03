const mongoose = require('mongoose');
const { connectToDB } = require('./utils');

// Авто-реконнект не работает при получении еррора. В таких случаях нужно отключиться
// (он потом поднимется)
mongoose.connection.on('error', function () {
  mongoose.disconnect();
});

mongoose.connection.on('disconnected', function () {
  // Устанавливаем время на реконнект в миллисекундах (либо из конфига, либо 5000 по умолчанию)
  setTimeout(connectToDB, API_CONFIG ? API_CONFIG.db_settings.reconnect_delay : 5000);
});

// Подключаемся к базе данных
connectToDB();
