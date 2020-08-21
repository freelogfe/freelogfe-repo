import * as React from 'react';
import styles from './index.less';
import PolicyCard from './PolicyCard';
import {Dispatch, connect} from "dva";
import {UpdateAuthorizedAction} from "@/models/resourceAuthPage";
import {FAuthPanelProps} from "@/pages/resource/containers/FAuthPanel";

interface PoliciesProps {
  dispatch: Dispatch;
  dataSource: FAuthPanelProps['dataSource'][number]['policies'];
  // onLicense?: (id: string, record: PoliciesProps['dataSource'][0]) => void;
}

function Policies({dataSource, dispatch}: PoliciesProps) {
  function onLicense(versions: string[], policyId: string) {
    dispatch<UpdateAuthorizedAction>({
      type: 'resourceAuthPage/updateAuthorized',
      payload: versions.map((v: string) => ({
        version: v,
        policyId: policyId,
        operation: 1,
      })),
    });
  }

  return (<div className={styles.styles}>
    {dataSource.map((i) => (
      <PolicyCard
        key={i.id}
        title={i.title}
        code={i.code}
        allVersions={i.allEnabledVersions}
        onClickLicense={(versions: string[]) => onLicense(versions, i.id)}
      />
    ))}
  </div>)
}

export default connect()(Policies);
