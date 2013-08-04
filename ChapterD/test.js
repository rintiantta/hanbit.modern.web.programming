// 모듈을 추출합니다.
var should = require('should');
var module = require('./module');

// 테스트를 작성합니다.
describe('module.getGCD()', function () {
    // 동작 테스트
    it('should be 21', function (done) {
        // 테스트 시작
        module.getGCD(252, 735).should.equal(21);

        // 테스트 통과
        done();
    });

    // 예외 테스트
    it('should occur a exception', function (done) {
        try {
            // 테스트 시작
            GetGCD(252, 735).should.equal(21);

            // 테스트 실패
            should.fail();
        } catch (exception) {
            // 테스트 통과
            done();
        }
    });
});