exports.getGCD = function (number_1, number_2) {
    // 변수를 선언합니다.
    var modular = number_1 % number_2;

    // 연산을 시작합니다.
    while (modular != 0) {
        number_1 = number_2;
        number_2 = modular;
        modular = number_1 % number_2;
    }

    // 연산 종료
    return number_2;
};