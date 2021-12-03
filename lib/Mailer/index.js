const nodemailer = require('nodemailer');
// подключаем логгер Mailer
const Logger = require('log-my-ass');
const log = new Logger(API_CONFIG.logger, 'Mailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: API_CONFIG.mailer.host,
      port: API_CONFIG.mailer.port,
      secure: API_CONFIG.mailer.secure,
      auth: {
        user: API_CONFIG.mailer.user,
        pass: API_CONFIG.mailer.password,
      },
    });
  }

  async sendActivationMail(to, link) {
    if (!API_CONFIG.mailer.enabled) {
      return log.info(
        'Невозможно отправить сообщение, т.к почтовый сервис отключен в конфиге!'
      );
    }

    await this.transporter.sendMail({
      from: API_CONFIG.mailer.user,
      to,
      subject: 'Активация аккаунта',
      text: '',
      html: `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href = ${link}>${link}</a>
            </div>
            `,
    });
  }
}

module.exports = new MailService();
