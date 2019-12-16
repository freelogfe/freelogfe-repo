
// 异常码对应的解释和eventName
import { HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE } from './names'

const errCodeHandlerMap = {
  301: NOTIFY_NODE,             // 资源合同未激活
  401: NOTIFY_NODE,             // 节点的合同未激活
  402: HANDLE_INVALID_AUTH,     // 节点合同中的策略身份认证失败
  403: NOTIFY_NODE,             // 未找到有效的节点合同
  404: REPORT_ERROR,            // 未找到节点信息
  501: HANDLE_INVALID_AUTH,     // 用户的合同未激活
  502: HANDLE_INVALID_AUTH,     // 资源策略拒绝
  503: HANDLE_INVALID_AUTH,     // 未创建资源合同
  505: GO_TO_LOGIN,             // 未登录用户
  28: GO_TO_LOGIN,
  30: GO_TO_LOGIN,
  506: HANDLE_INVALID_AUTH,     // 选择需要执行的合同.一般有两个或两个以上的时候需要用户选择具体执行哪个
  601: GO_TO_LOGIN,             // 身份认证失败
  900: REPORT_ERROR             // 未知异常
}


export default errCodeHandlerMap
