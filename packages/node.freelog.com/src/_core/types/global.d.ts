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

interface Env {
  leaguage: string;
  type: string;
  mainDomain: string;
  qiOrigin: string;
  nodeType: string;
  isTest: boolean;
  isMobile: boolean;
}

interface FreelogApp {
  QI: QI;
  Env: Env;
  on(event: string): any;
  off(event: string, fn: () => any): any;
  once(event: string): any;
  trigger(event: string): any;
}

interface authInfo {
  __auth_user_id__: number;
  __auth_node_id__: number;
  __auth_node_name__: string;
  __auth_error_info__?: plainObject;
  __page_build_id?: string;
  __page_build_entity_id?: string;
  __page_build_sub_releases?: subRelease [];
}

interface subRelease {
  id: string;
  name: string;
  type: string;
  resourceType: string;
}

interface Window {
  FreelogApp: FreelogApp;
  __auth_info__: authInfo;
}

interface plainObject extends Object {
  [propName: string]: any;
}


