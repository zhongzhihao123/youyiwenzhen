<script lang="ts" setup>
import { MsgType } from '@/enums'
import { showToast } from 'vant'
import { inject, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { evaluateConsultOrder } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'

defineProps<{
  type: MsgType
  myscore?: number
}>()
const route = useRoute()
// 1. 准备参数
const consultOrder = inject<Ref<ConsultOrderItem>>('consultOrder')
const completeEva = inject<(score: number) => void>('completeEva')
const score = ref(0)
const content = ref('')
const anonymousFlag = ref(false)
const orderId = route.query.orderId
// 提示评价的方法
const submit = async () => {
  // 校验数据的合法性
  if (!score.value) return showToast('评分不能为空')
  if (!content.value) return showToast('评论内容不能为空')
  if (!orderId) return showToast('订单 id 不能为空')
  if (!consultOrder?.value.docInfo?.id) return showToast('医生 id 不能为空')
  // 提交评价
  await evaluateConsultOrder({
    docId: consultOrder?.value.docInfo?.id,
    orderId: orderId as string,
    score: score.value,
    content: content.value,
    anonymousFlag: anonymousFlag.value ? 1 : 0
  })
  // 将当前评价对应的状态改为已评价，还要给 显示评价 的结构设置分数
  completeEva && completeEva(score.value)
}
</script>
<template>
  <!-- 显示评价 -->
  <div class="evalutate-card" v-if="type === MsgType.CardEva">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :model-value="myscore"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>
  <!-- 评价表单 -->
  <div class="evalutate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      v-model="score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
    <van-field
      v-model="content"
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button @click="submit" type="primary" size="small" round> 提交评价 </van-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.evalutate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;
  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }
  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    ::v-deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }
        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }
        height: 16px;
      }
      .van-button {
        padding: 0 16px;
        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
