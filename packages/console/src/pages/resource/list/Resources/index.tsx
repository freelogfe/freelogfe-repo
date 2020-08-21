import * as React from 'react';
import {
  ChangeStatesAction, ResourceListPageModelState
} from "@/models/resourceListPage";
import {router} from "umi";
import FResourceCardsList from "@/pages/resource/components/FResourceCardsList";
import {connect, Dispatch} from "dva";
import {ConnectState} from "@/models/connect";

interface ResourceProps {
  dispatch: Dispatch;
  resource: ResourceListPageModelState;
}

function Resources({dispatch, resource}: ResourceProps) {
  function changeStatus(payload: ChangeStatesAction['payload']) {
    dispatch<ChangeStatesAction>({
      type: 'resourceListPage/changeStates',
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
    showGotoCreateBtn={true}
    onClickDetails={() => null}
    onClickEditing={(id) => router.push(`/resource/${id}/info`)}
    onClickRevision={(id, record) => router.push(`/resource/${id}/version/creator`)}
  />)
}

export default connect(({resourceListPage}: ConnectState) => ({
  resource: resourceListPage,
}))(Resources);
