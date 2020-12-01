// 展品名称
export const EXHIBIT_NAME: RegExp = /^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#)).{1,60}$/;

// 资源名称
export const RESOURCE_NAME: RegExp = /^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#)).{1,60}$/;

// 资源类型
export const RESOURCE_TYPE: RegExp = /^(?!_)[a-z0-9_]{3,20}(?<!_)$/;

// 自定义属性键
export const CUSTOM_KEY: RegExp = /^[a-zA-Z0-9_]{1,20}$/;