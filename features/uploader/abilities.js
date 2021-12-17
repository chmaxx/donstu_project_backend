const { defineAbility } = require('@casl/ability');

const uploadAbilities = (user) =>
  defineAbility((can) => {
    switch (user.usergroup) {
      case 'admin':
        can('manage', 'all');
        break;
      case 'editor':
        can(['write', 'delete'], 'Upload');
        break;
    }
  });

module.exports = uploadAbilities;
