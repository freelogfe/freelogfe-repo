import * as React from 'react';
import styles from './index.less';
import {i18nMessage} from "@/utils/i18n";


interface StatusLabelProps {
  status?: 'executing' | 'pending' | 'stopped';
}

export default function ({status = 'executing'}: StatusLabelProps) {
  let text = '';
  switch (status) {
    // case "executing":
    //   text = i18nMessage('contract_state_authorzed');
    //   break;
    case "pending":
      text = i18nMessage('contract_state_pending');
      break;
    case "stopped":
      text = i18nMessage('contract_state_end');
      break;
    default:
      text = i18nMessage('contract_state_authorzed');
  }
  return (<label className={styles[status]}>{text}</label>);
}
