import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourcePageModelState {
  dataSource: any[];
}

export interface ResourcePageModelType {
  namespace: 'resourcePage';
  state: ResourcePageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourcePageModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourcePageModelType = {

  namespace: 'resourcePage',

  state: {
    dataSource: [{
      id: 1,
      cover: '',
      title: '这里是发行名称1',
      version: '1.0.10',
      policy: ['免费1', '免费2', '免费3'],
      type: 'image',
    }, {
      id: 2,
      cover: '',
      title: '这里是发行名称2',
      version: '1.0.10',
      policy: ['免费1', '免费2', '免费3'],
      type: 'image',
    }],
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: ResourcePageModelState, action: AnyAction): ResourcePageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;