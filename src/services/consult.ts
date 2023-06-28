import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  pageParams,
  DoctorPage,
  FollowType,
  TopDep,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartialConsult,
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage
} from '@/types/consult'

// 1. 首页-查询推荐/减脂/饮食健康/关注页面--百科文章列表
export const getKnowledgePage = (p: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'get', p)
// 2. 首页-关注的医生列表
export const getDoctorPage = (p: pageParams) => request<DoctorPage>('/home/page/doc', 'get', p)
// 3. 关注-关注操作
export const followDoctor = (id: string, type: FollowType = 'doc') =>
  request('/like', 'POST', { type, id })
// 4. 找医生--查询所有科室-层级
export const getAllDep = () => request<TopDep[]>('/dep/all')
// 5. 上传文件/图片
export const uploadImage = (file: File) => {
  // 将文件管理 到 formData 中
  const fd = new FormData()
  fd.append('file', file)
  return request<{ id: string; url: string }>('/upload', 'POST', fd)
}
// 6. 问诊-支付页面-计算就诊信息和抵扣信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('/patient/consult/order/pre', 'get', params)
// 7. 问诊-保存/修改问诊订单
export const createConsultOrder = (params: PartialConsult) =>
  request<{ id: string }>('/patient/consult/order', 'POST', params)
// 8. 订单-支付接口
export const getConsultOrderPayUrl = (params: {
  paymentMethod: string
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('/patient/consult/pay', 'POST', params)
// 9. 问诊-查询订单详情信息-找医生、极速问诊和开药问诊
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('/patient/consult/order/detail', 'get', { orderId })
// 10. 药品订单-根据处方ID查询处方单
export const getPrescriptionPic = (id: string) =>
  request<{ url: string }>(`/patient/consult/prescription/${id}`)
// 11. 问诊-订单-评价医生
export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: number
}) => request('/patient/order/evaluate', 'POST', data)
// 12. 问诊记录-订单列表-找医生、极速问诊、开药问诊
export const getConsultOrderList = (params: ConsultOrderListParams) =>
  request<ConsultOrderPage>('/patient/consult/order/list', 'GET', params)
// 13. 订单-取消订单
export const cancelOrder = (id: string) => request(`/patient/order/cancel/${id}`, 'PUT')
// 14. 订单-删除订单
export const delOrder = (id: string) => request(`/patient/order/${id}`, 'delete')
