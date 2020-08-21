import * as React from 'react';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceCollectPageModelState} from '@/models/connect';
import {router} from 'umi';
import {} from "@/models/resourceCollectPage";
import FResourceCardsList from "@/pages/resource/components/FResourceCardsList";
import {ChangeStatesAction} from "@/models/resourceCollectPage";

const navs = [
  {
    value: '1',
    text: '我的资源',
  },
  {
    value: '2',
    text: '我的收藏',
  },
];

interface ResourceCollectProps {
  dispatch: Dispatch;
  resource: ResourceCollectPageModelState;
}

function ResourceCollect({dispatch, resource}: ResourceCollectProps) {
  function changeStatus(payload: ChangeStatesAction['payload']) {
    dispatch<ChangeStatesAction>({
      type: 'resourceCollectPage/changeStates',
      payload,
    })
  }

  return (<FResourceCardsList
    resourceType={resource.resourceType}
    resourceStatus={resource.resourceStatus}
    inputText={resource.inputText}
    dataSource={resource.dataSource}
    pageCurrent={resource.pageCurrent}
    pageSize={resource.pageSize}
    totalNum={resource.totalNum}
    onChangeResourceType={(value) => changeStatus({resourceType: value})}
    onChangeResourceStatus={(value) => changeStatus({resourceStatus: value})}
    onChangeInputText={(value) => changeStatus({inputText: value})}
    onChangePageCurrent={(value) => changeStatus({pageCurrent: value})}
    onChangePageSize={(value) => changeStatus({pageSize: value})}
    isCollect={true}
    onBoomJuice={() => null}
    onClickMore={() => null}
  />);
}

export default connect(({resourceCollectPage}: ConnectState) => ({
  resource: resourceCollectPage,
}))(ResourceCollect);
