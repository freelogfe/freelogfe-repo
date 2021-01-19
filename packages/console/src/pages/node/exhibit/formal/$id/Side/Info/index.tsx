import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import FUploadImage from "@/components/FUploadImage";
import {ChangeAction, ExhibitInfoPageModelState, UpdateBaseInfoAction} from "@/models/exhibitInfoPage";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {FEdit} from "@/components/FIcons";
import {Space} from "antd";
import FInput from "@/components/FInput";
import {FNormalButton, FTextButton} from "@/components/FButton";
import FLabelEditor from "@/pages/resource/components/FLabelEditor";
import {connect, Dispatch} from 'dva';
import {ConnectState} from "@/models/connect";

interface InfoProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Info({dispatch, exhibitInfoPage}: InfoProps) {
  function onChangePInputTitle(value: string | null) {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        pInputTitle: value,
      },
    });
  }

  if (exhibitInfoPage.resourceType === 'theme') {
    return null;
  }

  return (<>
    <FTitleText text={'基础信息'} type="h4"/>
    <div style={{height: 20}}/>

    <FUploadImage
      onUploadSuccess={(url: string) => dispatch<UpdateBaseInfoAction>({
        type: 'exhibitInfoPage/updateBaseInfo',
        payload: {
          pCover: url,
        },
      })}>
      <div className={styles.cover}>
        <img
          alt=""
          src={exhibitInfoPage.pCover || imgSrc}
        />
        <div>
          <FEdit style={{fontSize: 32}}/>
          <div style={{height: 10}}/>
          <div>修改封面</div>
        </div>
      </div>
    </FUploadImage>

    <div style={{height: 20}}/>

    <FTitleText text={'展品标题'} type="form"/>
    <div style={{height: 15}}/>
    {
      exhibitInfoPage.pInputTitle === null
        ? (<Space size={10}>
          <FContentText text={exhibitInfoPage.pTitle}/>
          <a onClick={() => onChangePInputTitle(exhibitInfoPage.pTitle)}><FEdit/></a>
        </Space>)
        : (<>
          <FInput
            className={styles.Input}
            value={exhibitInfoPage.pInputTitle || ''}
            onChange={(e) => onChangePInputTitle(e.target.value)}
          />
          <div style={{height: 10}}/>
          <div className={styles.btn}>
            <FTextButton
              size="small"
              onClick={() => onChangePInputTitle(null)}
            >取消</FTextButton>
            <div style={{width: 15}}/>
            <FNormalButton
              size="small"
              onClick={() => {
                dispatch<UpdateBaseInfoAction>({
                  type: 'exhibitInfoPage/updateBaseInfo',
                  payload: {
                    pTitle: exhibitInfoPage.pInputTitle || '',
                  },
                });
                onChangePInputTitle(null);
              }}
            >确定</FNormalButton>
          </div>

        </>)
    }
    <div style={{height: 30}}/>

    <FTitleText text={'展品标签'} type="form"/>
    <div style={{height: 15}}/>
    <FLabelEditor
      values={exhibitInfoPage.pTags}
      onChange={(value) => {
        dispatch<UpdateBaseInfoAction>({
          type: 'exhibitInfoPage/updateBaseInfo',
          payload: {
            pTags: value,
          },
        });
      }}
    />
    <div style={{height: 30}}/>
  </>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Info);