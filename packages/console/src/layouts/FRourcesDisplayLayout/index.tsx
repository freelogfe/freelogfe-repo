import * as React from 'react';
import styles from './index.less';

interface FResourcesDisplayLayoutProps {
  // header: React.ReactNode;
  children: React.ReactNode;

  containerClassName?: string;
  contentClassName?: string;
}

function FResourcesDisplayLayout({children, containerClassName = '', contentClassName = ''}: FResourcesDisplayLayoutProps) {
  return (<div className={styles.container}>
    {/*<div className={styles.header}>*/}
    {/*  {header}*/}
    {/*</div>*/}
    <div className={styles.content}>
      {children}
    </div>
    {/*<div style={{height: 200}}/>*/}
  </div>);
}

export default FResourcesDisplayLayout;
