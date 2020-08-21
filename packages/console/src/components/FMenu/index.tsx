import * as React from 'react';
import styles from './index.less';
import {Menu} from 'antd';

interface FMenuItem {
  text?: React.ReactNode;
  value: string;
}

export interface FMenuProps {
  options: FMenuItem[];
  onClick?: (value: string) => void;
}

export default function FMenu({options, onClick}: FMenuProps) {
  return (
    <Menu
      selectable={false}
      className={styles.Menu}
      mode="vertical"
      onClick={(param) => onClick && onClick(param.key)}
    >
      {
        (options || [])
          .map((i: FMenuItem) => (<Menu.Item
            key={i.value}
            className={styles.MenuItem}
          >{i.text || i.value}</Menu.Item>))
      }
    </Menu>
  );
}
