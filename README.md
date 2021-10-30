# StaySecured

Данный репозиторий создан для совместной разработки Backend-части сайта **StaySecured**.
**StaySecured** - информационный портал, посвященный информационной безопасности. Идея сайта не возникла сама собой - разработчики являются студентами ДГТУ, которые 6-го сентября начали заниматься проектной деятельностью на интересном им направлении. Наши интересы - разработка Web-сайтов и безопасность.

Над исходным кодом работают:

- Максим Захаренков - ВМО11
- Владимир Горшков - ВПР12

## Установка зависимостей Node.JS

Для установки зависимостей используйте команду:

```
npm install
```

## Конфигурация

Перед тем, как запустить приложение, необходимо создать `config.json` в папке `config`
Содержимое конфига:

```json
{
  "port": 8000,
  "ip": "127.0.0.1",
  "api_version": "v1",

  "db_settings": {
    "url": "mongodb://<пользователь>:<пароль>@<сайт>/<база_данных>?retryWrites=true",
    "enabled": true,
    "reconnect_delay": 4000
  },

  "jwt": {
    "access_token_lifetime": 86400,
    "access_token_secret": "секретный ключ для JWT Access Token",

    "refresh_token_lifetime": 1209600,
    "refresh_token_secret": "секретный ключ для JWT Refresh Token"
  },

  "mailer": {
    "host": "SMTP-хост",
    "port": 587,
    "secure": false,

    "enabled": true,

    "user": "почта, с которой будет отправляться письмо",
    "password": "пароль от почты"
  },

  "logger": {
    "info": {
      "console_output": true,
      "file_write": false,
      "file_path": "../path/to/info.log"
    },
    "error": {
      "console_output": true,
      "file_write": true,
      "file_path": "../path/to/error.log"
    },
    "access": {
      "console_output": false,
      "file_write": false,
      "file_path": "../path/to/access.log"
    }
  }
}
```

_Поясненение к ссылке на базу данных:_

- Пользователь - Пользователь базы данных, необязателен
- Пароль - Пароль от пользователя, необязателен
- Сайт - ссылка на сайт, на котором расположена база данных (включая порт)
- База данных - название базы данных. Рекомендуемое название - `staysecured`
