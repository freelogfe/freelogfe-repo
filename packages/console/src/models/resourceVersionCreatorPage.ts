import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FSelectObject} from '@/pages/resource/components/FSelectObject';
import {FCustomPropertiesProps} from '@/pages/resource/components/FCustomProperties';
import {
  batchInfo,
  BatchInfoParamsType,
  createVersion,
  CreateVersionParamsType, cycleDependencyCheck,
  info,
  InfoParamsType,
  lookDraft,
  LookDraftParamsType, resolveResources,
  ResolveResourcesParamsType,
  resourceVersionInfo,
  saveVersionsDraft,
  SaveVersionsDraftParamsType
} from '@/services/resources';
import {ConnectState, MarketPageModelState} from '@/models/connect';
import {router} from 'umi';
import BraftEditor, {EditorState} from 'braft-editor';
import fMessage from '@/components/fMessage';
import {FetchDataSourceAction} from '@/models/resourceInfo';
import * as semver from 'semver';
import {contracts, ContractsParamsType} from "@/services/contracts";
import moment from "moment";

export type DepResources = Readonly<{
  id: string;
  title: string;
  resourceType: string;
  status: 0 | 1 | 2;
  version: Readonly<{
    isCustom: boolean;
    select: string;
    allowUpdate: boolean;
    input: string;
  }>;
  versions: string[];
  upthrow: boolean;
  upthrowDisabled: boolean;
  enableReuseContracts: Readonly<{
    checked: boolean;
    id: string;
    policyId: string;
    title: string;
    status: 'executing' | 'stopped';
    code: string;
    date: string;
    versions: string[];
  }>[];
  enabledPolicies: Readonly<{
    checked: boolean;
    id: string;
    title: string;
    code: string;
    status: 0 | 1;
  }>[];
}>[];

export type Relationship = Readonly<{
  id: string;
  children: Readonly<{
    id: string;
  }>[];
}>[];

export interface ResourceVersionCreatorPageModelState {
  version: string;
  versionErrorText: string;
  resourceObject: FSelectObject['resourceObject'];
  resourceObjectErrorText: string;

  depRelationship: Relationship;
  dependencies: DepResources;
  depActivatedID: string;

  properties: FCustomPropertiesProps['dataSource'];
  description: EditorState;

  draftData: any;
}

export interface OnChangeDependenciesByIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeDependenciesByID';
  payload: Partial<ResourceVersionCreatorPageModelState['dependencies'][number]>;
  id: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface DeleteDependencyByIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/deleteDependencyByID';
  payload: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface OnChangeDepActivatedIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeDepActivatedID';
  payload: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface CreateVersionAction extends AnyAction {
  type: 'resourceVersionCreatorPage/createVersion';
}

export interface FetchDraftAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchDraft';
  payload: string;
}

export interface SaveDraftAction extends AnyAction {
  type: 'resourceVersionCreatorPage/saveDraft';
}

export interface ImportPreVersionAction extends AnyAction {
  type: 'resourceVersionCreatorPage/importPreVersion';
}

export interface AddADepByIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/addADepByIDAction';
  payload: string[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionCreatorPage/change',
  payload: Partial<ResourceVersionCreatorPageModelState>;
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    importPreVersion: (action: ImportPreVersionAction, effects: EffectsCommandMap) => void;
    createVersion: (action: CreateVersionAction, effects: EffectsCommandMap) => void;
    fetchDraft: (action: FetchDraftAction, effects: EffectsCommandMap) => void;
    saveDraft: (action: SaveDraftAction, effects: EffectsCommandMap) => void;
    addADepByIDAction: (action: AddADepByIDAction, effects: EffectsCommandMap) => void;
    // dddDependenciesForDepRelation: (action: AddDependenciesForDepRelationAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketPageModelState, ChangeAction>;
    deleteDependencyByID: DvaReducer<ResourceVersionCreatorPageModelState, DeleteDependencyByIDAction>;
    onChangeDependenciesByID: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDependenciesByIDAction>;
    onChangeDepActivatedID: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDepActivatedIDAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionCreatorPageModelState = {
  version: '',
  versionErrorText: '',
  resourceObject: null,
  resourceObjectErrorText: '',

  depRelationship: [],
  dependencies: [],
  depActivatedID: '',
  properties: [],
  description: BraftEditor.createEditorState(''),
  draftData: null,
};

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: initStates,

  effects: {
    * createVersion(action: CreateVersionAction, {call, select, put}: EffectsCommandMap) {

      const {resourceVersionCreatorPage, resourceInfo}: ConnectState = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => {
        return {
          resourceVersionCreatorPage,
          resourceInfo,
        };
      });
      const baseUpcastResourceIds = resourceVersionCreatorPage.dependencies
        .filter((dep) => dep.upthrow)
        .map((dep) => dep.id);
      const resolveResources = resourceVersionCreatorPage.dependencies
        .filter((dep) => !baseUpcastResourceIds.includes(dep.id))
        .map((dep) => ({
          resourceId: dep.id,
          contracts: [
            ...dep.enabledPolicies
              .filter((p) => (p.checked))
              .map((p) => ({policyId: p.id})),
            ...dep.enableReuseContracts
              .filter((c) => (c.checked))
              .map((c) => ({policyId: c.policyId})),
          ],
        }));
      const params: CreateVersionParamsType = {
        resourceId: resourceInfo.info?.resourceId || '',
        // latestVersion: resourceInfo.info?.latestVersion || '',
        version: resourceVersionCreatorPage.version,
        fileSha1: resourceVersionCreatorPage.resourceObject?.id || '',
        filename: resourceVersionCreatorPage.resourceObject?.name || '',
        baseUpcastResources: baseUpcastResourceIds.map((baseUpId) => ({resourceId: baseUpId})),
        dependencies: resourceVersionCreatorPage.dependencies.map((dep) => {
          const version = dep.version;
          return {
            resourceId: dep.id,
            versionRange: version.isCustom ? version.input : (version.allowUpdate ? '^' : '') + version.select,
          }
        }),
        resolveResources: resolveResources,
        customPropertyDescriptors: resourceVersionCreatorPage.properties.map((i) => ({
          key: i.key,
          defaultValue: i.value,
          type: !i.allowCustom ? 'readonlyText' : i.custom === 'input' ? 'editableText' : 'select',
          candidateItems: i.customOption ? i.customOption.split(',') : [],
          remark: i.description,
        })),
        description: resourceVersionCreatorPage.description.toHTML(),
      };

      // for (const resolve of params.resolveResources) {
      //
      // }

      for (const custom of (params.customPropertyDescriptors || [])) {
        if (!custom.key || !custom.defaultValue) {
          return fMessage('请检查自定义属性');
        }
      }

      const {versionErrorText, resourceObjectErrorText} = verify(params);

      if (versionErrorText || resourceObjectErrorText) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            versionErrorText,
            resourceObjectErrorText,
          },
        });
      }

      const {data} = yield call(createVersion, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draftData: null,
        },
      });
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: params.resourceId,
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
      router.replace(`/resource/${data.resourceId}/version/${data.version}/success`)
    },
    * fetchDraft(action: FetchDraftAction, {call, put}: EffectsCommandMap) {
      const params: LookDraftParamsType = {
        resourceId: action.payload,
      };
      const {data} = yield call(lookDraft, params);
      if (!data) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            draftData: null,
            version: '',
            resourceObject: null,
            depRelationship: [],
            dependencies: [],
            depActivatedID: '',
            properties: [],
            description: BraftEditor.createEditorState(''),
          }
        });
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...data.draftData,
          description: BraftEditor.createEditorState(data.draftData.description),
          draftData: data.draftData,
        }
      });
    },
    * saveDraft(action: SaveDraftAction, {call, select, put}: EffectsCommandMap) {
      const params: SaveVersionsDraftParamsType = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
        resourceId: resourceInfo.info?.resourceId,
        draftData: {
          ...resourceVersionCreatorPage,
          description: resourceVersionCreatorPage.description.toHTML(),
        },
      }));
      yield call(saveVersionsDraft, params);
      fMessage('暂存草稿成功');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draftData: params.draftData,
        },
      });
    },
    * importPreVersion({}: ImportPreVersionAction, {select, call, put}: EffectsCommandMap) {
      const {resourceId, latestVersion} = yield select(({resourceInfo}: ConnectState) => ({
        resourceId: resourceInfo.info?.resourceId,
        latestVersion: resourceInfo.info?.latestVersion,
      }));
      const {data} = yield call(resourceVersionInfo, {
        version: latestVersion,
        resourceId: resourceId,
      });
      // console.log(data.customPropertyDescriptors, 'datadatadata1423234');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          properties: data.customPropertyDescriptors.map((i: any) => ({
            key: i.key,
            value: i.defaultValue,
            description: i.remark,
            allowCustom: i.type !== 'readonlyText',
            // custom: 'input' | 'select';
            // i.custom === 'input' ? 'editableText' : 'select'
            custom: i.type === 'editableText' ? 'input' : 'select',
            customOption: i.candidateItems.join(','),
          })),
        },
      })
    },
    * addADepByIDAction({payload}: AddADepByIDAction, {put, call, select}: EffectsCommandMap) {
      // console.log(payload, 'PPPPLLLLLL');
      const [id, ...ids] = payload;
      const relationship = {
        id: id,
        children: ids.map((i: string) => ({id: i})),
      };
      // console.log(relationship, 'relationship');
      const {resourceDepRelationship, resourceInfo, dependencies, allExistsIds} = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
        resourceDepRelationship: resourceVersionCreatorPage.depRelationship,
        resourceInfo: resourceInfo.info,
        dependencies: resourceVersionCreatorPage.dependencies,
        allExistsIds: resourceVersionCreatorPage.dependencies.map((r: any) => r.resourceId),
      }));
      const handleDepResourcePrams: HandleDepResourceParams = {
        resourceInfo: resourceInfo,
        allBaseUpthrowIds: resourceInfo.baseUpcastResources?.map((up: any) => up.resourceId),
        allNeedHandledIds: payload,
        allExistsIds: allExistsIds,
      };
      // console.log(handleDepResourcePrams, 'handleDepResourcePrams34dspoi;j');
      const allDeps = yield call(handleDepResource, handleDepResourcePrams);
      // console.log(allDeps, '开始change');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship: [
            relationship,
            ...resourceDepRelationship,
          ],
          dependencies: [
            ...dependencies,
            ...allDeps,
          ],
        }
      });
    },
  },

  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    onChangeDependenciesByID(state: ResourceVersionCreatorPageModelState, action: OnChangeDependenciesByIDAction): ResourceVersionCreatorPageModelState {
      const resources = state.dependencies;
      const dependencies = resources.map((i) => {
        if (i.id !== action.id) {
          return i;
        }
        return {
          ...i,
          ...action.payload,
        };
      });

      return {
        ...state,
        dependencies,
      };
    },
    deleteDependencyByID(state: ResourceVersionCreatorPageModelState, action: DeleteDependencyByIDAction): ResourceVersionCreatorPageModelState {
      const depRelationship = state.depRelationship.filter((i) => i.id !== action.payload);
      const usedResourceID: string[] = [];
      for (const i of depRelationship) {
        usedResourceID.push(i.id);
        for (const j of i.children) {
          usedResourceID.push(j.id);
        }
      }
      const dependencies = state.dependencies.filter((i) => usedResourceID.includes(i.id));
      return {
        ...state,
        depRelationship,
        dependencies,
      };
    },
    onChangeDepActivatedID(state: ResourceVersionCreatorPageModelState, action: OnChangeDepActivatedIDAction): ResourceVersionCreatorPageModelState {
      return {
        ...state,
        depActivatedID: action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // dispatch({
      //   type: 'init',
      // });
    },
  },

};

export default Model;

function verify(data: any) {
  const {version, latestVersion, fileSha1} = data;
  let versionErrorText = '';
  let resourceObjectErrorText = '';

  if (!version) {
    versionErrorText = '请输入版本号';
  } else if (!semver.valid(version)) {
    versionErrorText = '版本号不合法';
  } else if (!semver.gt(version, latestVersion || '0.0.0')) {
    versionErrorText = latestVersion ? `必须大于最新版本 ${latestVersion}` : '必须大于 0.0.0';
  }

  if (!fileSha1) {
    resourceObjectErrorText = '请选择对象或上传文件';
  }

  return {versionErrorText, resourceObjectErrorText};
}

interface HandleDepResourceParams {
  resourceInfo: any;
  allBaseUpthrowIds: string[];
  allNeedHandledIds: string[];
  allExistsIds: string[];
}

async function handleDepResource({allNeedHandledIds, resourceInfo, allBaseUpthrowIds, allExistsIds}: HandleDepResourceParams) {
  const arr: any[] = [];

  for (const [i, id] of Object.entries(allNeedHandledIds)) {
    if (allExistsIds.includes(id)) {
      continue;
    }
    let dep = await dddDependency(id, resourceInfo, allBaseUpthrowIds);

    if (dep.status === 1) {
      const {data} = await cycleDependencyCheck({
        resourceId: resourceInfo.resourceId,
        dependencies: [{
          resourceId: id,
          versionRange: '',
        }],
      });
      // console.log(data, 'data');
      if (!data) {
        dep = {
          ...dep,
          status: 2,
        };
      }
    }

    arr.push(dep);
  }

  return arr;
}

async function dddDependency(resourceId: string, resourceInfo: any, allBaseUpthrowIds: string[]) {

  const resourcesParams: InfoParamsType = {
    resourceIdOrName: resourceId,
    isLoadPolicyInfo: 1,
  };
  const {data: resourceData} = await info(resourcesParams);

  const contractsParams: ContractsParamsType = {
    identityType: 2,
    licensorId: resourceId,
    licenseeId: resourceInfo.resourceId,
    isLoadPolicyInfo: 1,
  };
  const {data: {dataList: contractsData}} = await contracts(contractsParams);
  // console.log(contractsData, 'contractsData24fsdzvrg');
  const allContractPolicyIds = contractsData.map((constract: any) => constract.policyId);
  // console.log(allContractPolicyIds, 'allContractPolicyIds23tg98piore');
  const resolveResourcesParams: ResolveResourcesParamsType = {
    resourceId: resourceInfo.resourceId,
  };
  const {data: resolveResourcesData} = await resolveResources(resolveResourcesParams);
  // console.log(resolveResourcesData, 'resolveResourcesDatae4w98wu3h');
  const dependency: DepResources[number] = {
    id: resourceData.resourceId,
    title: resourceData.resourceName,
    resourceType: resourceData.resourceType,
    status: resourceData.status,
    version: {
      isCustom: false,
      select: resourceData.latestVersion,
      allowUpdate: true,
      input: '',
    },
    versions: resourceData.resourceVersions.map((version: any) => version.version),
    upthrow: allBaseUpthrowIds.includes(resourceData.resourceId),
    upthrowDisabled: !!resourceInfo.latestVersion,
    enableReuseContracts: contractsData.map((c: any) => ({
      checked: true,
      id: c.contractId,
      policyId: c.policyId,
      title: c.contractName,
      status: c.isAuth ? 'executing' : 'stopped',
      code: c.policyInfo.policyText,
      date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
      versions: resolveResourcesData
        .find((rr: any) => rr.resourceId === resourceData.resourceId)
        .versions
        .filter((rr: any) => {
          const allContractIds = rr.contracts.map((cs: any) => cs.contractId)
          return allContractIds.includes(c.contractId);
        })
        .map((rr: any) => rr.version),
    })),
    enabledPolicies: resourceData.policies
      .filter((policy: any) => !allContractPolicyIds.includes(policy.policyId))
      .map((policy: any) => {
        // console.log(policy, 'PPPPafwe98iokl');
        return {
          checked: false,
          id: policy.policyId,
          title: policy.policyName,
          code: policy.policyText,
          status: policy.status,
        };
      }),
  };

  return dependency;
}
