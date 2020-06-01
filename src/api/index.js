import request from '@/utils/request'

// 对响应做进一步处理
function requestWrapper(requestMethod, ...params) {
  return requestMethod(...params)
    .then((res) => {
      if (res.success) {
        return res.result
      } else {
        return Promise.reject(res)
      }
    })
    .catch((error) => {
      if (
        Object.prototype.hasOwnProperty.call(error, 'success') &&
        error.success === false
      ) {
        return Promise.reject(error)
      } else {
        return Promise.reject()
      }
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
