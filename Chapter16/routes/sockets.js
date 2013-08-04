exports.active = function (io, client, parseCookie, sessionStore) {
    io.set('authorization', function (data, accept) {
        if (data.headers.cookie) {
            var cookies = parseCookie(data.headers.cookie);
            if (cookies.session) {
                sessionStore.get(cookies.session, function (error, session) {
                    if (session && session.auth) {
                        data.userId = session.auth.userId;
                        accept(null, true);
                    } else {
                        accept('ERROR', true);
                    }
                });
            }
        } else {
            accept('ERROR', false);
        };
    });

    // 소켓 서버 이벤트를 설정합니다.
    io.sockets.on('connection', function (socket) {
        // 변수를 선언합니다.
        var userId = socket.handshake.userId;

        // 사용자에게 소켓 아이디를 추가합니다.
        client.lpush('sockets:' + userId, socket.id);
        socket.emit('sucecss');

        // disconnect 이벤트
        socket.on('disconnect', function () {
            // 사용자에게서 소켓 아이디를 제거합니다: 0은 전부 제거를 의미합니다.
            client.lrem('sockets:' + userId, 0, socket.id);
        });
    });

    // 사용자 정의 메서드
    io.sockets.sockets.emitTo = function (userId, name, message) {
        // 푸시 요청을 수행합니다.
        client.lrange('sockets:' + userId, 0, -1, function (error, data) {
            if (data) {
                console.log(data)
                data.forEach(function (item) {
                    if (io.sockets.sockets[item]) {
                        io.sockets.sockets[item].emit(name, message);
                    }
                });
            }
        });
    };
};