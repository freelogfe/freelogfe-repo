interface QIFetchOpts {
  url?: string
  baseURL?: string
  method?: string
  body?: any
  data?: plainObject
  timeout?: number
  headers?: plainObject
  credentials?: "omit" | "same-origin" | "include"
} 