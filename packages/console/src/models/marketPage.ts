import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list, ListParamsType} from '@/services/resources';
import {ConnectState} from "@/models/connect";
import {useDebounce} from "ahooks";

// import {useDebounceFn} from 'ahooks';

export interface MarketPageModelState {
  pageCurrent: number;
  resourceType: string;
  inputText: string;
  dataSource: {
    id: string;
    cover: string,
    title: string,
    version: string,
    policy: string[],
    type: string,
  }[];
  totalItem: number;
}

export interface ChangeDataSourceAction extends AnyAction {
  type: 'marketPage/changeDataSource' | 'changeDataSource';
  payload: MarketPageModelState['dataSource'];
  restart?: boolean;
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'fetchDataSource',
}

export interface ChangeStatesAction extends AnyAction {
  type: 'marketPage/changeStates',
  payload: {
    resourceType?: string;
    inputText?: string;
    pageCurrent?: number;
  };
}

export interface ChangeAction extends AnyAction {
  type: 'change',
  payload: Partial<MarketPageModelState>;
}

export interface MarketModelType {
  namespace: 'marketPage';
  state: MarketPageModelState;
  effects: {
    changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    changeDataSource: DvaReducer<MarketPageModelState, ChangeDataSourceAction>;
    change: DvaReducer<MarketPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
    fetchData: Subscription;
    // takeEvery: Subscription;
  };
}

const Model: MarketModelType = {

  namespace: 'marketPage',

  state: {
    pageCurrent: 1,
    resourceType: '-1',
    inputText: '',
    dataSource: [],
    totalItem: -1,
  },

  effects: {
    * changeStates({payload}: ChangeStatesAction, {put}: EffectsCommandMap) {
      if (payload.resourceType || payload.inputText) {
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
    * fetchDataSource(action: FetchDataSourceAction, {call, put, select, take}: EffectsCommandMap) {

      const routerHistory = yield select(({global: {routerHistories}}: ConnectState) => {
        // console.log(routerHistory, 'routerHistory');
        return routerHistories[routerHistories.length - 1];
      });
      const oldDataSource = yield select(({marketPage}: ConnectState) => ({
        dataSource: marketPage.dataSource,
      }));
      if (routerHistory?.pathname === '/example' && oldDataSource.dataSource.length > 0) {
        return;
      }

      const params: ListParamsType = yield select(({marketPage}: ConnectState) => ({
        page: marketPage.pageCurrent,
        keywords: marketPage.inputText,
        resourceType: marketPage.resourceType === '-1' ? undefined : marketPage.resourceType,
      }));

      const {data} = yield call(list, {
        ...params,
        status: 1,
        pageSize: 20,
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          totalItem: data.totalItem,
        },
      });
      const dataSource = data.dataList.map((i: any) => ({
        id: i.resourceId,
        cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
        title: i.resourceName,
        version: i.latestVersion,
        policy: i.policies.map((l: any) => l.policyName),
        type: i.resourceType,
      }));
      yield put<ChangeDataSourceAction>({
        type: 'changeDataSource',
        payload: dataSource,
        restart: params.page === 1,
      });
    },
  },

  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    changeDataSource(state, {payload, restart = false}): MarketPageModelState {
      if (restart) {
        return {
          ...state,
          dataSource: payload
        };
      }
      return {
        ...state,
        dataSource: [
          ...state.dataSource,
          ...payload,
        ],
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // history.listen((listener) => {
      //   // console.log(listener, 'LLLLLLLLLLLL');
      //   if (listener.pathname === '/market') {
      //     dispatch({type: 'onChangeTabValue', payload: '1'});
      //   }
      //   if (listener.pathname === '/example') {
      //     dispatch({type: 'onChangeTabValue', payload: '2'});
      //   }
      // });
    },
    // takeEvery({dispatch, history}: SubscriptionAPI) {
    //   dispatch<TakeEveryAction>({
    //     type: 'takeEvery',
    //   });
    // },
    fetchData({dispatch, history}: SubscriptionAPI) {

      history.listen((listener) => {
        // console.log(listener, 'listener');
        if (listener.pathname === '/market') {
          dispatch<FetchDataSourceAction>({
            type: 'fetchDataSource',
          });
        }
      });
    },
  },

};

export default Model;
