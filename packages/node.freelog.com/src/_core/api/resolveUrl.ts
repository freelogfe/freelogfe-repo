
// 获取url：依赖子发行的数据内容
export function resolveSubDependDataUrl(presentableId: string, subDependId: string, entityNid: string): string {
  return resolveUrl(`/v1/presentable/${presentableId}/data/subDepend/${subDependId}`, { entityNid })
}

// 获取url：依赖子发行的信息
export function resolveSubDependInfoUrl(presentableId: string, subDependId: string, entityNid: string): string {
  return resolveUrl(`/v1/presentable/${presentableId}/info/subDepend/${subDependId}`, { entityNid })
}

// 获取url：节点发行(presentable)的数据内容
export function resolvePresentableDataUrl(presentableId: string): string {
  return resolveUrl(`/v1/presentable/${presentableId}/data`)
}

function resolveUrl(path: string, params?: plainObject): string {
  const { nodeType, qiOrigin } = window.FreelogApp.Env
  params = Object.assign({ nodeType }, params)
  var queryStringArr = []
  for (let key in params) {
    if (params[key] != null) {
      queryStringArr.push(`${key}=${params[key]}`)
    }
  }
  return `${qiOrigin}${path}?${queryStringArr.join('&')}`
}