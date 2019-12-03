interface QI {
  create(url: string): any;
  get(url: string): any;
  delete(url: string): any;
  options(url: string): any;
  post(url: string): any;
  put(url: string): any;
  fetch(url: string): any;
  resolveSubDependDataUrl(url: string): any;
  resolveSubDependInfoUrl(url: string): any;
  resolvePresentableDataUrl(url: string): any;
  getUserInfo(url: string): any;
  checkUserIsLogin(url: string): any;
  pagingGetPresentables(url: string): any;
  getPresentable(url: string): any;
  getPresentableAuth(url: string): any;
  getPresentableData(url: string): any;
  batchGetPresentables(url: string): any;
  getPresnetableSubDependData(url: string): any;
  getPresnetableSubDependInfo(url: string): any;
  requireSubDepend(url: string): any;
}

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