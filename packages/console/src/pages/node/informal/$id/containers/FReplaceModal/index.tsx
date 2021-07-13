import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import Replacer from "./Replacer";
import Replaced from "./Replaced";
import FModal from "@/components/FModal";
import {connect, Dispatch} from 'dva';
import {OnReplaceModalCancelAction, OnReplaceModalConfirmAction} from "@/models/informalNodeManagerPage";
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import FThickArrowRight from "@/components/FIcons/FThickArrowRight";
import * as AHooks from 'ahooks';

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

type IConfirmValue = {
  exhibitName: string;
  replaced: ICandidate;
  replacer: ICandidate;
  scopes: ICandidate[][];
}[];

interface FReplaceModalProps {
  // nodeID: number;
  // isTheme: boolean;
  // visible?: boolean;

  // onCancel?(): void;

  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;

  // onConfirm?(value: IConfirmValue): void;
}

function FReplaceModal({dispatch, informalNodeManagerPage}: FReplaceModalProps) {

  // AHooks.useMount(() => {
  //   // console.log('modal**************');
  //   console.log(nodeID, 'nodeIDnodeIDnodeID890upioj;ksadrf;sad');
  //   dispatch<ChangeAction>({
  //     type: 'replaceInformExhibit/change',
  //     payload: {
  //       nodeID: nodeID,
  //     },
  //   });
  // });

  // React.useEffect(() => {
  //   dispatch<ChangeAction>({
  //     type: 'informalNodeManagerPage/change',
  //     payload: {
  //       nodeID: nodeID,
  //     },
  //   });
  // }, [nodeID]);

  // React.useEffect(() => {
  //   dispatch<ChangeAction>({
  //     type: 'replaceInformExhibit/change',
  //     payload: {
  //       isTheme: isTheme,
  //     },
  //   });
  // }, [isTheme]);

  return (<FModal
    title={null}
    width={947}
    visible={informalNodeManagerPage.replaceModalVisible}
    closable={false}
    destroyOnClose
    onCancel={() => {
      dispatch<OnReplaceModalCancelAction>({
        type: 'informalNodeManagerPage/onReplaceModalCancel',
      });
    }}
    okButtonProps={{
      disabled: !informalNodeManagerPage.replacerResourceList.some((rr) => rr.checked) || informalNodeManagerPage.replacedCheckedKeys.length === 0,
    }}
    onOk={async () => {
      dispatch<OnReplaceModalConfirmAction>({
        type: 'informalNodeManagerPage/onReplaceModalConfirm',
      });
    }}
  >
    <div className={styles.replaceHandler}>
      <div className={styles.replacer}>
        <FContentText type="highlight" text={'选择替换资源'}/>
        <div style={{height: 5}}/>
        <div className={styles.content}>
          <Replacer/>
        </div>
      </div>
      <div className={styles.arrow}>
        <FThickArrowRight
          style={{fontSize: 36, fontWeight: 600, color: '#D8D8D8'}}
        />
      </div>
      <div className={styles.replaced}>
        <FContentText
          type="highlight"
          text={'选择被替换资源'}
        />
        <div style={{height: 5}}/>
        <div className={styles.content}>
          <Replaced/>
        </div>
      </div>
    </div>
  </FModal>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(FReplaceModal);

// function simplifiedRelationship(relation: string[]): string[] {
//   // console.log(relation, 'relation!!!!!@@@@@');
//   let arr: string[] = [...relation].sort((a: string, b: string) => a.length - b.length);
//
//   for (let i = 0; i < arr.length; i++) {
//     const current: string = arr[i];
//     arr = arr.filter((a) => {
//       return a === current || !a.startsWith(current);
//     })
//   }
//   return arr;
// }
