// api请求基础接口
import request from '@/utils/request'

// 对响应做进一步处理
function requestWrapper(requestMethod, ...params) {
  return requestMethod(...params)
    .then((res) => {
      if (res.success) {
        return res
      } else {
        return Promise.reject(res)
      }
    })
    .catch((error) => {
      // 存在两种类型的 error: { code, message, result, ... } || { message, ... }
      return Promise.reject(error)
    })
}

function get(url, params = {}, config = {}) {
  config.params = params
  return requestWrapper(request.get, url, config)
}

function post(url, data = {}, config = {}) {
  return requestWrapper(request.post, url, data, config)
}

function put(url, data = {}, config = {}) {
  return requestWrapper(request.put, url, data, config)
}

export default {
  request,
  get,
  post,
  put,
  delete(url, params = {}, config = {}) {
    config.params = params
    return requestWrapper(request.delete, url, config)
  },
}
