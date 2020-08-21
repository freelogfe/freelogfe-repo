import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, CloseCircleFilled} from '@ant-design/icons';
import VersionPopover from './VersionPopover';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  DeleteDependencyByIDAction,
  DepResources,
  OnChangeDepActivatedIDAction,
  OnChangeDependenciesByIDAction
} from '@/models/resourceVersionCreatorPage';
import {i18nMessage} from '@/utils/i18n';

export interface ResourcesProps {
  // readonly dataSource: FDepPanelProps['dataSource'];
  // readonly activatedID: string | number;
  // readonly onClick?: (resourceID: string | number) => void;
  // readonly onChange?: (resource: ResourcesProps['dataSource'][0]) => void;
  // readonly onDelete?: (resourceID: string | number) => void;
  dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

type T = DepResources[0];

interface DataS extends T {
  unresolved: DepResources;
}

function Resources({creator: {depRelationship, dependencies, depActivatedID}, dispatch}: ResourcesProps) {

  React.useEffect(() => {
    if (!dependencies.map((i) => i.id).includes(depActivatedID)) {
      if (depRelationship.length > 0) {
        onChangeResourcesActivated(depRelationship[0].id);
      } else {
        onChangeResourcesActivated('');
      }
    }
  }, [depActivatedID, depRelationship, onChangeResourcesActivated]);

  const dataSource: DataS[] = depRelationship.map((i) => {
    return {
      ...(dependencies.find((j) => j.id === i.id) as DepResources[number]),
      unresolved: i.children.map((k) => {
        return dependencies.find((l) => k.id === l.id) as DepResources[number];
      })
    }
  });

  // console.log(dataSource, 'dataSourcedsssssdataSourcedataSource#@#@#@#@#');

  function onChangeVersion(version: DepResources[number]['version'], id: DepResources[number]['id']) {
    dispatch<OnChangeDependenciesByIDAction>({
      type: 'resourceVersionCreatorPage/onChangeDependenciesByID',
      id,
      payload: {
        version,
      }
    });
  }

  function onChangeResourcesActivated(id: DepResources[number]['id']) {
    dispatch<OnChangeDepActivatedIDAction>({
      type: 'resourceVersionCreatorPage/onChangeDepActivatedID',
      payload: id,
    });
  }

  function onDeleteResource(id: DepResources[number]['id']) {

    dispatch<DeleteDependencyByIDAction>({
      type: 'resourceVersionCreatorPage/deleteDependencyByID',
      payload: id,
    });
    // return onChange && onChange();
  }

  return <div className={styles.styles}>
    {dataSource?.map((i) => {
        if (!i?.version) {
          return null;
        }
        return (<div key={i.id}>
          <div
            onClick={() => onChangeResourcesActivated(i.id)}
            className={styles.DepPanelNav + ' ' + (i.id === depActivatedID ? styles.DepPanelNavActive : '')}>
            <div>
              <div className={styles.title}>
                <FContentText text={i.title}/>
                {i.status !== 1 && <CloseCircleFilled className={styles.titleErrorIcon}/>}
              </div>
              <div style={{height: 9}}/>
              <FContentText type="additional2">
                <div>{i.resourceType} | {i.versions.length === 0 ? <span
                    style={{paddingRight: 5}}>暂无版本</span>
                  : <>
                    <span
                      style={{paddingRight: 5}}>{i18nMessage('version_range')}：{i?.version?.isCustom ? i.version.input : ((i.version?.allowUpdate ? '^' : '') + i.version.select)}</span>
                    <VersionPopover
                      versions={i.versions}
                      onChange={(version) => onChangeVersion(version, i.id)}
                      defaultVersion={i.version}><EditOutlined/></VersionPopover>
                  </>
                }
                </div>
              </FContentText>
              <>
                <div style={{height: 5}}/>
                <div className={styles.DepPanelLabels}>
                  {
                    !i.upthrow && [...i.enableReuseContracts, ...i.enabledPolicies]
                      .filter((k) => k.checked)
                      .map((j) => (<label
                        key={j.id}
                        className={styles.labelInfo}
                      >{j.title}</label>))
                  }
                  {
                    i.upthrow && (<label
                      className={styles.labelError}
                    >上抛</label>)
                  }
                </div>
              </>
            </div>
            <FCircleButton
              onClick={(e) => {
                e.stopPropagation();
                return onDeleteResource(i.id)
              }}
              theme='delete'
            />
          </div>

          <SmallNav
            dataSource={i.unresolved || []}
            activatedID={depActivatedID}
            onClick={onChangeResourcesActivated}
          />

        </div>);
      }
    )}
  </div>
}

interface SmallNavProps {
  dataSource: DepResources;
  activatedID: string | number;
  readonly onClick?: (resourceID: DepResources[number]['id']) => void;
}

function SmallNav({dataSource, activatedID, onClick}: SmallNavProps) {
  if (dataSource.length === 0) {
    return null;
  }

  return (<div className={styles.children}>
    <div style={{padding: '5px 0 5px 20px'}}>
      <FContentText
        type="additional2"
        // text={'此资源存在以下基础上抛'}
        text={i18nMessage('upcast')}
      />
    </div>
    {
      dataSource.map((i) => (
        <div
          key={i.id}
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(i.id);
          }}
          className={styles.childrenDepPanelNav + ' ' + (activatedID === i.id ? styles.DepPanelNavActive : '')}>
          <FContentText text={i.title}/>
          <div style={{height: 5}}/>
          <FContentText type="additional2">
            <div>{i.resourceType}</div>
          </FContentText>
          <>
            <div style={{height: 5}}/>
            <div className={styles.DepPanelLabels}>
              {
                !i.upthrow && [...i.enableReuseContracts, ...i.enabledPolicies]
                  .filter((k) => k.checked)
                  .map((j) => (<label
                    key={j.id}
                    className={styles.labelInfo}
                  >{j.title}</label>))
              }
              {/*{i18nMessage('info_upcast')}*/}
              {
                i.upthrow && (<label
                  className={styles.labelError}
                >上抛</label>)
              }
            </div>
          </>
        </div>))
    }

  </div>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(Resources);
