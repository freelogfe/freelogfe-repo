import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceAuthPageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/resourceAuthPage";

interface ResourcesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Resources({resourceAuthPage, dispatch}: ResourcesProps) {
  function onChangeActivated(id: number | string) {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        contractsAuthorized: resourceAuthPage.contractsAuthorized.map((i) => ({
          ...i,
          activated: i.id === id,
        })),
      },
    });
  }

  const dataSource = resourceAuthPage.contractsAuthorized.map((i) => ({
    id: i.id,
    activated: i.activated,
    title: i.title,
    resourceType: i.resourceType,
    version: i.version,
    labels: i.contracts.map((j) => j.title)
  }));

  return <div className={styles.styles}>
    {dataSource.map((i) => (
      <div
        key={i.id}
        onClick={() => onChangeActivated(i.id)}
        className={styles.DepPanelNav + ' ' + (i.activated ? styles.DepPanelNavActive : '')}>
        <div>
          <FContentText text={i.title}/>
          <div style={{height: 9}}/>
          <FContentText type="additional2">
            <span>{i.resourceType}</span>
          </FContentText>
          <>
            <div style={{height: 9}}/>
            <div className={styles.DepPanelLabels}>
              {
                i.labels.map((j: string) => (<label
                  key={j}
                  className={styles.labelInfo}
                >{j}</label>))
              }
            </div>
          </>
        </div>
      </div>))}
  </div>
}


export default connect(({resourceAuthPage}: ConnectState) => {
  return ({
    resourceAuthPage: resourceAuthPage
  });
})(Resources);
