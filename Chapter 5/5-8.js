// 이벤트를 연결합니다.
onmessage = function (event) {
    // 데이터를 전달합니다.
    postMessage('ECHO: ' + event.data);
};
