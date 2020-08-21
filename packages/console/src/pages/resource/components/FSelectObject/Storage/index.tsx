import * as React from 'react';
import styles from "./index.less";
import FDropdown from "@/components/FDropdown";
import FInput from "@/components/FInput";
import {FContentText} from "@/components/FText";
import {FNormalButton} from "@/components/FButton";
import {bucketList} from "@/services/storages";
import {FMenuProps} from "@/components/FMenu";
import moment from 'moment'

export interface ResourceObject {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly path: string;
  readonly type: string;
  readonly time: string;
}

interface StorageProps {
  readonly onSelect?: (resource: ResourceObject) => void;
}

interface StorageStates {
  bucketOptions: {},
}

export default function ({onSelect}: StorageProps) {

  const [bucketOptions, setBucketOptions] = React.useState<FMenuProps['options']>([{text: '全部Bucket', value: '-1'},]);
  const [selected, setSelected] = React.useState<any>('-1');

  const [input, setInput] = React.useState<string>('');

  const [resourceObjects, setResourceObjects] = React.useState<ResourceObject[] | null>(null);

  React.useEffect(() => {
    handleBucketOptions();
    setResourceObjects([
      // {
      //   id: 'q12342',
      //   name: 'picture.png',
      //   size: 1234190,
      //   path: 'buckt1/1234.png',
      //   // time: '2019-12-22 12:22',
      //   time: moment().format('YYYY-MM-DD HH:mm'),
      //   type: 'image'
      // },
      // {
      //   id: 'q12343',
      //   name: 'picture2.png',
      //   size: 634532,
      //   path: 'buckt2/1234.png',
      //   time: moment().format('YYYY-MM-DD HH:mm'),
      //   type: 'image'
      // },
    ])
  }, []);

  async function handleBucketOptions() {
    const {data} = await bucketList({bucketType: 1});
    setBucketOptions([
      {text: '全部Bucket', value: '-1'},
      ...data.map((i: any) => ({value: i.bucketName}))
    ]);
  }

  async function handleDataSource() {

  }

  return (
    <div className={styles.SelectBucket}>
      <div className={styles.filter}>
        <div className={styles.filterSelect}>
          <FDropdown
            options={bucketOptions}
            text={selected === '-1' ? bucketOptions[0].text : selected}
            onChange={(value) => setSelected(value)}
          />
        </div>

        <FInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.filterInput}
          theme="dark"
          size="small"
        />
      </div>

      <div style={{height: 17}}/>

      {
        (resourceObjects || []).map((i: ResourceObject) => (
          <div key={i.id} className={styles.bucket}>
            <div>
              <FContentText text={i.path}/>
              <div style={{height: 2}}/>
              <FContentText type={'additional2'} text={`资源类型 ${i.type} | 更新时间 ${i.time}`}/>
            </div>
            <FNormalButton
              theme="weaken"
              onClick={() => onSelect && onSelect(i)}
            >选择</FNormalButton>
          </div>
        ))
      }
    </div>
  );
}
