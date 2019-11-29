
import * as eventNames from '../events/names'
import { notifyNode, handleInvalidResponse, handleAuthError, reportError } from '../events/handlers/index'
import EventCenter from '../events/index'

export default function initEvents(FreelogApp) {
  const eventCenter = new EventCenter()
  FreelogApp.on = EventCenter.prototype.on.bind(eventCenter)
  FreelogApp.once = EventCenter.prototype.once.bind(eventCenter)
  FreelogApp.trigger = EventCenter.prototype.emit.bind(eventCenter)

  FreelogApp.off = function (event, fn) {
    if(arguments.length === 0) {
      for(let name in eventCenter._events) {
        if(!eventNames[name]) {
          Reflect.deleteProperty(eventCenter._events, name)
        }
      }
      return eventCenter
    }

    if(arguments.length === 1 && eventNames[event]) {
      console.info(`This event({event}) can't be offed`)
      return eventCenter
    }
    const off = EventCenter.prototype.off.bind(eventCenter)
    return off(event, fn)
  }

  FreelogApp
    // .on(eventNames['GO_TO_LOGIN'], goToLoginPage)
    .on(eventNames['NOTIFY_NODE'], notifyNode)
    .on(eventNames['HANDLE_INVALID_RESPONSE'], handleInvalidResponse)
    .on(eventNames['HANDLE_INVALID_AUTH'], handleAuthError)
    .on(eventNames['REPORT_ERROR'], reportError)
}


