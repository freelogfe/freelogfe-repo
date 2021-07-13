import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from "@/components/FText";
import {connect, Dispatch} from "dva";
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {Space} from "antd";
import {FRectBtn} from "@/components/FButton";
import {UpdateRelationAction} from "@/models/exhibitInfoPage";

interface PolicyProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Policy({dispatch, exhibitInfoPage}: PolicyProps) {

  const selectedResource = exhibitInfoPage.associated.find((a) => a.id === exhibitInfoPage.selectedAssociatedID);

  if (!selectedResource?.policies || selectedResource?.policies.length === 0) {
    return null;
  }

  return (<Space style={{width: '100%'}} size={15} direction="vertical">
    <FTitleText type="h4">未签约策略</FTitleText>
    {
      selectedResource?.policies.map((p) => (<div
        className={styles.singPolicy}
        key={p.id}
      >
        <div className={styles.singPolicyHeader}>
          <FContentText type="highlight">{p.name}</FContentText>

          <FRectBtn
            style={{height: 26, padding: '0 15px'}}
            size="small"
            onClick={() => dispatch<UpdateRelationAction>({
              type: 'exhibitInfoPage/updateRelation',
              payload: {
                resourceId: selectedResource.id,
                policyId: p.id,
              },
            })}
          >签约</FRectBtn>
        </div>
        <div style={{height: 15}}/>
        <pre>{p.text}</pre>
      </div>))
    }
  </Space>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Policy);