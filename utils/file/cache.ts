import fs from 'node:fs'
import path from 'node:path'
import logger from '@/lib/logger'

const dir = 'public/file-cache'

async function writeCacheFile(fileName: string, content: string) {
  const filePath = path.join(process.cwd(), dir, fileName)
  try {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
    await fs.promises.writeFile(filePath, content, 'utf-8')
    return true
  }
  catch (error) {
    logger.error(error)
    return false
  }
}

async function readCacheFile(fileName: string) {
  const filePath = path.join(process.cwd(), dir, fileName)
  try {
    await fs.promises.access(filePath)
    const content = await fs.promises.readFile(filePath, 'utf-8')
    return content
  }
  catch (error: any) {
    if (error.code !== 'ENOENT') {
      logger.error(error)
    }
    return ''
  }
}

export { readCacheFile, writeCacheFile }
