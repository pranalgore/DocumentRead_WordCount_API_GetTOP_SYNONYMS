var fs = require('fs');
var file = 'big.txt';
var stopw = require('remove-stopwords');
var fetch = require('cross-fetch');
const https = require("https");
request = require('request');
zlib = require('zlib');
var _ = require("lodash");
var async = require("async");

const _apiURL = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=';
const _newfile = fs.createWriteStream("data.txt");

// https.get("https://norvig.com/big.txt", response => {
//     console.log('File reading success');
//     var stream = response.pipe(_newfile);

//     stream.on("finish", function () {
        var _file = "big.txt";
        fs.readFile(_file, 'utf8', function (err, _data) {

            if (err) throw err;

            /*
             Data read success. Now remove the stopwords which does not mean a much
             then split - Map - Array of name and counts
            */

            var _wordsArray = splitWords(_data);
            _wordsArray = stopw.removeStopwords(_wordsArray, ['\"I', 'itI', '"', '\"', 'Mr.', '"I', 'I-VII', 'I,', 'I;', 'I?', 'I.', 'I."', 'I\'d', 'I\'ll', 'I\'m', 'I\'ve']);
           
            var _wordsMap = createWordMap(_wordsArray);
           
            var _finalWordsArray = sortByCount(_wordsMap);
           
            var jsonData = {};
            
            // get top 10 records
            top10_finalWordsArray = _finalWordsArray.slice(0, 10);
            
            var promises = [];
            console.log(top10_finalWordsArray);
            top10_finalWordsArray.forEach(element => {
                var _wordText = element['name'];
                var _wordText_count = element['total'];

                https.get(_apiURL + _wordText, (resp) => {

                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        let _pos = null;
                        if (typeof JSON.parse(chunk) !== 'undefined') {
                            if (JSON.parse(chunk).def.length > 0 && typeof JSON.parse(chunk).def[0]["pos"] !== 'undefined')
                                _pos = JSON.parse(chunk).def[0]["pos"];
                        }
                        jsonData = { Word: _wordText, Count: _wordText_count, pos: _pos };
                        promises.push(jsonData);
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        console.log(JSON.stringify(promises));
                        fs.writeFile("output_file.json", JSON.stringify(promises), function (err) {
                            if (err) throw err;
                            console.log('complete');
                        }
                        );
                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });

            });


            function splitWords(text) {
                // split string by spaces (including spaces, tabs, and newlines)
                var wordsArray = text.split(/\s+/);
                return wordsArray;
            }


            function createWordMap(wordsArray) {

                // create map for word counts
                var wordsMap = {};

                wordsArray.forEach(function (key) {
                    if (wordsMap.hasOwnProperty(key)) {
                        wordsMap[key]++;
                    } else {
                        wordsMap[key] = 1;
                    }
                });

                return wordsMap;

            }


            function sortByCount(wordsMap) {

                // sort by count in descending order
                var finalWordsArray = [];
                finalWordsArray = Object.keys(wordsMap).map(function (key) {
                    return {
                        name: key,
                        total: wordsMap[key]
                    };
                });

                finalWordsArray.sort(function (a, b) {
                    return b.total - a.total;
                });

                return finalWordsArray;

            }

            console.log("done");
        });
//     });
// });
// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write(req.url);
//   res.end();
// }).listen(8080);
