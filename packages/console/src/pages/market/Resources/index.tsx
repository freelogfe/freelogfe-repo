import * as React from 'react';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketPageModelState} from '@/models/connect';
import styles from '@/pages/market/index.less';
import {ChangeStatesAction} from '@/models/marketPage';
import FInput from '@/components/FInput';
import FResourceCard from '@/components/FResourceCard';
import {Button} from 'antd';
import {resourceTypes} from '@/utils/globals';

const filters = [{
  value: '-1',
  text: '全部类型'
}, ...resourceTypes.map((i) => ({value: i}))];

interface ResourcesProps {
  dispatch: Dispatch;
  market: MarketPageModelState,
}

function Resources({dispatch, market}: ResourcesProps) {
  return (<>
    <div style={{height: 30}}/>
    <div className={styles.filter}>
      <Labels
        options={filters}
        value={market.resourceType}
        onChange={(value) => dispatch<ChangeStatesAction>({
          type: 'marketPage/changeStates',
          payload: {resourceType: value as string},
        })}
      />
      <FInput
        value={market.inputText}
        onChange={(e) => dispatch<ChangeStatesAction>({
          type: 'marketPage/changeStates',
          payload: {inputText: e.target.value},
        })}
        theme="dark"
        size="small"
        className={styles.filterInput}
      />
    </div>

    <div style={{height: 30}}/>

    <div className={styles.Content}>
      {
        market.dataSource.map((resource: any) => (
          <FResourceCard
            key={resource.id}
            resource={resource}
            className={styles.FResourceCard}
          />))
      }

      <div className={styles.bottomPadding}/>
      <div className={styles.bottomPadding}/>
      <div className={styles.bottomPadding}/>
      <div className={styles.bottomPadding}/>
    </div>


    {
      market.totalItem > (20 * market.pageCurrent) && (<>
        <div style={{height: 100}}/>
        <div className={styles.bottom}>
          <Button
            className={styles.loadMore}
            onClick={() => dispatch<ChangeStatesAction>({
              type: 'marketPage/changeStates',
              payload: {
                pageCurrent: market.pageCurrent + 1,
              },
            })}
          >加载更多</Button>
        </div>
      </>)
    }

  </>)
}

export default connect(({marketPage}: ConnectState) => ({
  market: marketPage,
}))(Resources);

interface Labels {
  options: {
    value: string | number;
    text?: string | number;
  }[];
  value: string | number;
  onChange?: (value: string | number) => void;
}

function Labels({options, value, onChange}: Labels) {
  return (<div>
    {
      options.map((i, j) => (
        <a key={i.value}
           className={styles.filterTag + ' ' + (i.value === value ? styles.filterTagActive : '')}
           onClick={() => onChange && onChange(i.value)}
        >{i.text || i.value}</a>))
    }
  </div>)
}
