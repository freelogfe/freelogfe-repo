import * as React from 'react';
import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FTitleText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {Space} from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FCustomProperties from '@/components/FCustomProperties';
import FDepPanel from '@/pages/resource/containers/FDepPanel';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceInfoModelState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction,
  CreateVersionAction, ImportPreVersionAction, ObjectAddDepsAction,
  SaveDraftAction,
} from '@/models/resourceVersionCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {withRouter} from 'umi';
import {i18nMessage} from '@/utils/i18n';
import RouterTypes from 'umi/routerTypes';
import * as semver from 'semver';

interface VersionCreatorProps {
  dispatch: Dispatch;
  version: ResourceVersionCreatorPageModelState,
  resource: ResourceInfoModelState,
  match: {
    params: {
      id: string;
    };
  };
}

function VersionCreator({dispatch, route, version, match, resource}: VersionCreatorProps & RouterTypes) {

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  function onClickCache() {
    dispatch<SaveDraftAction>({
      type: 'resourceVersionCreatorPage/saveDraft',
    });
  }

  function onClickCreate() {
    dispatch<CreateVersionAction>({
      type: 'resourceVersionCreatorPage/createVersion',
      payload: match.params.id,
    });
  }

  function onChange(payload: ChangeAction['payload']) {
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
    });
  }

  return (<FInfoLayout>
    <FContentLayout header={<Header
      onClickCreate={onClickCreate}
      onClickCache={onClickCache}
      disabledCreate={!!version.versionErrorText || !!version.resourceObjectErrorText}
    />}>
      <div className={styles.wrap}>
        <FEditorCard dot={true} title={i18nMessage('version_number')}>
          <FInput
            value={version.version}
            onChange={(e) => {
              onChange({version: e.target.value, versionErrorText: ''});
            }}
            className={styles.versionInput}
            errorText={version.versionErrorText}
          />
        </FEditorCard>

        <FEditorCard dot={true} title={i18nMessage('release_object')}>
          <FSelectObject
            resourceType={resource.info?.resourceType || ''}
            resourceObject={version.resourceObject}
            onChange={(value, deps) => {
              onChange({resourceObject: value, resourceObjectErrorText: ''});
              if (!deps || deps.length === 0) {
                return;
              }
              dispatch<ObjectAddDepsAction>({
                type: 'resourceVersionCreatorPage/objectAddDeps',
                payload: deps,
              });
            }}
            errorText={version.resourceObjectErrorText}
            onChangeErrorText={(text) => onChange({resourceObjectErrorText: text})}
          />
        </FEditorCard>

        <FEditorCard dot={false} title={i18nMessage('rely')}>
          <FDepPanel/>
        </FEditorCard>

        <FEditorCard dot={false} title={i18nMessage('object_property')}>
          <FCustomProperties
            stubborn={false}
            dataSource={version.properties}
            onChange={(value) => onChange({properties: value})}
            onImport={() => dispatch<ImportPreVersionAction>({
              type: 'resourceVersionCreatorPage/importPreVersion',
            })}
          />
        </FEditorCard>

        <FEditorCard dot={false} title={i18nMessage('version_description')}>
          <FBraftEditor
            value={version.description}
            onChange={(value) => onChange({description: value})}
          />
        </FEditorCard>
      </div>
    </FContentLayout>
  </FInfoLayout>);
}


//CreateVersionAction

interface HeaderProps {
  onClickCache: () => void;
  onClickCreate: () => void;
  disabledCreate?: boolean;
}

function Header({onClickCache, onClickCreate, disabledCreate = false}: HeaderProps) {
  return (<div className={styles.Header}>
    <FTitleText text={i18nMessage('create_new_version')} type={'h2'}/>

    <Space size={30}>
      <FTextButton onClick={onClickCache}>{i18nMessage('save_as_draft')}</FTextButton>
      <FNormalButton
        style={{width: 108}}
        onClick={onClickCreate}
        disabled={disabledCreate}
      >{i18nMessage('release_to_market')}</FNormalButton>
    </Space>
  </div>);
}

export default withRouter(connect(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
  version: resourceVersionCreatorPage,
  resource: resourceInfo,
}))(VersionCreator));
