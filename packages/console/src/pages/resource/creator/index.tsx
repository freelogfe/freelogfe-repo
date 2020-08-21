import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {FTitleText, FContentText, FTipText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import {FNormalButton, FTextButton} from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {Space, AutoComplete} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceCreatorPageModelState, UserModelState} from '@/models/connect';
import {
  OnCreateAction,ChangeAction,
} from '@/models/resourceCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import FAutoComplete from '@/components/FAutoComplete';
import {i18nMessage} from '@/utils/i18n';
import {RouterTypes} from 'umi';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resource: ResourceCreatorPageModelState;
  user: UserModelState;
}

const resourceTypes = ['json', 'widget', 'image', 'audio', 'markdown', 'page_build', 'reveal_slide', 'license', 'video', 'catalog'].map((i: string) => ({value: i}));


function ResourceCreator({dispatch, route, resource, user}: ResourceCreatorProps & RouterTypes) {

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  function onClickCreate() {
    dispatch<OnCreateAction>({
      type: 'resourceCreatorPage/create',
    });
  }

  function onChange(payload: ChangeAction['payload']) {
    dispatch<ChangeAction>({
      type: 'resourceCreatorPage/change',
      payload,
    })
  }

  return (<FCenterLayout>
    <FContentLayout header={<Header
      disabled={!!resource.nameErrorText || !!resource.resourceTypeErrorText}
      onClickCreate={onClickCreate}
    />}>
      <div className={styles.workspace}>
        <FEditorCard title={i18nMessage('resource_name')} dot={true}>
          <div className={styles.resourceName}>
            <FContentText text={`${user.info?.username} /`}/>
            &nbsp;
            <FInput
              errorText={resource.nameErrorText}
              value={resource.name}
              onChange={(e) => onChange({
                name: e.target.value,
                nameErrorText: '',
              })}
              className={styles.FInput}
              placeholder={i18nMessage('hint_enter_resource_name')}
              suffix={<span className={styles.FInputWordCount}>{resource.name.length}</span>}
            />
          </div>
        </FEditorCard>

        <FEditorCard title={i18nMessage('resource_type')} dot={true}>
          <FAutoComplete
            errorText={resource.resourceTypeErrorText}
            value={resource.resourceType}
            onChange={(value) => onChange({
              resourceType: value,
              resourceTypeErrorText: '',
            })}
            className={styles.FSelect}
            placeholder={i18nMessage('hint_choose_resource_type')}
            options={resourceTypes}
          />
        </FEditorCard>

        <FEditorCard title={i18nMessage('resource_short_description')}>
          <FIntroductionEditor
            value={resource.introduction}
            onChange={(e) => onChange({
              introduction: e.target.value
            })}
            placeholder={i18nMessage('hint_enter_resource_short_description')}
          />
        </FEditorCard>

        <FEditorCard title={i18nMessage('resource_image')}>
          <FUploadResourceCover
            value={resource.cover}
            onChange={(value) => onChange({
              cover: value
            })}
          />
        </FEditorCard>

        <FEditorCard title={i18nMessage('resource_tag')}>
          <FLabelEditor
            values={resource.labels}
            onChange={(value) => onChange({
              labels: value,
            })}
          />
        </FEditorCard>
      </div>
    </FContentLayout>
  </FCenterLayout>);
}

interface HeaderProps {
  onClickCreate: () => void;
  disabled?: boolean;
}

function Header({onClickCreate, disabled = false}: HeaderProps) {
  return (<div className={styles.Header}>
    <FTitleText text={i18nMessage('create_resource')} type={'h2'}/>

    <Space size={30}>
      {/*<FTextButton onClick={onClickCache}>暂存草稿</FTextButton>*/}
      <FNormalButton
        onClick={onClickCreate}
        style={{width: 108}}
        disabled={disabled}
      >{i18nMessage('create')}</FNormalButton>
    </Space>
  </div>);
}

export default connect(({resourceCreatorPage, user}: ConnectState) => ({
  resource: resourceCreatorPage,
  user: user,
}))(ResourceCreator);
