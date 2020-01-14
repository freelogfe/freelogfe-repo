
import EventCenter from './events/index'
import * as pbEventNames from './events/pb-event-names'
import { setStyle } from './dom'
import initEnv, { Env } from './initEnv'
import initQI, { QI } from './initQI'
import initWidgets from './pb-parser'

interface loading {
  show(): void;
  hide(): void;
}

interface FreelogApp {
  QI: QI;
  Env: Env;
  $loading: loading;
  on(event: string, fn: () => any): any;
  off(event?: string, fn?: () => any): any;
  once(event: string, fn: () => any): any;
  trigger(event: string): any;
}

initGlobalApi()
initWidgets()

function initGlobalApi(): void {
  const eventInstance = new EventCenter()
  const FreelogApp: FreelogApp = {
    QI: initQI(),
    Env: initEnv(),
    $loading: initLoading(),
    on: EventCenter.prototype.on.bind(eventInstance),
    once: EventCenter.prototype.once.bind(eventInstance),
    trigger: EventCenter.prototype.emit.bind(eventInstance),
    off(event: string, fn?: () => any): EventCenter {
      const names: plainObject = pbEventNames
      if(arguments.length === 0) {
        for(let name in eventInstance._events) {
          if(!names[name]) {
            Reflect.deleteProperty(eventInstance._events, name)
          }
        }
        return eventInstance
      }
      if(arguments.length === 1 && names[event]) {
        console.info(`This event({event}) can't be offed`)
        return eventInstance
      }
      return eventInstance.off(event, fn)
    },
  }
  window.FreelogApp = FreelogApp
} 

function initLoading(): loading {
  var $loading: HTMLElement = document.querySelector('#f-loading')
  return {
    show(){
      if($loading) {
        setStyle($loading, 'display', 'block')
      }
    },
    hide(){
      if($loading) {
        setStyle($loading, 'display', 'none')
      }
    }
  }
}
