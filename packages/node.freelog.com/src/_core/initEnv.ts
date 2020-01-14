export interface Env {
  leaguage: string;
  type: string;
  mainDomain: string;
  qiOrigin: string;
  nodeType: string;
  isTest: boolean;
  isMobile: boolean;
}

export default function initEnv(): Env {
  const type: string = getEnvType()
  const isTest = type !== 'prod'

  return {
    leaguage: getEnvLanguage(),
    mainDomain: getMainDomain(),
    qiOrigin: getQIoringin(),
    nodeType: getNodeType(),
    type,
    isTest,
    isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent),
  }
}

export function getEnvType(): string {
  const host = window.location.host
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

export function getEnvLanguage(): string {
  var language: string | null = window.localStorage.getItem('locale')
  const langArray: Array<string> = [ 'zh-CN', 'en' ]
  if (!langArray.includes(language)) {
    if (/^zh(\-\w+)?/.test(window.navigator.language)) {
      language = langArray[0] 
    } else {
      language = langArray[1]
    }
  } 
  return language
}

export function getMainDomain(): string {
  return window.location.host.split('.').slice(-2).join('.')
}

export function getQIoringin(): string {
  return getEnvType() !== 'prod' ? '//qi.testfreelog.com' : '//qi.freelog.com'
}

export function getNodeType(): string {
  return /^t\./.test(window.location.host) ? 'test' : 'formal'
}
