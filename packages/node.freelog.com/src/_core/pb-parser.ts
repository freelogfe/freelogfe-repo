import { createScript, createCssLink } from './helpers'
import { resolveSubDependDataUrl } from './api/resolveUrl'
import { subDependency } from './api'

interface authInfo {
  __auth_user_id__: number;
  __auth_node_id__: number;
  __auth_node_name__?: string;
  __page_build_id?: string;
  __page_build_entity_id?: string;
  __page_build_sub_releases?: Array<subDependency>;
  __auth_error_info__?: plainObject;
}

export default function initWidgets(): void {
  const FreelogApp = window.FreelogApp
  FreelogApp.$loading.show()
  const authInfo = window.__auth_info__
  const authErrorData = authInfo && authInfo.__auth_error_info__

  if (!authErrorData) {
    loadWidgets()
      .then(FreelogApp.$loading.hide)
      .catch(e => {
        // widget加载失败 EXCEPTION_LOADWIDGET
        console.error(e.toString())
        FreelogApp.$loading.hide()
      })
  } else {
    /**
     * 授权异常
     * 显示PB异常页及授权按钮，待授权问题解决后刷新页面
     */
    // throwException('PB授权未通过', EXCEPTION_PB_AUTH)
    FreelogApp.$loading.hide()
  }
}

function loadWidgets(): Promise<any> {
  const promises: Promise<any> [] = []
  
  if (window.__auth_info__) {
    const vis: { [propName: string]: boolean } = {}
    const { 
      __page_build_sub_releases, 
      __page_build_id, 
      __page_build_entity_id, 
    } = window.__auth_info__ as authInfo

    __page_build_sub_releases
      .forEach(subRelease => {
        const { resourceType, id: subReleaseId } = subRelease
        if (!vis[subReleaseId]) {
          vis[subReleaseId] = true
          const url = resolveSubDependDataUrl(__page_build_id, subReleaseId, __page_build_entity_id)
          switch (resourceType) {
            case 'widget':
            case 'js': {
              promises.push(createScript(url))
              break
            }
            case 'css': {
              promises.push(createCssLink(url))
              break
            }
            default: { }
          }
        }
      })
  }
  
  return Promise.all(promises)
}

