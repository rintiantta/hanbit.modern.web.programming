# 배열을 생성합니다.
array = []
for i in [0..100]
    array.push Math.round(Math.random() * 100)
 
# 반복 조합 배열을 생성합니다.
array = item for item in array when item % 2 is 0
 
# 출력합니다.
console.log array