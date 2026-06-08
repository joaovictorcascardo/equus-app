'use strict'

// Captura qualquer erro não tratado antes de morrer silenciosamente
process.on('uncaughtException', (err) => {
  console.error('[CRASH] uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('[CRASH] unhandledRejection:', reason)
  process.exit(1)
})

const { createServer } = require('http')
const { parse }        = require('url')
const next             = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const dev  = process.env.NODE_ENV !== 'production'

console.log(`[SERVER] Iniciando porta=${port} env=${process.env.NODE_ENV}`)

const app    = next({ dev, hostname: '0.0.0.0', port })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('[SERVER] Erro na requisição:', req.url, err)
        res.statusCode = 500
        res.end('Erro interno')
      }
    })

    server.once('error', (err) => {
      console.error('[SERVER] Erro fatal no servidor:', err.message)
      process.exit(1)
    })

    server.listen(port, '0.0.0.0', () => {
      console.log(`[SERVER] Pronto em http://0.0.0.0:${port}`)
    })
  })
  .catch((err) => {
    console.error('[SERVER] Falha ao preparar o app:', err.message)
    console.error(err.stack)
    process.exit(1)
  })
