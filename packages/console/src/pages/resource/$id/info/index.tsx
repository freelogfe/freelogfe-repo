import * as React from 'react';
import styles from './index.less';
import FEditorCard from '@/components/FEditorCard';
import {FContentText, FTitleText} from '@/components/FText';
import {Space} from 'antd';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import FHorn from '@/pages/resource/components/FHorn';
import {FCircleButton, FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState, ResourceInfoPageModelState, UserModelState} from '@/models/connect';
import {OnChangeInfoAction, ChangeAction, InitModelStatesAction} from "@/models/resourceInfoPage";
import {i18nMessage} from "@/utils/i18n";
import {ChangeAction as GlobalChangeAction} from "@/models/global";
import {router, RouterTypes} from "umi";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";
import FBlock from "@/layouts/FFormLayout/FBlock";
import FNoDataTip from "@/components/FNoDataTip";
import {match} from "path-to-regexp";

interface InfoProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState,
  resourceInfoPage: ResourceInfoPageModelState,
  user: UserModelState;

  match: {
    params: {
      id: string;
    };
  };
}

function Info({dispatch, route, resourceInfoPage, resourceInfo, user, match}: InfoProps & RouterTypes) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 70);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 70);
  }

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });

    dispatch<ChangeAction>({
      type: 'resourceInfoPage/change',
      payload: {
        resourceID: match.params.id,
      },
    });

    return () => {
      dispatch<InitModelStatesAction>({
        type: 'resourceInfoPage/initModelStates',
      });
    };
  }, [route]);

  // React.useEffect(() => {
  //
  // }, []);

  // React.useEffect(() => {
  //   // setEditorText(info?.intro || '');
  //   dispatch<ChangeAction>({
  //     type: 'resourceInfoPage/change',
  //     payload: {
  //       editorText: info?.intro || '',
  //     },
  //   })
  // }, [info]);

  function onChangeIsEditing(bool: boolean) {
    // console.log(bool, '0293jdsfl;kjf;lasd');
    // console.log(info?.intro, 'info?.intro');
    dispatch<ChangeAction>({
      type: 'resourceInfoPage/change',
      payload: {
        editorText: bool ? resourceInfo.info?.intro : '',
        isEditing: bool,
        introductionErrorText: '',
      },
    });
  }

  // if (!resourceInfo.hasPermission) {
  //   return (<div>
  //     <FNoDataTip
  //       height={minHeight}
  //       tipText={'403,没权限访问'}
  //       btnText={'将前往首页'}
  //       onClick={() => {
  //         router.replace('/');
  //       }}
  //     />
  //   </div>);
  // }

  return (
    <FLeftSiderLayout
      sider={<Sider/>}
      header={<FTitleText
        text={i18nMessage('resource_information')}
        type="h1"
      />}
    >
      {resourceInfo.info && <FFormLayout>
        {/*<div className={styles.styles}>*/}
        <FFormLayout.FBlock title={i18nMessage('resource_name')}>
          <FContentText text={resourceInfo.info?.resourceName}/>
        </FFormLayout.FBlock>
        <FEditorCard title={i18nMessage('resource_type')}>
          <FContentText text={resourceInfo.info.resourceType}/>
        </FEditorCard>
        <FFormLayout.FBlock title={i18nMessage('resource_short_description')}>

          {
            !resourceInfo.info?.intro && !resourceInfoPage.isEditing && (<Space size={10}>
              <FCircleButton
                onClick={() => onChangeIsEditing(true)}
                theme="weaken"
              />
              <FContentText text={i18nMessage('resource_short_description')}/>
            </Space>)}

          <FHorn className={styles.about} extra={<>
            {
              resourceInfoPage.isEditing
                ? (<Space size={10}>
                  <FTextButton
                    onClick={() => onChangeIsEditing(false)}
                  >{i18nMessage('cancel')}</FTextButton>
                  <FTextButton
                    theme="primary"
                    disabled={!!resourceInfoPage.introductionErrorText}
                    onClick={() => {
                      onChangeIsEditing(false);
                      dispatch<OnChangeInfoAction>({
                        type: 'resourceInfoPage/onChangeInfo',
                        // payload: {intro: resourceInfoPage.editor},
                        payload: {intro: resourceInfoPage.editorText},
                        id: resourceInfo.info?.resourceId || '',
                      });
                    }}
                  >{i18nMessage('save')}</FTextButton>
                </Space>)
                : resourceInfo.info?.intro
                ? <FTextButton
                  theme="primary"
                  onClick={() => onChangeIsEditing(true)}
                >{i18nMessage('edit')}</FTextButton>
                : null}
          </>}>

            {
              resourceInfoPage.isEditing
                ? (<FIntroductionEditor
                  value={resourceInfoPage.editorText}
                  errorText={resourceInfoPage.introductionErrorText}
                  onChange={(e) => dispatch<ChangeAction>({
                    type: 'resourceInfoPage/change',
                    payload: {
                      editorText: e.target.value,
                      introductionErrorText: e.target.value.length > 1000 ? '不多于1000个字符' : '',
                    },
                  })}
                />)
                : resourceInfo.info?.intro ? (<div className={styles.aboutPanel}>
                  <FContentText text={resourceInfo.info?.intro}/>
                </div>) : null}
          </FHorn>

        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={i18nMessage('resource_image')}>
          <FUploadResourceCover
            value={resourceInfo.info?.coverImages.length > 0 ? resourceInfo.info?.coverImages[0] : ''}
            // onChange={(value) => dispatch<OnChangeCoverAction>({
            //   type: 'resourceInfoPage/onChangeCover',
            //   payload: value,
            // })}
            onChange={(value) => dispatch<OnChangeInfoAction>({
              type: 'resourceInfoPage/onChangeInfo',
              payload: {coverImages: [value]},
              id: resourceInfo.info?.resourceId || ''
            })}
          />
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={i18nMessage('resource_tag')}>
          <FLabelEditor
            values={resourceInfo.info?.tags}
            // onChange={(value) => dispatch<OnChangeLabelsAction>({
            //   type: 'resourceInfoPage/onChangeLabels',
            //   payload: value,
            // })}
            onChange={(value) => dispatch<OnChangeInfoAction>({
              type: 'resourceInfoPage/onChangeInfo',
              payload: {tags: value},
              id: resourceInfo.info?.resourceId || '',
            })}
          />
        </FFormLayout.FBlock>
      </FFormLayout>}
    </FLeftSiderLayout>)
}

export default connect(({resourceInfo, resourceInfoPage, user}: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceInfoPage: resourceInfoPage,
  user: user,
}))(Info);

//has permission
