let fs = require('fs');
let path = require('path');

const format_str = (prefix, message) => {
  let current_datetime = new Date();
  let formatted_date = current_datetime.toLocaleString('es-CL');
  return `[${formatted_date}] [${prefix}] ${message}`;
};

const output = (config, textlog) => {
  if (config.console_output) {
    console.log(textlog);
  }

  if (config.file_write) {
    if (fs.existsSync(path.dirname(config.file_path)) != true) {
      fs.mkdirSync(path.dirname(config.file_path), { recursive: true });
    }

    fs.appendFile(config.file_path, textlog + '\n', (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

class Logger {
  constructor(config, prefix) {
    this.config = config;
    this.prefix = prefix;
  }

  //todo: проверка правильности конфига

  //todo: метод для логгирования объектов err

  info(message) {
    output(this.config.info, format_str(this.prefix, message));
  }

  access(req, res) {
    output(
      this.config.access,
      format_str(`${req.method}`, `${res.statusCode}: ${req.url}`)
    );
  }
}

module.exports = Logger;
