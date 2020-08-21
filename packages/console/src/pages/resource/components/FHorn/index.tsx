import * as React from 'react';

import styles from './index.less';

interface FHornProps {
  className?: string;
  children?: React.ReactNodeArray | React.ReactNode;
  extra?: React.ReactNodeArray | React.ReactNode;
}

export default function ({className, children, extra}: FHornProps) {
  return (<div className={styles.FHorn + ' ' + (className || '')}>
    {extra && <div className={styles.rightTop}>{extra}</div>}
    {children}
  </div>);
}
