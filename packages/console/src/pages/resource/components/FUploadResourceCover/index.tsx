import * as React from 'react';
import styles from './index.less';
import FUploadImage from '@/components/FUploadImage';
import {FContentText} from '@/components/FText';
import {RcFile, UploadChangeParam} from "antd/lib/upload/interface";
import {uploadImage} from "@/services/storages";
import {i18nMessage} from "@/utils/i18n";

interface FUploadResourceCoverProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ({value, onChange}: FUploadResourceCoverProps) {

  const uploadConfig = {
    accept: 'image/*',
    beforeUpload: (file: RcFile, FileList: RcFile[]) => {
      // console.log(file, 'file1');
      upload(file);
      return false;
    },
    onChange: (info: UploadChangeParam) => {
      // console.log(info, '########');
    },
    multiple: false,
  };

  async function upload(file: File) {
    const res = await uploadImage({
      file: file,
    });
    // console.log(res, 'RRRRRRRRR');
    onChange && onChange(res.data.url);
  }

  return (<div className={styles.cover}>
    {!value
      ? (<FUploadImage  {...uploadConfig}>
        <a className={styles.FUploadImageChildren}>
          <i className={'freelog fl-icon-shangchuanfengmian'}/>
          <span>{i18nMessage('upload_image')}</span>
        </a>
      </FUploadImage>)
      : (<div className={styles.FUploadImageChildren}>
        <img src={value} alt=""/>
      </div>)
    }
    <div className={styles.coverTip}>
      {value && <FUploadImage {...uploadConfig}>
        <a className={styles.ReUpload}>{i18nMessage('replace_resource_image')}</a>
      </FUploadImage>}
      <div style={{height: 15}}/>
      <FContentText type="additional2" text={i18nMessage('rules_resource_image')}/>
      <div style={{height: 5}}/>
      <FContentText type="additional2" text={'未上传封面时，默认使用系统封面。'}/>
    </div>
  </div>);
}

// interface UploadProps {
//   children?: React.ReactNode;
//   on
// }
//
// function Upload() {
//
// }
