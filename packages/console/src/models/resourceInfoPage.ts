import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FetchDataSourceAction, ResourceInfoModelState} from "@/models/resourceInfo";
import {update} from "@/services/resources";

export interface ResourceInfoPageModelState {
  isEditing: boolean;
  editor: string;
}

export interface OnChangeIsEditingAction extends AnyAction {
  type: 'resourceInfoPage/onChangeIsEditing',
  payload: boolean;
}

export interface OnChangeEditorAction extends AnyAction {
  type: 'resourceInfoPage/onChangeEditor',
  payload: string;
}

export interface OnChangeInfoAction extends AnyAction {
  type: 'resourceInfoPage/onChangeInfo',
  payload: Partial<ResourceInfoModelState['info']>;
  id: string;
}

export interface ResourceInfoPageModelType {
  namespace: 'resourceInfoPage';
  state: ResourceInfoPageModelState;
  effects: {
    onChangeInfo: (action: OnChangeInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    onChangeIsEditing: DvaReducer<ResourceInfoPageModelState, OnChangeIsEditingAction>;
    onChangeEditor: DvaReducer<ResourceInfoPageModelState, OnChangeEditorAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceInfoPageModelType = {
  namespace: 'resourceInfoPage',

  state: {
    isEditing: false,
    editor: '',
  },

  effects: {
    * onChangeInfo(action: OnChangeInfoAction, {call, put}: EffectsCommandMap) {
      // yield put({type: 'save'});
      const params = {
        ...action.payload,
        resourceId: action.id,
      };
      yield call(update, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: action.id,
      });
    },
  },

  reducers: {
    onChangeIsEditing(state: ResourceInfoPageModelState, action: OnChangeIsEditingAction): ResourceInfoPageModelState {
      return {
        ...state,
        isEditing: action.payload
      };
    },
    onChangeEditor(state: ResourceInfoPageModelState, action: OnChangeEditorAction): ResourceInfoPageModelState {
      return {
        ...state,
        editor: action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
