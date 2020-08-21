import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import {FContentText} from '@/components/FText';
import {Space} from 'antd';
import {FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";
import {FetchDataSourceAction} from "@/models/resourceInfo";
import {FetchDraftAction} from "@/models/resourceVersionCreatorPage";
import {i18nMessage} from "@/utils/i18n";

interface SilderProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
  match: {
    params: {
      id: string;
      version: string;
    };
  };
}

function Sider({resourceInfo: {info}, resourceVersionCreatorPage: {draftData}, match, dispatch}: RouterTypes & SilderProps) {
  // console.log(match, 'props');

  React.useEffect(() => {
    if (match.params.id === info?.resourceId) {
      return;
    }
    dispatch<FetchDataSourceAction>({
      type: 'resourceInfo/fetchDataSource',
      payload: match.params.id,
    });
    dispatch<FetchDraftAction>({
      type: 'resourceVersionCreatorPage/fetchDraft',
      payload: match.params.id,
    });
  }, [dispatch, info, match.params.id]);


  function gotoCreator() {
    router.push(`/resource/${match.params.id}/version/creator`);
  }

  if (!info) {
    return null;
  }

  return (<div className={styles.Sider}>
    <FResourceCover
      src={info?.coverImages.length > 0 ? info?.coverImages[0] : ''}
      status={info?.status === 1 ? 'online' : 'stopped'}
    />
    <div style={{height: 15}}/>
    <FContentText className={styles.breakWord} text={info?.resourceName}/>
    <div style={{height: 10}}/>
    <label className={styles.label}>{info.resourceType}</label>
    <div style={{height: 15}}/>
    <div className={styles.radios}>
      <div style={{height: 20}}/>
      <Space className={styles.Space} size={16} direction="vertical">
        <div className={styles.radio}>
          <a
            className={match.path === '/resource/:id/info' ? styles.activatedRadio : ''}
            onClick={() => router.push(`/resource/${match.params.id}/info`)}
          >{i18nMessage('resource_information')}</a>
        </div>
        <div className={styles.radio}>
          <a
            className={match.path === '/resource/:id/auth' ? styles.activatedRadio : ''}
            onClick={() => router.push(`/resource/${match.params.id}/auth`)}
          >{i18nMessage('authorization_infomation')}</a>
        </div>

        <div className={styles.radio}>
          <a>{i18nMessage('verions')}</a>
          <FTextButton onClick={gotoCreator}><i
            className="freelog fl-icon-add"/></FTextButton>
        </div>

        <Space size={16} direction="vertical" className={styles.versions + ' ' + styles.Space}>
          {
            match.path === '/resource/:id/version/creator'
              ? (
                <div className={styles.radio + ' ' + styles.smallVersion}>
                  {/*<a className={styles.activatedRadio}>{i18nMessage('unamed_version')}</a>*/}
                  <a className={styles.activatedRadio}>正在创建版本</a>
                </div>)
              : (draftData && (<div className={styles.radio + ' ' + styles.smallVersion}>
                <a onClick={gotoCreator}>{draftData.version || '未输入版本号'}（草稿）</a>
              </div>))
          }

          {
            [...info?.resourceVersions].reverse().map((i) => (
              <div key={i.versionId} className={styles.radio + ' ' + styles.smallVersion}>
                <a
                  onClick={() => router.push(`/resource/${match.params.id}/version/${i.version}`)}
                  className={(match.path === '/resource/:id/version/:version' && match.params.version === i.version) ? styles.activatedRadio : ''}
                >{i.version}</a>
              </div>))
          }
        </Space>
      </Space>
    </div>
  </div>)
}

export default withRouter(connect(({resourceInfo, resourceVersionCreatorPage}: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Sider))

