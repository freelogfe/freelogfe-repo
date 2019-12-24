export default function initEnv(): Env {
  const host = window.location.host
  const type = getEnvType(host)
  const isTest = type !== 'prod'

  return {
    leaguage: getEnvLanguage(),
    mainDomain: getMainDomain(host),
    qiOrigin: isTest ? '//qi.testfreelog.com' : '//qi.freelog.com',
    nodeType: /^t\./.test(host) ? 'test' : 'formal',
    type,
    isTest,
    isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
  }
}

function getEnvType(host: string): string {
  if (/^localhost/.test(host) || /^\d+\.\d+\.\d+\.\d+/.test(host)) {
    // 是否为本地开发环境
    return 'dev'
  } else if (/testfreelog\.com/.test(host)) {
    // 是否为本地开发环境
    return 'test'
  } else {
    return 'prod'
  }
}

function getEnvLanguage(): string {
  var language: string | null = window.localStorage.getItem('locale')
  const langArray: string [] = [ 'zh-CN', 'en' ]
  if (!langArray.includes(language)) {
    if (/^zh(\-\w+)?/.test(window.navigator.language)) {
      language = langArray[0] 
    } else {
      language = langArray[1]
    }
  } 
  return language
}

function getMainDomain(host: string): string {
  return host.split('.').slice(-2).join('.')
}

