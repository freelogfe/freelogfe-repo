import { isObject } from "../utils/util"

export function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export function complementQueryString(url, data){

  const esc = encodeURIComponent
  const qsStr = Object.keys(data)
    .map(k => `${esc(k)}=${esc(data[k])}`)
    .join('&')

  url += (url.indexOf('?') > -1 ? '&' : '?') + qsStr
  return url
}

export function createScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    script.async = 'async'
    document.getElementsByTagName('head').item(0).appendChild(script)
  })
}

export function createCssLink(href, type) {
  return new Promise((resolve, reject) => {
    
    const link = document.createElement('link')
    link.href = href
    link.rel = 'stylesheet'
    link.type = type || 'text/css'
    link.onload = resolve
    link.onerror = reject
    document.getElementsByTagName('head').item(0).appendChild(link)
  })
}

export function injectCodeResource(res, type, filename) {
  filename = filename || +new Date()
  const file = new File([res], `${filename}`, { type })
  const url = window.URL.createObjectURL(file)
  switch (type) {
    case 'text/javascript': {
      return createScript(url)
    }
    case 'text/css': {
      return createCssLink(url)
    }
    default:
      throw new Error('wrong type!')
  }
}
