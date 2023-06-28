// 封装 axios
import axios, { type Method } from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/stores'
// 设置请求的基地址：
const BASE_URL = 'https://consult-api.itheima.net'
// 创建 axios 副本对象
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})
// 拦截器
// 请求拦截器
instance.interceptors.request.use(
  (request) => {
    // 获取 token
    const store = useUserStore()
    const token = store.user?.token
    // 判断 token
    if (token && request.headers) {
      // 携带 token
      request.headers.authorization = `Bearer ${token}`
    }
    return request
  },
  (err) => {
    return Promise.reject(err)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 判断返回的状态
    if (response.data.code !== 10000) {
      // 提示出错
      showToast(response.data.message)
      // 结束代码
      return Promise.reject(new Error(response.data.message))
    }
    // 处理返回的数据
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 设置接口类型
type TRes<T> = {
  code: number
  message: string
  data: T
}
// 统一封装一个网络请求的接口
const request = <T>(url: string, method: Method = 'get', data?: object) =>
  instance.request<T>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })

// 暴露 axios 副本对象
export { request, instance, BASE_URL }
