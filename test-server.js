const http = require('http')
const port = parseInt(process.env.PORT || '3000', 10)

console.log('[TEST] iniciando — node:', process.version, '— port:', port, '— pid:', process.pid)
console.log('[TEST] env:', JSON.stringify({
  NODE_ENV: process.env.NODE_ENV,
  PORT:     process.env.PORT,
  DB_HOST:  process.env.DB_HOST,
  DB_NAME:  process.env.DB_NAME,
  JWT_OK:   !!process.env.JWT_SECRET,
}))

const server = http.createServer((req, res) => {
  console.log('[TEST] requisição:', req.method, req.url)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    ok:      true,
    node:    process.version,
    pid:     process.pid,
    port,
    url:     req.url,
    env:     process.env.NODE_ENV,
    dbHost:  process.env.DB_HOST || 'NÃO CONFIGURADO',
  }))
})

server.once('error', (err) => {
  console.error('[TEST] erro ao escutar:', err.message)
  process.exit(1)
})

server.listen(port, '0.0.0.0', () => {
  console.log('[TEST] SERVIDOR OUVINDO em http://0.0.0.0:' + port)
})
