import type { MiddlewareConfig, NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './lib/i18n/routing'

export const config: MiddlewareConfig = {
  matcher: [
    '/',
    /**
     * 排除一些情况
     * 1. 文件路径，即以点和字母、数字或下划线结尾的字符串
     * 2. 包括 _next 的路径
     * 3. 包括 api 的路径
     */
    '/((?!.+\\.[\\w]+$|_next|api).*)',
  ],
}

export function middleware(request: NextRequest) {
  // 可以对 request 和 response 进行一些处理
  const response = createMiddleware(routing)(request)
  return response
}
