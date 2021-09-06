/*
  Подгрузка модулей
  Далее приставка (m_) означает модуль


  TODO: будем искать все имеющиеся модули в папке и добавлять циклом (автоматизация) 
*/
const m_Create = require('./modules/create');

// Тем временем сам include.js тоже является модулем (который подгружает остальные)
module.exports = function(server, db) {
  m_Create(server, db);
};
