import * as React from 'react';
import styles from './index.less';
import {AutoComplete} from 'antd';
import {AutoCompleteProps} from "antd/lib/auto-complete";

interface FAutoCompleteProps extends AutoCompleteProps {
  errorText?: string;
}

function FAutoComplete({errorText, ...props}: FAutoCompleteProps) {
  return (<div className={styles.wrap}>
    <AutoComplete
      {...props}
      // className={!!errorText ? styles.AutoCompleteError : ''}
    />
    {
      errorText && (<div className={styles.errorText}>{errorText}</div>)
    }
  </div>);
}

export default FAutoComplete;
