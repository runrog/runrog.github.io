var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require("url");
var port = 2002;

http.createServer(function (request, response) {

    var filePath = './dist' + request.url;

    if (filePath == './dist/'){
      filePath = './dist/index.html';
    }

    // console.log(filePath + 'dist/');

    var extname = path.extname(filePath);
    var contentType = 'text/html';

    if(extname == '.js'){
      contentType = 'text/javascript';
    }
    if(extname == '.css'){
      contentType = 'text/css';
    }
    if(extname == '.json'){
      contentType = 'application/json';
    }
    if(extname == '.png'){
      contentType = 'image/png';
    }
    if(extname == '.jpg'){
      contentType = 'image/jpg';
    }
    if(extname == '.wav'){
      contentType = 'audio/wav';
    }
    if(extname == '.svg'){
      contentType = 'image/svg+xml';
    }
    if(extname =='.pdf'){
      contentType = 'application/pdf';
    }

    fs.readFile(filePath, function(error, content) {
      if (error) {
        if(error.code == 'ENOENT'){
            fs.readFile('./404.html', function(error, content) {
              response.writeHead(200, { 'Content-Type': contentType });
              response.end(content, 'utf-8');
            });
        }
        else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end();
        }
      }
      else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
      }
    });

}).listen(port);
