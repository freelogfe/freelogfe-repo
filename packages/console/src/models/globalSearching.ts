import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';

export interface GlobalSearchingModelState {
  input: string;
}

// type GlobalSearchingModelState = WholeReadonly<IGlobalSearchingModelState>

interface OnInputChangeAction extends AnyAction {
  payload: string
}

export interface GlobalSearchingModelType {
  namespace: 'globalSearching';
  state: GlobalSearchingModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    onInputChange: DvaReducer<GlobalSearchingModelState, OnInputChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: GlobalSearchingModelType = {

  namespace: 'globalSearching',

  state: {
    input: '',
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      // console.log('FFFFFFFFF');
      // yield call(list, {page: 1});
      // yield put({type: 'save'});
    },
  },

  reducers: {
    onInputChange(state: GlobalSearchingModelState, action: OnInputChangeAction): GlobalSearchingModelState {
      return {...state, input: action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        // console.log(listener, 'LLLLLLLLLLLL');
        // if (listener.pathname === '/') {
        //   dispatch({type: 'fetchDataSource'});
        // }
      });
    },
  },

};

export default Model;
