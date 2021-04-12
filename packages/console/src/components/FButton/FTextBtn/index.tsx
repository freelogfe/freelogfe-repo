import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FTextBtnProps {
  children: React.ReactNode;
  type?: 'primary' | 'default';
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

function FTextBtn({children, type = 'primary', className, style, disabled, onClick}: FTextBtnProps) {

  if (type === 'primary') {
    return (<button
      className={[styles.Primary, className].join(' ')}
      style={{
        ...style,
      }}
      disabled={disabled}
      onClick={(event: any) => {
        onClick && onClick(event);
      }}
    >{children}</button>);
  }

  return (<button
    className={[styles.Default, className].join(' ')}
    style={{
      ...style,
    }}
    disabled={disabled}
    onClick={(event: any) => {
      onClick && onClick(event);
    }}
  >{children}</button>);
}

export default FTextBtn;
