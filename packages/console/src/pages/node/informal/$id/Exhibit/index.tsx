import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Popconfirm, Space} from "antd";
import FInput from "@/components/FInput";
import FTable from "@/components/FTable";
import FMappingRuleAdd from "@/components/FIcons/FMappingRuleAdd";
import {FDelete, FEdit, FFileSearch, FWarning} from "@/components/FIcons";
import FMappingRuleAttr from "@/components/FIcons/FMappingRuleAttr";
import FMappingRuleCover from "@/components/FIcons/FMappingRuleCover";
import FMappingRuleLabel from "@/components/FIcons/FMappingRuleLabel";
import FMappingRuleOffline from "@/components/FIcons/FMappingRuleOffline";
import FMappingRuleOnline from "@/components/FIcons/FMappingRuleOnline";
import FMappingRuleReplace from "@/components/FIcons/FMappingRuleReplace";
import FMappingRuleTitle from "@/components/FIcons/FMappingRuleTitle";
import FMappingRuleVersion from "@/components/FIcons/FMappingRuleVersion";
import {FNormalButton, FTextButton} from "@/components/FButton";
import FSwitch from "@/components/FSwitch";
import FTooltip from "@/components/FTooltip";
import FAdd from "@/components/FIcons/FAdd";
import FDropdownMenu from "@/components/FDropdownMenu";
import FDrawer from "@/components/FDrawer";

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '3',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '4',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },

];

interface ExhibitProps {

}

function Exhibit({}: ExhibitProps) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 94);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 94);
  }

  if (false) {
    return (<FNoDataTip
      height={minHeight}
      tipText={'当前测试节点没有添加展品'}
      btnText={'添加测试展品'}
    />);
  }

  const columns = [
    {
      title: (<FContentText text={'来源｜封面'}/>),
      dataIndex: 'cover',
      key: 'cover',
      width: 120,
      render() {
        return (<div className={styles.cover}>
          <img
            src={'//cn.bing.com/th?id=OHR.FichtelbergWinter_ZH-CN9274877146_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'}
            alt={''}
            loading="lazy"
          />
          <label className={styles.resource}>资源</label>
          {/*<label className={styles.object}>对象</label>*/}
          {/*<label className={styles.exhibit}>展品</label>*/}
        </div>);
      },
    },
    {
      title: (<FContentText text={'测试展品名称｜类型｜测试展品标题｜映射规则'}/>),
      dataIndex: 'name',
      key: 'name',
      render() {
        return (<div className={styles.name}>
          <FTitleText
            // text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里这'}
            text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里是名称名称这里是展这里是展品名称这里是名称名称这里是展'}
            type="h4"
            singleRow
          />
          <div className={styles.type}>
            <label>image</label>
            <div>
              <FContentText
                type="additional2"
                text={'这里是展品标题这里是展品标题这里是展品标题这里这里是展品标题这'}
                singleRow
              />
            </div>
          </div>
          <Space size={16}>
            {/*{*/}
            {/*  true ? <span></span>*/}
            {/*}*/}
            <>
              <FMappingRuleAdd/>
              <FEdit/>
              <FMappingRuleAttr/>
              <FMappingRuleCover/>
              <FMappingRuleLabel/>
              <FMappingRuleOffline/>
              <FMappingRuleOnline/>
              <FMappingRuleReplace/>
              <FMappingRuleTitle/>
              <FMappingRuleVersion/>
            </>
          </Space>
        </div>);
      }
    },
    {
      title: <FContentText text={''}/>,
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render() {
        return (<div
          style={{width: 110}}
          className={styles.hoverVisible}
        >
          <Space size={25}>
            <FTextButton
              // onClick={() => router.push('/node/exhibit/formal/' + record.id)}
              theme="primary"
            >
              <FEdit/>
            </FTextButton>
            <FTextButton
              // onClick={() => router.push('/resource/' + record.resourceId)}
              theme="primary"
            >
              <FFileSearch/>
            </FTextButton>

            <Popconfirm
              title={'确定删除吗？'}
              // onConfirm={() => onClickDelete && onClickDelete()}
            >
              <FTextButton
                className={styles.Delete}
              ><FDelete/></FTextButton>
            </Popconfirm>
          </Space>
        </div>);
      },
    },
    {
      title: <FContentText text={'展示版本'}/>,
      dataIndex: 'version',
      key: 'version',
      width: 123,
      render() {
        return (<div style={{width: 123}}>
          <FContentText text={'1.0.10'}/>
        </div>);
      },
    },
    {
      title: <FContentText text={'上线'}/>,
      dataIndex: 'online',
      key: 'online',
      width: 65,
      render() {
        return (<div style={{width: 65}}>
          <Space size={15}>
            <FSwitch
              disabled={false}
              // checked={record.isOnline}
              onChange={(value) => {
                // dispatch<OnOnlineOrOfflineAction>({
                //   type: 'nodeManagerPage/onOnlineOrOffline',
                //   payload: {
                //     id: record.id,
                //     onlineStatus: value ? 1 : 0,
                //   },
                // });
              }}
            />
            {/*{!record.isAuth || record.policies.length === 0 ?*/}
            <FTooltip
              // title={!record.isAuth ? record.authErrorText : '暂无上线策略'}
              title={'暂无上线策略'}
            >
              <FWarning/>
            </FTooltip>
            {/*: ''}*/}
          </Space>
        </div>);
      },
    },
  ];

  return (<>
    <div className={styles.header}>
      <FTitleText text={'展品管理'}/>
      <Space size={30}>
        <Space size={5}><FAdd/><FContentText text={'新增测试展品'}/></Space>
        <Space size={5}><FMappingRuleReplace/><FContentText text={'资源替换'}/></Space>
        <div><FDropdownMenu options={[{value: '1234', text: '1234'}]} text={'筛选'}/></div>
        <div><FInput theme={'dark'}/></div>
      </Space>
    </div>
    <div className={styles.body}>
      <div>
        <FTable
          className={styles.table}
          dataSource={dataSource}
          columns={columns}
          rowClassName={styles.rowClassName}
        />
      </div>
    </div>
    <div style={{height: 100}}/>

    <FDrawer
      title={'添加测试展品'}
      visible={true}
      topRight={<Space size={30}>
        <FTextButton>取消</FTextButton>
        <FNormalButton>添加</FNormalButton>
      </Space>}>


    </FDrawer>
  </>);
}

export default Exhibit;