const defineUserAbility = (defineAbilityFunc) => {
  return (req, res, next) => {
    req.ability = defineAbilityFunc(req.user);
    next();
  };
};

module.exports = defineUserAbility;
