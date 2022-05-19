const fs = require('fs');
const path = require('path');

let filePath = path.join(__dirname, 'text.txt');
// console.log(filePath);

var readStream = fs.createReadStream(filePath, 'utf8'); // or var readstream = new fs.ReadStream(filePath, 'utf8');

readStream.on('data', function (chunk) {
  console.log(chunk);
});

readStream.on('error', function (err) {
  if (err.code == 'ENOENT') {
    console.log('File not found');
  } else {
    console.error(err);
  }
});

readStream.on('end', function () {
  readStream.destroy();
  console.log('File reading finished.');
});
