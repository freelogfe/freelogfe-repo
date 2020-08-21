import * as React from 'react';
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import styles from './index.less';
import {UploadProps} from 'antd/lib/upload';

interface FUploadImageProps extends UploadProps {
  children: React.ReactNode;
}

export default function ({children, ...props}: FUploadImageProps) {

  return (
    <div className={styles.styles}>
      <ImgCrop
        rotate
        grid
        aspect={4 / 3}
      >
        <Upload{...props} showUploadList={false}>
          {children}
        </Upload>
      </ImgCrop>
    </div>
  )
}
