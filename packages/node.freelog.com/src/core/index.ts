import { initGlobalAPI } from './global-api/index.js'
import initWidgets from './pb-parse'

const FreelogApp = {}
initGlobalAPI(FreelogApp)
initWidgets(FreelogApp)
// Object.seal(FreelogApp)
window.FreelogApp = FreelogApp



