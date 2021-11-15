const path = require('path');

// подключаем логгер Backup
const Logger = require('log-my-ass');
const log = new Logger(api_config.logger, 'Backup');

class BackupController {
  async getlist(req, res, next) {
    accessTemplate(req, res, next, function () {
      var list_path = path.join('../../', api_config.backup.storage, 'list.json');
      var backup_list = require(list_path);
      res.send(backup_list);
    });
  }

  async getbackup(req, res, next) {
    accessTemplate(req, res, next, (req, res, next) => {
      // определяем нужные пути к фалам
      var storage = path.join('../../', api_config.backup.storage);
      var list_path = path.join(storage, 'list.json');
      var backup_list = require(list_path);
      var id = req.query.id;
      var file_name = backup_list[id].file_name;
      var backup_path = path.join(path.dirname(__filename), storage, file_name);
      // отправляем
      res.download(backup_path, file_name, function (err) {
        if (err) {
          log.error(err);
          res.sendStatus(500);
        }
      });
    });
  }
}

function accessTemplate(req, res, next, callback) {
  try {
    if (checkAccess(req)) {
      callback(req, res, next);
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    log.error(err, err.stack);
    res.sendStatus(500);
  }
}

function checkAccess(req) {
  try {
    if (req.get('access_token') == api_config.backup.access_token) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

module.exports = new BackupController();
