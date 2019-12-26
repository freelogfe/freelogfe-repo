import createQIFetch, { QIFetchOpts, qiFetch } from './qi-fetch/index'
import { resolveSubDependDataUrl, resolveSubDependInfoUrl, resolvePresentableDataUrl } from './api/resolveUrl'
import {
  pagingGetPresentablesParams,
  pagingGetPresentables,
  getPresentable,
  getPresentableAuth,
  getPresentableData,
  batchGetPresentablesParams,
  batchGetPresentables,
  getPresnetableSubDependData,
  getPresnetableSubDependInfo,
  requireSubDepend,
} from './api/interface'

type fetchFn = (url: string, options: QIFetchOpts) => Promise <any>
export interface QI {
  create(opts: QIFetchOpts): any
  get: fetchFn
  delete: fetchFn
  options: fetchFn
  post: fetchFn
  put: fetchFn
  fetch: fetchFn
  resolveSubDependDataUrl(presentableId: string, subDependId: string, entityNid: string): string
  resolveSubDependInfoUrl(presentableId: string, subDependId: string, entityNid: string): string
  resolvePresentableDataUrl(presentableId: string): string
  // getUserInfo(url: string): any
  // checkUserIsLogin(url: string): Promise <any>
  pagingGetPresentables(params: pagingGetPresentablesParams): Promise <any>
  getPresentable(params: string): Promise <any>
  getPresentableAuth(params: string): Promise <any>
  getPresentableData(params: string): Promise <Response>
  batchGetPresentables(params: batchGetPresentablesParams): Promise <any>
  getPresnetableSubDependData(presentableId: string, subDependId: string, entityNid: string): Promise <Response>
  getPresnetableSubDependInfo(presentableId: string, subDependId: string, entityNid: string): Promise <any>
  requireSubDepend(presentableId: string, subDependId: string, entityNid: string): Promise <any>
}

export default function initQI(): QI {
  const fetch = createQIFetch({
    baseURL: window.FreelogApp.Env.qiOrigin,
  })

  return {
    fetch,
    create: createQIFetch,
    get(url, options) {
      return fetch(url, Object.assign(options, { method: 'get' }))
    },
    delete(url, options) {
      return fetch(url, Object.assign(options, { method: 'delete' }))
    },
    options(url, options) {
      return fetch(url, Object.assign(options, { method: 'options' }))
    },
    post(url, options) {
      return fetch(url, Object.assign(options, { method: 'post' }))
    },
    put(url, options) {
      return fetch(url, Object.assign(options, { method: 'put' }))
    },
    resolveSubDependDataUrl, 
    resolveSubDependInfoUrl, 
    resolvePresentableDataUrl,
    pagingGetPresentables,
    getPresentable,
    getPresentableAuth,
    getPresentableData,
    batchGetPresentables,
    getPresnetableSubDependData,
    getPresnetableSubDependInfo,
    requireSubDepend,
  }
}
 