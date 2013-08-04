// 모듈을 추출합니다.
var express = require('express');
var http = require('http');

// 웹 서버를 생성합니다.
var app = express();

// 데이터베이스에 연결합니다.
var db = require('mongojs').connect('rest', ['todos', 'users']);

// 웹 서버를 설정합니다.
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser('secret key'));
app.use(express.session());
app.use(express.static('public'));
app.use(app.router);

// 라우트합니다.                        
app.get('/todos', function (request, response) {
    if (request.session.me) {
        db.todos.find({
            author: request.session.me._id.toString()
        }, function (error, results) {
            if (error) {
                // Status Code 500(내부 서버 오류)
                response.send(500);
            } else {
                // Status Code 200(성공)
                response.send(results);
            }
        });
    } else {
        // Status Code 401(권한 없음)
        response.send(401);
    }
});

app.get('/todos/:id', function (request, response) {
    if (request.session.me) {
        db.todos.findOne({
            _id: db.ObjectId(request.param('id')),
            author: request.session.me._id.toString()
        }, function (error, result) {
            if (error) {
                // Status Code 500(내부 서버 오류)
                response.send(500);
            } else if (result) {
                // Status Code 200(성공)
                response.send(result);
            } else {
                // Status Code 404(찾을 수 없음)
                response.send(404);
            }
        });
    } else {
        // Status Code 401(권한 없음)
        response.send(401);
    }
});

app.post('/todos', function (request, response) {
    if (request.session.me) {
        if (request.param('title')) {
            db.todos.insert({
                title: request.param('title'),
                completed: false,
                author: request.session.me._id.toString()
            }, function (error, results) {
                if (error) {
                    // Status Code 500(내부 서버 오류)
                    response.send(500);
                } else {
                    // Status Code 200(성공)
                    response.send(results);
                }
            });
        } else {
            // Status Code 400(잘못된 요청)
            response.send(400);
        }
    } else {
        // Status Code 401(권한 없음)
        response.send(401);
    }
});
app.put('/todos/:id', function (request, response) {
    if (request.session.me) {
        if (request.param('completed')) {
            db.todos.update({
                _id: db.ObjectId(request.param('id')),
                author: request.session.me._id.toString()
            }, {
                $set: {
                    completed: (function () {
                        if (request.param('completed') == 'true')
                            return true;
                        else if (request.param('completed') == true)
                            return true;
                        else
                            return false;
                    })()
                }
            }, function (error, result) {
                if (error) {
                    // Status Code 500(내부 서버 오류)
                    response.send(500);
                } else {
                    // Status Code 200(성공)
                    response.send(200);
                }
            });
        } else {
            // Status Code 400(잘못된 요청)
            response.send(400);
        }
    } else {
        // Status Code 401(권한 없음)
        response.send(401);
    }
});

app.del('/todos/:id', function (request, response) {
    if (request.session.me) {
        db.todos.remove({
            _id: db.ObjectId(request.param('id')),
            author: request.session.me._id.toString()
        }, function (error, result) {
            if (error) {
                // Status Code 500(내부 서버 오류)
                response.send(500);
            } else {
                // Status Code 200(성공)
                response.send(200);
            }
        });
    } else {
        // Status Code 401(권한 없음)
        response.send(401);
    }
});

app.get('/users', function (request, response) {
    db.users.find(function (error, results) {
        response.send(results);
    });
});

app.post('/users', function (request, response) {
    // 변수를 선언합니다.
    var login = request.param('login');
    var password = request.param('password');
    if (login && password) {
        // 아이디 중복을 확인합니다.
        db.users.findOne({
            login: login
        }, function (error, result) {
            if (result) {
                // Status Code 409(충돌)
                response.send(409);
            } else {
                // 해시를 생성합니다.
                var shasum = require('crypto').createHash('sha1');
                shasum.update(password);
                var hash = shasum.digest('hex');
                // 데이터베이스 요청을 수행합니다.
                db.users.insert({
                    login: login,
                    hash: hash
                }, function (error, result) {
                    if (error) {
                        // Status Code 500(내부 서버 오류)
                        response.send(500);
                    } else {
                        // Status Code 200(성공)
                        response.send(result);
                    }
                });
            }
        });
    } else {
        // Status Code 400(잘못된 요청)
        response.send(400);
    }
});

app.post('/users/login', function (request, response) {
    // 변수를 선언합니다.
    var login = request.param('login');
    var password = request.param('password');
    if (login && password) {
        // 데이터베이스에서 사용자를 찾습니다.
        db.users.findOne({
            login: login
        }, function (error, result) {
            if (error) {
                // Status Code 500(내부 서버 오류)
                response.send(500);
            } else if (result) {
                // 해시를 생성합니다.
                var shasum = require('crypto').createHash('sha1');
                shasum.update(password);
                var hash = shasum.digest('hex');
                // 비교합니다.
                if (hash == result.hash) {
                    // Status Code 200(성공)
                    request.session.me = result;
                    response.send(200);
                } else {
                    // Status Code 400(잘못된 요청)
                    response.send({ message: '비밀번호가 맞지 않음' }, 400);
                }
            } else {
                // Status Code 400(잘못된 요청)
                response.send({ message: '아이디 없음' }, 400);
            }
        });
    } else {
        // Status Code 400(잘못된 요청)
        response.send({ message: '요청 매개변수가 적절하지 않음' }, 400);
    }
});

app.get('/users/me', function (request, response) {
    // 로그인 상태 확인
    if (request.session.me) {
        // Status Code 200(성공)
        response.send(request.session.me);
    } else {
        // Status Code 401(권한 없음)
        response.send(401);
    }
});

app.get('/users/logout', function (request, response) {
    // 로그인 상태 확인
    if (request.session.me) {
        // 세션을 제거합니다.
        request.session.destroy();
        // Status Code 200(성공)
        response.send(200);
    } else {
        // Status Code 401(권한 없음)
        response.send(401);
    }
});

// 웹 서버를 실행합니다.
http.createServer(app).listen(52273, function () {
    console.log('Express server listening on port 52273');
});