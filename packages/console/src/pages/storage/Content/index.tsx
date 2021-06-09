import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import {Space} from 'antd';
import FTable from '@/components/FTable';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {
  DeleteObjectAction,
  UploadFilesAction,
  ChangeAction as HomePageChangeAction,
  FetchObjectsAction,
} from '@/models/storageHomePage';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {FDelete, FEdit, FWarning} from "@/components/FIcons";
import FNoDataTip from "@/components/FNoDataTip";
import FUploadTasksPanel from "@/pages/storage/containers/FUploadTasksPanel";
import FUpload from "@/components/FUpload";
import {RcFile} from "antd/lib/upload/interface";
import FLoadingTip from "@/components/FLoadingTip";
import InfiniteScroll from 'react-infinite-scroller';
import FDownload from "@/components/FIcons/FDownload";
import {ColumnsType} from "antd/lib/table/interface";
import FTooltip from "@/components/FTooltip";
import FLink from "@/components/FLink";
import fConfirmModal from "@/components/fConfirmModal";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import {FApiServer} from "@/services";
import NoBucket from "@/pages/storage/NoBucket";

interface ContentProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Content({storageHomePage, dispatch}: ContentProps) {

  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  const columns: ColumnsType<NonNullable<StorageHomePageModelState['objectList']>[number]> = [
    {
      title: (<FTitleText type="table" text={FUtil1.I18n.message('object_name')}/>),
      dataIndex: 'name',
      key: 'name',
      render(text: any, record: any) {
        return (<Space size={10}>
          <FContentText type="normal" text={text}/>
          <div className={styles.hoverVisible}>
            <FCopyToClipboard
              text={`${storageHomePage.activatedBucket}/${text}`}
              title={FUtil1.I18n.message('copy_object_name')}
            />
          </div>
        </Space>);
      },
    },
    {
      title: '',
      dataIndex: 'tool',
      key: 'tool',
      width: 150,
      render(text: any, record) {
        return (<div className={styles.hoverVisible}>
          <ToolsBar
            bucketName={record.bucketName}
            objectID={record.id}
            showDelete={!isUserDataBucket}
            showEdit={!isUserDataBucket}
            onClickDownload={() => FApiServer.Storage.downloadObject({objectIdOrName: record.id})}
            onClickDelete={() => {
              fConfirmModal({
                message: '存储空间对象一旦删除则无法恢复，确认删除吗？',
                onOk() {
                  onClickDelete(record);
                },
              });
            }}
          />
        </div>);
      },
      // className: styles.columns,
    },
    {
      title: (<FTitleText type="table" text={FUtil1.I18n.message('resource_type')}/>),
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render(text: any, record: any) {
        if (!text) {
          return (<FContentText type="negative" text={'未设置类型'}/>);
        }
        return (<FContentText text={text}/>);
      },
      // className: styles.columns,
    },
    {
      title: (<FTitleText type="table" text={FUtil1.I18n.message('size')}/>),
      dataIndex: 'size',
      key: 'size',
      width: 120,
      // className: styles.columns,
      render(text: any, record: any): any {
        return (<FContentText type="normal" text={text}/>);
      }
    },
    {
      title: (<FTitleText type="table" text={FUtil1.I18n.message('last_updated_time')}/>),
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      // className: styles.columns,
      render(text: any, record: any): any {
        return (<FContentText type="normal" text={text}/>);
      }
    },
  ];

  function onClickDelete(record: any) {
    dispatch<DeleteObjectAction>({
      type: 'storageHomePage/deleteObject',
      payload: record.id,
    });
  }

  if (storageHomePage.bucketList?.length === 0) {
    return (<NoBucket/>);
  }

  return (<div>
    {
      storageHomePage.total === -1 && (<FLoadingTip height={'calc(100vh - 170px)'}/>)
    }

    {
      storageHomePage.total === 0 && (<>
        <FNoDataTip
          height={'calc(100vh - 170px)'}
          // tipText={'当前Bucket还没有上传任何对象'}
          tipText={FUtil1.I18n.message('objects_list_empty')}
          btn={<FUpload
            showUploadList={false}
            multiple={true}
            beforeUpload={(file: RcFile, fileList: RcFile[]) => {
              if (file === fileList[fileList.length - 1]) {
                dispatch<UploadFilesAction>({
                  type: 'storageHomePage/uploadFiles',
                  payload: fileList,
                });
              }
              return false;
            }}>
            <FRectBtn
              size="large"
              type="primary"
              style={{paddingLeft: 50, paddingRight: 50}}
            >{FUtil1.I18n.message('upload_object')}</FRectBtn>
          </FUpload>}
        />
      </>)
    }

    {
      storageHomePage.total > 0 && (<InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={() => {
          if (storageHomePage.isLoading || storageHomePage.total === -1) {
            return;
          }
          dispatch<HomePageChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              isLoading: true,
            },
          });
          dispatch<FetchObjectsAction>({
            type: 'storageHomePage/fetchObjects',
            payload: 'append',
          });
        }}
        hasMore={!storageHomePage.isLoading && storageHomePage.total !== -1 && storageHomePage.objectList.length < storageHomePage.total}
      >
        <div className={styles.body}>
          <FTable
            rowClassName={styles.rowClassName}
            columns={columns}
            dataSource={storageHomePage.objectList}
            pagination={false}
          />
        </div>
        {storageHomePage.isLoading && <div className={styles.loader} key={0}>Loading ...</div>}
      </InfiniteScroll>)
    }

    <FUploadTasksPanel/>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(Content);

interface ToolsBarProps {
  bucketName: string;
  objectID: string;
  showEdit?: boolean;
  showDownload?: boolean;
  showDelete?: boolean;

  onClickDownload?(): void;

  onClickDelete?(): void;
}

function ToolsBar({bucketName, objectID, showEdit = true, showDownload = true, showDelete = true, onClickDownload, onClickDelete}: ToolsBarProps) {
  return (<Space
    className={styles.toolBar}
    // style={{visibility: hoverRecord?.key !== record?.key ? 'visibility' : 'inherit'} as CSSProperties}
    size={25}>
    {
      showEdit && (<FTooltip title={FUtil1.I18n.message('tip_edit_object')}>
        <FLink to={FUtil.LinkTo.objectDetails({
          bucketName,
          objectID: objectID,
        })}><FEdit/></FLink>
      </FTooltip>)
    }
    {
      showDownload && (<FTooltip title={FUtil1.I18n.message('tip_download_object')}>
        <span>
          <FTextBtn
            onClick={() => onClickDownload && onClickDownload()}
            type="primary"
          ><FDownload/></FTextBtn>
        </span>
      </FTooltip>)
    }
    {
      showDelete && (
        <FTooltip title={FUtil1.I18n.message('tip_delete')}>
          <span>
            <FTextBtn
              onClick={() => onClickDelete && onClickDelete()}
              className={styles.Delete}
            ><FDelete/></FTextBtn>
          </span>
        </FTooltip>
      )
    }
  </Space>)
}
