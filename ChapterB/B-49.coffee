# 클래스를 선언합니다.
class Being
    constructor: (name, age) ->
        # 속성을 생성합니다.
        @name = name
        @age = age
class Human extends Being
    constructor: (name, age, language, region) ->
        # 부모의 생성자를 호출합니다.
        super name, age

        # 속성을 생성합니다.
        @language = language
        @region = region