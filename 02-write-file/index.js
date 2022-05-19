const fs = require('fs');
const path = require('path');
const events = require('events');
const {stdin: input, stdout: output} = require('process');
const readline = require('readline');

let eventGreet = new events();
eventGreet.on('greet', function() {
  console.log('\nWelcome to write file task!');
  console.log('To stop typing text type \'exit\' or press \'ctrl + c\'');
  console.log('Please enter some text...');
});
eventGreet.emit('greet');

let filePath = path.join(__dirname, 'input.txt');

const rl = readline.createInterface({input, output});
let writeStream = fs.createWriteStream(filePath);

// rl.question('Please enter some text...\n', function(answer) {
//   console.log(`Received text: ${answer}`);
//   writeStream.write(answer + '\n');
// });

rl.on('line', function(text) {
  if (text.toLowerCase() == 'exit') {
    rl.close();
  } else {
    console.log(`Received text: ${text}`);
    console.log('Please enter some text...');
    writeStream.write(text + '\n');
  }
});

process.stdin.on('data', function(key) {
  if (key === 'u0003') {
    rl.close();
  }
});

rl.on('close', function() {
  writeStream.destroy();

  let readStream = fs.createReadStream(filePath, 'utf8');
  console.log('\nAll text in input.txt file:');
  readStream.on('data', function(chunk){
    console.log(chunk);
  });

  readStream.on('end', function() {
    readStream.destroy();
    console.log('File reading finished.');
  });
});

process.on('exit', function() {
  console.log('Bye bye!\n');
});