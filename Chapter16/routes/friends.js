exports.active = function (app, db, sockets) {
    // 테스트 전용
    app.get('/users', function (request, response) {
        // 데이터베이스 요청을 수행합니다.
        db.users.find( function (error, data) {
            // 응답합니다.
            response.json(data);
        });
    });

    app.get('/user', function (request, response) {
        if (request.user) {
            db.users.find({
                _id: []
            });
            response.json(request.user);
        } else {
            response.json({
                code: 1,
                message: '로그인 되어있지 않습니다.'
            }, 400);
        }
    });

    app.get('/search/:query', function (request, response) {
        if (request.user) {
            // 변수를 선언합니다.
            var query = request.param('query');
            
            // 데이터베이스 요청을 수행합니다.
            db.users.find({
                email: new RegExp('.*' + query + '.*')
            }, {
                _id: true,
                email: true
            }, function (error, results) {
                // 데이터를 생성합니다.
                var output = {
                    acceptFriends: [],
                    pendingFriends: [],
                    requestFriends: [],
                    other: []
                };
                results.forEach(function (item) {
                    if (request.user.acceptFriends.indexOf(item._id.toString()) != -1) {
                        output.acceptFriends.push(item);
                    } else if (request.user.pendingFriends.indexOf(item._id.toString()) != -1) {
                        output.pendingFriends.push(item);
                    } else if (request.user.requestFriends.indexOf(item._id.toString()) != -1) {
                        output.requestFriends.push(item);
                    } else if (request.user._id.toString() != item._id.toString()) {
                        output.other.push(item);
                    }
                });

                // 응답합니다.
                response.json(output);
            });
        } else {
            response.json({
                code: 1,
                message: '로그인 되어있지 않습니다.'
            }, 400);
        }
    });

    app.get('/friends/request/:id', function (request, response) {
        if (request.user) {
            // 변수를 선언합니다.
            var otherId = request.param('id');

            if (request.user._id.toString() == otherId) {
                response.json({
                    code: 5,
                    message: '자기 자신에게 친구 요청할 수 없습니다.'
                }, 400);
            } else if(request.user.requestFriends.contain(otherId)) {
                // 에러 응답
                response.json({
                    code: 6,
                    message: '이미 요청한 상대입니다.'
                }, 400);
            } else {
                // 상대방의 데이터를 가져옵니다.
                db.users.findOne({
                    _id: db.ObjectId(otherId)
                }, function (error, other) {
                    if (other) {
                        // 상대가 나에게 요청을 한적이 있는지 없는지 확인합니다.
                        var position = request.user.pendingFriends.indexOf(otherId)
                        if (position != -1) {
                            // PendingFriends 배열에 있을 경우: 친구를 맺습니다.
                            request.user.pendingFriends.splice(position, 1);
                            request.user.acceptFriends.push(otherId);

                            var otherPosition = other.requestFriends.indexOf(request.user._id.toString());
                            other.requestFriends.splice(otherPosition, 1);
                            other.acceptFriends.push(request.user._id.toString());

                            // 저장합니다.
                            db.users.save(request.user);
                            db.users.save(other);

                            // 응답합니다.
                            response.json({
                                code: 1,
                                message: '친구를 맺었습니다.'
                            });

                            // 푸시 요청을 수행합니다.
                            sockets.emitTo(otherId, 'message', {
                                code: 1,
                                message: '친구를 맺었습니다.'
                            });
                        } else {
                            // PendingFriends 배열에 없을 경우: 친구 요청을 보냅니다.
                            request.user.requestFriends.push(otherId);
                            other.pendingFriends.push(request.user._id.toString())

                            // 저장합니다.
                            db.users.save(request.user);
                            db.users.save(other);

                            // 응답합니다.
                            response.json({
                                code: 2,
                                message: '친구 요청을 보냈습니다.'
                            });

                            // 푸시 요청을 수행합니다.
                            sockets.emitTo(otherId, 'message', {
                                code: 2,
                                message: '친구 요청 완료'
                            });
                        }
                    } else {
                        response.json({
                            code: 7,
                            message: '존재하지 않는 상대입니다.'
                        }, 400);
                    }
                });
            }
        } else {
            response.json({
                code: 1,
                message: '로그인 되어있지 않습니다.'
            }, 400);
        }
    });
};