http = require 'http'
server = http.createServer (request, response) ->
    response.writeHead 200,
        'Content-Type': 'text/template'
    response.end 'Hello World .. !'

server.listen 52273, () ->
    console.log 'Server Running at http://127.0.0.1:52273'