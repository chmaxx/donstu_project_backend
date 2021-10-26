//набросок логгера
//туду:
//правильно оформить middleware
//вывод в консоль
//запись в файл

const { defaultConfiguration } = require("express/lib/application");
const { append } = require("express/lib/response");

//готово сейчас: форматирование строки

function format_str (prefix, message) {

    let current_datetime = new Date();
    let formatted_date =
    current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();


    return `[${formatted_date}] [${prefix}] ${message}`;
};

module.exports = function (prefix, message, next) {
    if (config.logger.info.console) {
        console.log(format_str(prefix, message))
    }
    next();
}