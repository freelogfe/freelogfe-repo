import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';
import {info} from "@/services/resources";
import {FetchAuthorizeAction, FetchAuthorizedAction, FetchPoliciesAction} from "@/models/resourceAuthPage";

export interface ResourceInfoModelState {
  info: null | {
    resourceId: string;
    resourceType: string;
    resourceName: string;
    userId: number;
    username: number;
    coverImages: string[];
    intro: string;
    tags: string[];
    status: 0 | 1;
    latestVersion: string;
    resourceVersions: {
      version: string;
      versionId: string;
      createDate: string;
    }[];
    policies: any[];
    baseUpcastResources: {
      resourceId: string;
      resourceName: string;
    }[];
  };
}

export interface ChangeInfoAction extends AnyAction {
  type: 'resourceInfo/changeInfo' | 'changeInfo';
  payload: ResourceInfoModelState['info'];
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceInfo/fetchDataSource';
  payload: string;
}

export interface ResourceInfoModelType {
  namespace: 'resourceInfo';
  state: WholeReadonly<ResourceInfoModelState>;
  effects: {
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    changeInfo: DvaReducer<ResourceInfoModelState, ChangeInfoAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceInfoModelType = {
  namespace: 'resourceInfo',

  state: {
    info: null,
  },

  effects: {
    * fetchDataSource(action: FetchDataSourceAction, {call, put}: EffectsCommandMap): Generator<any, void, any> {
      const params = {
        resourceIdOrName: action.payload,
        isLoadPolicyInfo: 1,
      };
      const {data} = yield call(info, params);
      // console.log(data, 'DDDDDDDD');
      yield put<ChangeInfoAction>({
        type: 'changeInfo',
        payload: data,
      });

      yield put<FetchPoliciesAction>({
        type: 'resourceAuthPage/fetchPolicies',
        payload: data.policies,
      });

      yield put<FetchAuthorizeAction>({
        type: 'resourceAuthPage/fetchAuthorize',
        payload: data.resourceId,
      });

      yield put<FetchAuthorizedAction>({
        type: 'resourceAuthPage/fetchAuthorized',
        payload: {
          baseResourceId: data.resourceId
        },
      });
    },
  },

  reducers: {
    changeInfo(state: ResourceInfoModelState, action: ChangeInfoAction): ResourceInfoModelState {
      return {
        ...state,
        info: action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // console.log(history, 'historyhistory');
    },
  },

};

export default Model;
