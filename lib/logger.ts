import pino from 'pino'

const pinoConfig: pino.LoggerOptions = {
  browser: {
    asObject: true,
    formatters: {
      level: (label) => {
        return { level: label }
      },
      log: (obj) => {
        // 将时间戳转换为本地时间
        obj.time = new Date().toLocaleString()
        return obj
      },
    },
    disabled: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  },
}

if (process.env.NODE_ENV === 'development') {
  pinoConfig.transport = {
    target: 'pino-pretty',
  }
}

const logger = pino(pinoConfig)

export default logger
