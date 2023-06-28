<script setup lang="ts">
import { OrderType } from '@/enums'
import { showToast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { ref } from 'vue'
import { uploadImage } from '@/services/consult'

defineProps<{
  status: OrderType
}>()
const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-img', pic: { id: string; url: string }): void
}>()
// 1.0 发送消息
const text = ref('')
const sendText = () => {
  // 判断输入框中的内容是否为空
  if (text.value.trim() === '') return showToast('内容不能为空')
  console.log('sendText', text.value)
  // 将数据提交到问诊室页面中
  emit('send-text', text.value)
  // 清空输入框
  text.value = ''
}
// 2.0 图片聊天
const afterRead: UploaderAfterRead = async (item) => {
  // 判断它是否是数组
  if (Array.isArray(item)) return
  if (item.file) {
    // 将选中的图片上传到服务器
    const res = await uploadImage(item.file)
    // 得到返回的图片地址
    console.log(res.data.url)
    // 将图片地址交给 room 页面
    emit('send-img', res.data)
  }
}
</script>

<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      v-model="text"
      @keyup.enter="sendText"
      :border="false"
      :disabled="status !== OrderType.ConsultChat"
      placeholder="问医生"
      autocomplete="off"
    ></van-field>
    <van-uploader :after-read="afterRead" :preview-image="false">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
