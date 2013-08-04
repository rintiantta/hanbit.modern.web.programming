# 함수를 선언합니다.
randomInteger = (limit) ->
    Math.round Math.random() * limit
 
# 함수를 호출합니다.
for i in [0..100]
    console.log randomInteger 100