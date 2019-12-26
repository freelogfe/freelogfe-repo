export function noop(): void {}

export function toString(val: any): string {
  return Object.prototype.toString.call(val)
}

export function isFormData(val: any): boolean {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
}

export function isArrayBuffer(val: any): boolean {
  return toString(val) === '[object ArrayBuffer]'
}

export function isArrayBufferView(val: any): boolean {
  let result
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val)
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer)
  }
  return result
}

export function isFile(val: any): boolean {
  return toString(val) === '[object File]'
}

export function isBlob(val: any): boolean {
  return toString(val) === '[object Blob]'
}

export function isStream(val: any): boolean {
  return isObject(val) && isFunction(val.pipe)
}

export function isURLSearchParams(val: any): boolean {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
}

export function isObject(val: any): boolean {
  return toString(val) === '[object Object]'
}

export function isFunction(val: any): boolean {
  return toString(val) === '[object Function]'
}

export function isArray(val: any): boolean {
  return toString(val) === '[object Array]'
}

export function isAbsoluteURL(url: string): boolean {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function combineURLs(baseURL: string, relativeURL: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export function complementQueryString(url: string, data: plainObject): string {
  const qsStr: string = Object.keys(data)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')
  url += (url.indexOf('?') > -1 ? '&' : '?') + qsStr
  return url
}

export function deepMerge (...args: Array<plainObject>): plainObject {
  var leng = args.length
  var result: plainObject = {}
  if(leng > 0) {
    result = Object.assign({}, args[0])
    for(let i = 1; i < leng; i++) {
      let obj = args[i]
      if(isObject(obj)){
        for(let key in obj) {
          let val = obj[key]
          if(isObject(val)) {
            if(isObject(result[key])) {
              result[key] = deepMerge(result[key], val)
            }else {
              result[key] = Object.assign({}, val)
            }
          }else {
            result[key] = val
          }
        }
      }
    }
  } 
  return result
}

export function toArray(list: Array<any>, start = 0): Array<any> {
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
