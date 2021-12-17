const { defineAbility } = require('@casl/ability');

const articleAbilities = (user) =>
  defineAbility((can) => {
    switch (user.usergroup) {
      case 'admin':
        can('manage', 'all');
        break;
      case 'editor':
        can(['write', 'update', 'delete'], 'Article');
        break;
    }
  });

module.exports = articleAbilities;
