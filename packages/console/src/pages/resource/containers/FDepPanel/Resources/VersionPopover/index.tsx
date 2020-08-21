import {Popover, Radio, Select, Checkbox, Button} from "antd";
import FInput from '@/components/FInput';
import {FNormalButton} from '@/components/FButton';
import * as React from "react";
import styles from './index.less';
import {DepResources} from "@/models/resourceVersionCreatorPage";
// import {ResourcesProps} from "..";

interface VersionPopoverProps {
  // defaultVersion: ResourcesProps['dataSource'][0]['version']
  // versions: ResourcesProps['dataSource'][0]['versions'];
  defaultVersion: DepResources[0]['version']
  versions: DepResources[0]['versions'];
  onChange?: (version: VersionPopoverProps['defaultVersion']) => void;
  children: any;
}

export default function ({defaultVersion, versions, children, onChange}: VersionPopoverProps) {

  const [visible, setVisible] = React.useState<boolean>(false);

  const [version, setVersion] = React.useState<VersionPopoverProps['defaultVersion']>(defaultVersion);

  function onConfirm() {
    setVisible(false);
    return onChange && onChange(version);
  }

  function onChangeVersion(obj: any) {
    setVersion({
      ...version,
      ...obj,
    })
  }

  // function onSubmit() {
  //
  // }

  return (<Popover
    placement="bottomLeft"
    trigger="click"
    onVisibleChange={(visible) => setVisible(visible)}
    visible={visible}
    content={<div onClick={(e) => e.stopPropagation()}>
      <div className={styles.select}>
        <Radio
          checked={!version.isCustom}
          onClick={() => onChangeVersion({isCustom: false})}
        />
        <span>选定版本</span>
        <div style={{width: 10}}/>
        <Select
          value={version.select}
          onChange={(value) => onChangeVersion({select: value})}
          size="small"
          className={styles.Select}
          disabled={version.isCustom}
        >
          {
            versions.map((i) => <Select.Option key={i} value={i}>{i}</Select.Option>)
          }
        </Select>
        <div style={{width: 20}}/>
        <Checkbox
          checked={version.allowUpdate}
          onChange={(e) => onChangeVersion({allowUpdate: e.target.checked})}
          disabled={version.isCustom}
        />
        <div style={{width: 10}}/>
        <div>允许使用当前版本的最新变动</div>
      </div>
      <div style={{height: 10}}/>
      <div className={styles.input}>
        <Radio
          checked={version.isCustom}
          onClick={() => onChangeVersion({isCustom: true})}
        />
        <span>自定义</span>
        <div style={{width: 10}}/>
        <FInput
          value={version.input}
          onChange={(e) => onChangeVersion({input: e.target.value})}
          className={styles.FInput}
          placeholder="输入semver版本范围"
          size="small"
          disabled={!version.isCustom}
        />
      </div>
      <div style={{height: 10}}/>
      <div className={styles.footer}>
        <Button
          size="small"
          type="default"
          onClick={() => setVisible(false)}
        >取消</Button>
        <div style={{width: 10}}/>
        <FNormalButton
          size="small"
          onClick={onConfirm}
        >确定</FNormalButton>
      </div>
    </div>}
    title={null}
  >
    <div className={styles.children} onClick={(e) => {
      e.stopPropagation();
      setVisible(true);
    }}>{children}</div>
  </Popover>)
}
