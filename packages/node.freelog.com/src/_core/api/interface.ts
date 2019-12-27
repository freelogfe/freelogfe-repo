import createQIFetch, { qiFetchFn } from '../qi-fetch/index'
import { getQIoringin, getNodeType } from '../initEnv'
import { resolveSubDependDataUrl, resolveSubDependInfoUrl } from './resolveUrl'
import { injectCodeResource } from '../helpers'

const HEADERS_FREELOG_SUB_DEPENDENCIES = 'freelog-sub-dependencies'

const authInfo = window.__auth_info__ || {}
const nodeId: string = authInfo.__auth_node_id__ || ''
const nodeType: string = getNodeType()

const _fetch: qiFetchFn = createQIFetch({
  baseURL: getQIoringin(),
  timeout: 1000,
  data: { nodeId, nodeType }
})

/**
 * 分页获取节点Presentable列表
 * @param {Object} params 
 */
export interface pagingGetPresentablesParams {
  nodeId?: string
  keywords?: string
  tags?: string
  resourceType?: string
  page?: number
  pageSize?: number
  isOnline?: number
}
export async function pagingGetPresentables(params: pagingGetPresentablesParams = {}): Promise<any> {
  return _fetch('/v1/presentables/authList', { data: params })
    .then(resp => resp.json())
    .then(res => {
      if(res.errcode === 0 && res.data.dataList) {
        res.data.dataList = res.data.dataList.map((p: plainObject) => {
          const authResult = p.authResult  
          const fSubDependencies = authResult[HEADERS_FREELOG_SUB_DEPENDENCIES]
          p.authResult.subReleases = resolveSubDependencies(fSubDependencies)
          return p
        })
      }
      return res
    })
}

/**
 * 获取单个presentable
 * @param {String} presentableId 
 */
export async function getPresentable(presentableId: string): Promise<any> {
  return _fetch(`/v1/presentable/${presentableId}/info`)
    .then(resp => resp.json())
}

/**
 * 获取单个presentable授权
 * @param {string} presentableId  
 */
export async function getPresentableAuth(presentableId: string): Promise<any> {
  return _fetch(`/v1/presentable/${presentableId}/auth`)
    .then(resp => resp.json())
    .then(res => {
      if(res.errcode === 0 && res.data) {
        const fSubReleases: string = res.data[HEADERS_FREELOG_SUB_DEPENDENCIES]
        res.data.subReleases = resolveSubDependencies(fSubReleases)
      }
      return res
    })
}

export interface subDependency {
  entityNid?: string
  id: string
  name: string
  resourceType: string
  type: string
}
function resolveSubDependencies(fSubDependencies: string): Array<subDependency> {
  var subDependencies: Array<subDependency> = []
  try {
    const subDependenciesString: string = Buffer.from(fSubDependencies,'base64').toString('utf-8')
    subDependencies = JSON.parse(subDependenciesString)
  } catch(e) {
    console.error(e)
  }
  return subDependencies 
}

/**
 * 获取单个presentable资源数据
 * @param {string} presentableId  
 */
export async function getPresentableData(presentableId: string): Promise<Response> {
  return _fetch(`/v1/presentable/${presentableId}/data`)
}

/**
 * 通过releaseNames或relealseIds批量获取节点Presentable
 * @param {Object} params 
 */
export interface batchGetPresentablesParams {
  releaseNames: string
  releaseIds: string
}
export async function batchGetPresentables(params?: batchGetPresentablesParams): Promise<any> {
  const nodeId: number = window.__auth_info__.__auth_node_id__
  return _fetch(`/v1/${nodeId}/presentables/authList`, { data: params })
    .then(resp => resp.json())
    .then(res => {
      if(res.errcode === 0 && res.data.dataList) {
        res.data.dataList = res.data.dataList.map((p: plainObject) => {
          const authResult = p.authResult  
          const fSubDependencies: string = authResult[HEADERS_FREELOG_SUB_DEPENDENCIES]
          p.authResult.subReleases = resolveSubDependencies(fSubDependencies)
          return p
        })
      }
      return res
    })
}

/**
 * 获取presentable子依赖的数据内容
 */
export async function getPresnetableSubDependData(presentableId: string, subDependId: string, entityNid: string): Promise<Response> {
  const url: string = resolveSubDependDataUrl(presentableId, subDependId, entityNid)
  return _fetch(url)
}

/**
 * 获取presentable子依赖的信息
 */
export async function getPresnetableSubDependInfo(presentableId: string, subDependId: string, entityNid: string): Promise<any> {
  const url: string = resolveSubDependInfoUrl(presentableId, subDependId, entityNid)
  return _fetch(url).then(resp => resp.json())
}

export async function requireSubDepend(presentableId: string, subDependId: string, entityNid: string): Promise<any> {
  const url: string = resolveSubDependDataUrl(presentableId, subDependId, entityNid)
  var type: string
  return _fetch(url)
    .then(resp => {
      const contentType: string = resp.headers.get('content-type')
      if (/css/.test(contentType)) {
        type = 'text/css'
      } else if (/javascript/.test(contentType)) {
        type = 'text/javascript'
      }
      return resp.text()
    })
    .then(data => injectCodeResource(data, type))
}