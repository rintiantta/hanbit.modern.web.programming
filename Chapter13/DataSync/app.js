// 모듈을 추출합니다.
var http = require('http');
var express = require('express');
var app = express();

// 모듈을 설정합니다.
app.use(express.static('public'));
app.use(express.bodyParser());
app.use(app.router);

// 데이터를 생성합니다.
var books = [{
    _id: 0,
    name: '모던 웹을 위한 JavaScript + jQuery 입문',
    isbn: '9788979148749',
    today_count: 10
}, {
    _id: 1,
    name: '모던 웹을 위한 Node.js 프로그래밍',
    isbn: '9788979148886',
    today_count: 10
}, {
    _id: 2,
    name: '모던 웹을 위한 HTML5 + CSS3 입문',
    isbn: '9788979149555',
    today_count: 10
}];

// 라우트합니다.
app.get('/books', function (request, response) {
    response.send(books);
});

app.get('/books/:id', function (request, response) {
    response.send(books[Number(request.param('id'))]);
});

app.all('*', function (request, response) {
    // url과 body 속성을 출력합니다.
    console.log();
    console.log(request.method + ' : ' + request.url);
    console.log('body: ' + JSON.stringify(request.body, null, 2));
    // 응답합니다.
    response.send();
});

// 서버를 실행합니다.
http.createServer(app).listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});