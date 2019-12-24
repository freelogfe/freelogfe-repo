import * as util from "../utils"

function setContentTypeIfUnset(headers: plainObject, value: string): void {
  if (!headers['content-type'] && !headers['Content-Type']) {
    headers['Content-Type'] = value
  }
}

export const transformRequests: Array<(options: QIFetchOpts) => QIFetchOpts> = [
  function transformBody(options) {
    var body = options.body
    const headers = options.headers

    if (util.isFormData(body) || util.isArrayBuffer(body) || util.isStream(body) || util.isFile(body) || util.isBlob(body)) {
      options.body = body
    }
    if (util.isArrayBufferView(body)) {
      options.body = body.buffer
    }
    if (util.isURLSearchParams(body)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8')
      options.body = body.toString()
    }
    if (util.isObject(body)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8')
      options.body = JSON.stringify(body)
    }
    return options
  }
]

export const transformResponses: Array<(resp: Response) => Response> = []

