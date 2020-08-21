import * as React from 'react';
import styles from './index.less';
import {Dropdown} from 'antd';
import FMenu from '@/components/FMenu';
import FInput from '@/components/FInput';
import {FNormalButton} from '@/components/FButton';
import {router} from 'umi';
import FResourceCard from '@/components/FResourceCard';
import FPagination from '@/components/FPagination';
import {resourceTypes} from '@/utils/globals';
import {DownOutlined} from '@ant-design/icons';
import {i18nMessage} from "@/utils/i18n";


const resourceTypeOptions = [
  {text: '全部', value: '-1'},
  ...resourceTypes.map((i) => ({value: i}))
];

const resourceStatusOptions = [
  {text: '全部', value: '2'},
  {text: '已上线', value: '1'},
  {text: '已下线', value: '0'},
];

const navs = [
  {
    value: '1',
    text: '我的资源',
  },
  {
    value: '2',
    text: '我的收藏',
  },
];

interface FResourceCardsListProps {
  resourceType: string;
  resourceStatus: string;
  inputText: string;
  dataSource: any[];
  pageCurrent: number;
  pageSize: number;
  totalNum: number;
  onChangeResourceType?: (value: string) => void;
  onChangeResourceStatus?: (value: string) => void;
  onChangeInputText?: (value: string) => void;
  onChangePageCurrent?: (value: number) => void;
  onChangePageSize?: (value: number) => void;
  showGotoCreateBtn?: boolean;
  isCollect?: boolean;
  onBoomJuice?: (id: string | number, record: any, index: number) => void;
  onClickDetails?: (id: string | number, record: any, index: number) => void;
  onClickEditing?: (id: string | number, record: any, index: number) => void;
  onClickRevision?: (id: string | number, record: any, index: number) => void;
  onClickMore?: (id: string | number, record: any, index: number) => void;
}

export default function ({
                           resourceType, resourceStatus, inputText, dataSource, pageCurrent, pageSize, totalNum,
                           onChangeResourceType, onChangeResourceStatus, onChangeInputText, onChangePageCurrent, onChangePageSize,
                           showGotoCreateBtn = false, isCollect = false,
                           onBoomJuice, onClickDetails, onClickEditing, onClickRevision, onClickMore
                         }: FResourceCardsListProps) {

  const [typeText, setTypeText] = React.useState('');
  const [statusText, setStatusText] = React.useState('');


  React.useEffect(() => {
    const selectedType: any = resourceTypeOptions.find((i) => i.value === resourceType);
    setTypeText(selectedType?.text || selectedType?.value);
  }, [resourceType]);

  React.useEffect(() => {
    const selectedStatus: any = resourceStatusOptions.find((i) => i.value === resourceStatus);
    setStatusText(selectedStatus?.text || selectedStatus?.value);
  }, [resourceStatus]);

  function onChangeTab(value: '1' | '2') {
    if (value === '2') {
      return router.push('/resource/collect');
    }
  }

  return (<>
    <div className={styles.filter}>
      <div className={styles.filterLeft}>
        <div>
          <span>{i18nMessage('resource_type')}：</span>
          <Dropdown overlay={<FMenu
            options={resourceTypeOptions}
            onClick={(value) => onChangeResourceType && onChangeResourceType(value)}
          />}>
              <span style={{cursor: 'pointer'}}>{typeText}<DownOutlined
                style={{marginLeft: 8}}/></span>
          </Dropdown>
        </div>
        <div style={{marginLeft: 60}}>
          <span>{i18nMessage('resource_state')}：</span>
          <Dropdown overlay={<FMenu
            options={resourceStatusOptions}
            onClick={(value) => onChangeResourceStatus && onChangeResourceStatus(value)}
          />}>
            <span style={{cursor: 'pointer'}}>{statusText}<DownOutlined style={{marginLeft: 10}}/></span>
          </Dropdown>
        </div>

      </div>
      <div className={styles.filterRight}>
        <FInput
          value={inputText}
          debounce={300}
          allowClear={true}
          // onChange={(e) => onChangeInputText && onChangeInputText(e.target.value)}
          onDebounceChange={(value) => onChangeInputText && onChangeInputText(value)}
          theme="dark"
          className={styles.FInput}
          placeholder={i18nMessage('search_resource')}
        />
        {showGotoCreateBtn && <FNormalButton
          onClick={() => router.push('/resource/creator')}
          type="primary"
        >{i18nMessage('create_resource')}</FNormalButton>}
      </div>
    </div>

    <div className={styles.Content}>
      {
        dataSource.map((i: any, j: number) => (<FResourceCard
          key={i.id}
          resource={i}
          type={isCollect ? 'favorite' : 'resource'}
          className={styles.FResourceCard}
          onBoomJuice={() => onBoomJuice && onBoomJuice(i.id, i, j)}
          onClickDetails={() => onClickDetails && onClickDetails(i.id, i, j)}
          onClickEditing={() => onClickEditing && onClickEditing(i.id, i, j)}
          onClickRevision={() => onClickRevision && onClickRevision(i.id, i, j)}
          onClickMore={() => onClickMore && onClickMore(i.id, i, j)}
        />))
      }
      <div className={styles.bottomPadding}/>
      <div className={styles.bottomPadding}/>
      <div className={styles.bottomPadding}/>
      <div className={styles.bottomPadding}/>
    </div>
    {totalNum > 10 && <>
      <div style={{height: 10}}/>
      <FPagination
        current={pageCurrent}
        pageSize={pageSize}
        total={totalNum}
        onChangeCurrent={(value) => onChangePageCurrent && onChangePageCurrent(value)}
        onChangePageSize={(value) => onChangePageSize && onChangePageSize(value)}
        className={styles.FPagination}
      />
    </>}</>)
}
