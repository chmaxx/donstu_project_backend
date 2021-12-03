const path = require('path');

// подключаем логгер Backup
const Logger = require('log-my-ass');
const log = new Logger(API_CONFIG.logger, 'Backup');

// TODO: Распихать next() как надо
// TODO: Добавить маршрут возврата id последнего бэкапа(в боди без json)

class BackupController {
  async getlist(req, res, next) {
    accessTemplate(req, res, next, (req, res, next) => {
      var list_path = path.join('../../', API_CONFIG.backup.storage, 'list.json');
      var backup_list = require(list_path);
      res.send(backup_list);
    });
  }

  async getbackup(req, res, next) {
    accessTemplate(req, res, next, (req, res, next) => {
      // определяем нужные пути к фалам
      var storage = path.join('../../', API_CONFIG.backup.storage);
      var list_path = path.join(storage, 'list.json');
      var backup_list = require(list_path);
      var id = req.query.id;
      var file_name = backup_list[id].file_name;
      var backup_path = path.join(path.dirname(__filename), storage, file_name);
      // отправляем
      res.download(backup_path, file_name, function (err) {
        if (err) {
          log.error(err);
          // err произошла ошибка при отдаче файла
          res.sendStatus(500);
        }
      });
    });
  }
}

// шаблон проверки доступа (признаю - костыль)
function accessTemplate(req, res, next, callback) {
  try {
    if (checkAccess(req)) {
      callback(req, res, next);
    } else {
      res.sendStatus(403);
      // access_token неверный
    }
  } catch (err) {
    log.error(err);
    res.sendStatus(500);
    // произошла неизвестная ошибка
  }
}

// логика проверки валидности токена
// TODO: исправить это недорозумение
function checkAccess(req) {
  try {
    if (req.get('access_token') == API_CONFIG.backup.access_token) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

module.exports = new BackupController();
