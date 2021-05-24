import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import {FContentText} from "@/components/FText";
import FTooltip from "@/components/FTooltip";
import {FInfo} from "@/components/FIcons";
import FDivider from "@/components/FDivider";
import {FCircleBtn} from "@/components/FButton";

interface FCustomOptionsCardsProps {
  dataSource: {
    theKey: string;
    description: string;
    type: 'input' | 'select';
    value: string;
  }[];

  onEdit?(theKey: string): void;

  onDelete?(theKey: string): void;
}

function FCustomOptionsCards({dataSource, onEdit, onDelete}: FCustomOptionsCardsProps) {
  return (<div className={styles.customOptions1}>

    {
      dataSource.map((ds) => {
        return (<div key={ds.theKey} className={styles.customOptions1Item}>
          <div>
            <Space size={5}>
              <FContentText text={ds.theKey} type="additional2"/>
              {
                ds.description
                  ? (<FTooltip title={ds.description}><FInfo style={{cursor: 'pointer', fontSize: 14}}/></FTooltip>)
                  : null
              }

            </Space>
            <div style={{height: 10}}/>
            <Space size={5}>
              <FContentText text={ds.type === 'select' ? '下拉框' : '输入框'}/>
              <FDivider/>
              <FContentText
                text={ds.value}
                style={{maxWidth: 500}}
                singleRow
              />
            </Space>
          </div>
          <div style={{width: 10}}/>
          <Space size={10} className={styles.customOptions1ItemOperation}>
            {
              onEdit && (<FTooltip title={'编辑'}>
                <div>
                  <FCircleBtn
                    type="minor"
                    onClick={() => {
                      onEdit(ds.theKey);
                    }}
                  />
                </div>
              </FTooltip>)
            }

            {
              onDelete && (<FTooltip title={'删除'}>
                <div>
                  <FCircleBtn
                    style={{width: 20, height: 20}}
                    onClick={() => {
                      onDelete(ds.theKey);
                    }}
                    type="danger"
                  />
                </div>
              </FTooltip>)
            }

          </Space>
        </div>);
      })
    }


  </div>);
}

export default FCustomOptionsCards;

function fn(num: number) {
  return Array(num).fill(null).map((n, i) => '' + n + i);
}