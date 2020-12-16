import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FLeftSiderLayoutProps {

  type?: 'form' | 'table' | 'empty';

  header?: React.ReactNode;
  sider: React.ReactNode | React.ReactNodeArray;
  children: React.ReactNode | React.ReactNodeArray;

  contentClassNames?: string;
  contentStyles?: CSSProperties;
  hasBottom?: boolean;
}

function FLeftSiderLayout({children, header, sider, type, contentStyles, hasBottom = true}: FLeftSiderLayoutProps) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 70);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 70);
  }

  return (<div
    className={styles.leftRight}
    style={{minHeight: minHeight}}
  >
    <div className={styles.Slider}>
      <div style={{height: minHeight}}>
        {sider}
      </div>
    </div>
    <div className={styles.rightContent}>
      {
        type === 'empty'
          ? (children)
          : (<>
            <div className={[styles.header, type === 'table' ? styles.tableWidth : ''].join(' ')}>
              {header}
            </div>
            <div style={contentStyles} className={[styles.content, type === 'table' ? styles.tableWidth : ''].join(' ')}>
              {children}
            </div>
            {console.log(hasBottom, 'hasBottom2093ufsdaio')}
            {
              hasBottom && (<div style={{height: 100}}/>)
            }

          </>)
      }
    </div>
  </div>);
}

export default FLeftSiderLayout;
