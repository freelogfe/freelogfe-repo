import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FCustomPropertiesProps} from "@/components/FCustomProperties";
import {
  resourceVersionInfo,
  ResourceVersionInfoParamsType1,
  updateResourceVersionInfo,
  UpdateResourceVersionInfoParamsType
} from "@/services/resources";
import moment from 'moment';
import {ConnectState} from "@/models/connect";
import {pathToRegexp} from '@/utils/pathToRegexp';

export interface ResourceVersionEditorPageModelState {
  resourceID: string;
  version: string;
  signingDate: string;
  description: string;

  rawProperties: {
    key: string;
    value: string;
  }[];

  baseProperties: {
    key: string;
    value: string;
    description: string;
  }[];

  basePEditorVisible: boolean;
  basePKeyInput: string;
  basePValueInput: string;
  basePDescriptionInput: string;
  basePDescriptionInputError: string;

  properties: {
    key: string;

    description: string;
    descriptionIsEditing: boolean;
    descriptionInput: string;
    descriptionError: string;

    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionEditorPage/change';
  payload: Partial<ResourceVersionEditorPageModelState>;
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/fetchDataSource' | 'fetchDataSource';
}

export interface UpdateDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/updateDataSource';
  payload: Partial<UpdateResourceVersionInfoParamsType>;
}

export interface ChangeDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/changeDataSource' | 'changeDataSource';
  payload: Partial<ResourceVersionEditorPageModelState>;
}

export interface SyncAllPropertiesAction extends AnyAction {
  type: 'syncAllProperties' | 'resourceVersionEditorPage/syncAllProperties';
}

export interface ResourceVersionEditorModelType {
  namespace: 'resourceVersionEditorPage';
  state: ResourceVersionEditorPageModelState;
  effects: {
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    updateDataSource: (action: UpdateDataSourceAction, effects: EffectsCommandMap) => void;
    syncAllProperties: (action: SyncAllPropertiesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourceVersionEditorPageModelState, ChangeDataSourceAction>;
    change: DvaReducer<ResourceVersionEditorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionEditorModelType = {

  namespace: 'resourceVersionEditorPage',

  state: {
    resourceID: '',
    version: '',
    signingDate: '',
    description: '',

    rawProperties: [],
    baseProperties: [],

    basePEditorVisible: false,
    basePKeyInput: '',
    basePValueInput: '',
    basePDescriptionInput: '',
    basePDescriptionInputError: '',

    properties: [],
  },

  effects: {
    * fetchDataSource(action: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      // const params: ResourceVersionInfoParamsType1 = action.payload;
      const {resourceVersionEditorPage}: ConnectState = yield select(({resourceVersionEditorPage}: ConnectState) => ({
        resourceVersionEditorPage,
      }));
      const params: ResourceVersionInfoParamsType1 = {
        resourceId: resourceVersionEditorPage.resourceID,
        version: resourceVersionEditorPage.version,
      };
      const {data} = yield call(resourceVersionInfo, params);

      const base = data.customPropertyDescriptors.filter((i: any) => i.type === 'readonlyText');
      const opt = data.customPropertyDescriptors.filter((i: any) => i.type === 'editableText' || i.type === 'select');

      yield put<ChangeDataSourceAction>({
        type: 'changeDataSource',
        payload: {
          signingDate: moment(data.createDate).format('YYYY-MM-DD'),
          description: data.description,
          rawProperties: Object.entries(data.systemProperty).map((sp) => {
            return {
              key: sp[0],
              value: sp[1] as string,
            };
          }),
          baseProperties: base.map((b: any) => {
            return {
              key: b.key,
              value: b.defaultValue,
              description: b.remark
            };
          }),
          properties: opt.map((i: any) => ({
            key: i.key,
            value: i.defaultValue,

            description: i.remark,
            descriptionInput: i.remark,
            descriptionIsEditing: false,
            descriptionError: '',

            custom: i.type === 'select' ? 'select' : 'input',
            defaultValue: i.defaultValue,
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
    },
    * syncAllProperties({}: SyncAllPropertiesAction, {select, call}: EffectsCommandMap) {
      const {resourceVersionEditorPage}: ConnectState = yield select(({resourceVersionEditorPage}: ConnectState) => ({
        resourceVersionEditorPage,
      }));

      const customPropertyDescriptors: UpdateResourceVersionInfoParamsType['customPropertyDescriptors'] = [
        ...resourceVersionEditorPage.baseProperties.map((bp) => {
          return {
            key: bp.key,
            defaultValue: bp.value,
            type: 'readonlyText' as 'readonlyText',
            remark: bp.description,
          };
        }),
        ...resourceVersionEditorPage.properties.map((pp) => {
          const isInput: boolean = pp.custom === 'input';
          const options: string[] = pp.customOption.split(',');
          return {
            type: isInput ? 'editableText' : 'select' as 'editableText' | 'select',
            key: pp.key,
            remark: pp.description,
            defaultValue: isInput ? pp.defaultValue : options[0],
            candidateItems: isInput ? undefined : options,
          };
        }),
      ];
      const params: UpdateResourceVersionInfoParamsType = {
        version: resourceVersionEditorPage.version,
        resourceId: resourceVersionEditorPage.resourceID,
        customPropertyDescriptors: customPropertyDescriptors,
      };
      yield call(updateResourceVersionInfo, params);
    },
  },

  reducers: {
    changeDataSource(state: ResourceVersionEditorPageModelState, action: ChangeDataSourceAction): ResourceVersionEditorPageModelState {
      return {...state, ...action.payload};
    },
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {

      // history.listen((listener) => {
      //   const regexp = pathToRegexp('/resource/:id/version/:version');
      //   const result = regexp.exec(listener.pathname);
      //   if (result) {
      //     if (result[2] === 'creator') {
      //       return;
      //     }
      //     dispatch<FetchDataSourceAction>({
      //       type: 'fetchDataSource',
      //       payload: {
      //         resourceId: result[1],
      //         version: result[2],
      //       }
      //     });
      //   }
      // });

    },
  },

};

export default Model;
