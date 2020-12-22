import * as React from 'react';
import {
  ChangeStatesAction, FetchDataSourceAction, ResourceListPageModelState
} from "@/models/resourceListPage";
import {router} from "umi";
import FResourceCardsList from "@/pages/resource/components/FResourceCardsList";
import {connect, Dispatch} from "dva";
import {ConnectState} from "@/models/connect";
import FNoDataTip from "@/components/FNoDataTip";

interface ResourceProps {
  dispatch: Dispatch;
  resource: ResourceListPageModelState;
}

function Resources({dispatch, resource}: ResourceProps) {

  const [contentMinHeight, setContentMinHeight] = React.useState<number>(window.innerHeight - 220);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setContentMinHeight(window.innerHeight - 140);
  }

  if (resource.dataSource.length === 0 && resource.inputText === '' && resource.resourceType === '-1' && resource.resourceStatus === '2') {
    return (<FNoDataTip
      height={contentMinHeight}
      tipText={'未创建任何资源'}
      btnText={'创建资源'}
      onClick={() => router.push('/resource/creator')}
    />);
  }

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
    totalNum={resource.totalNum}
    onChangeResourceType={(value) => {
      if (value === resource.resourceType) {
        return;
      }
      changeStatus({resourceType: value});
    }}
    onChangeResourceStatus={(value) => {
      if (value === resource.resourceStatus) {
        return;
      }
      changeStatus({resourceStatus: value});
    }}
    onChangeInputText={(value) => {
      if (value === resource.inputText) {
        return;
      }
      changeStatus({inputText: value});
    }}
    showGotoCreateBtn={true}
    onClickDetails={(id) => router.push(`/resource/${id}`)}
    onClickEditing={(id) => router.push(`/resource/${id}/info`)}
    onClickRevision={(id, record) => router.push(`/resource/${id}/version/creator`)}
    onClickMore={(id) => router.push(`/resource/${id}`)}
    onloadMore={() => {
      dispatch<FetchDataSourceAction>({
        type: 'resourceListPage/fetchDataSource',
        payload: false,
      });
    }}
  />)
}

export default connect(({resourceListPage}: ConnectState) => ({
  resource: resourceListPage,
}))(Resources);
