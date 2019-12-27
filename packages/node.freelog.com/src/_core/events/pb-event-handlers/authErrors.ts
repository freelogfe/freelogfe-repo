import { SHOW_AUTH_DIALOG, NOTIFY_NODE } from '../pb-event-names'

interface authErrorPresentableInfo {
  presentableInfo: plainObject
}

interface authErrorData {
  isAuth: boolean
  authCode: number
  errors: Array<any>
  data: authErrorPresentableInfo
  'freelog-sub-dependencies': string
  'freelog-entity-nid': string
}

interface handleAuthErrorOpts {
  response: authErrorData
  [key: string]: any
}
type handleAuthCallback = (...args: Array<any>) => any
export function handleAuthError(options: handleAuthErrorOpts, callback: handleAuthCallback): void {
  const response: authErrorData = options.response

  let presentableInfo
  if (response.data) {
    presentableInfo = response.data.presentableInfo || {}
  }

  if (response && response.authCode && presentableInfo) {
    switch (response.authCode) {
      // 未激活状态
      case 501:
      // 未签约状态
      case 502:
      case 503:
      case 504:
        window.FreelogApp.trigger(SHOW_AUTH_DIALOG, {
          presentableList: [presentableInfo],
          callback
        })
        break
      // 节点与资源之间的合约未生效
      case 401:
        window.FreelogApp.trigger(NOTIFY_NODE, presentableInfo)
        break
      default:
        break
    }

  } else {
    console.error('[handleAuthError] Incorrect parameters!')
    //待完善错误提示
  }
}
