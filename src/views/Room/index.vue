<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import io, { Socket } from 'socket.io-client'
import { BASE_URL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, nextTick, provide } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType } from '@/enums'
import { getConsultOrderDetail } from '@/services/consult'
import { showToast } from 'vant'
import type { ConsultOrderItem } from '@/types/consult'

// 1.0 使用 websocket 建立连接
// 得到 userStore 对象
const userStore = useUserStore()
// 得到 route 对象
const route = useRoute()
let socket: Socket
// 定义消息列表
const list = ref<Message[]>([])
onMounted(() => {
  // 创建 socket 对象，建立连接
  socket = io(BASE_URL, {
    auth: {
      token: `Bearer ${userStore.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  // 设置连接成功的事件
  socket.on('connect', () => {
    // 清除数据源
    list.value = []
    // 获取默认聊天记录（chatMsgList：如果有聊天记录，直接返回记录，如果没有返回默认数据）
    socket.on('chatMsgList', (res: { data: TimeMessages[] }) => {
      // 得到最后一个元素
      const arr = res.data[0].items
      // 将最后一条数据的状态设置为已读取
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      console.log(res.data)
      res.data.forEach((item, index) => {
        if (index === 0) time.value = item.createTime
        // 将返回的默认消息添加到消息列表中
        list.value.unshift(...item.items)
        // 将返回的时间也定义为一条消息
        list.value.unshift({
          msgType: MsgType.Notify,
          createTime: item.createTime,
          msg: {
            content: item.createTime
          }
        })
      })
      // 判断长度是否为 0
      if (res.data.length === 0) {
        showToast('没有聊天记录了')
      }
      // 判断是否是第一次
      if (initList.value) {
        // 滚动到底部
        nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
          // 将第一次标识改为 false
          initList.value = false
        })
      }
    })
  })
  socket.on('error', () => {
    console.log('错误事件')
  })
  socket.on('disconnect', () => {
    console.log('断开连接')
  })
})
onUnmounted(() => {
  // 断开连接
  socket.close()
})
// 2.0 得到订单状态
// 定义订单详情
const consultOrder = ref<ConsultOrderItem>()
// 获取订单详情
const getConsultOrder = async () => {
  if (route.query.orderId === undefined) return showToast('订单不存在')
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consultOrder.value = res.data
}
onMounted(async () => {
  // 先获取订单状态
  await getConsultOrder()
  // 监听订单状态是否变化
  socket.on('statusChange', async () => {
    await getConsultOrder()
  })
})
// 3.0 发送消息（文字）
const sendText = (v: string) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consultOrder.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: v
    }
  })
}
// 4.0 接收并渲染消息（文字 & 图片）
onMounted(() => {
  socket.on('receiveChatMsg', async (data: Message) => {
    // 将信息保存到 list 中
    list.value.push(data)
    // 将消息设置为已读
    socket.emit('updateMsgStatus', data.id)
    await nextTick()
    // 让页面滚动到最下方
    window.scrollTo(0, document.body.scrollHeight)
  })
})
// 5.0 图片聊天
const sendImg = (img: { id: string; url: string }) => {
  // 将信息提示到服务器
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consultOrder.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: {
      picture: img
    }
  })
}
// 6.0 加载聊天记录
const loading = ref(false)
const time = ref('')
const refresh = () => {
  // 得到之前聊天记录
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
  // 关闭加载效果
  loading.value = false
}
// 是否是第一次加载记录
const initList = ref(true)
// 7.0 向外界传入数据
provide('consultOrder', consultOrder)
// 8.0 准备一个修改评论状态的方法
const completeEva = (score: number) => {
  // 得到评价
  const eva = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (eva) {
    // 修改状态和分类
    eva.msgType = MsgType.CardEva
    eva.msg.evaluateDoc = {
      score
    }
  }
}
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 顶部订单状态栏 -->
    <room-status
      :status="consultOrder?.status!"
      :countdown="consultOrder?.countdown!"
    ></room-status>
    <van-pull-refresh @refresh="refresh" v-model="loading">
      <!-- 消息卡片区域 -->
      <room-message :list="list"></room-message>
    </van-pull-refresh>
    <!-- 底部订单操作栏 -->
    <room-action
      @send-img="sendImg"
      @send-text="sendText"
      :status="consultOrder?.status!"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
