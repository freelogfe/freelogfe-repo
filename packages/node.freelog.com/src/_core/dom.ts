export function getStyle(element: HTMLElement, styleName: any): string {
  if (!element || !styleName) return null

  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    var computed: CSSStyleDeclaration = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : ''
  } catch (e) {
    return element.style[styleName]
  }
}


export function setStyle(element: HTMLElement, styleName: any, value?: string): void {
  if (!element || !styleName) return

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop])
      }
    }
  } else {
    element.style[styleName] = value
  }
}
