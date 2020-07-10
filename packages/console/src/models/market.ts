import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {Reducer} from './shared';

export interface MarketModelState {
  dataSource: any[];
}

export interface MarketModelType {
  namespace: 'market';
  state: MarketModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: Reducer<MarketModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const MarketModel: MarketModelType = {

  namespace: 'market',

  state: {
    dataSource: [],
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: MarketModelState, action: AnyAction): MarketModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default MarketModel;
