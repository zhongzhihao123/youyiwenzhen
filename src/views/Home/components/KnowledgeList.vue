<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgePage } from '@/services/consult'
import type { KnowledgePage, KnowledgeList, KnowledgeType } from '@/types/consult'
// 1. 上拉加载更多
// 接收 type
const props = defineProps<{
  type: KnowledgeType
}>()
// 当前页
const current = ref(1)
// 页容量
const pageSize = 5
// 是否正在请求下一页的数据
const loading = ref(false)
// 是否还有更多数据
const finished = ref(false)
// 数据源列表
const list = ref<KnowledgeList>([])
// 数据源对象
const knowledgeObj = ref<KnowledgePage>({} as KnowledgePage)
// 加载下一页数据时触发
const onLoad = async () => {
  const res = await getKnowledgePage({
    type: props.type,
    current: current.value,
    pageSize: pageSize
  })
  // 保存数据源对象
  knowledgeObj.value = res.data
  // 保存数据源列表
  list.value = [...list.value, ...res.data.rows]
  // 关闭加载状态
  loading.value = false
  // 当前页 + 1
  current.value += 1
  // 判断是否还在下一页
  if (knowledgeObj.value.total === list.value.length) {
    finished.value = true
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card :item="i" v-for="i in list" :key="i.id"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
