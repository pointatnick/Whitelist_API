const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
csvToJson.fieldDelimiter(',');
const { exit } = require('process');

// constants
const CONFIG_FILEPATH = './config.json';
const CSV_FILEPATH = './whitelisted.csv';
const CSV_FILENAME = 'whitelisted.csv';
const JSON_FILEPATH = './whitelisted.json';
const JSON_FILENAME = 'whitelisted.json';

module.exports = {
  convertCsvToJson: () => {
    const config = require(CONFIG_FILEPATH);

    if (!fs.existsSync(CSV_FILEPATH)) {
      // check for whitelisted.csv
      console.log('ERROR: No whitelisted.csv file has been found');
      exit(1);
    }
    if (!fs.existsSync(JSON_FILEPATH)) {
      // generate whitelisted.json from whitelisted.csv
      csvToJson.generateJsonFileFromCsv(CSV_FILENAME, JSON_FILENAME);
      config.loaded = true;
      console.log('No whitelisted.json detected, converting csv to json');
    }
    if (!config.load_csv_onetime) {
      // generate whitelisted.json from whitelisted.csv
      csvToJson.generateJsonFileFromCsv(CSV_FILENAME, JSON_FILENAME);
      console.log('Json reloaded: config is set csv_run_onetime = false');
    } else {
      console.log('Skipping csv reload, config is set csv_run_onetime = true');
      if (!config.loaded) {
        config.loaded = true;
        fs.writeFile(CONFIG_FILEPATH, JSON.stringify(config), 'utf8', (err) => {
          if (err) {
            console.log(err);
          }
        });
        csvToJson.generateJsonFileFromCsv(CSV_FILENAME, JSON_FILENAME);
        console.log('Data reloaded due to config loaded = false');
      }
    }
  },
};
