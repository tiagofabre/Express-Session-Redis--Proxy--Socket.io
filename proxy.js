const http = require('http')
const httpProxy = require('http-proxy')
var servers = [];
var proxies = null;

servers[0] = { host: 'localhost', port: 4000 }
servers[1] = { host: 'localhost', port: 4001 }

var proxies = servers.map(function (target) {
  return new httpProxy.createProxyServer({ target: target, ws: true })
})


var selectServer = function (req, res, callback) {
  var index = -1
  // captura a url do usuario e analisa o servidor que ele deve ser direcionado
  if (req.headers && req.url && req.url.split('/').length >= 4) {
    var room = req.url.split('/')[3]
    if(parseInt(room) == 1001){
      callback(0)
    } else {
      callback(1)
    }
    return;
  } else {
    index = Math.floor(Math.random() * proxies.length)
  }

  callback(index)
}

var startFailoverTimer = function (index) {}

var proxyServer = http.createServer(function (req, res) {

  selectServer(req, res, function(proxyIndex){
    var proxy = proxies[proxyIndex];
    proxy.web(req, res)
    
    proxy.on('error', function (err) {
      if (err) { throw err }
      startFailoverTimer(proxyIndex)
    })
  })
})

proxyServer.on('upgrade', function (req, socket, head) {

  selectServer(req, null, function(proxyIndex){
    var proxy = proxies[proxyIndex]
    proxy.ws(req, socket, head)

    proxy.on('error', function (err, req, socket) {
      if (err) { throw err }
      socket.end()
      startFailoverTimer(proxyIndex)
    })
  })
})

proxyServer.listen(8000, function () {
  console.log('listening on *:' + 8000)
})
