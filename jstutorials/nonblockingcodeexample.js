//non-blocking code example 

var fs = require("fs");

fs.readFile('input.txt', function (err, data) {	//asynchronous file reading
   if (err){
   		return console.error(err);
   		//console.log(err.stack);
   }
   console.log(data.toString());
});

console.log("Program Ended");