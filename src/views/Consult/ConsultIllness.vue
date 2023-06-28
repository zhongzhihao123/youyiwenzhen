<script setup lang="ts">
import { IllnessTime } from '@/enums'
import type { IllnessObj } from '@/types/consult'
import { showConfirmDialog, type UploaderFileListItem } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { uploadImage } from '@/services/consult'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { useConsultStore } from '@/stores'
import { useRouter } from 'vue-router'

// 1.0 准备数据
const form = ref<IllnessObj>({
  illnessDesc: '',
  illnessTime: IllnessTime.Week,
  consultFlag: 0,
  pictures: [] // 保存（上传到服务器中的）图片信息
})
const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More }
]
const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '未就诊过', value: 0 }
]
// 2.0 设置上传框的事件
const fileList = ref<UploaderFileListItem[]>([])
//  选中文件后会触发
const afterRead: UploaderAfterRead = async (item) => {
  // item：选中的文件(单个文件，多个文件)
  // 排除掉多文件的情况
  if (Array.isArray(item)) return
  // 单文件的情况，提交文件到服务
  // 将文件的上传状态设置为 uploading
  item.status = 'uploading'
  item.message = '上传中...'
  setTimeout(async () => {
    if (item.file) {
      const res = await uploadImage(item.file)
      // 将返回的图片信息保存起来
      form.value.pictures.push(res.data)
      // 将图片的 id 也保存到 item 中
      item.url = res.data.url
      item.status = 'done'
      item.message = '上传完成'
    }
  }, 2000)
}
const deleteItem = (item: UploaderFileListItem) => {
  // 将点击元素的对应的图片从 form 中的 picture 中删除就可以了
  form.value.pictures = form.value.pictures.filter((i) => item.url !== i.url)
}
// 3.0 设置按钮的禁用状态
const disabled = computed<boolean>(() => {
  const { illnessDesc, illnessTime, consultFlag, pictures } = form.value
  // 判断内容是否存在
  if (!illnessDesc) return true
  if (illnessTime === undefined) return true
  if (consultFlag === undefined) return true
  return false
})
// 4.0 保存数据
const store = useConsultStore()
const router = useRouter()
const next = () => {
  // 将患病信息保存到服务器
  store.setIllness(form.value)
  // 跳转到选择患者页面
  router.push('/user/patient?isChange=1')
}
// 5.0 数据回显
onMounted(async () => {
  // 判断就诊记录中是否存在患病信息
  if (store.consult.illnessDesc) {
    // 询问用户是否回显
    await showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      closeOnPopstate: false // 回退进入页面时，也要显示弹框
    })
    // 将数据进行回显
    const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
    // 保存数据
    form.value.illnessDesc = illnessDesc
    form.value.illnessTime = illnessTime!
    form.value.consultFlag = consultFlag!
    form.value.pictures = pictures!
    // 显示图片
    fileList.value = pictures!
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 表单 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="timeOptions" v-model="form.illnessTime" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="flagOptions" v-model="form.consultFlag" />
      </div>
      <!-- 上传结构 -->
      <div class="illness-img">
        <!-- v-model：预览选中的图片 delete：点击图片中的删除按钮时触发 after-read：选择好图片之后会触发-->
        <van-uploader
          v-model="fileList"
          :after-read="afterRead"
          @delete="deleteItem"
          upload-icon="photo-o"
          upload-text="上传图片"
          :max-count="3"
          :max-size="5 * 1024 * 1024"
        />
        <p v-if="fileList.length === 0" class="tip">上传内容仅医生可见,最多3张图,最大5MB</p>
      </div>
      <!-- 下一步按钮 -->
      <van-button :class="{ disabled: disabled }" @click="next" type="primary" block round>
        下一步
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}

.illness-tip {
  display: flex;
  padding: 15px;

  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }

  .info {
    flex: 1;
    padding-left: 12px;

    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }

    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }

    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;

      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}

.illness-form {
  padding: 15px;

  .van-field {
    padding: 0;

    &::after {
      border-bottom: none;
    }
  }

  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}

.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;

  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }

  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;

          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }

        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }

      &__upload {
        border-radius: 8px;
      }

      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
