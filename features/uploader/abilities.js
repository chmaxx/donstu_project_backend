const { defineAbility } = require('@casl/ability');

const uploadAbilities = (user) =>
  defineAbility((can) => {
    switch (user.usergroup) {
      case 'admin':
        can('manage', 'all');
        break;
      case 'editor':
        can('write', 'Upload');
        can('delete', 'Upload', { author: user._id });
        break;
    }
  });

module.exports = uploadAbilities;
