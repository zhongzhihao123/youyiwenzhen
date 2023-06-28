import { ConsultType, IllnessTime, OrderType } from '@/enums'
// 定义文章列表类型
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'
// 定义医生接口参数类型
export type pageParams = {
  current: number
  pageSize: number
}

// 文章列表参数类型
export type KnowledgeParams = pageParams & {
  type: KnowledgeType
}

// 医生类型
export type Doctor = {
  // 医生ID
  id: string
  // 医生名称
  name: string
  // 头像
  avatar: string
  // 医院名称
  hospitalName: string
  // 医院等级
  gradeName: string
  // 科室
  depName: string
  // 职称
  positionalTitles: string
  // 是否关注，0 未关注 1 已关注
  likeFlag: 0 | 1
  // 接诊服务费
  serviceFee: number
  // 接诊人数
  consultationNum: number
  // 评分
  score: number
  // 主攻方向
  major: string
}
// 医生列表类型
export type DoctorList = Doctor[]
// 医生列表的返回类型
export type DoctorPage = {
  pageTotal: number // 总页数
  total: number // 总条数
  rows: DoctorList
}

// 文章信息类型
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}
// 文章列表
export type KnowledgeList = Knowledge[]
// 文章列表带分页
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}
// 关注的类型
export type FollowType = 'topic' | 'knowledge' | 'doc' | 'disease'

// 图片列表
export type Image = {
  // 图片ID
  id: string
  // 图片地址
  url: string
}
// 问诊记录
export type Consult = {
  // 问诊记录ID
  id: string
  // 问诊类型
  type: ConsultType
  // 快速问诊类型，0 普通 1 三甲
  illnessType: 0 | 1
  // 科室ID
  depId: string
  // 疾病描述
  illnessDesc: string
  // 疾病持续时间
  illnessTime: IllnessTime
  // 是否就诊过，0 未就诊过  1 就诊过
  consultFlag: 0 | 1
  // 图片数组
  pictures: Image[]
  // 患者ID
  patientId: string
  // 优惠券ID
  couponId: string
}

export type IllnessObj = Pick<Consult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>

// 问诊记录-全部可选
export type PartialConsult = Partial<Consult>
// Required 转换为全部必须   Partial 转换为全部可选  两个内置的泛型类型

// 科室
export type SubDep = {
  // 科室ID
  id: string
  // 科室名称
  name: string
}

export type TopDep = SubDep & {
  // 二级科室数组
  child: SubDep[]
}

// 问诊订单预支付传参
export type ConsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>

// 问诊订单预支付信息
export type ConsultOrderPreData = {
  // 积分抵扣
  pointDeduction: number
  // 优惠券抵扣
  couponDeduction: number
  // 优惠券ID
  couponId: string
  // 需付款
  payment: number
  // 实付款
  actualPayment: number
}

// 问诊订单单项信息
export type ConsultOrderItem = Consult & {
  // 创建时间
  createTime: string
  // 医生信息
  docInfo?: Doctor
  // 患者信息
  patientInfo: Patient
  // 订单编号
  orderNo: string
  // 订单状态
  status: OrderType
  // 状态文字
  statusValue: string
  // 类型问诊文字
  typeValue: string
  // 倒计时时间
  countdown: number
  // 处方ID
  prescriptionId?: string
  // 评价ID
  evaluateId: number
  // 应付款
  payment: number
  // 优惠券抵扣
  couponDeduction: number
  // 积分抵扣
  pointDeduction: number
  // 实付款
  actualPayment: number
  // 是否评价
  evaluateFlag: 0 | 1
}

// 接口参数类型
export type ConsultOrderListParams = PageParams & {
  // 问诊记录类型
  type: ConsultType
}
// 带分页问诊记录类型
export type ConsultOrderPage = {
  // 总页数
  pageTotal: number
  // 总条数
  total: number
  // 列表数据
  rows: ConsultOrderItem[]
}