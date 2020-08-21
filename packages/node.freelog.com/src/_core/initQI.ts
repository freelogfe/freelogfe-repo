
import getUserInfo from '@freelog/freelog-ui-login/src/shared/getUserInfo'
import createQIFetch, { QIFetchOpts, qiFetchFn } from './qi-fetch/index'
import { getQIoringin } from './initEnv'
import { resolveSubDependDataUrl, resolveSubDependInfoUrl, resolvePresentableDataUrl } from './api/resolveUrl'
import {
  pagingGetPresentablesParams,
  pagingGetPresentables,
  getPresentable,
  getPresentableAuth,
  getPresentableData,
  batchGetPresentablesParams,
  batchGetPresentables,
  getUserNodeData,
  setUserNodeData,
  getPresentableSubDependData,
  getPresentableSubDependInfo,
  requireResource,
  requireSubDepend,
} from './api'


type fetchFn = (url: string, options: QIFetchOpts) => Promise <any>
export interface IFreelogQuery {
  create(opts: QIFetchOpts): any
  get: qiFetchFn
  delete: qiFetchFn
  options: qiFetchFn
  post: qiFetchFn
  put: qiFetchFn
  fetch: qiFetchFn
  resolveSubDependDataUrl(presentableId: string, subDependId: string, entityNid: string): string
  resolveSubDependInfoUrl(presentableId: string, subDependId: string, entityNid: string): string
  resolvePresentableDataUrl(presentableId: string): string
  getUserInfo(url: string): any
  // checkUserIsLogin(url: string): Promise <any>
  pagingGetPresentables(params: pagingGetPresentablesParams): Promise <any>
  getPresentable(presentableId: string): Promise <any>
  getPresentableAuth(presentableId: string): Promise <any>
  getPresentableData(presentableId: string): Promise <Response>
  batchGetPresentables(params: batchGetPresentablesParams): Promise <any>
  getPresentableSubDependData(presentableId: string, subDependId: string, entityNid: string): Promise <Response>
  getPresentableSubDependInfo(presentableId: string, subDependId: string, entityNid: string): Promise <any>
  requireResource(presentableId: string): Promise<any>
  requireSubDepend(presentableId: string, subDependId: string, entityNid: string): Promise <any>
  getUserNodeData(params: {fields: string;}): Promise<object>
  setUserNodeData(data: {removeFields: string[]; appendOrReplaceObject: object;}): Promise<void>
}

export default function initQI(): IFreelogQuery {
  const fetch: qiFetchFn = createQIFetch({
    baseURL: getQIoringin(),
  })

  return {
    fetch,
    create: createQIFetch,
    get(url, options = {}) {
      return fetch(url, Object.assign(options, { method: 'get' }))
    },
    delete(url, options = {}) {
      return fetch(url, Object.assign(options, { method: 'delete' }))
    },
    options(url, options = {}) {
      return fetch(url, Object.assign(options, { method: 'options' }))
    },
    post(url, options = {}) {
      return fetch(url, Object.assign(options, { method: 'post' }))
    },
    put(url, options = {}) {
      return fetch(url, Object.assign(options, { method: 'put' }))
    },
    resolveSubDependDataUrl,
    resolveSubDependInfoUrl,
    resolvePresentableDataUrl,
    pagingGetPresentables,
    getUserNodeData,
    setUserNodeData,
    getPresentable,
    getPresentableAuth,
    getPresentableData,
    batchGetPresentables,
    getPresentableSubDependData,
    getPresentableSubDependInfo,
    requireResource,
    requireSubDepend,
    getUserInfo,
  }
}
