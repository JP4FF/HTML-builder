const fs = require('fs/promises');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const pagePath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

buildPage();

async function buildPage() {
  let pageStructure = await readComponentsFiles(componentsPath, '.html');
  let template = await readTemplate(templatePath);
  pageStructure.forEach((item) => {
    let temp = template.split(`{{${item.tagName}}}`);
    template = temp.join(`${item.text}`);
  });
  await makeDirectory(pagePath);
  await createFile(pagePath, 'index.html', template);

  let stylesStructure = await readComponentsFiles(stylesPath, '.css');
  stylesStructure.reverse();
  let styleData = '';
  stylesStructure.forEach((item, index) => {
    index == 0 ? styleData = item.text : styleData += '\n\n' + item.text;
  });
  await createFile(pagePath, 'style.css', styleData);

  await copyDirectory(assetsPath, path.join(pagePath, 'assets'));
}
// =========================================================
async function makeDirectory(folderName) {
  try {
    await fs.rm(folderName, {recursive: true, force: true});
    await fs.mkdir(folderName, {recursive: true});
    console.log(`Folder '${path.basename(folderName)}' was created successfully`);
  } catch (error) {
    console.log(`Can't create folder '${path.basename(folderName)}'`);
  }
}
// ---------------------------------------------------------
async function readComponentsFiles(folderName, fileExt) {
  try {
    const files = await fs.readdir(folderName, {encoding: 'utf8', withFileTypes: true});
    let filesObj = [];

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) == fileExt) {
        let filePath = path.join(folderName, file.name);
        let content = {tagName: path.basename(filePath, fileExt), text: ''};
        let fileData = await fs.readFile(filePath, 'utf8');
        content.text = fileData.toString();
        filesObj.push(content);
      }
    }

    return filesObj;

  } catch (error) {
    console.log(`Can't read folder '${path.basename(folderName)}'`);
    console.error(error);
  }
}
// ---------------------------------------------------------
async function readTemplate(fileName) {
  try {
    let fileData = await fs.readFile(fileName, 'utf8');
    fileData = fileData.toString();

    return fileData;

  } catch (error) {
    console.log(`Can't read file '${path.basename(fileName)}'`);
    console.error(error);
  }
}
// ---------------------------------------------------------
async function createFile(folderName, fileName, data = null) {
  const filePath = path.join(folderName, fileName);

  try {
    await fs.writeFile(filePath, data, 'utf8');
    console.log(`File '${fileName}' was created successfully`);
  } catch (error) {
    console.log(`Can't create file '${fileName}'`);
    console.error(error);
  }
}
// ---------------------------------------------------------
async function copyFolderFiles(filePath, toFolderPath) {
  try {
    const files = await fs.readdir(filePath, {encoding: 'utf8', withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const sourceFilePath = path.join(filePath, file.name);
        const destFilePath = path.join(toFolderPath, file.name);

        await fs.copyFile(sourceFilePath, destFilePath);
        console.log(`File '${file.name}' was copied`);
      } else if (file.isDirectory()) {
        const sourceDirPath = path.join(filePath, file.name);
        const destDirPath = path.join(toFolderPath, file.name);

        await makeDirectory(destDirPath);
        await copyFolderFiles(sourceDirPath, destDirPath);
        console.log(`Folder '${file.name}' was successfully copied\n`);
      }
    }
  } catch (error) {
    console.log(`Can't copy '${path.basename(filePath)}'`);
    console.error(error);
  }
}

async function copyDirectory(sourcePath, destPath) {
  try {
    console.log('');
    await makeDirectory(destPath);
    await copyFolderFiles(sourcePath, destPath);
    console.log(`Folder '${path.basename(sourcePath)}' was successfully copied\n`);
  } catch (error) {
    console.log(`Can't copy folder '${path.dirname(sourcePath)}'`);
    console.error(error);
  }
}
// =========================================================
