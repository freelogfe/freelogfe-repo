import * as React from 'react';
import styles from './index.less';
import {FDown, FEdit, FExclamation, FFileSearch, FWarning} from '@/components/FIcons';
import Header from '../Header';
import FTable from '@/components/FTable';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FContentText, FTitleText} from '@/components/FText';
import {Dropdown, Space} from 'antd';
import {FTextButton} from '@/components/FButton';
import FPagination from '@/components/FPagination';
import FSwitch from '@/components/FSwitch';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState, NodeManagerModelState} from '@/models/connect';
import FInput from '@/components/FInput';
import {router} from "umi";
import {ColumnsType} from "antd/lib/table/interface";
import FMenu from "@/components/FMenu";
import {resourceTypes} from "@/utils/globals";
import {ChangeAction, OnChangeExhibitAction, OnOnlineOrOfflineAction} from "@/models/nodeManagerPage";
import {ChangeAction as MarketChangeAction} from '@/models/marketPage';
import FNoDataTip from "@/components/FNoDataTip";
import FDropdownMenu from "@/components/FDropdownMenu";
import FLoadingTip from "@/components/FLoadingTip";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/node/$id/Sider";
import FTooltip from "@/components/FTooltip";

interface ExhibitsProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

const resourceTypeOptions = [
  {text: '全部', value: '-1'},
  ...resourceTypes.map((i) => ({value: i, text: i}))
];

const resourceStatusOptions = [
  {text: '全部', value: '2'},
  {text: '已上线', value: '1'},
  {text: '已下线', value: '0'},
];

function Exhibits({dispatch, nodeManagerPage}: ExhibitsProps) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 170);
  const [minHeight2, setMinHeight2] = React.useState<number>(window.innerHeight - 70);


  React.useEffect(() => {
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 170);
  }

  React.useEffect(() => {
    window.addEventListener('resize', setHeight2);
    return () => {
      window.removeEventListener('resize', setHeight2);
    };
  }, []);

  function setHeight2() {
    setMinHeight2(window.innerHeight - 70);
  }

  const dataSource: NodeManagerModelState['exhibitList'] = nodeManagerPage.exhibitList.map((i) => ({
    key: i.id,
    ...i,
  }));

  if (nodeManagerPage.exhibitDataState === 'loading') {
    return (<FLoadingTip height={minHeight2}/>);
  }

  // if (nodeManagerPage.exhibitDataState === 'noData') {
  //   return (<FNoDataTip
  //     height={minHeight2}
  //     tipText={'当前节点没有添加展品'}
  //     btnText={'进入资源市场'}
  //     onClick={() => {
  //       dispatch<MarketChangeAction>({
  //         type: 'marketPage/change',
  //         payload: {
  //           resourceType: '-1',
  //         }
  //       });
  //       router.push('/market');
  //     }}
  //   />);
  // }

  const columns: ColumnsType<NonNullable<NodeManagerModelState['exhibitList']>[number]> = [
    {
      title: <FContentText text={'展品名称｜类型｜展品标题｜策略'}/>,

      dataIndex: 'name',
      key: 'name',
      className: styles.tableName,
      // width: 100,
      render(_, record) {
        return (<div className={styles.info}>
          <img src={record.cover || imgSrc} alt={''}/>
          <div style={{width: 10, flexShrink: 0}}/>
          <div className={styles.infos}>
            <FContentText
              singleRow
              text={record.resourceName}
            />
            <div className={styles.sub}>
              <label>{record.type}</label>
              <div style={{width: 5}}/>
              <FContentText
                type="additional2"
                text={record.title}
                singleRow
              />
            </div>
            <div className={styles.polices}>
              {
                record.policies.map((l) => (<label key={l}>{l}</label>))
              }
            </div>
          </div>
        </div>);
      },
    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      // width: 100,
      className: styles.tableEdit,
      render(_, record): any {
        return (<Space size={25}>
          <FTextButton
            onClick={() => router.push('/node/exhibit/' + record.id)}
            theme="primary"
          >
            <FEdit/>
          </FTextButton>
          <FTextButton
            onClick={() => router.push('/resource/' + record.resourceId)}
            theme="primary"
          >
            <FFileSearch/>
          </FTextButton>
        </Space>)
      }
    },
    {
      title: <FContentText text={'展示版本'}/>,
      dataIndex: 'version',
      key: 'version',
      // width: 125,
      className: styles.tableVersion,
      render(_, record): any {
        return (<FContentText text={record.version}/>)
      },
    },
    {
      title: <FContentText text={'上线'}/>,
      dataIndex: 'status',
      key: 'status',
      // width: 65,
      className: styles.tableStatus,
      render(_, record): any {
        return (<Space size={15}>
          <FSwitch
            disabled={!record.isAuth || record.policies.length === 0}
            checked={record.isOnline}
            onChange={(value) => {
              dispatch<OnOnlineOrOfflineAction>({
                type: 'nodeManagerPage/onOnlineOrOffline',
                payload: {
                  id: record.id,
                  onlineStatus: value ? 1 : 0,
                },
              });
            }}
          />
          {!record.isAuth || record.policies.length === 0 ?
            <FTooltip title={!record.isAuth ? record.authErrorText : '暂无上线策略'}>
              <FWarning/>
            </FTooltip> : ''}
        </Space>)
      }
    },
  ];

  return (<FLeftSiderLayout
    type={nodeManagerPage.exhibitDataState === 'noData' ? 'empty' : 'table'}
    sider={<Sider/>}
    header={<div className={styles.header}>
      <FTitleText type="h1" text={'展品管理'}/>
      <Space size={80}>
        <div>
          <span>类型：</span>
          <FDropdownMenu
            options={resourceTypeOptions}
            onChange={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                selectedType: value,
              },
            })}
          >
            <span
              style={{cursor: 'pointer'}}>{resourceTypeOptions.find((rto) => rto.value === nodeManagerPage.selectedType)?.text || ''}<FDown
              style={{marginLeft: 8}}/></span>
          </FDropdownMenu>
        </div>
        <div>
          <span>状态：</span>
          <FDropdownMenu
            options={resourceStatusOptions}
            onChange={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                selectedStatus: value,
              },
            })}
          >
            <span style={{cursor: 'pointer'}}>{resourceStatusOptions.find((rso) => {
              return rso.value === nodeManagerPage.selectedStatus.toString();
            })?.text}<FDown style={{marginLeft: 10}}/></span>
          </FDropdownMenu>
        </div>
        <div>
          <FInput
            className={styles.input}
            theme="dark"
            value={nodeManagerPage.exhibitInputFilter}
            debounce={300}
            onDebounceChange={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                exhibitInputFilter: value,
              },
            })}
          />
        </div>
      </Space>
    </div>}
  >

    {
      nodeManagerPage.exhibitDataState === 'noData' ? (<FNoDataTip
        height={minHeight2}
        tipText={'当前节点没有添加展品'}
        btnText={'进入资源市场'}
        onClick={() => {
          dispatch<MarketChangeAction>({
            type: 'marketPage/change',
            payload: {
              resourceType: '-1',
            }
          });
          router.push('/market');
        }}
      />) : (<>
        {
          nodeManagerPage.exhibitDataState === 'noSearchData'
            ? (<FNoDataTip height={minHeight} tipText={'无搜索结果'}/>)
            : (<div className={styles.body}>
              <FTable
                columns={columns}
                dataSource={dataSource as any}
                pagination={false}
              />
            </div>)
        }
      </>)
    }


  </FLeftSiderLayout>);
}

export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);
