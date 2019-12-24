import { createScript, createCssLink } from './helpers/index'
import { resolveSubResourceDataUrl } from './api/resolveUrl'

export default function initWidgets(FreelogApp) {
  FreelogApp.$loading.show()
  const authInfo = window.__auth_info__
  const authErrorData = authInfo && authInfo.__auth_error_info__

  if (!authErrorData) {
    loadWidgets(FreelogApp)
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

function loadWidgets(FreelogApp) {
  const promises = []
  const vis = {}

  try {
    if (window.__auth_info__) {
      const { __page_build_sub_releases = [], __page_build_id: presentableId, __page_build_entity_id: entityNid } = window.__auth_info__

      __page_build_sub_releases
        .filter(({ releaseId, id }) => !!releaseId || !!id)
        .forEach(subRelease => {
          const { releaseId, version, resourceType, id } = subRelease
          const subReleaseId = releaseId || id
          if (!vis[subReleaseId]) {
            vis[subReleaseId] = true
            const url = window.FreelogApp.QI.resolveSubDependDataUrl(presentableId, subReleaseId, entityNid)

            switch (resourceType) {
              case 'widget':
              case 'js': {
                createScript(url)
                break
              }
              case 'css': {
                createCssLink(url)
              }
              default: { }
            }
          }
        })
    }
  } catch (e) {

  }
  
  return Promise.all(promises)
}




