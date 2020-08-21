import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {currentUserInfo} from "@/services/user";

export interface UserModelState {
  info: null | {
    userId: number;
    username: string;
    nickname: string;
    email: string;
    tokenSn: string;
    mobile: string;
    userRole: number;
    createDate: string;
    updateDate: string;
    headImage: string;
  };
}

interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<UserModelState>;
}

interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface MarketModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<UserModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: MarketModelType = {
  namespace: 'user',
  state: {
    info: null,
  },
  effects: {
    * fetchInfo({}, {call, put}) {
      const {data} = yield call(currentUserInfo);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          info: data,
        }
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
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch<FetchInfoAction>({
        type: 'fetchInfo',
      });
    }
  }
};

export default Model;
