<script setup lang="ts">
import ConsultItem from './ConsultItem.vue'
import { getConsultOrderList } from '@/services/consult'
import { ref } from 'vue'
import type { ConsultType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
// 1.0 得到订单数据源
const props = defineProps<{
  type: ConsultType
}>()
// 加载状态
const loading = ref(false)
// 完结状态
const finished = ref(false)
// 定义一个数据源
const list = ref<ConsultOrderItem[]>([])
// 参数对象
const params = ref({
  type: props.type,
  current: 1,
  pageSize: 5
})
// 加载事件
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  console.log(list.value)
  // 关闭加载状态
  loading.value = false
  // 判断数据源是否加载完毕
  if (res.data.pageTotal > params.value.current) {
    // 将页码 ++
    params.value.current += 1
  } else {
    // 数据加载完毕
    finished.value = true
  }
}
// 2.0 删除订单数据
const delOrder = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item @del-order="delOrder" :item="item" v-for="(item, index) in list" :key="index" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
