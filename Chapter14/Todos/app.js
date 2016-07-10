// ����� �����մϴ�.
var express = require('express');
var http = require('http');

// �� ������ �����մϴ�.
var app = express();

// �����ͺ��̽��� �����մϴ�.
var db = require('mongojs').connect('rest', ['todos', 'users']);

// �� ������ �����մϴ�.
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser('secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static('public'));

// ���Ʈ�մϴ�.       
app.get('/', function (request, response) {
    if (request.session.me) {
        require('fs').readFile('main.html', function (error, file) {
            response.send(file.toString());
        });
    } else {
        response.redirect('/login');
    }
});
app.get('/login', function (request, response) {
    if (request.session.me) {
        response.redirect('/');
    } else {
        require('fs').readFile('login.html', function (error, file) {
            response.send(file.toString());
        });
    }
});
app.get('/register', function (request, response) {
    if (request.session.me) {
        response.redirect('/');
    } else {
        require('fs').readFile('register.html', function (error, file) {
            response.send(file.toString());
        });
    }
});
app.get('/logout', function (request, response) {
    if (request.session.me) {
        request.session.destroy();
        response.redirect('/');
    } else {
        response.send(401);
    }
});
app.post('/login', function (request, response) {
    var login = request.param('login');
    var password = request.param('password');
    if (login && password) {
        db.users.findOne({
            login: login
        }, function (error, result) {
            if (error) {
                response.send(500);
            } else if (result) {
                var shasum = require('crypto').createHash('sha1');
                shasum.update(password);
                var hash = shasum.digest('hex');
                if (hash == result.hash) {
                    request.session.me = result;
                    response.redirect('/');
                } else {
                    response.send({ message: '��й�ȣ�� ���� ����' }, 400);
                }
            } else {
                response.send({ message: '���̵� ����' }, 400);
            }
        });
    } else {
        // Status Code 400(�߸��� ��û)
        response.send({ message: '��û �Ű������� �������� ����' }, 400);
    }
});
app.post('/register', function (request, response) {
    var login = request.param('login');
    var password = request.param('password');
    if (login && password) {
        db.users.findOne({
            login: login
        }, function (error, result) {
            if (result) {
                response.send(409);
            } else {
                var shasum = require('crypto').createHash('sha1');
                shasum.update(password);
                var hash = shasum.digest('hex');
                db.users.insert({
                    login: login,
                    hash: hash
                }, function (error, result) {
                    if (error) {
                        response.send(500);
                    } else {
                        response.redirect('/login');
                    }
                });
            }
        });
    } else {
        response.send(400);
    }
});
app.get('/todos', function (request, response) {
    if (request.session.me) {
        db.todos.find({
            author: request.session.me._id.toString()
        }, function (error, results) {
            if (error) {
                // Status Code 500(���� ���� ����)
                response.send(500);
            } else {
                // Status Code 200(����)
                response.send(results);
            }
        });
    } else {
        // Status Code 401(���� ����)
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
                // Status Code 500(���� ���� ����)
                response.send(500);
            } else if (result) {
                // Status Code 200(����)
                response.send(result);
            } else {
                // Status Code 404(ã�� �� ����)
                response.send(404);
            }
        });
    } else {
        // Status Code 401(���� ����)
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
                    // Status Code 500(���� ���� ����)
                    response.send(500);
                } else {
                    // Status Code 200(����)
                    response.send(results);
                }
            });
        } else {
            // Status Code 400(�߸��� ��û)
            response.send(400);
        }
    } else {
        // Status Code 401(���� ����)
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
                    completed: request.param('completed') == 'true' ? true : false
                }
            }, function (error, result) {
                if (error) {
                    // Status Code 500(���� ���� ����)
                    response.send(500);
                } else {
                    // Status Code 200(����)
                    response.send(200);
                }
            });
        } else {
            // Status Code 400(�߸��� ��û)
            response.send(400);
        }
    } else {
        // Status Code 401(���� ����)
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
                // Status Code 500(���� ���� ����)
                response.send(500);
            } else {
                // Status Code 200(����)
                response.send(200);
            }
        });
    } else {
        // Status Code 401(���� ����)
        response.send(401);
    }
});
app.get('/users', function (request, response) {
    db.users.find(function (error, results) {
        response.send(results);
    });
});

// �� ������ �����մϴ�.
http.createServer(app).listen(52273, function () {
    console.log('Express server listening on port 52273');
});