// 모듈을 추출합니다.
var http = require('http');
var redis = require('redis');

// 데이터베이스를 연결합니다.
var client = redis.createClient();

// 서버 생성과 실행합니다.
http.createServer(function (request, response) {
    // 데이터 처리를 수행합니다.
    client.incr('request:count', function (error, count) {
        // 트랜잭션을 생성합니다.
        var multi = client.multi();
        multi.hset('request:' + count, 'method', request['method']);
        multi.hset('request:' + count, 'accept', request.headers['accept']);
        multi.hset('request:' + count, 'user-agent', request.headers['user-agent']);
        multi.hgetall('request:' + count);

        // 트랜잭션을 수행합니다.
        multi.exec(function (error, result) {
            // 응답합니다.
            response.end(JSON.stringify(result));
        });
    });
}).listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});