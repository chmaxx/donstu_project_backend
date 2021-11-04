const { watch } = require('fs');
const { getUploadPath } = require('./index');

watch(getUploadPath(), (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
