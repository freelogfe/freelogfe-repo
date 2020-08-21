import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export interface TempModelState {
  info: null | {};
}

interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<TempModelState>;
}

interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface TempModelType {
  namespace: 'temp';
  state: TempModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<TempModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: TempModelType = {
  namespace: 'temp',
  state: {
    info: null,
  },
  effects: {
    * fetchInfo({}, {}) {

    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup({}) {

    }
  }
};

export default Model;
