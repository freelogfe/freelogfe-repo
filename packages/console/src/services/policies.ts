import request from '@/utils/request';

// 批量获取授权策略列表
interface PoliciesParamsType {
  page?: number;
  pageSize?: number;
  subjectType?: 1 | 2 | 3; // 1:资源 2:展品 3:用户组
  projection?: string;
}

export function policies(params: PoliciesParamsType) {
  return request.get('/v2/policies', {
    params,
  });
}

// 批量获取授权策略列表
export interface PoliciesListParamsType {
  policyIds: string;
  subjectType?: number;
  userId?: number;
  projection?: string;
}

export function policiesList(params: PoliciesListParamsType) {
  return request.get('/v2/policies/list', {
    params,
  });
}
