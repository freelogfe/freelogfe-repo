declare module '@freelog/freelog-ui-login/src/core' {
  export function getUserInfo(): Promise<any>
}
declare module '@freelog/freelog-ui-login/src/shared/getUserInfo'

declare module '@freelog/freelog-common-lib/src/initEnv' {
  export function getEnvType(): string 
  export function getEnvLanguage(): string
  export function getMainDomain(): string
  export function getQIoringin(): string
  export function getNodeType(): string
}

declare module 'import-html-entry/lib/index' {
  export function getExternalStyleSheets(styles: string []): Promise<string[]>
}

declare module 'import-html-entry/lib/process-tpl' {
  export function genLinkReplaceSymbol(linkHref: string): string
}

interface plainObject extends Object {
  [propName: string]: any;
}

interface Window {
  FreelogApp: any;
  __auth_info__: plainObject;
}