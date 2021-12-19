const defineUserAbility = (defineAbilityFunc) => {
  return (abilityMiddleware = (req, res, next) => {
    req.ability = defineAbilityFunc(req.user);
    next();
  });
};

module.exports = defineUserAbility;
