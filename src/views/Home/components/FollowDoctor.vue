<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'
import { getDoctorPage } from '@/services/consult'
import { onMounted, ref } from 'vue'
import type { DoctorList, pageParams } from '@/types/consult'
// 1. 动态得到屏幕的宽度
const { width } = useWindowSize()
// 2. 渲染关注医生
// 定义参数
const params = ref<pageParams>({
  current: 1,
  pageSize: 5
})
// 定义数据源
const doctorList = ref<DoctorList>([])
onMounted(async () => {
  const res = await getDoctorPage(params.value)
  doctorList.value = res.data.rows
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe :width="(150 / 375) * width" :show-indicators="false" :loop="false">
        <van-swipe-item v-for="item in doctorList" :key="item.id">
          <DoctorCard :item="item"></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
