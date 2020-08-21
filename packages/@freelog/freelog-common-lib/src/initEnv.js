export default function initEnv() {
  const type = getEnvType()
  const isTest = type !== 'prod'

  window.FreelogApp = window.FreelogApp || {}
  window.FreelogApp.Env = {
    leaguage: getEnvLanguage(),
    mainDomain: getMainDomain(),
    qiOrigin: getQIoringin(),
    nodeType: getNodeType(),
    type,
    isTest,
    isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent),
  }
}

export function getEnvType() {
  if (window.location.port !== '') {
    return 'dev'
  }
  const hostname = window.location.hostname
  if (/^localhost/.test(hostname) || /^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    // 是否为本地开发环境
    return 'dev'
  } else if (/testfreelog\.com/.test(hostname)) {
    // 是否为本地开发环境
    return 'test'
  } else {
    return 'prod'
  }
}

export function getEnvLanguage() {
  const cookieLocale = document.cookie.split(';').map(i => i.trim()).find(i => i.startsWith('locale='))
  let localeCookie
  if (cookieLocale){
    localeCookie = cookieLocale.replace('locale=', '')
  }
  var language = localeCookie || window.localStorage.getItem('locale')
  const langArray = [ 'zh-CN', 'en' ]
  if (!langArray.includes(language)) {
    if (/^zh(\-\w+)?/.test(window.navigator.language)) {
      language = langArray[0] 
    } else {
      language = langArray[1]
    }
  } 
  return language
}

export function getMainDomain() {
  const envType = getEnvType()
  return envType === 'dev' ? 'freelog.com' : envType === 'prod' ? 'freelog.com' : 'testfreelog.com'
}

export function getQIoringin() {
  const envType = getEnvType()
  return envType === 'dev' ? window.location.origin : envType === 'prod' ? '//qi.freelog.com' : '//qi.testfreelog.com'
}

export function getNodeType() {
  return /^t\./.test(window.location.host) ? 'test' : 'formal'
}