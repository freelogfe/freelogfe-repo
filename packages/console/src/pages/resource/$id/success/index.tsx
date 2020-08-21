import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";
import {i18nMessage} from "@/utils/i18n";
import {ChangeAction} from "@/models/global";
import {Dispatch,connect} from "dva";

interface SuccessProps {
  dispatch: Dispatch;
  match: {
    params: {
      id: string;
    };
  };
}

function Success({match, route, dispatch}: RouterTypes & SuccessProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  function goto() {
    // /resource/:id/version/creator
    router.replace(`/resource/${match.params.id}/version/creator`)
  }

  return (<FCenterLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'}/>
      <div style={{height: 20}}/>
      <FTipText type={'secondary'} text={i18nMessage('resource_created_successfully')}/>
      <div style={{height: 40}}/>
      <FTipText type={'modal'} text={i18nMessage('hint_create_1st_version')}/>
      <div style={{height: 20}}/>
      <FNormalButton onClick={goto}>{i18nMessage('create_first_version')}</FNormalButton>
    </div>
  </FCenterLayout>)
}

export default withRouter(connect()(Success));
