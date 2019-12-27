/**
 * 1. fetch语法简洁，语义化；
 * 2. fetch返回Promise对象，异步编程更有友好；
 * 3. fetch相较于XHR，它的请求参数参数更加丰富
 * 4. fetch的浏览器兼容性覆盖率达到91.07%，但不支持IE
 * 5. fetch默认不携带cookie，可手动设置参数credientials:'include'
 *
 */
import { isAbsoluteURL, combineURLs, complementQueryString, deepMerge } from '../utils'
import { transformRequests, transformResponses } from './transform'

export interface QIFetchOpts {
  url?: string
  baseURL?: string
  method?: string
  body?: any
  data?: plainObject
  timeout?: number
  headers?: plainObject
  credentials?: "omit" | "same-origin" | "include"
} 

export type qiFetchFn = (url: string, opts?: QIFetchOpts) => Promise<any>

const defaultQIFetchOpts: QIFetchOpts = {
  baseURL: '',
  credentials: 'include',
  timeout: 10000,
  headers: {
    'Accept': 'application/json, text/plain, */*'
  }
}

export default function createQIFetch(opts: QIFetchOpts): qiFetchFn {
  const defaultOpts = deepMerge(defaultQIFetchOpts, opts)
  return function (url: string, options: QIFetchOpts = {}): Promise<any> {
    if(typeof url === 'object') {
      options = Object.assign(options, url)
    }else {
      options.url = url
    }
    if (options.data == null) {
      options.data = {} 
    }
    return qiFetch(deepMerge(defaultOpts, options) as QIFetchOpts)
  }
}

async function qiFetch(opts: QIFetchOpts): Promise<any> {
  opts.method = opts.method ? opts.method.toLowerCase() : 'get'
  opts.headers = opts.headers || {}

  if(opts.data) {
    if(opts.method === 'get'){
      opts.url = complementQueryString(opts.url, opts.data)
    }else {
      opts.body = opts.data
    }
    Reflect.deleteProperty(opts, 'data')
  }

  // support baseURL
  if (opts.baseURL && typeof opts.baseURL === 'string') {
    if(!isAbsoluteURL(opts.url)) {
      opts.url = combineURLs(opts.baseURL, opts.url)
    }
    Reflect.deleteProperty(opts, 'baseURL')
  }

  // transform request opts
  transformRequests.forEach(transformReqFn => {
    opts = transformReqFn(opts)
  })

  if(['post', 'put', 'patch'].indexOf(opts.method) > -1) {
    opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/x-www-form-urlencoded'
  }

  const url = opts.url || ''
  Reflect.deleteProperty(opts, 'url')
  const timeout = opts.timeout
  Reflect.deleteProperty(opts, 'timeout')
  let requestPromise: Promise<any> = window.fetch(url, opts)

  // 请求超时则退出
  if(timeout > 0) {
    requestPromise = Promise.race([
      requestPromise,
      new Promise(function (resolve, reject) {
        setTimeout(() => reject('request timeout...'), timeout)
      })
    ])
  }

  return requestPromise.then(response => {
    if(response.ok) {
      transformResponses.forEach(transformRespFn => {
        response = transformRespFn(response)
      })
      return response
    }
    throw new Error('response was not ok...')
  })
}


