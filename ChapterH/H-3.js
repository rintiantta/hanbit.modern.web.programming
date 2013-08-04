// 모듈을 추출합니다.
var redis = require('redis');

// 데이터베이스를 연결합니다.
var client = redis.createClient();

// 데이터 처리를 수행합니다.
client.set('name', 'rintiantta', function (error, result) {
    client.get('name', function (error, result) {
        // 출력합니다.
        console.log(result);
    });
});