function isJSON(item) {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
}

function ResponseMessage(message = undefined, additionalData = {}) {
  return {
    message,
    ...additionalData,
  };
}

module.exports = {
  isJSON,
  ResponseMessage,
};
