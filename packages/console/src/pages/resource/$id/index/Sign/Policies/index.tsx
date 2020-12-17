import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/marketResourcePage";
import {FContentText} from '@/components/FText';

interface PoliciesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Policies({dispatch, marketResourcePage}: PoliciesProps) {

  const policies = marketResourcePage.signResources.find((r) => r.selected)?.policies;

  if (!policies || marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID)) {
    return null;
  }

  return (<div>
    {
      marketResourcePage.selectedNodeID === -1
        ? (<div className={styles.noNode}>
          请先选择签约的节点…
        </div>)
        : policies.map((p) => (<div
          className={styles.singPolicy}
          key={p.id}
        >
          <Space size={5}>
            <Checkbox
              checked={p.checked}
              disabled={p.status === 0}
              onChange={(e) => dispatch<ChangeAction>({
                type: 'marketResourcePage/change',
                payload: {
                  signResources: marketResourcePage.signResources.map((sr) => {
                    if (!sr.selected) {
                      return sr;
                    }
                    return {
                      ...sr,
                      policies: sr.policies.map((srp) => {
                        if (srp.id !== p.id) {
                          return srp;
                        }
                        return {
                          ...srp,
                          checked: e.target.checked,
                        }
                      })
                    }
                  })
                }
              })}
            />
            <Space size={10}>{p.name}{p.status === 0 && (<FContentText type="additional2">(已下线)</FContentText>)}</Space>
          </Space>
          <div style={{height: 15}}/>
          <pre>{p.text}</pre>
        </div>))
    }
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Policies);
