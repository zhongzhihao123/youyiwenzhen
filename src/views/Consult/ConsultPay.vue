<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder, getConsultOrderPayUrl } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import type { ConsultOrderPreData } from '@/types/consult'
import { onMounted, ref } from 'vue'
import { useConsultStore } from '@/stores'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showDialog, showToast } from 'vant'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import CpPaySheet from '@/components/CpPaySheet.vue'
// 1. 渲染信息
const consultOrder = ref<ConsultOrderPreData>()
const patientObj = ref<Patient>()
const store = useConsultStore()
// 获取信息
onMounted(async () => {
  const { type, illnessType, patientId, illnessDesc, illnessTime, consultFlag } = store.consult
  // 判断问诊信息
  if (!illnessDesc || illnessTime === undefined || consultFlag === undefined) {
    // 提示不存在信息，跳转到首页
    showDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false
    }).then(() => {
      // 跳转回首页
      router.push('/home')
    })
  }
  // 获取订单信息
  const res = await getConsultOrderPre({
    type: type, // 问诊类型
    illnessType: illnessType // 极速问诊的类型
  })
  // 保存订单信息
  consultOrder.value = res.data
  // 获取患者信息
  const patientRes = await getPatientDetail(patientId!)
  patientObj.value = patientRes.data
})
// 2.0 立即支付
const agree = ref(false)
// 订单 id
const orderId = ref('')
// 控制面板的显示与隐藏
const show = ref(false)
// 设置一个支付方式
const paymentMethod = ref<0 | 1>()
const pay = async () => {
  // 同意协议
  if (!agree.value) return showToast('请先同意协议')
  // // 生成订单
  // const res = await createConsultOrder(store.consult!)
  // orderId.value = res.data.id
  // 打开面板
  show.value = true
  // 清除之前的问诊信息
  store.clear()
}
// 3.0 获取支付页面
const submit = async () => {
  // 提交支付信息，得到支付页面路径
  const res = await getConsultOrderPayUrl({
    paymentMethod: paymentMethod.value + '',
    orderId: orderId.value,
    payCallback: 'http://localhost:5173/room' // 支付成功后返回的页面路径
  })
  // 跳转到页面
  window.location.href = res.data.payUrl
}
// 4.0 提示关闭支付信息
const router = useRouter()
const beforeClose = () => {
  // 提示
  showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付'
  })
    .then(() => {
      return false // 阻止继续支付
    })
    .catch(() => {
      // 清除订单 id
      orderId.value = ''
      // 跳转到首页
      router.push('/home')
    })
}
// 5.0 阻止回退（onBeforeRouteLeave：当离开页面之前会触发）
//  return false ：中断离开的操作
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})
</script>

<template>
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <!-- 医生信息 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ consultOrder?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <!-- 订单信息 -->
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${consultOrder?.couponDeduction}.00`" />
      <van-cell title="积分抵扣" :value="`-¥${consultOrder?.pointDeduction}.00`" />
      <van-cell title="实付款" :value="`¥${consultOrder?.actualPayment}.00`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 患者信息 -->
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patientObj?.name} | ${patientObj?.genderValue} | ${patientObj?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 支付按钮 -->
    <van-submit-bar
      button-type="primary"
      :price="consultOrder?.actualPayment ? consultOrder?.actualPayment * 100 : 0"
      button-text="立即支付"
      @click="pay"
      text-align="left"
    />
    <!-- 支付抽屉 -->
    <!-- <cp-pay-sheet
      :before-close="beforeClose"
      v-model:show="show"
      :actual-payment="consultOrder?.actualPayment"
      :order-id="orderId"
    ></cp-pay-sheet> -->
    <!-- <van-action-sheet
      :before-close="beforeClose"
      :close-on-popstate="false"
      :closeable="false"
      v-model:show="show"
      title="选择支付方式"
    >
      <div class="pay-type">
        <p class="amount">￥{{ consultOrder?.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button @click="submit" type="primary" round block>立即支付</van-button>
        </div>
      </div>
    </van-action-sheet> -->
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
