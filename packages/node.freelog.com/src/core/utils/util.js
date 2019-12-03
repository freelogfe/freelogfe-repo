export function noop() {}

export function toString(val) {
  return Object.prototype.toString.call(val)
}


export function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
}

export function isArrayBuffer(val) {
  return toString(val) === '[object ArrayBuffer]'
}

export function isArrayBufferView(val) {
  let result
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val)
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer)
  }
  return result
}

export function isFile(val) {
  return toString(val) === '[object File]'
}

export function isBlob(val) {
  return toString(val) === '[object Blob]'
}

export function isStream(val) {
  return isObject(val) && isFunction(val.pipe)
}

export function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
}

export function isObject(val) {
  return toString(val) === '[object Object]'
}

export function isFunction(val) {
  return toString(val) === '[object Function]'
}

export function isArray(val) {
  return toString(val) === '[object Array]'
}

export function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function deepMerge(...args) {
  var result = {}

  var leng = args.length
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

export function toArray (list, start = 0) {
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

