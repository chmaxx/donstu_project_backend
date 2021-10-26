let fs = require('fs');

const format_str = (prefix, message) => {

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

const output = (config, textlog) => {

    if (config.console_output) {
        console.log(textlog)
    }

    if (config.file_write) {
        fs.appendFile(config.file_path, textlog + "\n", err => {
            if (err) {
              console.log(err);
            }
        });
    }
}


class Logger {

    constructor(config) {
        this.config = config;
    }

    //todo: проверка правильности конфига

    info(prefix, message) {
        var textlog = format_str(prefix, message);
        output(this.config.info, textlog);
    }

    access(req, res) {
        var textlog = format_str(`${req.method}`, `${res.statusCode}: ${req.url}`)
        output(this.config.access, textlog);
        //todo: добавление next(); и подключение через app.use();
    }

}


module.exports = Logger;
