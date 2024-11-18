import logger from '@/lib/logger'
import { ResponseCode } from './constants'

export interface ResponseData<T = unknown> {
  code: ResponseCode
  message: string
  debugMessage: string
  data: T
}

export class ResponseError extends Error {
  rawResponse: Pick<ResponseData<unknown>, 'code' | 'message'>
  constructor(data: Pick<ResponseData<unknown>, 'code' | 'message'>) {
    super(data.message)
    this.rawResponse = data
  }
}

interface CustomRequestOptions {
  baseUrl: string
  parseResponse: (response: ResponseData<any>) => any
}

export type CombinedRequestOptions = RequestInit & Partial<CustomRequestOptions>

const defaultOptions: CustomRequestOptions = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  parseResponse: (response) => {
    if (response.code !== ResponseCode.Success) {
      throw new ResponseError(response)
    }

    return response.data
  },
}

const requestLogger = logger.child({ module: 'request' })

export async function apiRequest<T>(url: string, options?: CombinedRequestOptions): Promise<T> {
  const { parseResponse, baseUrl } = { ...defaultOptions, ...options }
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }
  if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
    logger.info({
      module: 'request',
      url,
      headers,
      options,
    })
  }
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Unknown error')
    }

    const res: ResponseData = await response.json()
    return parseResponse(res) as T
  }
  catch (error) {
    requestLogger.error({
      url,
      error,
    })

    throw error
  }
}
