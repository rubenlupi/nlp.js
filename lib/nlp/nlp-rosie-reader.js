const fs = require('fs');
const path = require('path');

class NlpRosieReader {
  constructor(manager) {
    this.manager = manager;
  }

  loadNamedEntities(pathName) {
    if (!pathName) {
      throw new Error('Path must be defined');
    }
    if (!fs.existsSync(pathName)) {
      throw new Error('Path does not exist');
    }
    const setDir = path.join(pathName, 'sets');
    const setFiles = fs.readdirSync(setDir).map(fileName => {
      return {
        name: fileName.substr(0, fileName.indexOf('.')),
        fullPath: path.join(setDir, fileName),
      };
    });

    setFiles.forEach(file => {
      const dataFile = fs.readFileSync(file.fullPath, 'utf8');
      const data = JSON.parse(dataFile);
      data.forEach(term => {
        const termJoined = term.join('.');
        if (term) {
          this.manager.addNamedEntityText(
            file.name,
            termJoined.toLowerCase(),
            ['en'],
            term
          );
        }
      });
    });
  }

  loadDocuments(pathName) {
    if (!pathName) {
      throw new Error('Path must be defined');
    }
    if (!fs.existsSync(pathName)) {
      throw new Error('Path does not exist');
    }
    const setDir = `${pathName}/lib/sets`;
    const setFiles = fs.readdirSync(setDir).map(fileName => {
      return {
        name: fileName,
        fullPath: path.join(setDir, fileName),
      };
    });

    setFiles.forEach(fileSet => {
      const data = fs.readFileSync(fileSet.fullPath, 'utf8');
      data.forEach(term => {
        if (term[0]) {
          this.manager.addNamedEntityText(
            fileSet.name,
            term[0],
            ['en'],
            data[0]
          );
        }
      });
    });
  }
}

module.exports = NlpRosieReader;
