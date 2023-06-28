<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/services/order'
import type { Logistics } from '@/types/order'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'
import carImg from '@/assets/car.png'
const route = useRoute()
const orderLogistics = ref<Logistics>()
onMounted(async () => {
  // 1.0 渲染物流信息
  const res = await getMedicalOrderLogistics(route.params.id as string)
  orderLogistics.value = res.data
  // 2.0 使用地图
  AMapLoader.load({
    key: '393ca2bd8b2202923625faae133edf5f',
    version: '2.0'
  }).then((AMap) => {
    // 使用 AMap 初始化地图
    const map = new AMap.Map('map', {
      mapStyle: 'amap://styles/normal',
      zoom: 12
    })
    // 绘制轨迹
    AMap.plugin('AMap.Driving', function () {
      const driving = new AMap.Driving({
        map: map,
        showTraffic: false, // 关闭实时路况
        hideMarkers: true // 关闭默认覆盖物
      })
      // 设置位置（起点，终点）
      const start = res.data.logisticsInfo.shift()
      // 绘制起点
      var startMarker = new AMap.Marker({
        icon: startImg,
        position: [start?.longitude, start?.latitude],
        anchor: 'bottom-center'
      })
      map.add(startMarker)
      const end = res.data.logisticsInfo.pop()
      // 绘制终点
      var endMarker = new AMap.Marker({
        icon: endImg,
        position: [end?.longitude, end?.latitude],
        anchor: 'bottom-center'
      })
      map.add(endMarker)
      // 绘制点
      driving.search(
        [start?.longitude, start?.latitude],
        [end?.longitude, end?.latitude],
        {
          waypoints: res.data.logisticsInfo.map((item) => [item.longitude, item.latitude])
        },
        (status: string, result: object) => {
          // 当初始化之后，再设置物品的位置
          const carMarker = new AMap.Marker({
            icon: carImg,
            position: [
              res.data.currentLocationInfo?.longitude,
              res.data.currentLocationInfo?.latitude
            ],
            anchor: 'bottom-center'
          })
          map.add(carMarker)
          setTimeout(() => {
            // 以当前物品所在位置为中心点
            map.setFitView([carMarker])
            map.setZoom(20)
          }, 3000)
        }
      )
    })
  })
})
window._AMapSecurityConfig = {
  // 自己申请的 key
  securityJsCode: '5b21edccfff72d7e56ac710553ff29f5'
}
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ orderLogistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">
          订单{{ orderLogistics?.statusValue }}
          {{ orderLogistics?.estimatedTime }}
        </p>
        <p class="predict">
          <span>{{ orderLogistics?.name }}</span>
          <span>{{ orderLogistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="i in orderLogistics?.list" :key="i.id">
          <p class="status">{{ i.statusValue }}</p>
          <p class="content">{{ i.content }}</p>
          <p class="time">{{ i.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
