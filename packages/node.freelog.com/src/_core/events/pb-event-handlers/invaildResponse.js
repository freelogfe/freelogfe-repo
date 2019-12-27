import errCodeHandlerMap from "../errorCodeHandlerMap"
import { HANDLE_INVALID_AUTH } from '../names'

export function handleInvalidResponse(options, callback) {
  const response = options.response
  if(response) {
    const eventName = errCodeHandlerMap[response.authCode] || HANDLE_INVALID_AUTH
    window.FreelogApp.trigger(eventName, options, callback)
  }
}

