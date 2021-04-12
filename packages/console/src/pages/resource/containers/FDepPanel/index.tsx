import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FRectBtn} from '@/components/FButton';
import {Space, Drawer} from 'antd';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import IsUpthrow from './IsUpthrow';
import UpthrowList from './UpthrowList';
import Market from './Market';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {CloseCircleFilled} from '@ant-design/icons';
import {ChangeAction, DepResources, ImportLastVersionDataAction} from '@/models/resourceVersionCreatorPage';
import FDrawer from "@/components/FDrawer";
import FUtil from "@/utils";

export interface FDepPanelProps {
  dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

function FDepPanel({dispatch, creator}: FDepPanelProps) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const resource = creator.dependencies.find((i) => i.id === creator.depActivatedID) as DepResources[number];
  // console.log(resource, 'resource23qeasdj98io');
  return (<>
    <Space size={15}>
      {/*<FNormalButton*/}
      {/*  onClick={() => setModalVisible(true)}*/}
      {/*  theme="grey"*/}
      {/*>{FUtil.I18n.message('add_rely_resource')}</FNormalButton>*/}
      <FRectBtn
        onClick={() => setModalVisible(true)}
        type="default"
      >添加依赖</FRectBtn>
      {
        creator.preVersionDeps.relationships.length > 0 &&
        <FRectBtn
          type="default"
          onClick={() => {
            dispatch<ImportLastVersionDataAction>({
              type: 'resourceVersionCreatorPage/importLastVersionData',
              payload: 'deps',
            });
            dispatch<ChangeAction>({
              type: 'resourceVersionCreatorPage/change',
              payload: {
                dataIsDirty: true,
              },
            });
          }}
        >{FUtil.I18n.message('import_from_previous_version')}</FRectBtn>
      }

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
                {resource.status === 0 &&
                <FTipText text={FUtil.I18n.message('authorization_issue_offline_resource')} type="secondary"/>}
                {/*{resource.status === 2 && <FTipText text={FUtil.I18n.message('authorization_issue_circular_reply')} type="secondary"/>}*/}
                {resource.status === 2 && <FTipText
                  text={FUtil.I18n.message('authorization_issue_circular_reply')}
                  type="secondary"
                />}
                {resource.status === 3 && <FTipText text={'该依赖是存储空间对象，无法获取授权。'} type="secondary"/>}
                {resource.status === 4 && <FTipText text={'该依赖是基础上抛资源，无法获取授权'} type="secondary"/>}
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

    <FDrawer
      // title={FUtil.I18n.message('add_rely_resource')}
      title={'添加依赖'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
    >
      <Market/>
    </FDrawer>
  </>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(FDepPanel);
