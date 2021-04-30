import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FUserProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FUser({className, ...props}: FUserProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-yonghu', className].join(' ')} {...props}/>);
}

export default FUser;
