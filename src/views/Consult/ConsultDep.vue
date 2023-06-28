<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getAllDep } from '@/services/consult'
import type { TopDep, SubDep } from '@/types/consult'
import { useConsultStore } from '@/stores'
// 定义选中 item 的下标
const active = ref(0)
// 1.0 获取所有科室数据源
// 科室数据源
const dataList = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDep()
  dataList.value = res.data
})
// 2.0 得到二级科室数据
const subList = computed<SubDep[]>(() => {
  if (!dataList.value.length) return []
  return dataList.value[active.value].child
})
// 3.0 保存科室 id
const store = useConsultStore()
const saveDepId = (id: string) => {
  store.setDepId(id)
}
</script>

<template>
  <div class="consult-dep-page">
    <!-- 头部导航 -->
    <cp-nav-bar title="选择科室" />
    <!-- 侧边导航 -->
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="item in dataList" :key="item.id" :title="item.name" />
      </van-sidebar>
      <!-- 二级科室 -->
      <div class="sub-dep">
        <router-link
          @click="saveDepId(item.id)"
          v-for="item in subList"
          :key="item.id"
          to="/consult/illness"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
}
.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
