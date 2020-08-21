import * as React from 'react';
import {FTipText, FContentText} from '@/components/FText';
import StatusLabel from '@/pages/resource/components/StatusLabel';
import {FNormalButton, FTextButton, FCircleButton} from '@/components/FButton';
import FDropdown from '@/components/FDropdown';
import FModal from '@/components/FModal';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {PlusOutlined} from '@ant-design/icons';
import styles from './index.less';
import {i18nMessage} from "@/utils/i18n";
import {Drawer} from "antd";
import Pool from './Pool';

interface Policy {
  id: string;
  title: string;
  status: 'executing' | 'stopped';
  code: string;
}

interface FPoliciesProps {
  dataSource?: Policy[];
  // onChange?: (value: Policy[]) => void;
  onAddPolicy?: ({id, title, code}: Policy) => void;
  onChangeStatus?: ({id, status, title}: Partial<Policy>) => void;
}

export default function ({dataSource = [], onAddPolicy, onChangeStatus}: FPoliciesProps) {

  const [drawerVisible, setDrawerVisible] = React.useState<boolean>(false);
  // const [newTitle, setNewTitle] = React.useState<string>('');
  // const [newCode, setNewCode] = React.useState<string>('');
  const [previewCode, setPreviewCode] = React.useState<string>('');
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);

  // function onOkNewPolicy() {
  //   setNewVisible(false);
  //   // return onAddPolicy && onAddPolicy({
  //   //   title: newTitle,
  //   //   code: newCode,
  //   // });
  // }

  function onPolicyStatusChange(id: string, status: Policy['status'], title: string) {
    return onChangeStatus && onChangeStatus({id, status, title});
  }

  function openNewVisible() {
    setDrawerVisible(true);
  }

  function closeNewVisible() {
    setDrawerVisible(false);
  }

  // function onChangeCode(value: string) {
  //   setNewCode(value);
  // }

  function openPreviewCode(code: string) {
    setPreviewCode(code);
    setPreviewVisible(true);
  }

  function closePreview() {
    setPreviewVisible(false);
  }

  return (<div className={styles.FPoliciesStyles}>
    {dataSource?.length === 0
      ? (<div className={styles.empty}>
        <FTipText type="secondary" text={i18nMessage('hint_add_authorization_plan')}/>
        <div style={{height: 20}}/>
        <FNormalButton onClick={openNewVisible}>{i18nMessage('add_authorization_plan')}</FNormalButton>
      </div>)
      : (<div className={styles.policies}>
        {
          dataSource?.map((i) => (<PolicyCard
            key={i.id}
            title={i.title}
            status={i.status}
            code={i.code}
            onPreview={() => openPreviewCode(i.code)}
            onChangeStatus={(value) => onPolicyStatusChange(i.id, value, i.title)}
          />))
        }
        <div>
          <FNormalButton
            onClick={openNewVisible}
            theme="weaken"
            shape="circle"
            icon={<PlusOutlined/>}
          />
        </div>
      </div>)}
    <FModal
      title="查看策略"
      visible={previewVisible}
      // onOk={this.handleOk}
      onCancel={closePreview}
      // cancelText={null}
      footer={null}
    >
      <SyntaxHighlighter
        showLineNumbers={true}
      >{previewCode}</SyntaxHighlighter>
    </FModal>
    {/*<FModal*/}
    {/*  title="新建策略"*/}
    {/*  visible={false}*/}
    {/*  onCancel={closeNewVisible}*/}
    {/*  onOk={onOkNewPolicy}*/}
    {/*  width={768}*/}
    {/*>*/}
    {/*  <FInput*/}
    {/*    className={styles.newTitle}*/}
    {/*    value={newTitle}*/}
    {/*    onChange={(e) => setNewTitle(e.target.value)}*/}
    {/*    placeholder={'请输入授权策略名称'}*/}
    {/*  />*/}
    {/*  <div style={{height: 10}}/>*/}
    {/*  <FCodemirror*/}
    {/*    value={newCode}*/}
    {/*    onChange={onChangeCode}*/}
    {/*  />*/}
    {/*</FModal>*/}
    <Drawer
      title={'选择策略'}
      onClose={closeNewVisible}
      visible={drawerVisible}
      width={820}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Pool onSelect={(value) => {
        onAddPolicy && onAddPolicy({
          id: value.policyId,
          title: value.policyName,
          status: 'executing',
          code: value.policyText,
        });
        return closeNewVisible();
      }}/>
    </Drawer>
  </div>);
}

interface PolicyCardProps {
  title: string;
  status: 'executing' | 'stopped';
  code: string;
  onPreview?: () => void;
  onChangeStatus?: (value: PolicyCardProps['status']) => void;
}

function PolicyCard({title, status, code, onPreview, onChangeStatus}: PolicyCardProps) {
  return (<div className={styles.policy}>
    <div className={styles.policyHeader}>
      <FContentText text={title} singleRow={true}/>
      <FDropdown
        onChange={(value: any) => {
          if (value !== status) {
            return onChangeStatus && onChangeStatus(value);
          }
        }}
        text={<StatusLabel status={status}/>}
        options={[
          // {value: 'executing', text: i18nMessage('enabled')},
          {value: 'executing', text: i18nMessage('enabled')},
          {value: 'stopped', text: i18nMessage('disabled')},
        ]}
      />
    </div>
    <div style={{height: 5}}/>
    <div className={styles.policyContent}>
      <pre>{code}</pre>
    </div>
    <div style={{height: 3}}/>
    <div className={styles.fullscreen}>
      <FTextButton onClick={onPreview}>全屏查看</FTextButton>
    </div>
  </div>);
}

// policies
