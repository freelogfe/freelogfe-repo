import createQIFetch, { qiFetchFn } from '../qi-fetch/index'
import { getQIoringin, getNodeType } from '../initEnv'
import { resolveSubDependDataUrl, resolveSubDependInfoUrl, resolvePresentableDataUrl } from './resolveUrl'
import { injectCodeResource } from '../helpers'

const HEADERS_FREELOG_SUB_DEPENDENCIES = 'freelog-sub-dependencies'

const authInfo = window.__auth_info__ || {}
const nodeId: string = authInfo.__auth_node_id__ || ''
const nodeType: string = getNodeType()

const _fetch: qiFetchFn = createQIFetch({
  baseURL: getQIoringin(),
  timeout: 30000,
  data: { nodeId, nodeType }
});

export async function getUserNodeData({fields= ''}: {fields: string;} = {fields: ''}): Promise<object> {
  if (!fields) {
    return _fetch(`/v1/storages/buckets/.UserNodeData/objects/${nodeId}/customPick`, {})
  }
  return _fetch(`/v1/storages/buckets/.UserNodeData/objects/${nodeId}/customPick?fields=${fields}`, {})
}

export async function setUserNodeData({removeFields = [],appendOrReplaceObject= {}}: {removeFields?: string[]; appendOrReplaceObject?: object;}) {
  return _fetch(`/v1/storages/buckets/.UserNodeData/objects/${nodeId}`, {
    method: 'put',
    data: {
      removeFields,
      appendOrReplaceObject
    },
  })
}

/**
 * 分页获取节点Presentable列表
 * @param {Object} params
 */
export interface pagingGetPresentablesParams {
  nodeId?: string
  keywords?: string
  tags?: string
  resourceType?: string
  limit?: number
  skip?: number   // pageSize?: number
  onlineStatus?: number
}
export async function pagingGetPresentables(params: pagingGetPresentablesParams = {}): Promise<any> {
  return _fetch('/v1/presentables/authList', { data: params })
    .then(resp => resp.json())
    .then(res => {
      if(res.errcode === 0 && res.data.dataList) {
        res.data.dataList = res.data.dataList.map((p: plainObject) => {
          const authResult = p.authResult
          const fSubDependencies = authResult[HEADERS_FREELOG_SUB_DEPENDENCIES]
          p.authResult.subDependencies = resolveSubDependencies(fSubDependencies)
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
        res.data.subDependencies = resolveSubDependencies(fSubReleases)
      }
      return res
    })
}

export interface ISubDependency {
  entityNid?: string
  id: string
  name: string
  resourceType: string
  type: string
}
function resolveSubDependencies(fSubDependencies: string): Array<ISubDependency> {
  var subDependencies: Array<ISubDependency> = []
  try {
    const subDependenciesString: string = Buffer.from(fSubDependencies,'base64').toString('utf-8')
    subDependencies = JSON.parse(subDependenciesString)
  } catch(e) {
    console.error(e)
  }
  return subDependencies
}

/**
 * 根据presentableID获取单个presentable资源数据
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
          p.authResult.subDependencies = resolveSubDependencies(fSubDependencies)
          return p
        })
      }
      return res
    })
}

/**
 * 获取presentable子依赖的数据内容
 */
export async function getPresentableSubDependData(presentableId: string, subDependId: string, entityNid: string): Promise<Response> {
  const url: string = resolveSubDependDataUrl(presentableId, subDependId, entityNid)
  return _fetch(url)
}

/**
 * 获取presentable子依赖的信息
 */
export async function getPresentableSubDependInfo(presentableId: string, subDependId: string, entityNid: string): Promise<any> {
  const url: string = resolveSubDependInfoUrl(presentableId, subDependId, entityNid)
  return _fetch(url).then(resp => resp.json())
}

export async function requireResource(presentableId: string): Promise<any> {
  const url: string = resolvePresentableDataUrl(presentableId)
  return loadResource(url)
}

export async function requireSubDepend(presentableId: string, subDependId: string, entityNid: string): Promise<any> {
  const url: string = resolveSubDependDataUrl(presentableId, subDependId, entityNid)
  return loadResource(url)
}

async function loadResource(url: string): Promise<any> {
  var type: string
  const response = await _fetch(url)
  const contentType: string = response.headers.get('content-type')
  if (/css/.test(contentType)) {
    type = 'text/css'
  }
  else if (/javascript/.test(contentType)) {
    type = 'text/javascript'
  }
  const data = response.text()
  await injectCodeResource(data, type)
}