var http= require("http");
var fs= require("fs");
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/javascript','Access-Control-Allow-Origin':'*'});
  var bot=fs.readFileSync("main.js","utf8");
  
  res.end(bot);
}).listen(3030);

