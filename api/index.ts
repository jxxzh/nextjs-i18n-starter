import type { CombinedRequestOptions } from '@/lib/request'
import { baseRequest } from '@/lib/request'

const apiOptions: CombinedRequestOptions = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  parseResponse: async (response) => {
    return await response.json()
  },
}

export const apiRequest = baseRequest.child(apiOptions)
