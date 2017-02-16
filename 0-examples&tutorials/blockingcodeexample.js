//blocking code example below

var fs = require("fs");

var data = fs.readFileSync('input.txt');	//synchronously reads a file

console.log(data.toString());
console.log("Program Ended");