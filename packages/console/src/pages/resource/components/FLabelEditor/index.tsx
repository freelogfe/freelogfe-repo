import * as React from 'react';
import styles from './index.less';
import {CloseOutlined} from '@ant-design/icons';
import {Input, Form} from 'antd';
import {i18nMessage} from "@/utils/i18n";

interface FLabelEditor {
  values?: string[];
  onChange?: (values: string[]) => void;
}

let inputElement: any = null;

export default function ({values = [], onChange}: FLabelEditor) {

  const [input, onChangeInput] = React.useState<string>('');
  const [errorText, onChangeErrorText] = React.useState<string>('');

  function onKeyDown(e: any) {
    if (e.keyCode === 27) {
      inputElement.blur();
      onChangeErrorText('');
      return onChangeInput('');
    }
  }

  function onPressEnter(e: any) {
    const v = e.target.value;
    if (!v) {
      return;
    }
    if (values?.includes(v)) {
      onChangeErrorText('有重复');
      return;
    }
    onChangeInput('');
    return onChange && onChange([...values, e.target.value]);
  }

  function onChangeInputText(e: any) {
    onChangeErrorText('');
    onChangeInput(e.target.value);
  }

  function onRemove(index: number) {
    onChangeErrorText('');
    return onChange && onChange(values?.filter((i, j) => j !== index));
  }

  return (<div className={styles.styles}>
    {
      values.map((i: string, j: number) => (<label key={i} className={styles.label}>
        <span>{i}</span>
        <a onClick={() => onRemove(j)}><CloseOutlined/></a>
      </label>))
    }
    <div className={styles.InputWrap}>
      <Input
        className={styles.Input + ' ' + (errorText && styles.InputError)}
        placeholder={i18nMessage('hint_add_resource_tag')}
        ref={(i) => inputElement = i}
        value={input}
        onChange={onChangeInputText}
        onKeyDown={onKeyDown}
        onPressEnter={onPressEnter}
      />
      {errorText && <label>{errorText}</label>}
    </div>
  </div>);
}
