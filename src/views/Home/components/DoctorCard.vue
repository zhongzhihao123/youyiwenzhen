<script lang="ts" setup>
import type { Doctor } from '@/types/consult'
// import { followDoctor } from '@/services/consult'
// import { showToast } from 'vant'
// import { ref } from 'vue'
import { useFollow } from '@/composable'

defineProps<{
  item: Doctor
}>()
// 1.0 关注操作
// 关注的加载状态
// const loading = ref(false)
// const follow = async (item: Doctor) => {
//   loading.value = true
//   setTimeout(async () => {
//     // 关注 & 取关
//     await followDoctor(item.id)
//     // 提示操作
//     showToast(item.likeFlag ? '取关成功' : '关注成功')
//     // 手动修改关注状态
//     item.likeFlag = item.likeFlag ? 0 : 1
//     loading.value = false
//   }, 2000)
// }
const { loading, follow } = useFollow()
</script>
<template>
  <div class="doctor-card">
    <van-image round :src="item.avatar" />
    <p class="name">{{ item.name }}</p>
    <p class="van-ellipsis">{{ item.hospitalName }} {{ item.depName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button :loading="loading" @click="follow(item)" round size="small" type="primary">
      {{ item.likeFlag ? '已关注' : '+ 关注' }}
    </van-button>
  </div>
</template>
<style scoped lang="scss">
.doctor-card {
  width: 135px;
  height: 190px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
