<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import { computed, ref } from 'vue'
import { showLoadingToast } from 'vant'
import { useShowPrescription, useCancelOrder, useDelOrder } from '@/composable'
const props = defineProps<{
  item: ConsultOrderItem
}>()
const emit = defineEmits<{
  (e: 'del-order', id: string): void
}>()
// 1.0 显示更多
// 控制更多结构的显示与隐藏
const showPopover = ref(false)
// 更多结构的数据源
const actions = computed(() => {
  return [{ text: '查看处方', disabled: !props.item.prescriptionId }, { text: '删除订单' }]
})
// 点击选项的事件
const onSelect = async (action: any) => {
  if (action.text === '删除订单') {
    showLoadingToast({
      message: '加载中'
    })
    await delConsultOrder(props.item.id)
  } else {
    checkpre(props.item.prescriptionId)
  }
}
// 2.0 取消订单
const { loading, cancelConsultOrder } = useCancelOrder()
// const loading = ref(false)
// const cancelConsultOrder = async (item: ConsultOrderItem) => {
//   loading.value = true
//   setTimeout(async () => {
//     await cancelOrder(item.id)
//     // 提示成功
//     showSuccessToast('取消订单成功')
//     // 修改当前对象中的相关属性
//     item.status = OrderType.ConsultCancel
//     item.statusValue = '已取消'
//     loading.value = false
//   }, 2000)
// }
// 3.0 删除订单
const { delLoading, delConsultOrder } = useDelOrder((id) => {
  // 通知父组件，删除 id 对应的数据
  emit('del-order', id)
})
// const delLoading = ref(false)
// const delConsultOrder = (id: string) => {
//   delLoading.value = true
//   setTimeout(async () => {
//     await delOrder(id)
//     // 提示成功
//     showSuccessToast('订单删除成功')
//     // 通知父页面，删除订单数据
//     emit('del-order', id)
//     delLoading.value = false
//   }, 2000)
// }
// 4.0 查看处方
const { checkpre } = useShowPrescription()
</script>

<template>
  <div class="consult-item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>极速问诊（自动分配医生）</p>
      <span>{{ item.statusValue }}</span>
    </div>
    <div class="body" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ item.payment?.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>
    <!-- 待支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button
        :loading="loading"
        @click="cancelConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >取消问诊</van-button
      >
      <van-button
        @click="$router.push(`/user/consult/${item.id}`)"
        type="primary"
        plain
        size="small"
        round
        >去支付</van-button
      >
    </div>
    <!-- 待接诊 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button
        :loading="loading"
        @click="cancelConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >取消问诊</van-button
      >
      <van-button
        @click="$router.push(`/room?orderId=${item.id}`)"
        type="primary"
        plain
        size="small"
        round
        >继续沟通</van-button
      >
    </div>
    <!-- 咨询中 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button
        @click="checkpre(item.prescriptionId)"
        v-if="item.prescriptionId"
        class="gray"
        plain
        size="small"
        round
      >
        查看处方
      </van-button>
      <van-button
        @click="$router.push(`/room?orderId=${item.id}`)"
        type="primary"
        plain
        size="small"
        round
        >继续沟通</van-button
      >
    </div>
    <!-- 已完成 -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <div class="more">
        <cp-consult-more
          :dispabled="item.prescriptionId ? false : true"
          @on-check="checkpre(item.prescriptionId)"
          @on-del="delConsultOrder(item.id)"
        ></cp-consult-more>
        <!-- <van-popover
          placement="top-start"
          v-model:show="showPopover"
          :actions="actions"
          @select="onSelect"
        >
          <template #reference> 更多 </template>
        </van-popover> -->
      </div>
      <van-button
        @click="$router.push(`/room?orderId=${item.id}`)"
        class="gray"
        plain
        size="small"
        round
      >
        问诊记录
      </van-button>
      <van-button type="primary" plain size="small" round>查看评论</van-button>
    </div>
    <!-- 已取消 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        :loading="delLoading"
        @click="delConsultOrder(item.id)"
        class="gray"
        plain
        size="small"
        round
      >
        删除订单
      </van-button>
      <van-button @click="$router.push('/')" type="primary" plain size="small" round>
        咨询其它医生
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;
  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    .img {
      width: 20px;
      height: 20px;
    }
    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }
    > span {
      color: var(--cp-tag);
      &.orange {
        color: #f2994a;
      }
      &.green {
        color: var(--cp-primary);
      }
    }
  }
  .body {
    padding: 15px 15px 8px 15px;
    .body-row {
      display: flex;
      margin-bottom: 7px;
    }
    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }
    .body-value {
      width: 250px;
      &.tip {
        color: var(--cp-tip);
      }
    }
  }
  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .van-button {
      margin-left: 10px;
      padding: 0 16px;
      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }
    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
