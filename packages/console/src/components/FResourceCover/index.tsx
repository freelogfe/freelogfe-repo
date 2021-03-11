import * as React from 'react';
import styles from './index.less';
import Status from './Status';
import FResourceStatusBadge from "@/components/FResourceStatusBadge";

interface FResourceCoverProps {
  width?: number | string;
  height?: number | string;
  src?: string;
  status?: 'online' | 'offline' | 'unreleased';
  children?: React.ReactNode | React.ReactNodeArray;
}

export default function ({width, height, src, status, children}: FResourceCoverProps) {
  return (<div className={styles.Cover}>
    {src && (<img src={src} alt=""/>)}
    {children}
    {/*{status*/}
    {/*  ? (<Status*/}
    {/*    normal={status === 'online'}*/}
    {/*    className={styles.Status}*/}
    {/*  />)*/}
    {/*  : ''}*/}
    <div className={styles.Status}>
      <FResourceStatusBadge status={status}/>
    </div>

  </div>);
}
