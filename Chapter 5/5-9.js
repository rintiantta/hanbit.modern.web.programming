// 이벤트를 연결합니다.
worker.onmessage = function (event) {
    // 출력합니다.
    alert(event.data);

    // 워커를 종료합니다.
    worker.terminate();
};
