// api请求基础接口
import request from '@/utils/request'

// 对响应做进一步处理
function requestWrapper(requestMethod, ...params) {
  return requestMethod(...params)
    .then((res) => {
      // 业务接口成功，或者是二进制数据
      if (res && (res.success || res instanceof Blob)) {
        return res
      } else {
        return Promise.reject(res)
      }
    })
    .catch((error) => {
      // 存在两种类型的 error: { code, message, result, ... }
      // || { message, ... }
      // 为了方便处理，因为上层已经对第二种error作了处理
      // 故直接reject undefined
      // 后续业务需要 if(error) xxx...
      if (
        error &&
        Object.prototype.hasOwnProperty.call(error, 'success') &&
        error.success === false
      ) {
        return Promise.reject(error)
      }
      return Promise.reject()
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
