import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {
  formatDate,
  formatTime,
  formatRelative,
  formatNumber,
  formatPlural,
  formatMessage,
  formatHTMLMessage,
  setLocale,
  getLocale,
} from 'umi-plugin-react/locale';
import {History} from "history";
import {ConnectState} from "@/models/connect";

export interface GlobalModelState {
  locale: 'zh-CN' | 'en-US' | 'pt-BR';
  route: any;
  routerHistories: History['location'][];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'global/change';
  payload: Partial<GlobalModelState>;
}

export interface SetLocaleAction extends AnyAction {
  type: 'global/setLocale';
  payload: GlobalModelState['locale'];
}

export interface PushRouterAction extends AnyAction {
  type: 'pushRouter';
  payload: GlobalModelState['routerHistories'][number];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    setLocale: (action: SetLocaleAction, effects: EffectsCommandMap) => void;
    pushRouter: (action: PushRouterAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<GlobalModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: GlobalModelType = {
  namespace: 'global',
  state: {
    locale: getLocale() as GlobalModelState['locale'],
    route: null,
    routerHistories: [],
  },
  effects: {
    * setLocale({payload}: SetLocaleAction, {call, put}: EffectsCommandMap) {
      yield call(setLocale, payload);
      // yield call(window.localStorage.setItem, 'local', payload);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          locale: payload,
        },
      });
    },
    * pushRouter({payload}: PushRouterAction, {put, select}: EffectsCommandMap) {
      const {routerHistories} = yield select(({global}: ConnectState) => ({
        routerHistories: global.routerHistories,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          routerHistories: [
            ...routerHistories,
            payload,
          ],
        },
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
    setup({dispatch, history}) {
      history.listen((listener) => {
        // console.log(listener, 'listener098phijnoweklf');
        dispatch<PushRouterAction>({
          type: 'pushRouter',
          payload: listener,
        });
      });
    }
  }
};

export default Model;
