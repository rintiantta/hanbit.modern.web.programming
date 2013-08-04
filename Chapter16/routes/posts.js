exports.active = function (app, db, sockets) {
    app.get('/posts', function (request, response) {
        if (request.user) {
            // 변수를 선언합니다.
            var count = Number(request.param('count')) || 5;
            var time = Number(request.param('time')) || Date.now();

            // 검색 대상 배열을 생성합니다.
            request.user.acceptFriends.push(request.user._id.toString());

            // 데이터베이스 요청을 수행합니다.
            db.posts.find({
                authorId: { $in: request.user.acceptFriends },
                regdate: { $lt: time }
            }).sort({
                regdate: -1
            }).limit(count, function (error, posts) {
                // 응답합니다.
                response.json(posts);
            });
        } else {
            response.json({
                code: 1,
                message: '로그인 되어있지 않습니다.'
            }, 400);
        }
    });

    app.get('/postsOf/:id', function (request, response) {
        if (request.user) {
            // 변수를 선언합니다.
            var id = request.param('id');
            console.log(id);
            var time = Number(request.param('time')) || Date.now();
            console.log(request.user.acceptFriends);
            if (id == request.user._id.toString() || request.user.acceptFriends.indexOf(id) != -1) {
                // 데이터베이스 요청을 수행합니다.
                db.posts.find({
                    authorId: id,
                    regdate: { $lt: time }
                }).sort({
                    _id: -1
                }, function (error, post) {
                    // 응답합니다.
                    response.json(post);
                });
            } else {
                response.json({
                    code: 2,
                    message: '친구가 아닙니다.'
                }, 400);
            }
        } else {
            response.json({
                code: 1,
                message: '로그인 되어있지 않습니다.'
            }, 400);
        }
    });

    app.post('/posts', function (request, response) {
        if (request.user) {
            // 변수를 선언합니다.
            var authorId = request.user._id.toString();
            var authorName = request.user.email.split('@')[0];
            var status = request.param('status');
            var regdate = Date.now();

            // 유효성을 검사합니다.
            if (status && (status = status.trim()) != '') {
                // 데이터베이스 요청을 수행합니다.
                db.posts.insert({
                    authorId: authorId,
                    authorName: authorName,
                    status: status,
                    regdate: regdate,
                    replies: []
                }, function (error, post) {
                    // 응답합니다.
                    response.json(post[0]);

                    // 푸시 합니다.
                    request.user.acceptFriends.push(request.user._id.toString());
                    request.user.acceptFriends.forEach(function (item) {
                        sockets.emitTo(item, 'message',{
                            code: 3,
                            message: '새 글을 생성했습니다.',
                            data: post[0]
                        });
                    });
                });
            } else {
                response.json({
                    code: 3,
                    message: '글을 입력하지 않았습니다.'
                }, 400);
            }
        } else {
            response.json({
                code: 1,
                message: '로그인 되어있지 않습니다.'
            }, 400);
        }
    });

    /* 직접 구현해보세요.
    app.put('/posts', function (request, response) { });
    app.del('/posts', function (request, response) { });
    */
};