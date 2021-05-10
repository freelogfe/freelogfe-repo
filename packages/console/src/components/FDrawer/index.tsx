import * as React from 'react';
import styles from './index.less';
import {Drawer} from 'antd';
import {DrawerProps} from "antd/lib/drawer";
import {FTitleText} from '@/components/FText';
import {FTextBtn} from '@/components/FButton';
import {FClose} from '@/components/FIcons';

interface FDrawerProps extends DrawerProps {
  children: React.ReactNode | React.ReactNodeArray;
  title: string;
  // width?: number | string;
  topRight?: React.ReactNode;
}

function FDrawer({children, topRight, width = 720, title, onClose, ...props}: FDrawerProps) {
  return (<Drawer
    title={null}
    headerStyle={{display: 'none'}}
    bodyStyle={{padding: 0}}
    width={width || 720}
    onClose={onClose}
    {...props}
  >
    <div className={styles.header} style={{width: width}}>
      <FTitleText type="h2" text={title}/>
      {
        topRight || (<FTextBtn type="default" onClick={(e: any) => onClose && onClose(e)}><FClose/></FTextBtn>)
      }
    </div>
    <div style={{height: 70}}/>
    <div className={styles.content}>
      {children}
    </div>
  </Drawer>);
}

export default FDrawer;