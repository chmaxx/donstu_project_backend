const loginValidator = (value) => {
  if (!value) throw new Error('Необходимо ввести логин!');

  if (value.length < 5) throw new Error('Логин должен быть не менее 5 символов в длину!');

  if (value.length > 16) throw new Error('Логин должен быть не более 16 символов в длину!');

  if (value.match(/[^\da-zA-Z_]+/))
    throw new Error('Логин может содержать только латиницу, цифры и нижние подчеркивания');

  return true;
};

const passwordValidator = (value) => {
  if (!value) throw new Error('Необходимо ввести пароль!');

  if (value.length < 8) throw new Error('Пароль должен быть не менее 8 символов в длину!');

  if (value.length > 32) throw new Error('Пароль должен быть не более 32 символов в длину!');

  if (value.match(' ')) {
    throw new Error('Пароль не должен содержать пробел!');
  }

  return true;
};

const nameFieldValidator = (name) => {
  return (value) => {
    if (!value) throw new Error(`Поле "${name}" пусто!`);

    if (value.match(/[^\u0400-\u04FF]/))
      throw new Error(`В поле "${name}" может содержаться только кириллица!`);

    return true;
  };
};

const nameFieldSanitizer = (value) => {
  if (!value) return;

  return value[0].toUpperCase() + value.slice(1).toLowerCase();
};

module.exports = {
  loginValidator,
  passwordValidator,
  nameFieldValidator,
  nameFieldSanitizer,
};
