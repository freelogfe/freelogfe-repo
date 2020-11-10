import * as React from 'react';
import styles from './index.less';
import {EditOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FFileTextProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FEdit({className, ...props}: FFileTextProps) {
  // return (<EditOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-bianji', className].join(' ')} {...props} />);
}

export default FEdit;
