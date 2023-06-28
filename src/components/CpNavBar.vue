<script setup lang="ts">
import {} from 'vant'
import { useRouter } from 'vue-router'
// 得到 router 对象
const router = useRouter()
// 接收外界的参数
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void // 函数：用来决定将来点击左侧的箭头是否需要执行用户自己的逻辑
}>()
// 得到 emit 对象
const emit = defineEmits<{
  (e: 'clickRight'): void
}>()
// 点击右侧结构会触发的事件
const clickRight = () => {
  // 触发外界的事件
  emit('clickRight')
}
// 点击左侧结构会触发的事件
const clickLeft = () => {
  // 如果外界传入了 back 事件，点击左侧箭头就不执行默认逻辑，而是执行外界传入的 back 事件
  if (props.back) {
    return props.back()
  }
  // 判断上一个页面是否与当前页面是同一个网址
  if (history.state.back) {
    // 返回到上一个页面
    router.back()
  } else {
    // 跳转到 /
    router.push('/')
  }
}
</script>
<template>
  <van-nav-bar
    @click-right="clickRight"
    @click-left="clickLeft"
    :left-arrow="true"
    :right-text="rightText"
    :title="title"
    :fixed="true"
  />
</template>
<style scoped lang="scss">
::v-deep() {
  // 左侧文本大小&颜色
  .van-nav-bar__arrow {
    font-size: 18px;
    color: var(--cp-text1);
  }
  // 右侧文本大小
  .van-nav-bar__text {
    font-size: 15px;
  }
}
</style>
