exports.active = function (everyauth, db) {
    // EveryAuth 모듈의 기본 설정을 합니다.
    var auth = everyauth.password.loginWith('email');
    everyauth.everymodule.userPkey('_id');
    everyauth.everymodule.findUserById(function (id, callback) {
        db.users.findOne({ _id: db.ObjectId(id) }, function (error, user) {
            callback(error, user);
        });
    });

    // 로그아웃 설정
    everyauth.everymodule.logoutPath('/logout');
    everyauth.everymodule.logoutRedirectPath('/login');

    // 가입 설정
    auth.registerView('register');
    auth.getRegisterPath('/register');
    auth.postRegisterPath('/register');
    auth.extractExtraRegistrationParams(function (request) {
        return {
            confirmPassword: request.param('password-confirm')
        }
    });
    auth.validateRegistration(function (userAttribute, errors) {
        // 변수를 선언합니다.
        var promise = this.Promise();

        // 문자열 길이를 확인합니다.
        if (!/\w+@\w+\.\w+/.test(userAttribute.email)) {
            errors.push('올바른 이메일 형식이 아닙니다.');
        }
        // 비밀번호 개수 확인
        if (userAttribute.password.length < 8) {
            errors.push('비밀번호가 8글자 이하입니다.');
        }
        // 비밀번호 인증을 확인합니다.
        if (userAttribute.confirmPassword != userAttribute.password) {
            errors.push('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
        }
        // 데이터베이스에 데이터를 요청합니다.
        db.users.findOne({ email: userAttribute.email }, function (error, result) {
            if (result) {
                errors.push('이미 존재하는 아이디입니다.');
                promise.fulfill(errors);
            } else if (errors.length) {
                promise.fulfill(errors);
            } else {
                promise.fulfill(userAttribute);
            }
        });

        // 리턴합니다.
        return promise;
    });
    auth.registerUser(function (userAttribute) {
        // 변수를 선언합니다.
        var promise = this.Promise();
        var user = {
            email: userAttribute.email,
            password: userAttribute.password,
            acceptFriends: [],
            requestFriends: [],
            pendingFriends: []
        };

        // 데이터베이스에 데이터 저장을 요청합니다.
        db.users.insert(user, function (error, result) {
            if (error) {
                promise.fulfill([error]);
            } else if (result[0]) {
                // 리턴합니다.
                promise.fulfill(result[0]);

                // 글 하나를 기본으로 입력합니다: 쉽게 구성하겠습니다.
                var authorId = result[0]._id.toString();
                var authorName = result[0].email.split('@')[0];

                db.posts.insert({
                    authorId: authorId,
                    authorName: authorName,
                    status: authorName + '님 환영합니다.',
                    regdate: Date.now(),
                    replies: []
                });
            } else {
                promise.fulfill(['알 수 없는 오류가 발생했습니다.']);
            }
        });

        // 리턴합니다.
        return promise;
    });
    auth.registerSuccessRedirect('/');

    // 로그인 설정
    auth.loginView('login');
    auth.getLoginPath('/login');
    auth.postLoginPath('/login')
    auth.authenticate(function (email, password) {
        // 변수를 선언합니다.
        var promise = this.Promise();
        var errors = [];

        // 유효성을 확인합니다.
        if (!email) errors.push('이메일을 입력하세요.');
        if (!password) errors.push('비밀번호를 입력하세요.');
        if (errors.length) {
            return errors;
        }

        // 데이터베이스에 데이터를 요청합니다.
        db.users.findOne({
            email: email,
            password: password
        }, function (error, user) {
            if (error) {
                promise.fulfill(['알수 없는 오류가 발생했습니다.']);
            } else if (user) {
                promise.fulfill(user);
            } else {
                promise.fulfill(['아이디 또는 비밀번호를 잘못 입력했습니다.']);
            }
        });

        // 리턴합니다.
        return promise;

    });
    auth.loginSuccessRedirect('/');
};