exports.active = function (app, db, sockets) {
    app.post('/replies/:id', function (request, response) {
        if (request.user) {
            // 변수를 선언합니다.
            var postId = request.param('id');
            var authorId = request.user._id;
            var authorName = request.user.email.split('@')[0];
            var status = request.param('status');
            var regdate = Date.now();

            // 유효성을 검사합니다.
            if (status && (status = status.trim()) != '') {
                 // 데이터베이스 요청을 수행합니다.
                db.posts.update({
                    _id: db.ObjectId(postId)
                }, {
                    $push: {
                        replies: {
                            authorId: authorId,
                            authorName: authorName,
                            status: status,
                            regdate: regdate
                        }
                    }
                }, function (error, replies) {
                    // 응답합니다.
                    response.json(replies[0]);
                    
                    // 푸시 합니다.
                    request.user.acceptFriends.push(request.user._id.toString());
                    request.user.acceptFriends.forEach(function (item) {
                        sockets.emitTo(item, 'message', {
                            code: 4,
                            message: '새 댓글을 생성했습니다.',
                            target: postId,
                            data: {
                                authorId: authorId,
                                authorName: authorName,
                                status: status,
                                regdate: regdate
                            }
                        });
                    });
                });
            } else {
                response.json({
                    code: 4,
                    message: '댓글을 입력하지 않았습니다.'
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
    app.put('/replies/:id', function (request, response) { });
    app.del('/replies/:id', function (request, response) { });
    */
};