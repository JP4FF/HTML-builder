const fs = require('fs');
const path = require('path');

let filesDirectory = path.join(__dirname, 'secret-folder');

fs.readdir(filesDirectory, {withFileTypes: true}, function(err, files) {
  if (err) {
    return console.log(err);
  } else {
    console.log('Information about files in \'secret-folder\':');
    for (let i = 0; i < files.length; i++) {
      if (!files[i].isDirectory()) {
        let fileFullName = files[i].name;
        // let fileName = fileFullName.slice(0, fileFullName.lastIndexOf('.'));
        let fileName = path.parse(fileFullName).name;
        let fileExt = path.extname(fileFullName).slice(1);

        let filePath = path.join(__dirname, 'secret-folder', fileFullName);

        fs.stat(filePath, function(err, stats) {
          if (err) {
            throw(err);
          } else {
            let fileSize = stats.size / 1000;
            console.log(`${fileFullName} - ${fileName} - ${fileExt} - ${fileSize}kb`);

            if (i == files.length - 1) {
              console.log('');
            }
          }
        });
      }
    }
  }
});