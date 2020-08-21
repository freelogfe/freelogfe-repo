
import './app/styles/reset.css'
import './app/styles/global.less'
import './_core/index'
import fReport from '@freelog/freelog-report'

const { Env: { type: envType, mainDomain } } = window.FreelogApp
const __PAGEBUILD_AUTH__ = 'pagebuild-auth'
const pbAuthContentHash = getPagebuildAuthContentHash(window.__appOutputFilenames__, __PAGEBUILD_AUTH__)

window.FreelogApp.loadMicroApp({
  name: __PAGEBUILD_AUTH__,
  container: '#app-container',
  scripts: [ `//static.${mainDomain}/pagebuild/pagebuild-auth.${pbAuthContentHash}.js` ],
})

if (envType !== 'dev' ) {
  // 页面性能数据采集
  fReport.performanceReport({
    reportUrl: 'http://report.testfreelog.com/v1/report/performance'
  })
} 

function getPagebuildAuthContentHash(outputFilenames, appName) {
  outputFilenames = Buffer.from(outputFilenames, 'base64').toString('utf-8')
  outputFilenames = JSON.parse(outputFilenames)
  return outputFilenames[appName]
}



