import * as React from 'react';
import styles from './index.less';
import {Input} from 'antd';
import {TextAreaProps} from 'antd/lib/input';

// import {FTextButton} from '@/components/FButton';

interface FIntroductionEditorProps extends TextAreaProps {
  // status?: '' | 'edit' | 'save';
  // value: string;
  // onChange?: (value: string) => void;
}

let textInput: any;

export default function ({className, value, ...props}: FIntroductionEditorProps) {

  React.useEffect(() => {
    textInput.focus();
  }, []);

  return (<div className={styles.introduction}>
    <Input.TextArea
      {...props}
      ref={(input) => textInput = input}
      value={value}
      // onChange={(e) => onChange && onChange(e)}
      className={styles.TextArea}
    />
    <span className={styles.FInputWordCount}>{String(value).length}</span>
  </div>)
}
