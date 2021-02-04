import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {list, ListParamsType} from "@/services/resources";
import {formatDateTime} from "@/utils/format";
import {collectionResources, CollectionResourcesParamsType} from "@/services/collections";
import {objectList, ObjectListParamsType} from "@/services/storages";
import {
  // FetchAddExhibitListAction,
  // FetchCollectionAction,
  // FetchMarketAction,
  // FetchMyResourcesAction, FetchObjectAction
} from "@/models/addInformExhibitDrawer";

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}

export type ReplaceInformExhibitState = WholeReadonly<{
  replacerOriginOptions: { value: string; title: string }[];
  replacerOrigin: '!market' | '!resource' | '!collection' | string;
  replacerKeywords: string;
  replacerResourceList: {
    id: string;
    name: string;
    identity: 'resource' | 'object';
    type: string;
    updateTime: string;
    status: 'online' | 'offline' | 'unreleased' | '';
    versions: string[];
    version: string;
  }[];
  checkedResourceName: string;

  replacedKeywords: string;
  replacedVersions: string[];
  replacedVersion: string;
  treeData: TreeNode[];
}>;

export interface ChangeAction extends AnyAction {
  type: 'replaceInformExhibit/change' | 'change';
  payload: Partial<ReplaceInformExhibitState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

// export interface FetchInfoAction extends AnyAction {
//   type: 'fetchInfo';
// }

export interface FetchReplacerListAction extends AnyAction {
  type: 'replaceInformExhibit/fetchReplacerList'
  payload?: boolean; // 是否 restart
}

export interface FetchMarketAction extends AnyAction {
  type: 'fetchMarket';
  payload?: boolean; // 是否 restart
}

export interface FetchMyResourcesAction extends AnyAction {
  type: 'fetchMyResources';
  payload?: boolean; // 是否 restart
}

export interface FetchCollectionAction extends AnyAction {
  type: 'fetchCollection';
  payload?: boolean; // 是否 restart
}

export interface FetchObjectAction extends AnyAction {
  type: 'fetchObject';
  payload?: boolean; // 是否 restart
}

interface ReplaceInformExhibitModelType {
  namespace: 'replaceInformExhibit';
  state: ReplaceInformExhibitState;
  effects: {
    // fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    fetchReplacerList: (action: FetchReplacerListAction, effects: EffectsCommandMap) => void;
    fetchMarket: (action: FetchMarketAction, effects: EffectsCommandMap) => void;
    fetchMyResources: (action: FetchMyResourcesAction, effects: EffectsCommandMap) => void;
    fetchCollection: (action: FetchCollectionAction, effects: EffectsCommandMap) => void;
    fetchObject: (action: FetchObjectAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ReplaceInformExhibitState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ReplaceInformExhibitState = {
  replacerOriginOptions: [
    {value: '!market', title: '资源市场'},
    {value: '!resource', title: '我的资源'},
    {value: '!collection', title: '我的收藏'},
  ],
  replacerOrigin: '!market',
  replacerKeywords: '',
  replacerResourceList: [{
    id: '1234',
    name: '2341234',
    identity: 'resource',
    type: 'image',
    updateTime: '2002-01-01',
    status: '',
    versions: ['1.1.1'],
    version: '1.1.1',
  }],
  checkedResourceName: '2341234',

  replacedKeywords: '',
  replacedVersions: ['1.1.1'],
  replacedVersion: '1.1.1',
  treeData: []
};

const Model: ReplaceInformExhibitModelType = {
  namespace: 'replaceInformExhibit',
  state: initStates,
  effects: {
    * fetchReplacerList({}: FetchReplacerListAction, {select, call, put}: EffectsCommandMap) {
      // console.log('!!!!!!------');
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      if (replaceInformExhibit.replacerOrigin === '!market') {
        yield put<FetchMarketAction>({
          type: 'fetchMarket',
        });
      } else if (replaceInformExhibit.replacerOrigin === '!resource') {
        yield put<FetchMyResourcesAction>({
          type: 'fetchMyResources',
        });
      } else if (replaceInformExhibit.replacerOrigin === '!collection') {
        yield put<FetchCollectionAction>({
          type: 'fetchCollection',
        });
      } else {
        yield put<FetchObjectAction>({
          type: 'fetchObject',
        });
      }
    },
    * fetchMarket({payload}: FetchMarketAction, {call, select, put}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));
      const params: ListParamsType = {
        skip: 0,
        limit: 10,
        keywords: replaceInformExhibit.replacerKeywords,
      };
      const {data} = yield call(list, params);
      // console.log(data, 'data134@@@#@#@##@@@@@53');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
            // console.log(rs, '######2341234');
            return {
              id: rs.resourceId,
              // disabled: addInformExhibitDrawer.disabledResourceNames.includes(rs.resourceName),
              // checked: false,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              updateTime: formatDateTime(rs.updateDate),
              status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: rs.resourceVersions.map((rv: any) => {
                return rv.version;
              }),
              version: rs.latestVersion,
            };
          }),
        },
      });
    },
    * fetchMyResources({payload}: FetchMyResourcesAction, {call, put, select}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));
      const params: ListParamsType = {
        // resourceType:''
        skip: 0,
        limit: 10,
        isSelf: 1,
        // resourceType: replaceInformExhibit.isTheme ? 'theme' : undefined,
        keywords: replaceInformExhibit.replacerKeywords,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(list, params);
      // console.log(data, 'data13453');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
            return {
              id: rs.resourceId,
              // disabled: addInformExhibitDrawer.disabledResourceNames.includes(rs.resourceName),
              // checked: false,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              updateTime: formatDateTime(rs.updateDate),
              status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: ['1.1.1'],
              version: '1.1.1',
            };
          }),
        },
      });
    },
    * fetchCollection({}: FetchCollectionAction, {select, call, put}: EffectsCommandMap) {

      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const params: CollectionResourcesParamsType = {
        skip: 0,
        limit: 10,
        keywords: replaceInformExhibit.replacerKeywords,
      };

      const {data} = yield call(collectionResources, params);
      // console.log(data, '@@@@@@ASEDFSADF');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
            return {
              id: rs.resourceId,
              // disabled: addInformExhibitDrawer.disabledResourceNames.includes(rs.resourceName),
              // checked: false,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              updateTime: formatDateTime(rs.updateDate),
              status: rs.resourceStatus === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: ['1.1.1'],
              version: '1.1.1',
            };
          }),
        },
      });
    },
    * fetchObject({}: FetchObjectAction, {put, select, call}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const params: ObjectListParamsType = {
        skip: 0,
        limit: 10,
        bucketName: replaceInformExhibit.replacerOrigin,
        keywords: replaceInformExhibit.replacerKeywords,
      };

      const {data} = yield call(objectList, params);
      console.log(data, 'data1q2349ojmdfsl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((ob) => {
            const objectName: string = ob.bucketName + '/' + ob.objectName;
            // console.log(objectName, replaceInformExhibit.disabledObjectNames, '#####');
            return {
              id: ob.objectId,
              // disabled: addInformExhibitDrawer.disabledObjectNames.includes(objectName),
              // checked: false,
              identity: 'object',
              name: objectName,
              type: ob.resourceType,
              updateTime: formatDateTime(ob.updateDate),
              status: '',
              versions: ['1.1.1'],
              version: '1.1.1',
            };
          }),
        },
      });

    },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
    setup({}) {

    }
  }
};

export default Model;