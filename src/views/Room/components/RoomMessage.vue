<script setup lang="ts">
import type { Message, Prescription } from '@/types/room'
import { IllnessTime, MsgType, PrescriptionStatus } from '@/enums'
import type { Image } from '@/types/consult'
import { showImagePreview, showToast } from 'vant'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores'
// import { getPrescriptionPic } from '@/services/consult'
import { useRouter } from 'vue-router'
import EvaluateCard from './EvaluateCard.vue'
import { useShowPrescription } from '@/composable'

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
const getTimeWord = (v: IllnessTime) => {
  return timeOptions.find((item) => item.value === v)?.label
}
// 根据是否就诊的数值，找到对应的文本
const getFlagWord = (v: 0 | 1) => {
  return flagOptions.find((item) => item.value === v)?.label
}

defineProps<{
  list: Message[]
}>()
// 1.0 预览图片
const preImg = (pics: Image[]) => {
  // 判断图片的长度
  if (pics.length === 0) return showToast('暂无图片')
  const arr = pics.map((item) => item.url)
  // 预览
  showImagePreview(arr)
}

// 定义一个处理时间的函数
const formatTime = (time: string) => dayjs(time).format('hh:mm')
const userStore = useUserStore()
// 2. 查看处方
const { checkpre } = useShowPrescription()
// const checkpre = async (id: string) => {
//   const res = await getPrescriptionPic(id)
//   // 预览 url
//   showImagePreview([res.data.url])
// }
// 3. 购买药品
const router = useRouter()
const buy = (pre?: Prescription) => {
  // 判断
  if (!pre) return showToast('处方不存在')
  // 判断处方失效
  if (pre.status === PrescriptionStatus.Invalid) return showToast('处方已失效')
  // 判断：没付款且有订单 ID
  if (pre.status === PrescriptionStatus.NotPayment && pre.orderId)
    // 跳转到订单详情页面付款
    return router.push(`/order/${pre.orderId}`)
  // 判断：没付款且没有订单 id
  if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
    // 跳转到预支付页面
    return router.push(`/order/pay?id=${pre.id}`)
}
</script>

<template>
  <!-- 渲染数据 -->
  <div v-for="(item, index) in list" :key="index">
    <!-- 通知 -->
    <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
      <div class="content">
        <span>{{ item.msg.content }}</span>
      </div>
    </div>
    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ item.msg.consultRecord?.patientInfo.name }}
          {{ item.msg.consultRecord?.patientInfo.genderValue }}
          {{ item.msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getTimeWord(item.msg.consultRecord?.illnessTime!) }} |
          {{ getFlagWord(item.msg.consultRecord?.consultFlag!) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="preImg(item.msg.consultRecord?.pictures!)">点击查看</van-col>
      </van-row>
    </div>
    <!-- 发送文字 -->
    <div
      class="msg msg-to"
      v-if="item.msgType === MsgType.MsgText && item.from === userStore.user?.id"
    >
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <div class="pao">{{ item.msg.content }}</div>
      </div>
      <van-image :src="item.fromAvatar" />
    </div>
    <!-- 接收文字  -->
    <div
      class="msg msg-from"
      v-if="item.msgType === MsgType.MsgText && item.from !== userStore.user?.id"
    >
      <van-image
        src="https://img1.baidu.com/it/u=2536509876,2033929012&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
      />
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <div class="pao">{{ item.msg.content }}</div>
      </div>
    </div>
    <!-- 发送图片 -->
    <div
      class="msg msg-to"
      v-if="item.msgType === MsgType.MsgImage && item.from === userStore.user?.id"
    >
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <van-image fit="contain" :src="item.msg.picture?.url" />
      </div>
      <van-image :src="item.fromAvatar" />
    </div>
    <!-- 接收图片 -->
    <div
      class="msg msg-from"
      v-if="item.msgType === MsgType.MsgImage && item.from !== userStore.user?.id"
    >
      <van-image
        src="https://img1.baidu.com/it/u=2536509876,2033929012&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
      />
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <van-image :src="item.msg.picture?.url" />
      </div>
    </div>
    <!-- 处方消息 -->
    <div class="msg msg-recipe" v-if="item.msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit" @click="checkpre(item.msg.prescription?.id!)">
            <h3>电子处方</h3>
            <p>原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>
            {{ item.msg.prescription?.name }}
            {{ item.msg.prescription?.genderValue }}
            {{ item.msg.prescription?.age }}岁
            {{ item.msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ item.msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="i in item.msg.prescription?.medicines" :key="i.id">
            <div class="durg">
              <p>{{ i.name }}</p>
              <p>{{ i.usageDosag }}</p>
            </div>
            <div class="num">x{{ i.quantity }}</div>
          </div>
        </div>
        <div class="foot" @click="buy(item.msg.prescription)"><span>购买药品</span></div>
      </div>
    </div>
    <div
      class="msg"
      v-if="item.msgType === MsgType.CardEvaForm || item.msgType === MsgType.CardEva"
    >
      <!-- 评论信息 -->
      <EvaluateCard :myscore="item.msg.evaluateDoc?.score" :type="item.msgType"></EvaluateCard>
    </div>
  </div>
  <!-- 温馨提示 - 通知 -->
  <!-- <div class="msg msg-tip">
    <div class="content">
      <span class="green">温馨提示：</span>
      <span>在线咨询不能代替面诊，医护人员建议仅供参考</span>
    </div>
  </div> -->
  <!-- 订单取消 -->
  <!-- <div class="msg msg-tip msg-tip-cancel">
    <div class="content">
      <span>订单取消</span>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
