import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {create} from '@/services/resources';
import {ConnectState} from "@/models/connect";
import {router} from "umi";

export interface ResourceCreatorPageModelState {
  name: string;
  nameErrorText: string;
  resourceType: string;
  resourceTypeErrorText: string;
  introduction: string;
  cover: string;
  labels: string[];
}

export interface OnCreateAction extends AnyAction {
  type: 'resourceCreatorPage/create';
}

// export interface OnVerifyAction extends AnyAction {
//   type: 'verify';
// }

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceCreatorPage/change',
  payload: Partial<ResourceCreatorPageModelState>;
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    create: (action: OnCreateAction, effects: EffectsCommandMap) => void;
    // verify: (action: OnVerifyAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceCreatorPageModelType = {

  namespace: 'resourceCreatorPage',

  state: {
    name: '',
    // /^(?!_)[a-z0-9_]{3,20}(?<!_)$/
    nameErrorText: '',
    resourceType: '',
    resourceTypeErrorText: '',
    introduction: '',
    cover: '',
    labels: [],
  },

  effects: {
    * create({}: OnCreateAction, {call, put, select}: EffectsCommandMap) {
      const params = yield select(({resourceCreatorPage}: ConnectState) => ({
        name: resourceCreatorPage.name,
        resourceType: resourceCreatorPage.resourceType,
        policies: [],
        coverImages: resourceCreatorPage.cover ? [resourceCreatorPage.cover] : [],
        intro: resourceCreatorPage.introduction,
        tags: resourceCreatorPage.labels,
      }));
      const {nameErrorText, resourceTypeErrorText} = verifyDate(params);
      if (nameErrorText || resourceTypeErrorText) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            nameErrorText,
            resourceTypeErrorText,
          },
        });
      }

      const {data} = yield call(create, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          name: '',
          nameErrorText: '',
          resourceType: '',
          resourceTypeErrorText: '',
          introduction: '',
          cover: '',
          labels: [],
        },
      });
      router.replace(`/resource/${data.resourceId}/success`);
    },
  },

  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;

function verifyDate({name, resourceType}: any) {
  let nameErrorText = '';
  if (!name) {
    nameErrorText = '请输入资源名称';
  } else if (name.length > 60) {
    nameErrorText = '不多于60个字符';
  } else if (!/^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#)).{1,60}$/.test(name)) {
    nameErrorText = `不符合正则 /^(?!.*(\\\\|\\/|:|\\*|\\?|"|<|>|\\||\\s|@|\\$|#)).{1,60}$/`;
  }

  let resourceTypeErrorText = '';
  if (!resourceType) {
    resourceTypeErrorText = '请输入资源类型';
  } else if (resourceType.length < 3) {
    resourceTypeErrorText = '不少于3个字符';
  } else if (!/^(?!_)[a-z0-9_]{3,20}(?<!_)$/.test(resourceType)) {
    resourceTypeErrorText = `不符合正则 /^(?!_)[a-z0-9_]{3,20}(?<!_)$/`;
  }
  return {nameErrorText, resourceTypeErrorText};
}
