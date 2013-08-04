// 모듈을 추출합니다.
var should = require('should');

// 변수를 선언합니다.
var rint = {
    name: 'rintiantta',
    instruments: [
        'guitarA',
        'guitarB',
        'guitarC',
        'guitarD',
        'Bass',
        'Synthesizer']
};

// 테스트를 수행합니다.
rint.should.have.property('name', 'rint');
rint.instruments.should.have.lengthOf(2);
rint.instruments.should.be.empty();
rint.instruments.length.should.be.within(5, 10);