// 모듈을 추출합니다.
var express = require('express');
var http = require('http');
var path = require('path');
var everyauth = require('everyauth');
var mongojs = require('mongojs');
var redis = require('redis');

// 개인 모듈을 추출합니다.
var rintAuth = require('./routes/auth');
var rintMain = require('./routes/main');
var rintPosts = require('./routes/posts');
var rintFriends = require('./routes/friends');
var rintReplies = require('./routes/replies');
var rintSockets = require('./routes/sockets');

// 기본 메서드를 추가합니다.
Object.defineProperties(Array.prototype, {
    contain: {
        value: function (data) {
            if (this.indexOf(data) != -1) {
                return true;
            } else {
                return false;
            }
        }
    },
    remove: {
        value: function (data) {
            var index = this.indexOf(data);
            if (index) { removeAt(index); }
            return this;
        }
    },
    removeAt: {
        value: function (index) {
            this.splice(index, 1);
            return this;
        }
    }
});

// 데이터베이스를 연결합니다.
var db = mongojs.connect('social', ['posts', 'users', 'socket']);
var client = redis.createClient();
process.on('exit', function () {
    client.quit();
});

// 기본 함수를 추출합니다.
var ObjectId = db.ObjectId;
var parse = require('express/node_modules/cookie').parse;
var parseSignedCookies = require('express/node_modules/connect/lib/utils').parseSignedCookies;
var parseCookie = function (cookie) {
    return parseSignedCookies(parse(cookie), 'your secret here')
};

// 서버를 생성합니다.
var app = express();
var server = http.createServer(app);

// 세션 저장소를 생성합니다: 세션 저장소를 Redis 데이터베이스로 변경해도 좋습니다.
var sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 });

// EveryAuth 모듈을 기본 설정합니다.
rintAuth.active(everyauth, db);

// 서버를 설정합니다: 기본 설정
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session({
        key: 'session',
        store: sessionStore
    }));
    app.use(everyauth.middleware());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// 서버를 설정합니다: 개발 모드
app.configure('development', function(){
    app.use(express.errorHandler());
});

// 소켓 서버를 생성합니다.
var io = require('socket.io').listen(server);
io.set('log level', 2);

// 라우트를 수행합니다.
rintMain.active(app, db);
rintPosts.active(app, db, io.sockets.sockets);
rintFriends.active(app, db, io.sockets.sockets);
rintReplies.active(app, db, io.sockets.sockets);
rintSockets.active(io, client, parseCookie, sessionStore);

// 서버를 실행합니다.
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});