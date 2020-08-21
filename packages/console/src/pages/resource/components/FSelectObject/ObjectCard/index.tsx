import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import {FTitleText, FContentText} from '@/components/FText';
import {Progress} from 'antd';
import {i18nMessage} from "@/utils/i18n";

interface ObjectCardProps {
  readonly resourceObject: {
    readonly name: string;
    readonly size: number;
    readonly path: string;
  };
  readonly progress: number | null;
  readonly onClickDelete?: () => void;
}

export default function ({resourceObject, progress = null, onClickDelete}: ObjectCardProps) {
  return (<div className={styles.styles}>
    <div className={styles.card}>
      <img src={img} className={styles.img} alt=""/>
      <div style={{width: 20}}/>
      <div className="">
        <FTitleText type="h4" text={resourceObject.name}/>
        <div style={{height: 18}}/>
        <div className={styles.info}>
          {/*<FContentText type="additional1" text={'10 M'}/>*/}
          <div style={{display: "flex", flexShrink: 0}}>{humanizeSize(resourceObject.size)}</div>
          <div style={{display: "flex", flexShrink: 0, width: 30}}/>
          {progress === null
            ? <FContentText className={styles.infoSize} type="additional1" text={resourceObject.path || '本地上传'}/>
            : (<>
              <span style={{paddingRight: 10}}>{progress}%</span>
              <Progress
                className={styles.Progress}
                width={100}
                showInfo={false}
                percent={progress}
                size="small"
                trailColor="#EBEBEB"
              />
            </>)}
        </div>
      </div>
    </div>
    <div style={{width: 10}}/>
    <a onClick={() => onClickDelete && onClickDelete()}
       className={styles.delete}>{progress !== null ? i18nMessage('cancel_uploading') : i18nMessage('remove')}</a>
  </div>)
}

/**
 * 将对应的字节数，转换为易读单位数量
 * @param bytes
 * @return {string}
 */
function humanizeSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
  //toPrecision(3) 后面保留一位小数，如1.0GB
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

