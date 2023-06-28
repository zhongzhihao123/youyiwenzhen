<script setup lang="ts">
import { showLoadingToast } from 'vant'
import { computed, ref } from 'vue'
// 接收一个禁用属性
const props = defineProps<{
  dispabled: boolean
}>()
const emit = defineEmits<{
  (e: 'on-check'): void
  (e: 'on-del'): void
}>()
// 控制气泡的显示与隐藏
const showPopover = ref(false)
const actions = computed(() => {
  return [{ text: '查看处方', disabled: props.dispabled }, { text: '删除订单' }]
})
// 选择事件
const onSelect = (action: any, index: number) => {
  if (index === 0) {
    emit('on-check')
  } else {
    showLoadingToast('.....')
    emit('on-del')
  }
}
</script>
<template>
  <div class="cp-consult-more">
    <van-popover
      placement="top-start"
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>
<style scoped></style>
