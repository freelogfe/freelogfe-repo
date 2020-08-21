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
import {ConnectState, ResourceInfoModelState, ResourceInfoPageModelState} from '@/models/connect';
import {
  OnChangeInfoAction,
} from "@/models/resourceInfoPage";
import {i18nMessage} from "@/utils/i18n";
import {ChangeAction} from "@/models/global";
import {RouterTypes} from "umi";

interface InfoProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState,
  resourceInfoPage: ResourceInfoPageModelState,
}

function Info({dispatch, route, resourceInfoPage, resourceInfo: {info}}: InfoProps & RouterTypes) {

  const [editorText, setEditorText] = React.useState<string>('');
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  React.useEffect(() => {
    setEditorText(info?.intro || '');
  }, [info]);

  function onChangeIsEditing(bool: boolean) {
    setIsEditing(bool)
  }

  return (<FInfoLayout>
    {info && <FContentLayout header={<FTitleText text={i18nMessage('resource_information')} type={'h2'}/>}>
      <FEditorCard title={i18nMessage('resource_name')}>
        <FContentText text={info?.resourceName}/>
      </FEditorCard>
      <FEditorCard title={i18nMessage('resource_type')}>
        <FContentText text={info.resourceType}/>
      </FEditorCard>
      {/*{info?.baseUpcastResources.length > 0 && <FEditorCard title={'基础上抛'}>*/}
      {/*  <div className={styles.upthrow}>*/}
      {/*    {*/}
      {/*      info?.baseUpcastResources.map((i) => <label key={i.resourceId}>{i.resourceName}</label>)*/}
      {/*    }*/}
      {/*  </div>*/}
      {/*</FEditorCard>}*/}
      <FEditorCard title={i18nMessage('resource_short_description')}>

        {!info?.intro && !isEditing && (<Space size={10}>
          <FCircleButton
            onClick={() => onChangeIsEditing(true)}
            theme="weaken"
          />
          <FContentText text={i18nMessage('resource_short_description')}/>
        </Space>)}

        <FHorn className={styles.about} extra={<>
          {isEditing
            ? (<Space size={10}>
              <FTextButton
                onClick={() => onChangeIsEditing(false)}
              >{i18nMessage('cancel')}</FTextButton>
              <FTextButton
                theme="primary"
                onClick={() => {
                  onChangeIsEditing(false);
                  dispatch<OnChangeInfoAction>({
                    type: 'resourceInfoPage/onChangeInfo',
                    // payload: {intro: resourceInfoPage.editor},
                    payload: {intro: editorText},
                    id: info?.resourceId,
                  });
                }}
              >{i18nMessage('save')}</FTextButton>
            </Space>)
            : info?.intro ? <FTextButton
              theme="primary"
              onClick={() => onChangeIsEditing(true)}
            >{i18nMessage('edit')}</FTextButton> : null}
        </>}>

          {isEditing
            ? (<FIntroductionEditor
              // value={resourceInfoPage.editor}
              value={editorText}
              // onChange={(e) => dispatch<OnChangeEditorAction>({
              //   type: 'resourceInfoPage/onChangeEditor',
              //   payload: e.target.value,
              // })}
              onChange={(e) => setEditorText(e.target.value)}
              // onBlur={() => onChangeIsEditing(false)}
            />)
            : info?.intro ? (<div className={styles.aboutPanel}>
              <FContentText text={info?.intro}/>
            </div>) : null}
        </FHorn>

      </FEditorCard>
      <FEditorCard title={i18nMessage('resource_image')}>
        <FUploadResourceCover
          value={info?.coverImages.length > 0 ? info?.coverImages[0] : ''}
          // onChange={(value) => dispatch<OnChangeCoverAction>({
          //   type: 'resourceInfoPage/onChangeCover',
          //   payload: value,
          // })}
          onChange={(value) => dispatch<OnChangeInfoAction>({
            type: 'resourceInfoPage/onChangeInfo',
            payload: {coverImages: [value]},
            id: info?.resourceId,
          })}
        />
      </FEditorCard>
      <FEditorCard title={i18nMessage('resource_tag')}>
        <FLabelEditor
          values={info?.tags}
          // onChange={(value) => dispatch<OnChangeLabelsAction>({
          //   type: 'resourceInfoPage/onChangeLabels',
          //   payload: value,
          // })}
          onChange={(value) => dispatch<OnChangeInfoAction>({
            type: 'resourceInfoPage/onChangeInfo',
            payload: {tags: value},
            id: info?.resourceId,
          })}
        />
      </FEditorCard>
    </FContentLayout>}
  </FInfoLayout>)
}

export default connect(({resourceInfo, resourceInfoPage}: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceInfoPage: resourceInfoPage,
}))(Info);
