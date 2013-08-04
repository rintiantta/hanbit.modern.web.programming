#HTML5 Programming Example

`모던 웹을 위한 HTML5 프로그래밍『한빛미디어, 2013』`에 사용된 예제입니다.
그냥 위에 zip 파일 눌러서 다운 받으면 됩니다.

질문은 issues에 글을 남겨주시면 됩니다.
모두 함께 답변을 해주세요!
우리 함께 만들어가는 좋은 대한민국 개발 세상 "ㅁ" ....

#오탈자
78페이지

출간 전부터 오탈자가....

-webkit-full-screen 선택자가 2번이나 들어갔습니다.
```html
<style>
    /* HTML5 문서의 fullscreen 모드 */
    div.fullscreen:fullscreen { width: 60%; border-radius:10px; }
    /* 웹 브라우저 제조사의 fullscreen 모드 */
    div.fullscreen:full-screen { width: 60%; border-radius:10px; }
    div.fullscreen:-webkit-full-screen { width: 60%; border-radius:10px; }
    div.fullscreen:-webkit-full-screen { width: 60%; border-radius:10px; }
    div.fullscreen:-moz-full-screen{ width: 60%; border-radius:10px; }
    div.fullscreen:-o-full-screen{ width: 60%; border-radius:10px; }
</style>
```
하나를 ms로 변경해주세요. 하지만 변경해도 2013년 08월을 기준으로 IE에서 지원하지 않아서 못 씁니다. 'ㅁ'
```html
<style>
    /* HTML5 문서의 fullscreen 모드 */
    div.fullscreen:fullscreen { width: 60%; border-radius:10px; }
    /* 웹 브라우저 제조사의 fullscreen 모드 */
    div.fullscreen:full-screen { width: 60%; border-radius:10px; }
    div.fullscreen:-ms-full-screen { width: 60%; border-radius:10px; }
    div.fullscreen:-webkit-full-screen { width: 60%; border-radius:10px; }
    div.fullscreen:-moz-full-screen{ width: 60%; border-radius:10px; }
    div.fullscreen:-o-full-screen{ width: 60%; border-radius:10px; }
</style>
```

#참고사항
