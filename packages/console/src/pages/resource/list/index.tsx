import * as React from 'react';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {router, RouterTypes, withRouter} from 'umi';
import Resources from "./Resources";
import Collects from "./Collects";
import {RouteComponentProps} from "react-router";
import {i18nMessage} from "@/utils/i18n";
import {ChangeAction} from "@/models/global";
import {Dispatch, connect} from "dva";

const navs = [
  {
    value: '1',
    text: i18nMessage('my_resources'),
  },
  {
    value: '2',
    text: i18nMessage('my_collections'),
  },
];

interface ListProps extends RouteComponentProps {
  dispatch: Dispatch;
}

function List({match, dispatch, route}: ListProps & RouterTypes) {
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
    setTabValue(match.path === '/resource/list' ? '1' : '2')
  }, [match.path]);

  function onChangeTab(value: '1' | '2') {
    if (value === '1') {
      return router.push('/resource/list');
    }
    if (value === '2') {
      return router.push('/resource/collect');
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        value={tabValue}
        options={navs}
        onChange={onChangeTab}
      />

      {tabValue === '1' ? <Resources/> : null}
      {tabValue === '2' ? <Collects/> : null}

    </FCenterLayout>
  );
}

export default withRouter(connect()(List));
