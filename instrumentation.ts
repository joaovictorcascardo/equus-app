export async function register() {
  console.log('[I1] instrumentation.ts register() chamado — env:', process.env.NODE_ENV)
  console.log('[I2] PORT:', process.env.PORT, '— DB_HOST:', process.env.DB_HOST)

  process.on('uncaughtException', (err: Error) => {
    console.error('[I-CRASH] uncaughtException:', err.message)
    console.error(err.stack)
  })

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[I-CRASH] unhandledRejection:', String(reason))
  })

  process.on('exit', (code: number) => {
    console.log('[I-EXIT] código de saída:', code)
  })

  console.log('[I3] instrumentation.ts concluído')
}
