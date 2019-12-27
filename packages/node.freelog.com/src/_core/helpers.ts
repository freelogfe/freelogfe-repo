
export function combineURLs(baseURL: string, relativeURL: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export function complementQueryString(url: string, data: plainObject): string {
  const qsStr = Object.keys(data)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')

  url += (url.indexOf('?') > -1 ? '&' : '?') + qsStr
  return url
}

export function createScript(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    script.async = true
    document.getElementsByTagName('head').item(0).appendChild(script)
  })
}

export function createCssLink(href: string, type?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const link: HTMLLinkElement = document.createElement('link')
    link.href = href
    link.rel = 'stylesheet'
    link.type = type || 'text/css'
    link.onload = resolve
    link.onerror = reject
    document.getElementsByTagName('head').item(0).appendChild(link)
  })
}

export function injectCodeResource(res: any, type: string, filename?: string): Promise<any> {
  const file = new File([res], `${filename}`, { type })
  const url = window.URL.createObjectURL(file)
  switch (type) {
    case 'text/javascript': {
      return createScript(url)
    }
    case 'text/css': {
      return createCssLink(url, type)
    }
    default:
      return Promise.reject('wrong type!')
  }
}
