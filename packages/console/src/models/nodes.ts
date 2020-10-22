import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {create, CreateParamsType, nodeDetail, NodeDetailParamsType2, nodes, NodesParamsType} from "@/services/nodes";
import {ConnectState} from "@/models/connect";
import {router} from "umi";

export interface NodesModelState {
  nodeList: {
    nodeDomain: string;
    nodeId: number;
    nodeName: string;
  }[];

  nodeName: string;
  nameError: string;

  nodeDomain: string;
  domainError: string;
}

export interface ChangeAction extends AnyAction {
  type: 'nodes/change' | 'change';
  payload: Partial<NodesModelState>;
}

interface FetchNodesAction extends AnyAction {
  type: 'fetchNodes';
}

export interface CreateNodeAction extends AnyAction {
  type: 'nodes/createNode';
}

export interface NodesModelType {
  namespace: 'nodes';
  state: NodesModelState;
  effects: {
    fetchNodes: (action: FetchNodesAction, effects: EffectsCommandMap) => void;
    createNode: (action: CreateNodeAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodesModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: NodesModelType = {
  namespace: 'nodes',
  state: {
    nodeList: [],

    nodeName: '',
    nameError: '',

    nodeDomain: '',
    domainError: '',
  },
  effects: {
    * fetchNodes({}: FetchNodesAction, {call, put}: EffectsCommandMap) {
      const params: NodesParamsType = {};
      const {data} = yield call(nodes, params);
      // console.log(data, '#SDFASDC');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeList: data.dataList.map((n: any) => ({
            nodeDomain: n.nodeDomain,
            nodeId: n.nodeId,
            nodeName: n.nodeName,
          })),
        }
      })
    },
    * createNode({}: CreateNodeAction, {call, select, put}: EffectsCommandMap) {
      const {nodes}: ConnectState = yield select(({nodes}: ConnectState) => ({
        nodes,
      }));

      let nameError: string = '';
      let domainError: string = '';

      if (!/^(?!-)[a-z0-9-]{4,24}(?<!-)$/.test(nodes.nodeDomain)) {
        domainError = '只能包括小写字母、数字和短横线（-）。\n' +
          '必须以小写字母或者数字开头和结尾。\n' +
          '长度必须在 4-24 字符之间。';
      }

      if (!domainError) {
        const params1: NodeDetailParamsType2 = {
          nodeDomain: nodes.nodeDomain,
        };
        const {data: data1} = yield call(nodeDetail, params1);
        if (data1) {
          domainError = '该节点地址已经存在或已经被其它用户使用';
        }
      }

      if (!/^[\u4E00-\u9FA5|a-zA-Z0-9]{4,20}$/.test(nodes.nodeName)) {
        nameError = '长度必须在 1-100 字符之间。\n' +
          '不能以正斜线（/）或者反斜线（\\）开头。\n' +
          '开头和结尾的空格会自动删除。';
      }

      if (!nameError) {
        const params2: NodeDetailParamsType2 = {
          nodeName: nodes.nodeName,
        };
        const {data: data2} = yield call(nodeDetail, params2);
        if (data2) {
          nameError = '该节点名称已经存在或已经被其它用户使用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          domainError,
          nameError,
        }
      });

      if (domainError || nameError) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          domainError,
          nameError,
        }
      });

      if (domainError || nameError) {
        return;
      }

      const params: CreateParamsType = {
        nodeDomain: nodes.nodeDomain,
        nodeName: nodes.nodeName,
      };

      const {data} = yield call(create, params);
      // console.log(data, 'datadata');
      router.push('/node/' + data.nodeId);
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
    setup({dispatch}: SubscriptionAPI) {
      dispatch<FetchNodesAction>({
        type: 'fetchNodes',
      });
    }
  }
};

export default Model;
