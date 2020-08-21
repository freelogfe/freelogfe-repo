import * as React from 'react';
import styles from './index.less';
import {Affix, Dropdown, Layout} from "antd";
import FMenu from "@/components/FMenu";
import {DownOutlined} from '@ant-design/icons';
import {connect, Dispatch} from "dva";
import {ConnectState, GlobalModelState, GlobalSearchingModelState} from "@/models/connect";
import {SetLocaleAction} from "@/models/global";

const languagesOptions = [
  {value: 'zh-CN', text: '中文'},
  {value: 'en-US', text: 'English'},
  {value: 'pt-BR', text: 'Key'},
];

interface FLayoutFooter {
  dispatch: Dispatch;
  global: GlobalModelState;
}

function FLayoutFooter({dispatch, global}: FLayoutFooter) {

  const [footerOffsetTop, setFooterOffsetTop] = React.useState<number>(window.innerHeight - 68);

  React.useEffect(() => {
    window.onresize = () => {
      setFooterOffsetTop(window.innerHeight - 68);
    }
  }, []);

  function changeLocale(value: 'zh-CN' | 'en-US' | 'pt-BR') {
    // setLocale(value === '1' ? 'zh-CN' : 'en-US');
    console.log(value, 'valuevalue');
    dispatch<SetLocaleAction>({
      type: 'global/setLocale',
      payload: value,
    });
  }

  return (<Affix offsetTop={footerOffsetTop}>
    <Layout.Footer className={styles.Footer}>
      <div>
        <div>关于freelog</div>
        <div style={{width: 30}}/>
        <Dropdown overlay={<FMenu
          options={languagesOptions}
          onClick={(value) => changeLocale(value as 'zh-CN' | 'en-US')}
        />
        }>
          <div
            style={{cursor: 'pointer'}}>
            <span>{languagesOptions.find((i) => i.value === global.locale)?.text}</span>
            <DownOutlined style={{marginLeft: 8}}/>
          </div>
        </Dropdown>
        <div style={{width: 120}}/>
        <span>粤ICP备17085716号-1</span>
        <div style={{width: 30}}/>
        <span>Copyright© 2020 freelog freelog.com版权所有</span>
      </div>
    </Layout.Footer>
  </Affix>);
}

export default connect(({global}: ConnectState) => ({
  global: global,
}))(FLayoutFooter);
