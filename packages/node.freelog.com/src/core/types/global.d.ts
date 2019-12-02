interface FreelogApp {
  on(event: string): any;
  off(event: string, fn: () => any): any;
  once(event: string): any;
  trigger(event: string): any;
}

interface Window {
  FreelogApp: PlainObject;
}

interface PlainObject extends Object {
  [key: string]: any;
}