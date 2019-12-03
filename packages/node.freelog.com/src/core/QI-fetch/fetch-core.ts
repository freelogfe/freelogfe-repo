/**
 * 1. fetch语法简洁，语义化；
 * 2. fetch返回Promise对象，异步编程更有友好；
 * 3. fetch相较于XHR，它的请求参数参数更加丰富
 * 4. fetch的浏览器兼容性覆盖率达到91.07%，但不支持IE
 * 5. fetch默认不携带cookie，可手动设置参数credientials:'include'
 *
 */
import { isAbsoluteURL } from '../utils/util'
import { throwError, createError } from "../exceptions/throwError"
import { EXCEPTION_NETWORK, EXCEPTION_TIMEOUT } from '../exceptions/names'
import { combineURLs, complementQueryString } from '../helpers/index'
import { transformRequests, transformResponses } from './transform'

interface qiFetchOpts {
  baseURL?: string
  url: string
  method?: string
  body?: any
  data?: PlainObject
  headers?: PlainObject
  timeout?: number
}

interface fetchOpts {
  method: string
  body: any
  headers?: PlainObject
  credentials: "omit" | "same-origin" | "include"
} 

function qiFetch(opts: qiFetchOpts) {
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
  const timeout = opts.timeout || 0
  Reflect.deleteProperty(opts, 'timeout')
  let requestPromise = window.fetch(url, opts)
  if(timeout > 0) {
    requestPromise = Promise.race([
      requestPromise,
      new Promise(function (resolve, reject) {
        setTimeout(() => reject(createError('request timeout', EXCEPTION_TIMEOUT)), timeout)
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
    throwError('response was not ok...', EXCEPTION_NETWORK)
  })
}

export default qiFetch
