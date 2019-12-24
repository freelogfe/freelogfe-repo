interface fetchOtps {
  method?: string;
  body?: any;
  headers?: plainObject;
  credentials?: "omit" | "same-origin" | "include";
}

interface QIFetchOpts {
  url?: string;
  baseURL?: string;
  method?: string;
  body?: any;
  data?: plainObject;
  timeout?: number;
  headers?: plainObject;
  credentials?: "omit" | "same-origin" | "include";
} 