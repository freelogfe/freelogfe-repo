import * as React from 'react';
import styles from './index.less';
import warning from '../../../assets/warning.svg';
import {i18nMessage} from "@/utils/i18n";

export default function ({className, normal}: any) {
  return (
    <div className={[styles.div, className].join(' ')}>
      <label
        className={normal ? styles.normal : styles.warning}>{normal ? i18nMessage('online') : i18nMessage('offline')}</label>
      {normal || <img src={warning}/>}
    </div>
  );
}
