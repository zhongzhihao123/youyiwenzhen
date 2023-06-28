<script setup lang="ts">
// 导入 api
import { getPatientList, addPatient, updatePatient, delPatient } from '@/services/user'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import IDValidator from 'id-validator'
import { useRoute, useRouter } from 'vue-router'
import { useConsultStore } from '@/stores'
// 1. 获取患者信息
const patientList = ref<Patient[]>([])
// 封装得到数据源的方法
const getList = async () => {
  const res = await getPatientList()
  patientList.value = res.data
}
onMounted(async () => {
  await getList()
  // 默认选中
  // 判断是否存在默认患者
  const obj = patientList.value.find((item) => item.defaultFlag)
  if (patientList.value.length === 0) return
  if (!isChange.value) return
  if (obj) {
    // 将默认患者的 id 保存起来
    patientId.value = obj.id
  } else {
    // 将第一个患者信息当作默认值
    patientId.value = patientList.value[0].id
  }
})
// 2. 显示侧边栏
const show = ref(false)
const shoPop = () => {
  // 清空数据源
  patient.value = {
    name: '',
    idCard: '',
    gender: 1,
    defaultFlag: 0
  }
  show.value = true
}
// 3. 绑定侧边栏的表单结构
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
const patient = ref<Patient>({
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
})
// 4. 数据校验
// 5. 添加患者
var Validator = new IDValidator()
const submit = async () => {
  // 名字非空
  if (patient.value.name.trim() === '') return showToast('名字不能为空')
  // 身份证非空
  if (patient.value.idCard.trim() === '') return showToast('身份证不能为空')
  // 校验身份证信息是否合法
  if (!Validator.isValid(patient.value.idCard)) return showToast('身份证不合法')
  // 校验身份证号码与性别一致
  const { sex } = Validator.getInfo(patient.value.idCard)
  if (sex !== patient.value.gender) return showToast('性别与身份证不符')
  // 添加患者 || 编辑患者
  patient.value.id ? await updatePatient(patient.value) : await addPatient(patient.value)
  // 提示新增成功  || 编辑成功
  showSuccessToast(patient.value.id ? '编辑成功' : '新增成功')
  // 关闭面板
  show.value = false
  // 更新患者数据
  getList()
}
// 6. 编辑患者
const openEdit = (item: Patient) => {
  show.value = true
  // 将 item 保存到 patient 中
  patient.value = {
    name: item.name,
    idCard: item.idCard,
    defaultFlag: item.defaultFlag,
    id: item.id,
    gender: item.gender
  }
}
// 7. 删除患者
const remove = async () => {
  // 提示用户是否删除
  await showConfirmDialog({
    title: '温馨提示',
    message: '是否删除当前患者'
  })
  // 发送请求
  await delPatient(patient.value.id!)
  // 提示删除成功
  showSuccessToast('删除成功')
  // 关闭面板
  show.value = false
  // 更新数据
  getList()
}
// 8. 接收区别的标识
const route = useRoute()
const isChange = computed<boolean>(() => {
  const params = route.query.isChange
  if (params) return true
  return false
})
// 9. 选中效果
const patientId = ref<string>()
// 设置选中的 id
const selectId = (id: string | undefined) => {
  if (!isChange.value) return
  patientId.value = id
}
// 下一步
const store = useConsultStore()
const router = useRouter()
const next = () => {
  if (!patientId.value) return
  // 记录当前选中的患者信息
  store.setPatientId(patientId.value)
  // 跳转到支付页面
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <!-- 头部导航 -->
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <!-- 头部提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div class="patient-list">
      <div
        @click="selectId(item.id)"
        class="patient-item"
        :class="{ selected: patientId === item.id }"
        v-for="(item, index) in patientList"
        :key="index"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2') }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div @click="openEdit(item)" class="icon"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag">默认</div>
      </div>
      <div v-if="patientList.length < 6" class="patient-add" @click="shoPop">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
      <!-- 底部按钮 -->
      <div class="patient-next" v-if="isChange">
        <van-button @click="next" type="primary" round block>下一步</van-button>
      </div>
    </div>
    <!-- 侧边栏 -->
    <van-popup :show="show" @update:show="show = $event" position="right">
      <!-- 顶部导航 -->
      <cp-nav-bar
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="submit"
        :back="
          () => {
            show = false
          }
        "
      ></cp-nav-bar>
      <!-- 表单区域 -->
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <!-- <van-checkbox v-model="patient.defaultFlag" round /> -->
            <van-checkbox
              :model-value="patient.defaultFlag"
              @update:model-value="patient.defaultFlag = $event ? 1 : 0"
              round
            />
          </template>
        </van-field>
      </van-form>
      <!-- 删除按钮 -->
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
}

.patient-list {
  padding: 15px;
}

.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;

  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;

      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }

      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }

  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }

  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);

    .icon {
      color: var(--cp-primary);
    }
  }
}

.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;

  .cp-icon {
    font-size: 24px;
  }
}

.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}

.patient-page {
  padding: 46px 0 80px;

  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
    }
  }
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>
