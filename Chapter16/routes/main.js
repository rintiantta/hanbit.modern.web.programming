exports.active = function (app, db) {
    app.get('/', function (request, response) {
        if (request.user) {
            // 로그인 했을 경우
            response.render('index', {
                user: request.user
            });
        } else {
            // 유저가 존재하지 않을 경우
            response.redirect('/login');
        }
    });
};