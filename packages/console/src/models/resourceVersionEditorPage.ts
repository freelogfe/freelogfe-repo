import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FCustomPropertiesProps} from "@/pages/resource/components/FCustomProperties";
import {
  resourceVersionInfo,
  ResourceVersionInfoParamsType1,
  updateResourceVersionInfo,
  UpdateResourceVersionInfoParamsType
} from "@/services/resources";
import moment from 'moment';
import {ConnectState} from "@/models/connect";
// const {pathToRegexp} = require('path-to-regexp');
import {pathToRegexp} from '@/utils/pathToRegexp';
import * as redux from 'react-redux';

export interface ResourceVersionEditorPageModelState {
  version: string;
  signingDate: string;
  resourceID: string;
  description: string;
  properties: FCustomPropertiesProps['dataSource'],
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/fetchDataSource' | 'fetchDataSource';
  payload: {
    resourceId: string;
    version: string;
  };
}

export interface UpdateDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/updateDataSource';
  payload: Partial<UpdateResourceVersionInfoParamsType>;
}

export interface ChangeDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/changeDataSource' | 'changeDataSource';
  payload: Partial<ResourceVersionEditorPageModelState>;
}

export interface ResourceVersionEditorModelType {
  namespace: 'resourceVersionEditorPage';
  state: ResourceVersionEditorPageModelState;
  effects: {
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    updateDataSource: (action: UpdateDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourceVersionEditorPageModelState, ChangeDataSourceAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionEditorModelType = {

  namespace: 'resourceVersionEditorPage',

  state: {
    version: '',
    signingDate: '',
    resourceID: '',
    description: '',
    properties: [],
  },

  effects: {
    * fetchDataSource(action: FetchDataSourceAction, {call, put}: EffectsCommandMap) {
      const params: ResourceVersionInfoParamsType1 = action.payload;
      const {data} = yield call(resourceVersionInfo, params);
      yield put<ChangeDataSourceAction>({
        type: 'changeDataSource',
        payload: {
          version: data.version,
          signingDate: moment(data.createDate).format('YYYY-MM-DD'),
          resourceID: data.resourceId,
          description: data.description,
          properties: data.customPropertyDescriptors.map((i: any) => ({
            key: i.key,
            value: i.defaultValue,
            description: i.remark,
            allowCustom: i.type !== 'readonlyText',
            // allowCustom: false,
            custom: i.type === 'select' ? 'select' : 'input',
            customOption: i.candidateItems.join(','),
          })),
        },
      });
    },
    * updateDataSource(action: UpdateDataSourceAction, {call, put, select}: EffectsCommandMap) {
      const baseInfo = yield select(({resourceVersionEditorPage}: ConnectState) => ({
        version: resourceVersionEditorPage.version,
        resourceId: resourceVersionEditorPage.resourceID,
      }));
      const params: UpdateResourceVersionInfoParamsType = {
        ...baseInfo,
        ...action.payload,
      };
      yield call(updateResourceVersionInfo, params);
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: baseInfo,
      });
    }
  },

  reducers: {
    changeDataSource(state: ResourceVersionEditorPageModelState, action: ChangeDataSourceAction): ResourceVersionEditorPageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {

      history.listen((listener) => {
        const regexp = pathToRegexp('/resource/:id/version/:version');
        const result = regexp.exec(listener.pathname);
        if (result) {
          if (result[2] === 'creator') {
            return;
          }
          dispatch<FetchDataSourceAction>({
            type: 'fetchDataSource',
            payload: {
              resourceId: result[1],
              version: result[2],
            }
          });
        }
      });

    },
  },

};

export default Model;
