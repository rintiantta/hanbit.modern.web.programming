// 모듈을 추출합니다.
var http = require('http');
var cluster = require('cluster');
var cores = require('os').cpus().length;

// 포트 번호를 매개변수로 받습니다.
var port = Number(process.argv[2]);

// 본문을 실행합니다.
if (cluster.isMaster) {
    for (var i = 0; i < cores; i++) {
        cluster.fork();
    }
} else {
    http.createServer(function (request, response) {
        response.writeHead(200, { 'Content-Type': 'text/template' });
        response.end('<h1>Welcome to ' + port + '</h1>');
    }).listen(port, function (request, response) {
        console.log('Server Running at http://127.0.0.1');
    });
}