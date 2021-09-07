# Основы проектной деятельности (Создание Web- сайта Защити свои данные в сети)

### Установка зависимостей Node.JS
Для установки зависимостей используйте команду:
```
npm install
```

### Конфигурация
Перед тем, как запустить приложение, необходимо создать `config.json` в папке `config`
Содержимое конфига:
```json
{
  "port": 8000,
  "db_settings": {
    "url": "mongodb+srv://<пользователь>:<пароль>@<сайт>/<база_данных>?retryWrites=true&w=majority"
  }
}
```
