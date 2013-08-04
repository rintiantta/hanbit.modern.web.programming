#HTML5 Programming Example

`모던 웹을 위한 HTML5 프로그래밍『한빛미디어, 2013』`에 사용된 예제입니다.

질문은 issues에 글을 남겨주시면 됩니다.
모두 함께 답변을 해주세요!
우리 함께 만들어가는 좋은 대한민국 개발 세상 "ㅁ" ....

#파일 다운로드
Github 페이지 오른쪽의 Download Zip 누르시면 쭉 받아집니다.
Node.js 파일의 경우 관련 모듈을 넣지 않았습니다. 책에 표기된 모듈을 개별적으로 설치해주세요.
```
npm install mongojs
```
이런거요!

#중요 변경 사항
##부트스트랩 버전 관련
도서에서는 부트스트랩 2.X버전을 사용합니다. 그런데 현재 부트스트랩 3.X버전에 베타로 배포중입니다.
어떤 것을 사용해도 문제는 없지만 입력 양식을 지정하는 형식이 조금 바뀌었습니다.
```html
<!-- 부트스트랩 2.X -->
<input type="text" />
<!-- 부트스트랩 3.X -->
<input type="text" class="form-control" style="width:지정" />
```
참고적으로 부트스트랩 3.X는 인터넷 익스플로러 7 이하를 지원하지 않습니다.
따라서 부트스트랩 2.X 버전을 사용할 것을 추천합니다. (구시대 인터넷 익스플로러의 잔당들이.... 너무 많엉....)

##트위터 API 변경
본문에서 JSONP를 테스트하고자 트위터 API를 사용합니다.
그런데 2013년 08월, 마감을 내고 책이 출간되기 직전에 트위터에서 인증 시스템을 도입하여,
인증 없이는 사용할 수 없게 되었습니다.(책의 집필 기간이 길어지면 생기는 슬픈 문제)

따라서 다음과 같이 사용하는 트위터 API를,
```javascript
$.ajax('http://search.twitter.com/search.json?q=' + keyword + '&callback=?', {});
```
다음과 같이 미투데이 API로 변경해서 사용하세요!
```javascript
$.ajax('http://me2day.net/api/get_posts/' + id + '.json?callback=?', {});
```
트위터는 검색어를 기반으로 제공하는 것에 반해 미투데이는 사용자 한명을 글을 보여줍니다.
naver_news 등의 아이디를 찾아야 합니다. [http://me2day.net/me2/people/celebrity/all](http://me2day.net/me2/people/celebrity/all) 공식 사이트에서 아이디를 확인해서 검색해보세요!
(흐흐허허어헐헝.... 트위터.... OTL)

#참고 사항
## Ajax
Ajax는 같은 도메인에서 실행해야 적용됩니다!

##form 태그 관련
HTML5부터는 form 태그의 method 속성을 PUT, DELETE로 지정 못합니다. 'ㅁ'

##Handsontable
2013년 08월 기준으로 부록F의 Hansontable에 버그가 발생했습니다.
스타일시트에서 overflow 속성을 지정해도, 다시 지정하면서 뭉개버리는데요 'ㅁ'
```css
#table {
    width: 600px;
    height: 200px;
    overflow: scroll !important;
}
```
이렇게 !important 키워드를 적용하면 해결할 수 있습니다.

#오탈자
##78페이지: 코드 3-9: 1쇄 오류
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

##294페이지: 코드 13-12: 1쇄 오류
출간 전부터 오탈자가....
```javascript
// 이벤트를 연결합니다: "이벤트:속성" 형태의 문자열을 사용합니다.
person.bind('change:region', function (model, attr]) {
    alert(attr + '로 변경합니다.');
});
```
매개 변수 attr 뒤에 ] 기호가 이상하게 들어가 있답니다.

#참고사항
