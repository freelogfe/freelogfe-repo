import { SHOW_AUTH_DIALOG, NOTIFY_NODE } from '../pb-event-names'
export function handleAuthError(options, callback) {
  const response = options.response

  let presentableInfo
  if (response.data) {
    presentableInfo = response.data.presentableInfo || (response.data.data && response.data.data.presentableInfo)
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
