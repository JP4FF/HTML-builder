const fs = require('fs');
const path = require('path');

let dirOrigin = path.join(__dirname, 'files');
let dirCopy = path.join(__dirname, 'files-copy');

fs.rm(dirCopy, {recursive: true, force: true}, function(err) {
  if (err) {
    console.log('Folder \'files-copy\' does not exist');
  } else {
    console.log('Folder \'files-copy\' was successfuly deleted');
    copyDir(dirOrigin, dirCopy);
  }
});

function copyDir(fromDir, toDir) {
  fs.mkdir(toDir, {recursive: true}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Directory \'files-copy\' was successfuly created!');

      fs.readdir(fromDir, {withFileTypes: true}, function(err, files) {
        if (err) {
          return console.log(err);
        } else {
          let index = 0;
          files.forEach(function(file) {
            if (!file.isDirectory()) {
              let filePathFrom = path.join(fromDir, file.name);
              let filePathTo = path.join(toDir, file.name);

              fs.copyFile(filePathFrom, filePathTo, function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(` - ${file.name} was copied to '${path.basename(toDir)}' folder`);

                  if (index == files.length - 1) {
                    console.log('Files were successfuly copied\n');
                  }
                  index++;
                }
              });
            }
          });
        }
      });
    }
  });
}