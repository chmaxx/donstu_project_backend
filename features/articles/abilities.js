const { defineAbility } = require('@casl/ability');

const articleAbilities = (user) =>
  defineAbility((can) => {
    switch (user.usergroup) {
      case 'admin':
        can('manage', 'all');
        break;
      case 'editor':
        can('write', 'Article');
        can(['update', 'delete'], 'Article', { authorId: user._id });
        break;
    }
  });

module.exports = articleAbilities;
