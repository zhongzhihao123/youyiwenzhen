<script setup lang="ts">
import { IllnessTime } from '@/enums'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { OrderType } from '@/enums'
import { useCancelOrder, useDelOrder, useShowPrescription } from '@/composable'
import { useClipboard } from '@vueuse/core'
import { showConfirmDialog, showToast } from 'vant'

// 患病时间
const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More }
]
// 是否就诊
const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '未就诊过', value: 0 }
]
// 根据患病时间的数值，找到对应的文本
const getTimeWord = (v?: IllnessTime) => {
  if (v === undefined) return
  return timeOptions.find((item) => item.value === v)?.label
}
// 根据是否就诊的数值，找到对应的文本
const getFlagWord = (v?: 0 | 1) => {
  if (v === undefined) return
  return flagOptions.find((item) => item.value === v)?.label
}

// 1.0 渲染数据
const route = useRoute()
// 获取参数
const orderId = route.params.id
// 订单详情对象
const consultOrder = ref<ConsultOrderItem>()
onMounted(async () => {
  setTimeout(async () => {
    const res = await getConsultOrderDetail(orderId as string)
    consultOrder.value = res.data
  }, 2000)
})
// 2.0 取消订单
const { loading, cancelConsultOrder } = useCancelOrder()
// 3.0 删除订单
const router = useRouter()
const { delLoading, delConsultOrder } = useDelOrder(() => {
  // 删除成功后回到订单列表页面
  router.push('/user/consult/')
})
// 4.0 查看处方
const { checkpre } = useShowPrescription()
// 5.0 复制帐号
const { copy, copied, isSupported } = useClipboard()
// 定义一个复制的方法
const onCopy = () => {
  // 判断是否支持
  if (!isSupported) return showToast('浏览器不支持该功能')
  // 复制内容
  copy(consultOrder.value?.orderNo || '')
}
watch(copied, () => {
  if (copied.value) showToast('复制成功')
})
// 6.0 使用支付抽屉
const show = ref(false)
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
      // 跳转到首页
      router.push('/home')
    })
}
</script>

<template>
  <div class="consult-detail-page" v-if="consultOrder">
    <!-- 顶部导航 -->
    <cp-nav-bar title="问诊详情" />
    <!-- 头部信息 -->
    <div class="detail-head">
      <div class="text">
        <h3>图文问诊 {{ consultOrder?.actualPayment }} 元</h3>
        <span class="sta green">{{ consultOrder?.statusValue }}</span>
        <p class="tip">服务医生信息</p>
      </div>
      <div class="card">
        <img class="avatar" :src="consultOrder?.docInfo?.avatar" alt="" />
        <p class="doc">
          <span>极速问诊</span>
          <span>自动分配医生</span>
        </p>
        <van-icon name="arrow" />
      </div>
    </div>
    <!-- 患者信息 -->
    <div class="detail-patient">
      <van-cell-group :border="false">
        <van-cell
          title="患者信息"
          :value="`${consultOrder?.patientInfo.name} | ${consultOrder?.patientInfo.genderValue} | ${consultOrder?.patientInfo.age}岁`"
        />
        <van-cell title="患病时长" :value="getTimeWord(consultOrder?.illnessTime)" />
        <van-cell title="就诊情况" :value="getFlagWord(consultOrder?.consultFlag)" />
        <van-cell title="病情描述" :label="consultOrder?.illnessDesc" />
      </van-cell-group>
    </div>
    <!-- 订单信息 -->
    <div class="detail-order">
      <h3>订单信息</h3>
      <van-cell-group :border="false">
        <van-cell title="订单编号">
          <template #value>
            <span class="copy" @click="onCopy">复制</span>
            {{ consultOrder?.orderNo }}
          </template>
        </van-cell>
        <van-cell title="创建时间" :value="consultOrder?.createTime" />
        <van-cell title="应付款" :value="`￥${consultOrder?.payment.toFixed(2)}`" />
        <van-cell title="优惠券" :value="`-￥${consultOrder?.couponDeduction}`" />
        <van-cell title="积分抵扣" :value="`-￥${consultOrder?.pointDeduction}`" />
        <van-cell
          title="实付款"
          :value="`￥${consultOrder?.actualPayment.toFixed(2)}`"
          class="price"
        />
      </van-cell-group>
    </div>
    <!-- 倒计时 -->
    <div class="detail-time" v-if="consultOrder?.status === OrderType.ConsultPay">
      请在 <van-count-down :time="consultOrder?.countdown * 1000" /> 内完成支付，超时订单将取消
    </div>
    <!-- 底部操作栏 -->
    <!-- 待支付 -->
    <div
      class="detail-action van-hairline--top"
      v-if="consultOrder.status === OrderType.ConsultPay"
    >
      <div class="price">
        <span>需付款</span>
        <span>￥{{ consultOrder?.actualPayment.toFixed(2) }}</span>
      </div>
      <van-button :loading="loading" @click="cancelConsultOrder(consultOrder!)" type="default" round
        >取消问诊</van-button
      >
      <van-button @click="show = true" type="primary" round>继续支付</van-button>
    </div>
    <!-- 待接诊 -->
    <div
      class="detail-action van-hairline--top"
      v-if="consultOrder.status === OrderType.ConsultWait"
    >
      <van-button
        :loading="loading"
        @click="cancelConsultOrder(consultOrder!)"
        type="default"
        round
      >
        取消问诊
      </van-button>
      <van-button :to="`/room?orderId=${consultOrder.id}`" type="primary" round>
        继续沟通
      </van-button>
    </div>
    <!-- 咨询中 -->
    <div
      class="detail-action van-hairline--top"
      v-if="consultOrder.status === OrderType.ConsultChat"
    >
      <van-button
        @click="checkpre(consultOrder?.prescriptionId)"
        v-if="consultOrder.prescriptionId ? true : false"
        type="default"
        round
      >
        查看处方
      </van-button>
      <van-button :to="`/room?orderId=${consultOrder.id}`" type="primary" round>
        继续沟通
      </van-button>
    </div>
    <!-- 已完成 -->
    <div
      class="detail-action van-hairline--top"
      v-if="consultOrder.status === OrderType.ConsultComplete"
    >
      <CpConsultMore
        :dispabled="consultOrder.prescriptionId ? false : true"
        @on-check="checkpre(consultOrder?.id)"
        @on-del="delConsultOrder(consultOrder?.id!)"
      ></CpConsultMore>
      <van-button :to="`/room?orderId=${consultOrder.id}`" type="default" round>
        问诊记录
      </van-button>
      <van-button v-if="consultOrder.evaluateFlag === 0" type="primary" round>写评价</van-button>
      <van-button v-else type="primary" round>查看评价</van-button>
    </div>
    <!-- 已取消 -->
    <div
      class="detail-action van-hairline--top"
      v-if="consultOrder.status === OrderType.ConsultCancel"
    >
      <van-button
        :loading="delLoading"
        @click="delConsultOrder(consultOrder?.id!)"
        type="default"
        round
        >删除订单</van-button
      >
      <van-button to="/home" type="primary" round> 咨询其他医生 </van-button>
    </div>
    <!-- 支付抽屉 -->
    <!-- <CpPaySheet
      :actual-payment="consultOrder.actualPayment"
      v-model:show="show"
      :order-id="consultOrder.id"
      :before-close="beforeClose"
    ></CpPaySheet> -->
  </div>
  <!-- 骨架屏 -->
  <div class="consult-detail-page" v-else>
    <cp-nav-bar title="问诊详情" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
  </div>
</template>

<style lang="scss" scoped>
.consult-detail-page {
  padding: 46px 0 110px 0;
}
.detail-head {
  height: 140px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 135px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0), rgba(44, 181, 165, 0.2));
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
  }
  padding: 15px;
  .text {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 3px;
    .sta {
      color: var(--cp-tag);
      font-weight: 500;
      font-size: 16px;
      &.green {
        color: var(--cp-primary);
      }
      &.orange {
        color: #f2994a;
      }
    }
    .tip {
      width: 100%;
      color: var(--cp-text3);
      margin-top: 5px;
    }
  }
  .card {
    height: 74px;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    .avatar {
      width: 38px;
      height: 38px;
    }
    .doc {
      flex: 1;
      padding-left: 15px;
      > span {
        display: block;
        font-size: 16px;
        &:last-child {
          font-size: 13px;
          color: var(--cp-text3);
        }
      }
    }
    .van-icon {
      color: var(--cp-tip);
    }
  }
}
.detail-patient {
  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
  }
}
.detail-order {
  > h3 {
    padding: 10px 18px;
    font-weight: normal;
  }
  .copy {
    padding: 2px 10px;
    border: 1px solid var(--cp-primary);
    background-color: var(--cp-plain);
    color: var(--cp-primary);
    font-size: 12px;
    border-radius: 12px;
    margin-right: 10px;
  }
  :deep(.van-cell__title) {
    width: 70px;
    flex: none;
  }
  .price :deep(.van-cell__value) {
    font-size: 16px;
    color: var(--cp-price);
  }
}
.detail-action {
  height: 65px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: flex-end;
  padding: 0 15px;
  box-sizing: border-box;
  .price {
    flex: 1;
    > span:last-child {
      font-size: 18px;
      color: var(--cp-price);
      padding-left: 5px;
    }
  }
  .van-button {
    margin-left: 10px;
    padding-left: 17px;
    padding-right: 17px;
  }
  :deep(.van-button--default) {
    background-color: var(--cp-bg);
    color: var(--cp-text3);
  }
}
.van-cell {
  padding-left: 18px;
  padding-right: 18px;
}
.detail-time {
  position: fixed;
  left: 0;
  bottom: 65px;
  width: 100%;
  height: 44px;
  background-color: #fff7eb;
  text-align: center;
  line-height: 44px;
  font-size: 13px;
  color: #f2994a;
  .van-count-down {
    display: inline;
    color: #f2994a;
  }
}
</style>
