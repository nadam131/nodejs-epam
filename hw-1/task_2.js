const fs = require("fs");
const csv = require("csvtojson");
const { pipeline } = require("stream");

const csvPath = "./assets/example.csv";

const readStream = fs.createReadStream(csvPath);
const writeStream = fs.createWriteStream("./example.txt");

pipeline(readStream, csv(), writeStream, (error) => {
  console.log(error, "error");
});
