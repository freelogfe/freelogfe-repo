import { toArray } from '../utils'

export default class EventCenter {
  _events: plainObject;
  constructor() {
    this._events = Object.create(null)
  }

  on(event: string, fn: () => any): this {
    (this._events[event] || (this._events[event] = [])).push(fn)
    return this
  }

  once(event: string, fn: () => any): this {
    const self = this
    function on() {
      self.off(event, on)
      fn.apply(self, arguments)
    }
    on.fn = fn
    self.on(event, on)
    return self
  }

  off(event: string, fn: () => any): this {
    const self = this
    // all
    if (!arguments.length) {
      self._events = Object.create(null)
      return self
    }

    // specific event
    const cbs = self._events[event]
    if (!cbs) {
      return self
    }
    if (!fn) {
      self._events[event] = null
      return self
    }

    // specific handler
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return self
  }

  emit(event: string, ...args: Array<any>): this {
    let cbs = this._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const info = `event handler for "${event}"`
      cbs.forEach((handler: (...rest: any []) => void) => {
        try {
          handler(...args)
        } catch (e) {
          console.error(info, e)
        }
      })
    }
    return this
  }
}
