import * as React from 'react';

import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled, CopyOutlined} from '@ant-design/icons';
import {Radio, Checkbox, Space, Drawer} from 'antd';
import Resources, {ResourcesProps} from './Resources';
import Contracts from "./Contracts";
import Policies from "./Policies";
import UpthrowList from "./UpthrowList";
import Market, {MarketResource} from "./Market";

interface DepResources {
  readonly id: string;
  readonly activated: boolean;
  readonly title: string;
  readonly resourceType: string;
  readonly version: {
    readonly isCustom: boolean;
    readonly select: string;
    readonly allowUpdate: boolean;
    readonly input: string;
  };
  readonly versions: string[];
  readonly upthrow: boolean;
  readonly enableReuseContracts: {
    readonly checked: boolean;
    readonly title: string;
    readonly status: 'executing' | 'stopped';
    readonly code: string;
    readonly id: string;
    readonly date: string;
    readonly versions: string[];
  }[];
  readonly enabledPolicies: {
    readonly checked: boolean;
    readonly id: string;
    readonly title: string;
    readonly code: string;
  }[];
  readonly unresolved?: DepResources[];
}

export interface FDepPanelProps {
  readonly dataSource: DepResources[];
  onChange?: (dataSource: FDepPanelProps['dataSource']) => void;
}

export default function ({dataSource, onChange}: FDepPanelProps) {

  const [activeResource, setActiveResource] = React.useState<FDepPanelProps['dataSource'][0] | null>(null);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    const resource = dataSource.find((i) => i.activated);
    setActiveResource(resource || null);
  }, [dataSource]);

  function onChangeResources(value: ResourcesProps['dataSource'][0]) {
    // console.log(value, '######');
    return onChange && onChange(dataSource.map((i) => {
      if (value.id !== i.id) {
        return i;
      }
      return {
        ...i,
        version: value.version,
      };
    }));
  }

  function onChangeResourcesActivated(value: ResourcesProps['dataSource'][0]) {
    return onChange && onChange(dataSource.map((i) => ({
      ...i,
      activated: value.id === i.id,
    })));
  }

  function onDeleteResource(value: ResourcesProps['dataSource'][0]) {
    let resources = dataSource.filter((i) => i.id !== value.id);

    if (value.activated && resources.length > 0) {
      resources = resources.map((i, j) => {
        if (j !== 0) {
          return i;
        }
        return {
          ...i,
          activated: true,
        };
      })
    }
    return onChange && onChange(resources);
  }

  function onChangeIsUpthrow(bool: boolean) {
    return onChange && onChange(dataSource.map((i) => {
      if (i.id !== activeResource?.id) {
        return i;
      }
      return {
        ...i,
        upthrow: bool,
      };
    }));
  }

  function onChangeContracts(contracts: FDepPanelProps['dataSource'][0]['enableReuseContracts']) {
    return onChange && onChange(dataSource.map((i) => {
      if (i.id !== activeResource?.id) {
        return i;
      }
      return {
        ...i,
        enableReuseContracts: contracts,
      };
    }));
  }

  function onChangePolicies(policies: FDepPanelProps['dataSource'][0]['enabledPolicies']) {
    return onChange && onChange(dataSource.map((i) => {
      if (i.id !== activeResource?.id) {
        return i;
      }
      return {
        ...i,
        enabledPolicies: policies,
      };
    }));
  }

  function addDepResource(value: MarketResource) {
    const dep: DepResources = {
      ...marketToDep(value),
      activated: dataSource.length === 0,
    };
    return onChange && onChange([
      dep,
      ...dataSource,
    ]);
  }

  return (<>
    <Space size={80}>
      <Space size={10}>
        <FCircleButton onClick={() => setModalVisible(true)} theme="weaken"/>
        <FContentText text={'添加'}/>
      </Space>
      <Space size={10}>
        <FCircleButton theme="weaken" icon={<CopyOutlined/>}/>
        <FContentText text={'从上一版本导入'}/>
      </Space>
    </Space>

    {dataSource.length > 0 && (<>
      <UpthrowList labels={dataSource.filter((i) => i.upthrow).map((j) => j.title)}/>

      <div style={{height: 20}}/>
      <div className={styles.DepPanel}>
        <div className={styles.DepPanelNavs}>
          <div>
            <div>
              <Resources
                dataSource={dataSource.map((i) => ({
                  id: i.id,
                  activated: i.activated,
                  title: i.title,
                  resourceType: i.resourceType,
                  versions: i.versions,
                  version: i.version,
                  labels: [
                    ...i.enableReuseContracts.filter((i) => i.checked).map((j) => j.title),
                    ...i.enabledPolicies.filter((i) => i.checked).map((j) => j.title)
                  ],
                  upthrow: i.upthrow,
                }))}
                onClick={onChangeResourcesActivated}
                onChange={onChangeResources}
                onDelete={onDeleteResource}
              />
            </div>
          </div>
        </div>
        <div className={styles.DepPanelContent}>
          <div>
            <div className={styles.radios}>
              <div>
                <Radio
                  style={{lineHeight: '16px'}}
                  checked={activeResource?.upthrow}
                  onClick={() => onChangeIsUpthrow(true)}
                />
                <span style={{color: '#666'}}>上抛</span>
                <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
              </div>
              <div style={{height: 18}}/>
              <div>
                <Radio
                  style={{lineHeight: '16px'}}
                  checked={!activeResource?.upthrow}
                  onClick={() => onChangeIsUpthrow(false)}
                />
                <span style={{color: '#666'}}>签约</span>
                <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
              </div>
            </div>

            {!activeResource?.upthrow &&
            <>
              {
                activeResource && activeResource.enableReuseContracts.length > 0 && (<>
                  <div style={{height: 20}}/>
                  <FContentText type="additional2" text={'可复用的合约'}/>
                  <div style={{height: 5}}/>
                  <Contracts
                    dataSource={activeResource.enableReuseContracts}
                    onChange={onChangeContracts}
                  />
                </>)
              }

              {
                activeResource && activeResource.enabledPolicies.length > 0 && (<>
                  <div style={{height: 20}}/>
                  <FContentText type="additional2" text={'可签约的策略'}/>
                  <div style={{height: 5}}/>
                  <Policies
                    dataSource={activeResource.enabledPolicies}
                    onChange={onChangePolicies}
                  />
                </>)
              }

            </>
            }
          </div>
        </div>
      </div>
    </>)}

    <Drawer
      title={'添加依赖'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Market
        addedResourceID={dataSource.map((i) => i.id)}
        onSelect={addDepResource}
      />
    </Drawer>
  </>);
}


function marketToDep(value: MarketResource) {
  return {
    id: value.id,
    activated: false,
    title: value.name,
    resourceType: value.resourceType,
    version: {
      isCustom: false,
      select: value.versions[0],
      allowUpdate: true,
      input: '',
    },
    versions: value.versions,
    upthrow: false,
    enableReuseContracts: value.enableReuseContracts.map((i) => ({
      checked: true,
      title: i.title,
      status: i.status,
      code: i.code,
      id: i.id,
      date: i.date,
      versions: i.versions,
    })),
    enabledPolicies: value.enabledPolicies.map((i) => ({
      checked: true,
      id: i.id,
      title: i.title,
      code: i.title,
    })),
    unresolved: [],
  };
}
