import * as React from 'react';

import styles from './index.less';
import {FContentText, FTipText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {CopyOutlined} from '@ant-design/icons';
import {Space, Drawer} from 'antd';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import IsUpthrow from './IsUpthrow';
import UpthrowList from './UpthrowList';
import Market from './Market';
import {connect} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {i18nMessage} from '@/utils/i18n';
import {CloseCircleFilled} from '@ant-design/icons';
import {DepResources} from '@/models/resourceVersionCreatorPage';

export interface FDepPanelProps {
  // dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

function FDepPanel({creator}: FDepPanelProps) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const resource = creator.dependencies.find((i) => i.id === creator.depActivatedID) as DepResources[number];
  // console.log(resource, 'resource23qeasdj98io');
  return (<>
    <Space size={80}>
      <Space size={10}>
        <FCircleButton
          onClick={() => setModalVisible(true)}
          theme="weaken"
        />
        <FContentText text={i18nMessage('add_rely_resource')}/>
      </Space>
      <Space size={10}>
        <FCircleButton
          theme="weaken"
          icon={<CopyOutlined/>}
        />
        <FContentText text={i18nMessage('import_from_previous_version')}/>
      </Space>
    </Space>

    {
      creator.depRelationship.length > 0 && (<>
        <UpthrowList/>

        <div style={{height: 20}}/>
        <div className={styles.DepPanel}>

          <div className={styles.DepPanelNavs}>
            <div>
              <Resources/>
            </div>
          </div>

          <div className={styles.DepPanelContent}>
            {
              resource && resource.status !== 1 && (<div className={styles.errorBox}>
                <CloseCircleFilled className={styles.errorIcon}/>
                {resource.status === 0 && <FTipText text={'该资源已下线，无法获取授权。'} type="secondary"/>}
                {resource.status === 2 && <FTipText text={'循环依赖不支持授权。'} type="secondary"/>}
              </div>)
            }

            {
              resource && resource.status === 1 && (<div>

                <IsUpthrow/>

                <Contracts/>

                <Policies/>

              </div>)
            }

          </div>
        </div>
      </>)
    }

    <Drawer
      title={'添加依赖'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Market/>
    </Drawer>
  </>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(FDepPanel);
