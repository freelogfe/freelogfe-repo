import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from 'antd';
import {FContentText} from '@/components/FText';
import {UpdateAuthorizedAction} from '@/models/resourceAuthPage';
import {connect, DispatchProp} from 'dva';


interface ContractsProps extends DispatchProp {
  dataSource: {
    checked: boolean;
    title: string;
    status: string;
    code: string;
    id: string;
    policyId: string;
    date: string;
    versions: { version: string; checked: boolean; disabled: boolean; }[];
  }[];
}

function Contracts({dataSource, dispatch}: ContractsProps) {

  function onLicenseChange(version: string, policyId: string, checked: boolean) {
    // console.log(version, policyId, checked, '#@WDSfaDSAFD0[IJOA');
    dispatch<UpdateAuthorizedAction>({
      type: 'resourceAuthPage/updateAuthorized',
      payload: [{
        version: version,
        policyId: policyId,
        operation: checked ? 1 : 0,
      }],
    });
  }

  return <div className={styles.styles}>
    {dataSource.map((k) => (<div key={k.id} className={styles.Policy}>
      <div className={styles.PolicyGrammar}>
        <div className={styles.PolicyGrammarName}>
          <span>{k.title}</span>
          <label className={styles.executing}>执行中</label>
        </div>
        <div style={{height: 15}}/>
        <pre className={styles.highlight}>{k.code}</pre>
      </div>
      <div className={styles.PolicyInfo}>
        <Space size={40}>
          <FContentText type="additional2" text={'合约ID：' + k.id}/>
          <FContentText type="additional2" text={'签约时间：' + k.date}/>
        </Space>
        <div style={{height: 9}}/>
        <div className={styles.versionControl}>
          <FContentText type="additional2">应用版本：</FContentText>
          <div className={styles.allVersions}>
            {k.versions.map((i) => <Space size={8} key={i.version}>
              <Checkbox
                checked={i.checked}
                disabled={i.disabled}
                onChange={(e) => onLicenseChange(i.version, k.policyId, e.target.checked)}
              />
              <span>{i.version}</span>
            </Space>)}
          </div>
        </div>
      </div>
    </div>))}
  </div>
}

export default connect()(Contracts);
