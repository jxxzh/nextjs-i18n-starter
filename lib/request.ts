import logger from '@/lib/logger'

export interface CustomRequestOptions {
  baseUrl: string
  parseResponse: (response: any) => any
}

export type CombinedRequestOptions = RequestInit & Partial<CustomRequestOptions>

const defaultOptions: CustomRequestOptions = {
  baseUrl: '',
  parseResponse: response => response,
}

const requestLogger = logger.child({ module: 'request' })

export async function baseRequest<T>(url: string, options?: CombinedRequestOptions): Promise<T> {
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

    const res = await response.json()
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

baseRequest.child = (options?: CombinedRequestOptions) => {
  return (url: string, requestOptions?: RequestInit) => baseRequest(url, { ...options, ...requestOptions })
}
