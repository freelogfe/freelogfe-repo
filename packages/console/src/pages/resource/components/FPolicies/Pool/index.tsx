import * as React from 'react';
import styles from './index.less';
import {policies, policiesList} from "@/services/policies";
import {FNormalButton} from '@/components/FButton';

interface PoolStates {
  dataSource: {
    policyId: string;
    userId: number;
    policyName: string;
    policyText: string;
    createDate: string;
  }[];
}

interface PoolProps {
  onSelect?(value: PoolStates['dataSource'][number]): void;
}

function Pool({onSelect}: PoolProps) {

  const [dataSource, setDataSource] = React.useState<PoolStates['dataSource']>([]);

  React.useEffect(() => {
    handleData();
  }, []);

  async function handleData() {
    const {data} = await policies({});
    // console.log(data, 'DADAFDSFSDFDSF@#');
    setDataSource(data.dataList);
  }

  function onClick(value: PoolStates['dataSource'][number]) {
    onSelect && onSelect(value)
  }

  return (<div>
    {
      dataSource.map((i) => (<a onClick={() => onClick(i)} key={i.policyId}>
        <div>{i.policyName}</div>
        <div><FNormalButton>选择</FNormalButton></div>
      </a>))
    }

  </div>);
}

export default Pool;

const sr = 'for public:\n' +
  '  escrow account acct\n' +
  '  custom event acceptor.customEvent\n' +
  '\n' +
  '  initial:\n' +
  '    recontractable\n' +
  '    proceed to auth on acct exceed 1 feather\n' +
  '  auth:\n' +
  '    presentable\n' +
  '    recontractable\n' +
  '    active\n' +
  '    proceed to refund on acct.confiscated\n' +
  '  refund:\n' +
  '    recontractable\n' +
  '    proceed to finish on acct.refunded\n' +
  '  finish:\n' +
  '    recontractable\n' +
  '    terminate\n' +
  '  '
