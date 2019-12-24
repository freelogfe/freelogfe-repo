import { initGlobalAPI } from './global-api/index.js'
import initWidgets from './pb-parser'

const FreelogApp = {}
initGlobalAPI(FreelogApp)
initWidgets(FreelogApp)
// Object.seal(FreelogApp)
window.FreelogApp = FreelogApp



