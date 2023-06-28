// 封装功能逻辑的函数
import { OrderType } from '@/enums'
import { cancelOrder, delOrder, followDoctor, getPrescriptionPic } from '@/services/consult'
import { getMedicalOrderDetail } from '@/services/order'
import type { ConsultOrderItem } from '@/types/consult'
import type { OrderDetail } from '@/types/order'
import { showImagePreview, showSuccessToast, showToast } from 'vant'
import { onMounted, ref } from 'vue'

// 1.0 关注&取关功能
export const useFollow = () => {
  // 关注的加载状态
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    setTimeout(async () => {
      // 关注 & 取关
      await followDoctor(item.id)
      // 提示操作
      showToast(item.likeFlag ? '取关成功' : '关注成功')
      // 手动修改关注状态
      item.likeFlag = item.likeFlag ? 0 : 1
      loading.value = false
    }, 2000)
  }
  return {
    loading,
    follow
  }
}

// 2.0 查看处方
export const useShowPrescription = () => {
  const checkpre = async (id?: string) => {
    if (!id) return
    const res = await getPrescriptionPic(id)
    console.log(res.data.url)
    // 预览 url
    showImagePreview([res.data.url])
  }
  return { checkpre }
}

// 3.0 取消订单
export const useCancelOrder = () => {
  const loading = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    loading.value = true
    setTimeout(async () => {
      await cancelOrder(item.id)
      // 提示成功
      showSuccessToast('取消订单成功')
      // 修改当前对象中的相关属性
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      loading.value = false
    }, 2000)
  }
  return {
    loading,
    cancelConsultOrder
  }
}

// 4.0 删除订单
export const useDelOrder = (cb: (id: string) => void) => {
  const delLoading = ref(false)
  const delConsultOrder = (id: string) => {
    delLoading.value = true
    setTimeout(async () => {
      await delOrder(id)
      // 提示成功
      showSuccessToast('订单删除成功')
      // 这里要执行删除后的逻辑（不能写死，由用户传入）
      cb(id)
      delLoading.value = false
    }, 2000)
  }
  return {
    delLoading,
    delConsultOrder
  }
}

// 5.0 获取药品订单详情
export const useOrderDetail = (id: string) => {
  const medicalOrder = ref<OrderDetail>({} as OrderDetail)
  onMounted(async () => {
    const medRes = await getMedicalOrderDetail(id)
    medicalOrder.value = medRes.data
  })
  return {
    medicalOrder
  }
}
