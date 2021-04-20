import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import {Space, Popconfirm} from 'antd';
import {FCircleBtn, FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState} from '@/models/connect';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";
import {ChangeAction, FetchDataSourceAction, InitModelStatesAction} from "@/models/resourceInfo";
import {FPlus} from '@/components/FIcons';
import FLink from "@/components/FLink";
import FUtil from "@/utils";
import * as AHooks from 'ahooks';
import fMessage from "@/components/fMessage";
import fConfirmModal from "@/components/fConfirmModal";

interface SilderProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState;
  // resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
  match: {
    params: {
      id: string;
      version: string;
    };
  };
}

function Sider({resourceInfo, match, dispatch, route}: RouterTypes & SilderProps) {

  AHooks.useMount(() => {

  });
  // React.useEffect(() => {
  //   if (match.params.id === resourceInfo.info?.resourceId) {
  //     return;
  //   }
  //   dispatch<FetchDataSourceAction>({
  //     type: 'resourceInfo/fetchDataSource',
  //     payload: match.params.id,
  //   });
  //   // dispatch<FetchDraftAction>({
  //   //   type: 'resourceVersionCreatorPage/fetchDraft',
  //   //   payload: match.params.id,
  //   // });
  // }, [resourceInfo.info, match.params.id]);

  React.useEffect(() => {
    onChangeMatchParamsId();

    return () => {
      dispatch<InitModelStatesAction>({
        type: 'resourceInfo/initModelStates',
      });
    };
  }, [match.params.id]);

  async function onChangeMatchParamsId() {
    await dispatch<ChangeAction>({
      type: 'resourceInfo/change',
      payload: {
        resourceID: match.params.id,
      },
    });
    // dispatch<FetchDraftDataAction>({
    //   type: 'resourceInfo/fetchDraftData',
    // });
    dispatch<FetchDataSourceAction>({
      type: 'resourceInfo/fetchDataSource',
      payload: match.params.id,
    });
  }

  function gotoCreator() {
    // router.push(`/resource/${match.params.id}/version/creator`);
    router.push(FUtil.LinkTo.resourceCreateVersion({
      resourceID: match.params.id,
    }));
  }

  if (!resourceInfo.info) {
    return null;
  }

  return (<div className={styles.Sider}>
    <div style={{height: 40}}/>
    <div className={styles.header}>
      <FResourceCover
        src={resourceInfo.info?.coverImages.length > 0 ? resourceInfo.info?.coverImages[0] : ''}
        status={resourceInfo.info?.status === 1 ? 'online' : !!resourceInfo.info?.latestVersion ? 'offline' : 'unreleased'}
      />
      <div style={{height: 15}}/>
      <FLink
        to={FUtil.LinkTo.resourceDetails({
          resourceID: resourceInfo.info?.resourceId || '',
        })}
        className={styles.resourceName}
      >{resourceInfo.info?.resourceName}</FLink>
      <div style={{height: 10}}/>
      <label className={styles.label}>{resourceInfo.info.resourceType}</label>
    </div>
    <div style={{height: 35}}/>
    <div className={styles.radios}>
      <FLink
        className={[match.path === '/resource/:id/info' ? styles.activatedRadio : '', styles.radio].join(' ')}
        to={FUtil.LinkTo.resourceInfo({
          resourceID: match.params.id,
        })}
      >{FUtil.I18n.message('resource_information')}</FLink>
      <FLink
        className={[match.path === '/resource/:id/auth' ? styles.activatedRadio : '', styles.radio].join(' ')}
        to={FUtil.LinkTo.resourceAuth({
          resourceID: match.params.id,
        })}
      >
        <span>{FUtil.I18n.message('authorization_infomation')}</span>
        {resourceInfo.info?.policies.length === 0 && (<div className={styles.redDot}/>)}
      </FLink>
      <div className={styles.versionControl}>
        <div className={styles.versionControlTitle}>
          <div style={{cursor: 'default'}}>{FUtil.I18n.message('verions')}</div>
          {
            match.path === '/resource/:id/version/creator'
              ? (<FCircleBtn
                type="transparent"
                onClick={() => {
                  fMessage('正在创建版本', 'warning');
                }}/>)
              : resourceInfo.draftData
              ? (<FCircleBtn
                type="transparent"
                onClick={() => {
                  // fConfirmModal({
                  //   message: FUtil.I18n.message('error_unreleasedverionexisted'),
                  //   onOk: gotoCreator,
                  // });
                  fMessage(FUtil.I18n.message('error_unreleasedverionexisted'), 'warning');
                }}
              />)
              : (<FCircleBtn onClick={gotoCreator} type="transparent"/>)
          }
        </div>

        <div className={styles.versions}>

          {
            resourceInfo.draftData
              ? (<FLink
                className={[styles.version, match.path === '/resource/:id/version/creator' ? styles.activatedVersion : ''].join(' ')}
                to={FUtil.LinkTo.resourceCreateVersion({
                  resourceID: match.params.id,
                })}>{resourceInfo.draftData?.version || '未输入版本号'}（草稿）</FLink>)
              : match.path === '/resource/:id/version/creator'
              ? (<FLink
                className={[styles.version, match.path === '/resource/:id/version/creator' ? styles.activatedVersion : ''].join(' ')}
                to={FUtil.LinkTo.resourceCreateVersion({
                  resourceID: match.params.id,
                })}>{FUtil.I18n.message('unnamed_version')}</FLink>)
              : null
          }

          {
            [...resourceInfo.info?.resourceVersions].reverse().map((i) => (
              <FLink
                key={i.versionId}
                to={FUtil.LinkTo.resourceVersion({
                  resourceID: match.params.id,
                  version: i.version,
                })}
                className={[styles.version, (match.path === '/resource/:id/version/:version' && match.params.version === i.version) ? styles.activatedVersion : ''].join(' ')}
              >{i.version}</FLink>))
          }
        </div>
      </div>
    </div>
    <div style={{height: 40}}/>
  </div>)
}

export default withRouter(connect(({resourceInfo, resourceVersionCreatorPage}: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Sider))

