'use strict'

console.log('[S1] server.js iniciou — pid:', process.pid, '— node:', process.version)
console.log('[S2] PORT env:', process.env.PORT, '— NODE_ENV:', process.env.NODE_ENV)

process.on('uncaughtException', (err) => {
  console.error('[S-CRASH] uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('[S-CRASH] unhandledRejection:', String(reason))
  process.exit(1)
})

process.on('exit', (code) => {
  console.log('[S-EXIT] código:', code)
})

console.log('[S3] handlers registrados')

const { createServer } = require('http')
const { parse }        = require('url')

console.log('[S4] http/url importados')

let next
try {
  next = require('next')
  console.log('[S5] next importado com sucesso')
} catch (err) {
  console.error('[S5-ERRO] falha ao importar next:', err.message)
  process.exit(1)
}

const port = parseInt(process.env.PORT || '3000', 10)
const dev  = process.env.NODE_ENV !== 'production'

console.log('[S6] criando app next — dev:', dev, '— port:', port)

let app
try {
  app = next({ dev, hostname: '0.0.0.0', port })
  console.log('[S7] app next criado')
} catch (err) {
  console.error('[S7-ERRO]', err.message)
  process.exit(1)
}

const handle = app.getRequestHandler()

console.log('[S8] chamando app.prepare()...')

app.prepare()
  .then(() => {
    console.log('[S9] app.prepare() concluído — criando servidor HTTP')

    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('[S-REQ-ERRO]', req.url, err.message)
        res.statusCode = 500
        res.end('Erro interno')
      }
    })

    server.once('error', (err) => {
      console.error('[S-SERVER-ERRO]', err.code, err.message)
      process.exit(1)
    })

    server.listen(port, '0.0.0.0', () => {
      console.log('[S10] SERVIDOR PRONTO em http://0.0.0.0:' + port)
    })
  })
  .catch((err) => {
    console.error('[S-PREPARE-ERRO]', err.message)
    console.error(err.stack)
    process.exit(1)
  })
