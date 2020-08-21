import * as React from 'react';
import styles from './index.less';
import {FNormalButton} from '@/components/FButton';
import {FDepPanelProps} from '@/pages/resource/containers/FDepPanel';
import {Checkbox} from 'antd';
import {
  DepResources,
  OnChangeDependenciesByIDAction,
  ResourceVersionCreatorPageModelState
} from '@/models/resourceVersionCreatorPage';
import {connect, Dispatch} from 'dva';
import {ConnectState} from '@/models/connect';
import {FContentText, FTipText} from '@/components/FText';
import {CloseCircleFilled} from '@ant-design/icons';
import {i18nMessage} from '@/utils/i18n';

interface PoliciesProps {
  // dataSource: FDepPanelProps['dataSource'][0]['enabledPolicies'];
  // onChange?: (dataSource: PoliciesProps['dataSource']) => void;
  dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

function Policies({creator, dispatch}: PoliciesProps) {
  const resource = creator.dependencies.find((i) => i.id === creator.depActivatedID) as DepResources[number];

  if (!resource || resource.upthrow) {
    return null;
  }

  function onChangeChecked(checked: boolean, contractID: DepResources[number]['enabledPolicies'][number]) {
    const enabledPolicies = resource.enabledPolicies.map((i) => {
      if (i.id !== contractID.id) {
        return i;
      }
      return {
        ...i,
        checked,
      };
    });
    dispatch<OnChangeDependenciesByIDAction>({
      type: 'resourceVersionCreatorPage/onChangeDependenciesByID',
      payload: {
        enabledPolicies,
      },
      id: creator.depActivatedID,
    });
  }

  if (resource.enabledPolicies.length === 0) {
    return null;
  }

  return (<>
    <div style={{height: 20}}/>
    {/*<FContentText type="additional2" text={i18nMessage('other_authorization_plan')}/>*/}
    <FContentText type="additional2" text={'可签约的合约'}/>
    <div style={{height: 5}}/>
    <div className={styles.styles}>
      {resource.enabledPolicies.map((i) => (
        <div key={i.id} className={styles.Policy}>
          <div className={styles.PolicyGrammar}>
            <div className={styles.PolicyName}>
              <Checkbox
                disabled={i.status === 0}
                checked={i.checked}
                onChange={(e) => onChangeChecked(e.target.checked, i)}
              />
              <div style={{width: 5}}/>
              <span>{i.title}</span>
              <div style={{width: 2}}/>
              {i.status === 0 && <>
                <CloseCircleFilled className={styles.titleErrorIcon}/>
                <div style={{width: 5}}/>
                <FTipText text={'该授权策略已停用，无法签约。'} type="modal"/>
              </>}
            </div>
            <div style={{height: 5}}/>
            <pre>{i.code}</pre>
          </div>
        </div>
      ))}
    </div>
  </>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(Policies);
