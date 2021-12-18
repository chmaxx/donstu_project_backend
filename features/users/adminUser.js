const UserModel = require('./user/model');
const bcrypt = require('bcrypt');

const Logger = require('log-my-ass');
const log = new Logger(API_CONFIG.logger, 'AdminUser');

const initAdminUser = async () => {
  const {
    email,
    login,
    password,
    first_name: firstName,
    last_name: lastName,
  } = API_CONFIG.super_user_settings;

  const passwordHashed = await bcrypt.hash(password, 3);
  const adminUser = await UserModel.findOne({ email });

  // Если админ-пользователь существует - обновляем его данные соответственно конфигу
  if (adminUser) {
    Object.assign(adminUser, { email, login, passwordHashed, firstName, lastName });

    await adminUser.save();
    log.info('Свойства админ-пользователя перезаписаны.');
    return;
  }

  // иначе - создаем пользователя
  UserModel.create({
    login,
    firstName,
    lastName,
    email,
    passwordHashed,
    // пасхалочка >_<
    activationUUID: 'https://www.toptal.com/developers/hastebin/raw/apopiyegip',
    isActivated: true,
    usergroup: 'admin',
  })
    .then(() => log.info('Успешно создан админ-пользователь!'))
    .catch(log.error);
};

module.exports = initAdminUser;
