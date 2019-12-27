
export function gotoLogin(redirect) {
  cacheScrollTop()

  const loginPath = '/login'
  if (window.location.pathname === loginPath) {
    return
  }

  let loginUrl = `//www.${window.FreelogApp.Env.mainDomain}${loginPath}`
  redirect = redirect || window.location.href
  if (isSafeRedirectUrl(redirect)) {
    loginUrl += `?redirect=${encodeURIComponent(redirect)}`
  }

  window.location.href = loginUrl
}

function cacheScrollTop() {
  const rect = document.body.getBoundingClientRect()
  localStorage.setItem(`${window.location.href}_scrollTop`, -rect.top)
}

function isSafeRedirectUrl(url) {
  const reg = /^.+\.(test)?freelog\.com$/

  try {
    const obj = new URL(url) // 正确的链接检测
    if (reg.test(obj.hostname)) {
      return true
    }
  } catch (e) {
    // path型链接检测
    if ((/^\/[^/]+/.test(url))) {
      return true
    }
  }

  return false
}
