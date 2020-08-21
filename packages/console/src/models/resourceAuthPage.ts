import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FAuthPanelProps} from "@/pages/resource/containers/FAuthPanel";
import {
  batchInfo,
  BatchInfoParamsType, batchSetContracts, BatchSetContractsParamsType,
  resolveResources,
  ResolveResourcesParamsType,
  update,
  UpdateParamsType
} from "@/services/resources";
import {FetchDataSourceAction} from "@/models/resourceInfo";
import {policiesList, PoliciesListParamsType} from "@/services/policies";
import {contracts, ContractsParamsType} from "@/services/contracts";
import moment from "moment";
import {ConnectState} from "@/models/connect";

export interface ResourceAuthPageModelState {
  policies: {
    id: string;
    title: string;
    status: 'executing' | 'stopped';
    code: string;
  }[] | null;
  contractsAuthorized: FAuthPanelProps['dataSource'];
  contractsAuthorize: {
    key: string,
    contractName: string,
    contractID: string,
    authorizedParty: string,
    createDate: string,
    status: 'executing' | 'stopped';
  }[];
}

export interface UpdatePoliciesAction {
  type: 'resourceAuthPage/updatePolicies';
  payload: Partial<Exclude<ResourceAuthPageModelState['policies'], null>[number]>;
  id: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceAuthPage/change',
  payload: Partial<ResourceAuthPageModelState>;
}

export interface FetchPoliciesAction extends AnyAction {
  type: 'resourceAuthPage/fetchPolicies',
  payload: { policyId: string, policyName: string, status: 0 | 1, policyText: string; }[];
}

export interface FetchAuthorizedAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorized' | 'fetchAuthorized',
  payload: {
    baseResourceId: string;
    activatedResourceId?: string;
  };
}

export interface FetchAuthorizeAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorize',
  payload: string;
}

export interface UpdateAuthorizedAction extends AnyAction {
  type: 'resourceAuthPage/updateAuthorized',
  payload: {
    version: string;
    policyId: string;
    operation: 0 | 1;
  }[];
}

export interface ResourceAuthPageModelType {
  namespace: 'resourceAuthPage';
  state: ResourceAuthPageModelState;
  effects: {
    fetchPolicies: (action: FetchPoliciesAction, effects: EffectsCommandMap) => void;
    updatePolicies: (action: UpdatePoliciesAction, effects: EffectsCommandMap) => void;
    fetchAuthorized: (action: FetchAuthorizedAction, effects: EffectsCommandMap) => void;
    fetchAuthorize: (action: FetchAuthorizeAction, effects: EffectsCommandMap) => void;
    updateAuthorized: (action: UpdateAuthorizedAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceAuthPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceAuthPageModelType = {

  namespace: 'resourceAuthPage',

  state: {
    policies: [],
    contractsAuthorized: [],
    contractsAuthorize: [],
  },
  effects: {
    * fetchPolicies({payload}: FetchPoliciesAction, {call, put}: EffectsCommandMap) {
      const policies: ResourceAuthPageModelState['policies'] = payload.map((i) => ({
        id: i.policyId,
        title: i.policyName,
        status: i.status === 1 ? 'executing' : 'stopped',
        code: i.policyText,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          policies: policies,
        }
      });
    },
    * updatePolicies(action: UpdatePoliciesAction, {call, put}: EffectsCommandMap) {
      const params = {
        resourceId: action.id,
        // [action.payload.id ? 'updatePolicies' : 'addPolicies']: [
        [action.payload.status ? 'updatePolicies' : 'addPolicies']: [
          {
            policyId: action.payload.id,
            status: action.payload.status === 'stopped' ? 0 : 1,
          }
        ],
      };
      yield call(update, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: action.id,
      });
    },
    * fetchAuthorized({payload: {baseResourceId, activatedResourceId}}: FetchAuthorizedAction, {call, put}: EffectsCommandMap) {
      const params: ResolveResourcesParamsType = {
        resourceId: baseResourceId,
      };
      const {data} = yield call(resolveResources, params);
      // console.log(data, 'datadata232323');
      if (data.length === 0) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            contractsAuthorized: [],
          },
        });
      }

      const resourceParams: BatchInfoParamsType = {
        resourceIds: data.map((i: any) => i.resourceId).join(','),
        isLoadPolicyInfo: 1,
      };
      // console.log(resourceParams, 'resourceParams908hik');
      const {data: resourcesInfoData} = yield call(batchInfo, resourceParams);
      // console.log(resourcesInfoData, 'resourcesInfoDataresourcesInfoData');

      const contractsParams: ContractsParamsType = {
        identityType: 2,
        licenseeId: baseResourceId,
        isLoadPolicyInfo: 1,
      };

      const {data: {dataList: contractsData}} = yield call(contracts, contractsParams);
      // console.log(contractsData, 'contractsDatacontractsData');
      // const {data: resourceData} = yield call()

      const contractsAuthorized = data.map((i: any/* 关系资源id */, j: number) => {
        // 当前资源信息
        const currentResource = resourcesInfoData.find((resource: any) => resource.resourceId === i.resourceId);
        // console.log(currentResource, 'currentResource');
        const allEnabledVersions: string[] = i.versions.map((version: any) => version.version);
        const allContracts = contractsData
          .filter((c: any) => c.licensorId === i.resourceId);
        // console.info(allContracts, 'allContracts');

        const allUsedPoliciesId = allContracts.map((c: any) => c.policyId);
        // console.info(allUsedPoliciesId, 'allUsedPoliciesId');
        const allEnabledPolicies = resourcesInfoData.find((resource: any) => resource.resourceId === i.resourceId)?.policies?.filter((resource: any) => !allUsedPoliciesId.includes(resource.policyId));
        // console.log(allEnabledPolicies, 'allEnabledPolicies');
        return {
          id: currentResource.resourceId,
          activated: activatedResourceId ? activatedResourceId === currentResource.resourceId : (j === 0),
          title: currentResource.resourceName,
          resourceType: currentResource.resourceType,
          version: '',
          contracts: allContracts
            .map((c: any /* 当前合约 */) => {
              // console.log(c, '当前合约');
              // console.log(i, '关系');
              return {
                checked: true,
                id: c.contractId,
                policyId: c.policyId,
                title: c.contractName,
                status: c.status === 0 ? 'stopping' : 'executing',
                code: c.policyInfo.policyText,
                date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
                // versions: [{version: '10.5.2', checked: true}, {version: '10.5.3', checked: false}]
                versions: allEnabledVersions.map((v: string) => {
                  // console.log(i, currentResource, c, v, 'aw39osidc');
                  const versionContracts = i.versions?.find((version: any) => version.version === v)?.contracts;
                  const versionChecked: boolean = !!versionContracts?.find((contract: any) => contract.contractId === c.contractId);
                  return {
                    version: v,
                    checked: versionChecked,
                    disabled: (versionContracts.length === 1) && versionChecked,
                  };
                }),
              };
            }),
          policies: allEnabledPolicies.map((policy: any) => ({
            id: policy.policyId,
            title: policy.policyName,
            code: policy.policyText,
            allEnabledVersions: allEnabledVersions,
          })),
        }
      });
      // console.log(contractsAuthorized, 'contractsAuthorized');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractsAuthorized,
        },
      });
    },
    * fetchAuthorize({payload}: FetchAuthorizeAction, {call, put}: EffectsCommandMap) {
      const params: ContractsParamsType = {
        identityType: 1,
        licensorId: payload,
      };
      const {data} = yield call(contracts, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractsAuthorize: data.dataList.map((i: any) => ({
            key: i.contractId,
            contractName: i.contractName,
            contractID: i.contractId,
            authorizedParty: i.licenseeName,
            createDate: moment(i.createDate).format('YYYY-MM-DD HH:mm'),
            status: i.isAuth ? 'executing' : 'stopped',
          })),
        }
      });
    },
    * updateAuthorized({payload}: UpdateAuthorizedAction, {select, call, put}: EffectsCommandMap) {
      const {resourceId, activatedResourceId} = yield select(({resourceInfo, resourceAuthPage}: ConnectState) => ({
        resourceId: resourceInfo.info?.resourceId,
        activatedResourceId: (resourceAuthPage.contractsAuthorized.find((auth) => auth.activated) as any).id,
      }));
      const params: BatchSetContractsParamsType = {
        resourceId,
        subjects: [{
          subjectId: activatedResourceId,
          versions: payload,
        }],
      };
      const {data} = yield call(batchSetContracts, params);
      yield put<FetchAuthorizedAction>({
        type: 'fetchAuthorized',
        payload: {
          baseResourceId: resourceId,
          activatedResourceId: activatedResourceId,
        },
      });
    }
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },
};

export default Model;
