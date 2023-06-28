<script setup lang="ts">
// 接收传入图标的名称：文件夹 + 图标名
defineProps<{
  name: string
}>()
</script>
<template>
  <svg aria-hidden="true" class="cp-icon">
    <use :href="`#icon-${name}`" />
  </svg>
</template>
<style scoped lang="scss">
.cp-icon {
  // 1em = 当前元素的 font-size
  width: 1em;
  height: 1em;
}
</style>
