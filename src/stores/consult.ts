// 保存问诊记录数据
import { defineStore } from 'pinia'
import type { PartialConsult, IllnessObj } from '@/types/consult'
import { ref } from 'vue'
import type { ConsultType } from '@/enums'
export const useConsultStore = defineStore(
  'consult',
  () => {
    // 定义问诊记录
    const consult = ref<PartialConsult>({})
    // 设置问诊类型
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    // 设置问诊类型
    const setIllnessType = (type: 0 | 1) => {
      consult.value.illnessType = type
    }
    // 设置科室
    const setDepId = (id: string) => {
      consult.value.depId = id
    }
    // 设置患病信息
    const setIllness = (obj: IllnessObj) => {
      consult.value.illnessDesc = obj.illnessDesc
      consult.value.illnessTime = obj.illnessTime
      consult.value.consultFlag = obj.consultFlag
      consult.value.pictures = obj.pictures
    }
    // 设置患者信息
    const setPatientId = (id: string) => {
      consult.value.patientId = id
    }
    // 设置优惠券
    const setCouponId = (id: string) => {
      consult.value.couponId = id
    }
    // 清除方法
    const clear = () => {
      consult.value = {}
    }
    return {
      consult,
      setType,
      setIllnessType,
      setDepId,
      setIllness,
      setPatientId,
      setCouponId,
      clear
    }
  },
  {
    persist: true
  }
)
