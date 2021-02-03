import * as React from 'react';
import styles from './index.less';

interface FIdentityTypeBadgeBadgeProps {
  status?: 'resource' | 'object' | 'exhibit';
}

const statusTextObj = {
  resource: '资源',
  object: '对象',
  exhibit: '展品',
};

function FIdentityTypeBadge({status = 'resource'}: FIdentityTypeBadgeBadgeProps) {
  return (<label className={styles[status]}>{statusTextObj[status]}</label>);
}

export default FIdentityTypeBadge;