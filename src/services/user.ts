// 封装所有与用户相关的网络请求
import { request } from '@/utils/request'
// 导入类型
import type { User, CodeType, UserInfo, Patient } from '@/types/user'

// 1. 登录--密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('/login/password', 'post', { mobile, password })
// 2. 获取手机验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request<{ code: string }>('/code', 'get', { mobile, type })
// 3. 登录--手机验证码登录
export const loginByCode = (mobile: string, code: string) =>
  request<User>('/login', 'post', { mobile, code })
// 4. 我的-获取个人用户信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')
// 5. 问诊-查询患者列表信息
export const getPatientList = () => request<Patient[]>('/patient/mylist')
// 6. 问诊-添加患者信息
export const addPatient = (obj: Patient) => request('/patient/add', 'POST', obj)
// 7. 问诊-编辑患者信息
export const updatePatient = (obj: Patient) => request('/patient/update', 'PUT', obj)
// 8. 问诊-删除患者信息
export const delPatient = (id: string) => request(`/patient/del/${id}`, 'DELETE')
// 9. 问诊-查询患者详情
export const getPatientDetail = (id: string) => request<Patient>(`/patient/info/${id}`)
