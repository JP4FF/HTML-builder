const fs = require('fs');
const path = require('path');

let dirStyles = path.join(__dirname, 'styles');
let dirBundle = path.join(__dirname, 'project-dist');

let fileBundle = path.join(dirBundle, 'bundle.css');

createFile();

// ========================================================
function createFile() {
  // let fileBundle = path.join(dirBundle, 'bundle.css');
  fs.writeFile(fileBundle, '', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('File \'bundle.css\' was created...');
      mergeStyles();
    }
  });
}

function mergeStyles() {
  fs.readdir(dirStyles, {withFileTypes: true}, function(err, files) {
    if (err) {console.log(err);}
    else {
      files.forEach(function(file) {
        if (!file.isDirectory() && path.extname(file.name) == '.css') {
          let filePath = path.join(dirStyles, file.name);
          let readStream = fs.createReadStream(filePath, 'utf8');

          readStream.on('data', function(chunk) {
            fs.appendFile(fileBundle, chunk, function(err) {
              if (err) throw err;
              console.log(` - content from ${file.name} was added to ${path.basename(fileBundle)}`);
            });
          });

          readStream.on('end', function() {
            console.log(` - finished reading ${file.name} file`);
          });
        }
      });
    }
  });
}