import * as React from 'react';
import styles from './index.less';
import FDropdown from '@/components/FDropdown';
import FInput from '@/components/FInput';
import {FContentText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {resourceTypes} from '@/utils/globals';
import {
  AddADepByIDAction,
  ChangeAction,
  DepResources,
  // OnChangeDependenciesAction,
  // OnChangeDepRelationshipAction
} from '@/models/resourceVersionCreatorPage';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {list, ListParamsType} from '@/services/resources';
import moment from 'moment';
import {resourceList} from "@/services/collections";
import {List, Skeleton} from 'antd';

interface MarketProps {
  dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

interface MarketStatus {
  selected: '1' | '2' | '3';
  page: number;
  totalItem: number;
  input: string;
  resourceObjects: {
    id: string;
    title: string;
    resourceType: string;
    time: string;
    status: 0 | 1;
  }[];
}

const selectOptions: { text?: string, value: string }[] = [
  {text: '资源市场', value: '1'},
  {text: '我的资源', value: '2'},
  {text: '我的收藏', value: '3'},
];

let page: MarketStatus['page'] = 1;
let input: MarketStatus['input'] = '';

function Market({creator: {depRelationship, dependencies}, dispatch}: MarketProps) {

  const [selected, setSelected] = React.useState<MarketStatus['selected']>('1');
  // const [page, setPage] = React.useState<MarketStatus['page']>(1);
  // const [input, setInput] = React.useState<MarketStatus['input']>('');
  const [totalItem, setTotalItem] = React.useState<MarketStatus['totalItem']>(-1);

  const [resourceObjects, setResourceObjects] = React.useState<MarketStatus['resourceObjects']>([]);

  React.useEffect(() => {
    handleDataSource(0);
  }, []);

  async function handleDataSource(isSelf: 0 | 1 = 0) {
    const params: ListParamsType = {
      isSelf: isSelf,
      pageSize: 20,
      page: page,
      status: isSelf === 1 ? 2 : 1,
      keywords: window.encodeURIComponent(input),
    };
    // console.log(params, '324wdsparams');
    const {data} = await list(params);
    const resources = data.dataList.map((i: any) => ({
      id: i.resourceId,
      title: i.resourceName,
      resourceType: i.resourceType,
      time: moment(i.updateDate).format('YYYY-MM-DD HH:mm'),
      status: i.status,
      baseUpcastResources: i.baseUpcastResources,
    }));
    setTotalItem(data.totalItem);
    if (page === 1) {
      setResourceObjects(resources);
    } else {
      setResourceObjects([
        ...resourceObjects,
        ...resources,
      ]);
    }

  }

  function onSelect(i: any) {
    // console.log(i, 'IIIIIIsAAAA');
    dispatch<AddADepByIDAction>({
      type: 'resourceVersionCreatorPage/addADepByIDAction',
      payload: [i.id, ...i.baseUpcastResources.map((up: any) => up.resourceId)],
    });
  }

  function onChangeSelected(selected: MarketStatus['selected']) {
    setSelected(selected as MarketStatus['selected']);
    page = 1;
    setTimeout(() => handleDataSource(selected === '1' ? 0 : 1));
  }

  function onChangePage() {
    // console.log(page, 'page35erdf');
    page += 1;
    setTimeout(() => handleDataSource(selected === '1' ? 0 : 1));
  }

  function onChangeInput(value: string) {
    input = value;
    page = 1;
    setTimeout(() => handleDataSource(selected === '1' ? 0 : 1));
  }

  return (
    <div className={styles.SelectBucket}>
      <div className={styles.filter}>
        <div className={styles.filterSelect}>
          <FDropdown
            options={selectOptions}
            text={selectOptions.find((i) => i.value === selected)?.text}
            onChange={onChangeSelected as any}
          />
        </div>

        <FInput
          debounce={300}
          onDebounceChange={onChangeInput}
          value={input}
          // onChange={(e) => setInput(e.target.value)}
          className={styles.filterInput}
          theme="dark"
          size="small"
        />
      </div>

      <div style={{height: 17}}/>

      <List
        // className="demo-loadmore-list"
        loading={totalItem === -1}
        itemLayout="horizontal"
        loadMore={(totalItem > page * 20)
          ? (<div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
            }}
          ><FNormalButton onClick={onChangePage}>加载更多</FNormalButton></div>)
          : (resourceObjects.length > 0 && (
            <div style={{textAlign: 'center', padding: '10px 0'}}><FContentText type="additional1" text={'没有更多了~'}/></div>))}
        dataSource={resourceObjects}
        renderItem={(i: MarketStatus['resourceObjects'][number]) => (
          <div className={styles.bucket}>
            <div>
              <FContentText text={i.title}/>
              <div style={{height: 2}}/>
              <FContentText type={'additional2'} text={`资源类型 ${i.resourceType} | 更新时间 ${i.time}`}/>
            </div>
            <FNormalButton
              theme="weaken"
              onClick={() => onSelect(i)}
              disabled={depRelationship.map((j) => j.id).includes(i.id)}
            >选择</FNormalButton>
          </div>
        )}
      />
    </div>
  );
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(Market);
