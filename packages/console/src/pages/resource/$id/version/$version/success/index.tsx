import * as React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import {FTipText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {withRouter, router} from "umi";
import FCenterLayout from "@/layouts/FCenterLayout";
import {i18nMessage} from "@/utils/i18n";
import {useInterval} from 'ahooks';
import {ChangeAction} from "@/models/global";
import {connect, Dispatch} from 'dva';
import RouterTypes from "umi/routerTypes";

interface SuccessProps {
  match: {
    params: {
      id: string;
      version: string;

    };
    url: string;
  };
  dispatch: Dispatch;
}

// let clear: any = null;
// let timeV: number = 3;

function Success({match, route, dispatch}: SuccessProps & RouterTypes) {

  const [count, setCount] = React.useState<number>(3);
  useInterval(() => {
    const c = count - 1;
    setCount(c);
    if (c === 0) {
      goto();
    }
  }, 1000);

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  // console.log(match, 'SSSSSSAAAAA');
  // const [time, setTime] = React.useState<number>(timeV);

  // React.useEffect(() => {
  //   clear = setInterval(() => {
  //     console.log(time, 'EEEEE');
  //     timeV--;
  //     setTime(timeV);
  //     if (timeV === 0) {
  //       goto();
  //     }
  //
  //   }, 1000);
  //   return function () {
  //     clearInterval(clear);
  //     clear = null;
  //     timeV = 3;
  //   }
  // }, [goto, time]);

  function goto() {

    return router.replace(match.url.replace('/success', ''));
  }

  return (<FCenterLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'}/>
      <div style={{height: 20}}/>
      {/*<FTipText type={'secondary'} text={`版本 ${match.params.version} 创建成功`}/>*/}
      <FTipText type={'secondary'}
                text={i18nMessage('version_created_successfully', {VersionNumber: match.params.version})}/>
      <div style={{height: 40}}/>
      <div className={styles.goto}>
        <FTipText type={'modal'} text={i18nMessage('jump_to_version_edit', {timer: count})}/>
        <div style={{width: 10}}/>
        <FTextButton
          theme={'primary'}
          onClick={goto}
        >{i18nMessage('jump_now')}</FTextButton>
      </div>
    </div>
  </FCenterLayout>)
}


export default withRouter(connect()(Success));
