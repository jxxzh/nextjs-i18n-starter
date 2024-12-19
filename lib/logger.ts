import { isDevelopment, isProduction } from '@/utils'
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
    disabled: isProduction(),
  },
}

if (isDevelopment()) {
  pinoConfig.transport = {
    target: 'pino-pretty',
  }
}

const logger = pino(pinoConfig)

export default logger
