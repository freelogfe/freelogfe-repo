import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {Checkbox, Dropdown, Space} from 'antd';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState} from "@/models/connect";

// import {UpdateAuthorizedAction} from "@/models/resourceAuthPage";

interface PolicyCardProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState['info'];
  title: string;
  code: string;
  allVersions: string[];

  onClickLicense?(versions: string[]): void;
}

function PolicyCard({title, code, allVersions, onClickLicense, resourceInfo, dispatch}: PolicyCardProps) {
  const [dropdownVisible, setDropdownVisible] = React.useState<boolean>(false);

  // function onLicense() {
  //   dispatch<UpdateAuthorizedAction>({
  //     type: 'resourceAuthPage/updateAuthorized',
  //     payload: [{
  //       version: '0',
  //       policyId: 'sdf',
  //       operation: 1,
  //     }]
  //   });
  // }

  return (<div className={styles.Policy}>
    <div className={styles.PolicyGrammar}>
      <div className={styles.PolicyName}>
        <span>{title}</span>
        <Dropdown
          overlay={<MenuPanel
            versions={allVersions}
            onClickCancel={() => setDropdownVisible(false)}
            onClickConfirm={(versions) => onClickLicense && onClickLicense(versions)}
          />}
          trigger={['click']}
          placement="bottomRight"
          visible={dropdownVisible}
          onVisibleChange={(visible) => setDropdownVisible(visible)}
          getPopupContainer={() => document.getElementById('DepPanelContent') as HTMLElement}
          arrow={true}
        >
          <FNormalButton
            size="small"
            // onClick={() => onClickLicense && onClickLicense()}
          >获取授权</FNormalButton>
        </Dropdown>
      </div>
      <div style={{height: 5}}/>
      <pre>{code}</pre>
    </div>
  </div>);
}


export default connect(({resourceInfo}: ConnectState) => ({
  resourceInfo: resourceInfo.info,
}))(PolicyCard);

interface MenuPanelProps {
  versions: string[];

  onClickConfirm?(versions: string[]): void;

  onClickCancel?(): void;
}

function MenuPanel({versions, onClickConfirm, onClickCancel}: MenuPanelProps) {
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);

  function onChangeSelected(version: string, checked: boolean) {
    if (checked) {
      setSelectedVersions([
        ...selectedVersions,
        version,
      ]);
    } else {
      setSelectedVersions(selectedVersions.filter((v: string) => v !== version));
    }
  }

  return (<div className={styles.MenuPanel}>
    <FContentText text={'选择签约的版本'}/>
    <div style={{height: 30}}/>
    <div className={styles.allVersions}>
      {
        versions.map((v) => (<Space size={8} key={v}>
          <Checkbox
            checked={selectedVersions.includes(v)}
            onChange={(e) => onChangeSelected(v, e.target.checked)}
          />
          <span>{v}</span>
        </Space>))
      }
    </div>
    <div style={{height: 40}}/>
    <Space size={25}>
      <FTextButton
        onClick={() => onClickCancel && onClickCancel()}>取消</FTextButton>
      <FNormalButton
        onClick={() => onClickConfirm && onClickConfirm(selectedVersions)}
      >签约</FNormalButton>
    </Space>
  </div>);
}
