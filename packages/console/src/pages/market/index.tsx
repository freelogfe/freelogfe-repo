import React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {router, withRouter} from 'umi';
import Resources from "./Resources";
import Examples from "@/pages/market/Examples";
import {RouteComponentProps} from "react-router";
import {connect, Dispatch} from "dva";
import {ChangeAction} from "@/models/global";

const navs = [
  {
    value: '1',
    text: '资源市场',
  },
  {
    value: '2',
    text: '示例节点',
  },
];


interface MarketProps extends RouteComponentProps {
  dispatch: Dispatch;
  route: any;
}

function Market({dispatch, match, history, location, route, ...props}: MarketProps) {

  const [tabValue, setTabValue] = React.useState<'1' | '2'>(match.path === '/resource/list' ? '1' : '2');

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  React.useEffect(() => {
    setTabValue(match.path === '/market' ? '1' : '2')
  }, [match.path]);

  function onChangeTab(value: '1' | '2') {
    if (value === '1' && tabValue !== '1') {
      return router.push('/market');
    }
    if (value === '2' && tabValue !== '2') {
      return router.push('/example');
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        options={navs}
        value={tabValue}
        // onChange={(value) => dispatch<OnChangeTabValueAction>({type: 'marketPage/onChangeTabValue', payload: value})}
        onChange={onChangeTab}
      />
      {tabValue === '1' && <Resources/>}
      {tabValue === '2' && <Examples/>}

    </FCenterLayout>
  );
}


export default withRouter(connect()(Market));

