const { defineAbility } = require('@casl/ability');

const userAbilities = (user) =>
  defineAbility((can) => {
    if (user.usergroup === 'admin') {
      can('manage', 'all');
    }
  });

module.exports = userAbilities;
