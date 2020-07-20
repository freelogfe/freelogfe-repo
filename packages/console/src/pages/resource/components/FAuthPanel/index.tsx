import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';

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
      versions: { version: string; checked: boolean; }[];
    }[];
    policies: {
      id: string;
      title: string;
      code: string;
    }[];
  }[];
  onChangeActivatedResource?: (dataSource: FAuthPanelProps['dataSource']) => void;
}

export default function ({dataSource, onChangeActivatedResource}: FAuthPanelProps) {

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
        <Resources
          onClick={(resource) => onChangeActivated(resource.id)}
          dataSource={dataSource.map((i) => ({
            id: i.id,
            activated: i.activated,
            title: i.title,
            resourceType: i.resourceType,
            version: i.version,
            labels: i.contracts.map((j) => j.title)
          }))}
        />
      </div>
    </div>
    <div className={styles.DepPanelContent}>
      <div>
        <FContentText type="additional2" text={'可复用的合约'}/>
        <div style={{height: 5}}/>
        {activeResource && <Contracts dataSource={activeResource.contracts}/>}

        <div style={{height: 20}}/>
        <FContentText type="additional2" text={'可签约的合约'}/>
        <div style={{height: 5}}/>
        {activeResource && <Policies dataSource={activeResource.policies}/>}
      </div>
    </div>
  </div>);
}