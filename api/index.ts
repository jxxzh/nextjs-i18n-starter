import type { CustomRequestOptions } from '../lib/request'
import { baseRequest } from '../lib/request'

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

export enum ResponseCode {
  // 服务端接口返回
  Success = '200', // 成功
}

const apiOptions: CustomRequestOptions = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  parseResponse: (response) => {
    if (response.code !== ResponseCode.Success) {
      throw new ResponseError(response)
    }

    return response.data
  },
}

export const apiRequest = baseRequest.child(apiOptions)
