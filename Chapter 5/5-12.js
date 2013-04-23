// 함수를 선언합니다.
function fibonacci(number) {
    if (number < 2) {
        return number;
    } else {
        return fibonacci(number - 2) + fibonacci(number - 1);
    }
}

// 이벤트를 연결합니다.
onmessage = function (event) {
    // 데이터를 전송합니다.
    postMessage(fibonacci(event.data));
};
