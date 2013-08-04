# 클래스를 선언합니다.
class Person
    constructor: (name, language, region) ->
        @name = name
        @language = language
        @region = region
 
# 인스턴스를 생성합니다.
list = [
    new Person "윤인성", "JavaScript", "Seoul, Korea"
    new Person "윤명월", "Lua", "Tokyo, Japan"
]