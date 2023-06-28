// 管理所有的校验规则

import type { FieldRule } from 'vant/lib/field'

// 1.0 手机号
const mobileRules: FieldRule[] = [
  // 必填
  { required: true, message: '请输入手机号' },
  // 手机号
  { pattern: /^1[3-9]\d{9}$/, message: '手机号不合法' }
]
// 2.0 密码框
const passwordRules: FieldRule[] = [
  // 必填
  { required: true, message: '请输入密码' },
  // 密码：8~24
  { pattern: /^\w{8,24}$/, message: '密码不合法' }
]
// 3.0 验证码
const codeRules: FieldRule[] = [
  // 必填
  { required: true, message: '请输入验证码' },
  // 长度：6
  { pattern: /^\d{6}$/, message: '验证码不合法' }
]

export { mobileRules, passwordRules, codeRules }
