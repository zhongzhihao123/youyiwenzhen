// 定义用户的类型
export type User = {
  token: string
  refreshToken: string
  avatar: string
  mobile: string
  account: string
  id: string
}
// 定义短信验证码的类型
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

type OmitUser = Omit<User, 'token' | 'refreshToken'>
// 定义个人中心用户信息类型
export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}
// 定义患者类型
export type Patient = {
  name: string
  idCard: string
  // 是否是默认患者
  defaultFlag: 0 | 1
  gender: 0 | 1
  genderValue?: string
  age?: number
  id?: string
}
