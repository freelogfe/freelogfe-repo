import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list, ListParamsType} from "@/services/resources";
import {debounce } from 'redux-saga/effects'
import {ConnectState} from "@/models/connect";

export interface ResourceListPageModelState {
  resourceType: string;
  resourceStatus: string;
  inputText: string;
  pageCurrent: number;
  pageSize: number;
  totalNum: number;
  dataSource: {
    id: string;
    cover: string;
    title: string;
    version: string;
    // policy: i.policies,
    policy: string[],
    type: string;
    status: 0 | 1;
  }[];
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'fetchDataSource',
}

export interface ChangeStatesAction extends AnyAction {
  type: 'resourceListPage/changeStates',
  payload: {
    resourceType?: string;
    resourceStatus?: string;
    inputText?: string;
    pageCurrent?: number;
    pageSize?: number;
  };
}

export interface ChangeAction extends AnyAction {
  type: 'change',
  payload: Partial<ResourceListPageModelState>;
}

export interface ResourceListPageModelType {
  namespace: 'resourceListPage';
  state: ResourceListPageModelState;
  effects: {
    changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceListPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ResourceListPageModelType = {

  namespace: 'resourceListPage',

  state: {
    resourceType: '-1',
    resourceStatus: '2',
    inputText: '',
    dataSource: [],
    pageCurrent: 1,
    pageSize: 20,
    totalNum: -1,
  },

  effects: {
    * changeStates({payload}: ChangeStatesAction, {put}: EffectsCommandMap) {
      if (payload.resourceType || payload.inputText || payload.pageSize || payload.resourceStatus) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            ...payload,
            pageCurrent: 1,
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload,
        });
      }
      // yield debounce(1000, 'change', () => console.log('####'))

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
      });
    },
    * fetchDataSource(_: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      // yield put({type: 'save'});
      const params: ListParamsType = yield select(({resourceListPage}: ConnectState) => ({
        page: resourceListPage.pageCurrent,
        pageSize: resourceListPage.pageSize,
        keywords: resourceListPage.inputText,
        resourceType: resourceListPage.resourceType === '-1' ? undefined : resourceListPage.resourceType,
        status: resourceListPage.resourceStatus,
      }));
      const {data} = yield call(list, {
        ...params,
        isSelf: 1,
      });
      // console.log(data, 'dataasdfw');

      const resource: ResourceListPageModelState['dataSource'] = data.dataList.map((i: any) => ({
        id: i.resourceId,
        cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
        title: i.resourceName,
        version: i.latestVersion,
        // policy: i.policies,
        policy: i.policies.map((l:any) => l.policyName),
        type: i.resourceType,
        status: i.status,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataSource: resource,
          totalNum: data.totalItem,
        },
      });
    },
  },

  reducers: {
    change(state: ResourceListPageModelState, action: ChangeAction): ResourceListPageModelState {
      return {
        ...state,
        ...action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        if (listener.pathname === '/resource/list') {
          dispatch<FetchDataSourceAction>({
            type: 'fetchDataSource',
          });
        }
      });
    },

  },

};

export default Model;
