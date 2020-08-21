import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list, ListParamsType} from "@/services/resources";
import {ConnectState, ResourceListPageModelState} from "@/models/connect";
import {resourceList, ResourceListParamsType} from "@/services/collections";

// import {ResourcePageModelState} from "@/models/resourceListPage";

export interface ResourceCollectPageModelState {
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
    policy: string[];
    type: string;
  }[];
}

// export interface OnChangeResourceTypeAction extends AnyAction {
//   type: 'resourceCollectPage/onChangeResourceType',
//   payload: string;
// }
//
// export interface OnChangeResourceStatusAction extends AnyAction {
//   type: 'resourceCollectPage/onChangeResourceStatus',
//   payload: string;
// }
//
// export interface OnChangeInputTextAction extends AnyAction {
//   type: 'resourceCollectPage/onChangeInputText',
//   payload: string;
// }

// export interface ChangeDataSourceAction extends AnyAction {
//   type: 'resourceCollectPage/changeDataSource' | 'changeDataSource',
//   payload: ResourceCollectPageModelState['dataSource'];
// }

// export interface OnChangePageCurrentAction extends AnyAction {
//   type: 'resourceCollectPage/onChangePageCurrent',
//   payload: number;
// }

// export interface OnChangePageSizeAction extends AnyAction {
//   type: 'resourceCollectPage/onChangePageSize',
//   payload: number;
// }

// export interface OnChangeTotalNumAction extends AnyAction {
//   type: 'resourceCollectPage/onChangeTotalNum' | 'onChangeTotalNum',
//   payload: number;
// }

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceCollectPage/fetchDataSource' | 'fetchDataSource',
}

export interface ChangeStatesAction extends AnyAction {
  type: 'resourceCollectPage/changeStates',
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

export interface ResourceCollectModelType {
  namespace: 'resourceCollectPage';
  state: ResourceCollectPageModelState;
  effects: {
    changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCollectPageModelState, ChangeAction>;
    // onChangeResourceType: DvaReducer<ResourceCollectPageModelState, OnChangeResourceTypeAction>;
    // onChangeResourceStatus: DvaReducer<ResourceCollectPageModelState, OnChangeResourceStatusAction>;
    // onChangeInputText: DvaReducer<ResourceCollectPageModelState, OnChangeInputTextAction>;
    // changeDataSource: DvaReducer<ResourceCollectPageModelState, ChangeDataSourceAction>;
    // onChangePageCurrent: DvaReducer<ResourceCollectPageModelState, OnChangePageCurrentAction>;
    // onChangePageSize: DvaReducer<ResourceCollectPageModelState, OnChangePageSizeAction>;
    // onChangeTotalNum: DvaReducer<ResourceCollectPageModelState, OnChangeTotalNumAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceCollectModelType = {

  namespace: 'resourceCollectPage',

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
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
      });
    },
    * fetchDataSource(_: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      const params: ResourceListParamsType = yield select(({resourceCollectPage}: ConnectState) => ({
        page: resourceCollectPage.pageCurrent,
        pageSize: resourceCollectPage.pageSize,
        keywords: resourceCollectPage.inputText,
        resourceType: resourceCollectPage.resourceType === '-1' ? undefined : resourceCollectPage.resourceType,
        resourceStatus: resourceCollectPage.resourceStatus === '-1' ? 2 : resourceCollectPage.resourceStatus,
      }));
      const {data} = yield call(resourceList, params);
      // TODO:
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataSource: [],
          totalNum: data.totalItem,
        },
      });
      // yield put({type: 'save'});
      // yield put<ChangeDataSourceAction>({
      //   type: 'changeDataSource',
      //   payload: [],
      // });
      // yield put<OnChangeTotalNumAction>({
      //   type: 'onChangeTotalNum',
      //   payload: data.totalItem,
      // });
    },
  },

  reducers: {
    change(state: ResourceCollectPageModelState, action: ChangeAction): ResourceCollectPageModelState {
      return {
        ...state,
        ...action.payload
      };
    },
    // onChangeResourceType(state: ResourceCollectPageModelState, action: OnChangeResourceTypeAction): ResourceCollectPageModelState {
    //   return {...state, resourceType: action.payload};
    // },
    // onChangeResourceStatus(state: ResourceCollectPageModelState, action: OnChangeResourceStatusAction): ResourceCollectPageModelState {
    //   return {...state, resourceStatus: action.payload};
    // },
    // onChangeInputText(state: ResourceCollectPageModelState, action: OnChangeInputTextAction): ResourceCollectPageModelState {
    //   return {...state, inputText: action.payload};
    // },
    // changeDataSource(state: ResourceCollectPageModelState, {payload, restart = false}: ChangeDataSourceAction): ResourceCollectPageModelState {
    //   return {
    //     ...state,
    //     dataSource: payload
    //   };
    // },
    // onChangePageCurrent(state: ResourceCollectPageModelState, action: OnChangePageCurrentAction): ResourceCollectPageModelState {
    //   return {...state, pageCurrent: action.payload};
    // },
    // onChangePageSize(state: ResourceCollectPageModelState, action: OnChangePageSizeAction): ResourceCollectPageModelState {
    //   return {...state, pageSize: action.payload};
    // },
    // onChangeTotalNum(state: ResourceCollectPageModelState, action: OnChangeTotalNumAction): ResourceCollectPageModelState {
    //   return {...state, totalNum: action.payload};
    // },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        if (listener.pathname === '/resource/collect') {
          dispatch<FetchDataSourceAction>({
            type: 'fetchDataSource',
          });
        }
      });
    },
  },

};

export default Model;
