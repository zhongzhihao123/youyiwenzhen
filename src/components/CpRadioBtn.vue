<script setup lang="ts">
// 接收外界的数据源
defineProps<{
  // 选项的数据源
  options: {
    label: string // 选项的文本
    value: string | number // 选项的值
  }[]
  // 选中的默认值
  modelValue?: string | number
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
}>()
// 修改选中的选项
const changeActive = (v: string | number) => {
  emit('update:modelValue', v)
}
</script>

<template>
  <div class="cp-radio-btn">
    <a
      class="item"
      :class="{ active: modelValue === item.value }"
      @click="changeActive(item.value)"
      href="javascript:;"
      v-for="(item, index) in options"
      :key="index"
    >
      {{ item.label }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
