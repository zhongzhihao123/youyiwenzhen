<script setup lang="ts">
import { getConsultOrderPayUrl } from '@/services/consult'
import { ref } from 'vue'

const props = defineProps<{
  // 关闭面板时会触发的事件
  beforeClose: () => void
  // 控制面板的显示与隐藏
  show: boolean
  // 订单金额
  actualPayment?: number
  // 订单 id
  orderId: string
  // 支付成功后的回跳页面
  callbackPath: string
}>()
const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
}>()
// 当我们修改面板状态时会触发
const updateshow = (v: boolean) => {
  emit('update:show', v)
}
// 支付方式
const paymentMethod = ref<0 | 1>()
// 发起支付
const submit = async () => {
  // 提交支付信息，得到支付页面路径
  const res = await getConsultOrderPayUrl({
    paymentMethod: paymentMethod.value + '',
    orderId: props.orderId,
    payCallback: props.callbackPath ? props.callbackPath : 'http://localhost:5173/room' // 支付成功后返回的页面路径
  })
  // 跳转到页面
  window.location.href = res.data.payUrl
}
</script>
<template>
  <van-action-sheet
    :before-close="beforeClose"
    :close-on-popstate="false"
    :closeable="false"
    :show="show"
    @update:show="updateshow"
    title="选择支付方式"
  >
    <!-- 支付抽屉 -->
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment?.toFixed(2) }}</p>
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
        <van-button @click="submit" type="primary" round block>立即支付 {{ orderId }}</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>
<style scoped lang="scss">
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
