import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import {i18nMessage} from "@/utils/i18n";
import {CloseCircleFilled} from '@ant-design/icons';

export interface FAuthPanelProps {
  dataSource: {
    id: string | number;
    activated: boolean;
    title: string;
    resourceType: string;
    version: string;
    contracts: {
      checked: boolean;
      title: string;
      status: string;
      code: string;
      id: string;
      date: string;
      policyId: string;
      versions: { version: string; checked: boolean; disabled: boolean }[];
    }[];
    policies: {
      id: string;
      title: string;
      code: string;
      allEnabledVersions: string[];
    }[];
  }[];

  onChangeActivatedResource?(dataSource: FAuthPanelProps['dataSource']): void;
}

function FAuthPanel({dataSource, onChangeActivatedResource}: FAuthPanelProps) {

  const [activeResource, setActiveResource] = React.useState<FAuthPanelProps['dataSource'][0] | null>(null);

  React.useEffect(() => {
    const resource = dataSource.find((i) => i.activated);
    setActiveResource(resource || null);
  }, [dataSource]);

  function onChangeActivated(id: number | string) {
    onChangeActivatedResource && onChangeActivatedResource(dataSource.map((i) => ({
      ...i,
      activated: i.id === id,
    })));
  }

  return (<div className={styles.DepPanel}>
    <div className={styles.DepPanelNavs}>
      <div>
        <Resources/>
      </div>
    </div>
    <div className={styles.DepPanelContent}>
      <div className={styles.contentBox} id={'DepPanelContent'}>

        {/*<>*/}
        {
          activeResource && activeResource?.contracts.length > 0 && (<>
            <FContentText type="additional2" text={i18nMessage('used_contract')}/>
            <div style={{height: 5}}/>
            <Contracts dataSource={activeResource.contracts}/>
          </>)
        }

        {
          activeResource && activeResource?.policies?.length > 0 && (<>
            <div style={{height: 20}}/>
            <FContentText type="additional2" text={i18nMessage('other_authorization_plan')}/>
            <div style={{height: 5}}/>
            <Policies dataSource={activeResource.policies}/>
          </>)
        }
        {/*</>*/}
      </div>
    </div>
  </div>);
}

export default FAuthPanel;
