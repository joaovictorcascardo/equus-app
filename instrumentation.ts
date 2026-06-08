export async function register() {
  console.log('[EQUUS] instrumentation carregada — env:', process.env.NODE_ENV, '— porta:', process.env.PORT)

  process.on('uncaughtException', (err: Error) => {
    console.error('[EQUUS CRASH] uncaughtException:', err.message)
    console.error(err.stack)
  })

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[EQUUS CRASH] unhandledRejection:', String(reason))
  })

  process.on('exit', (code: number) => {
    if (code !== 0) {
      console.error('[EQUUS EXIT] processo encerrado com código', code)
    }
  })
}
