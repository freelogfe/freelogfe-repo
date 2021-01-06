import request from '@/utils/request';

// 创建展品
export interface CreatePresentableParamsType {
  nodeId: number;
  resourceId: string;
  version: string;
  resolveResources: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
  presentableName: string;
  tags?: string[];
}

export function createPresentable(params: CreatePresentableParamsType) {
  return request.post(`/v2/presentables`, params);
}

// 更新展品
export interface UpdatePresentableParamsType {
  presentableId: string;
  presentableTitle?: string;
  tags?: string[];
  coverImages?: string[];
  addPolicies?: {
    policyName: string;
    policyText: string;
    status?: 0 | 1;
  }[];
  updatePolicies?: {
    policyId: string;
    status: 0 | 1;
  }[];
  resolveResources?: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
}

export function updatePresentable({presentableId, ...params}: UpdatePresentableParamsType) {
  return request.put(`/v2/presentables/${presentableId}`, params);
}

// 上下线presentable
export interface PresentablesOnlineParamsType {
  presentableId: string;
  onlineStatus: 0 | 1;
}

export function presentablesOnlineStatus({presentableId, ...params}: PresentablesOnlineParamsType) {
  return request.put(`/v2/presentables/${presentableId}/onlineStatus`, params);
}

// 查看展品详情
export interface PresentableDetailsParamsType1 {
  presentableId: string;
  projection?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
  isLoadCustomPropertyDescriptors?: 0 | 1;
}

export interface PresentableDetailsParamsType2 {
  nodeId: number;
  resourceId?: string;
  resourceName?: string;
  presentableName?: string;
  projection?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
  isLoadCustomPropertyDescriptors?: 0 | 1;
}

export function presentableDetails(params: PresentableDetailsParamsType1 | PresentableDetailsParamsType2) {
  if ((params as PresentableDetailsParamsType2).nodeId) {
    return request.get(`/v2/presentables/detail`, {
      params,
    });
  }
  const {presentableId, ...p} = params as PresentableDetailsParamsType1;
  return request.get(`/v2/presentables/${presentableId}`, {
    params: p,
  });
}

// 查询展品分页列表
export interface PresentablesParamsType {
  nodeId: number;
  skip?: number;
  limit?: number;
  resourceType?: string;
  omitResourceType?: string;
  onlineStatus?: number;
  tags?: string;
  projection?: string;
  keywords?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
}

export function presentables(params: PresentablesParamsType) {
  return request.get(`/v2/presentables`, {
    params,
  });
}

// 批量查询展品列表
export interface PresentableListParamsType {
  nodeId?: number;
  userId?: number;
  presentableIds?: string;
  resourceIds?: string;
  resourceNames?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
  projection?: string;
}

export function presentableList(params: PresentableListParamsType) {
  return request.get(`/v2/presentables/list`, {
    params,
  });
}

// 切换展品版本
export interface PresentablesVersionParamsType {
  presentableId: string;
  version: string;
}

export function presentablesVersion({presentableId, ...params}: PresentablesVersionParamsType) {
  return request.put(`/v2/presentables/${presentableId}/version`, params);
}


// 设置展品自定义属性
export interface UpdateRewritePropertyParamsType {
  presentableId: string;
  rewriteProperty: {
    key: string;
    value: string;
    remark: string;
  }[];
}

export function updateRewriteProperty({presentableId, ...params}: UpdateRewritePropertyParamsType) {
  return request.put(`/v2/presentables/${presentableId}/rewriteProperty`, params);
}

// 批量获取展品授权结果
export interface BatchAuthParamsType {
  nodeId: number;
  authType: 1 | 2 | 3; // 1:节点侧授权 2:资源侧授权 3:节点+资源侧授权
  presentableIds: string;
}

export function batchAuth({nodeId, ...params}: BatchAuthParamsType) {
  return request.get(`/v2/auths/presentables/nodes/${nodeId}/batchAuth/result`, {
    params,
  });
}
