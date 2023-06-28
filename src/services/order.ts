import type { Address, OrderPre, OrderDetail, Logistics } from '@/types/order'
import { request } from '@/utils/request'

// 1. 订单-查询收货地址列表
export const getAddressList = () => request<Address[]>('/patient/order/address')

// 2. 药品订单-支付药款页面-根据处方信息计算药款
export const getMedicalOrderPre = (prescriptionId: string) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', { prescriptionId })
// 3. 药品订单-根据处方下药品订单
export const createMedicalOrder = (data: { id: string; addressId: string }) =>
  request<{ id: string }>('/patient/medicine/order', 'POST', data)
// 4. 药品订单-查询订单详情信息
export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>(`/patient/medicine/order/detail/${id}`)
// 5. 订单-查询物流信息
export const getMedicalOrderLogistics = (id: string) =>
  request<Logistics>(`/patient/order/${id}/logistics`)
