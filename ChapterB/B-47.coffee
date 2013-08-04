Array::remove = (from, to) ->
    rest = @slice((to || from) + 1 || @length)
    @length = if from < 0 then @.length + from else from
    @push.apply(@, rest)