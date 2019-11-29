import initEnv from './initEnv'
import initQI from './initQI'
import initEvents from "./initEvents"
import initLoading from './initLoading'

export function initGlobalAPI(FreelogApp) {
  initEnv(FreelogApp)
  initQI(FreelogApp)
  initEvents(FreelogApp)
  initLoading(FreelogApp)
}
