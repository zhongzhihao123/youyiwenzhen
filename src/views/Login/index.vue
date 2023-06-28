<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 导入校验规则
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
// 导入 api
import { loginByPassword, sendMobileCode, loginByCode } from '@/services/user'
// 导入 user 的 store
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
// 导入路由对象
import { useRouter } from 'vue-router'
const router = useRouter()
// 协议的状态
const agree = ref(false)
// 睁睛的状态
const show = ref(false)
// 用户名和密码
const mobile = ref('13230000004')
const password = ref('abc12345')
// 得到 user 的 store 实例
const store = useUserStore()
// 点击右侧结构会触发的方法
const clickRight = () => {
  console.log('在外界触发 clickRight')
}
// 1.0 密码登录方法
const login = async () => {
  // 判断是否勾选协议
  if (!agree.value) return showToast('请先同意协议')
  // 判断当前登录的方式（短信登录 & 密码登录）
  // 发送请求到服务器，校验用户信息
  const res = isPass.value
    ? await loginByCode(mobile.value, code.value)
    : await loginByPassword(mobile.value, password.value)
  // 保存用户信息
  store.setUser(res.data)
  // 跳转到首页
  router.push('/home')
  // 提示登录成功
  showToast('登录成功')
}
// 2.0 短信登录
const isPass = ref(false)
const code = ref('')
const form = ref<HTMLFormElement>()
// 倒计时时长
const time = ref(0)
const timer = ref<number>()
// 发送验证码的方法
const getCode = async () => {
  // 校验手机号的合法性
  await form.value?.validate('mobile')
  // 获取手机验证码
  const res = await sendMobileCode(mobile.value, 'login')
  showToast('验证码为：' + res.data.code)
  // 设置倒计时的时长
  time.value = 60
  // 设置倒计时
  timer.value = setInterval(() => {
    time.value--
    // 判断时长
    if (time.value <= 0) {
      // 清除定时器
      clearInterval(timer.value)
    }
  }, 1000)
}
// 3.0 QQ登录
// onMounted(() => {
//   // 组件渲染完毕，使用QC生成QQ登录按钮，目的得到跳转链接
//   QC.Login({
//     btnId: 'qq'
//   })
// })
</script>
<template>
  <div class="login-page">
    <!-- 顶部导航栏 -->
    <CpNavBar title="自己的登录页面" rightText="注册" @clickRight="clickRight"></CpNavBar>
    <!-- 头部区域 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{ isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单区域 -->
    <van-form @submit="login" autocomplete="off" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="tel"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-if="!isPass"
        v-model="password"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
        :rules="passwordRules"
      >
        <template #right-icon>
          <CpIcon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></CpIcon>
        </template>
      </van-field>
      <van-field v-model="code" :rules="codeRules" placeholder="短信验证码" v-else>
        <template #button>
          <span v-if="time <= 0" @click="getCode" class="btn-send">发送验证码</span>
          <span v-else>{{ time }}s后重新发送</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部区域 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
        class="icon"
      >
        <img src="@/assets/qq.svg" alt="" />
      </a>
    </div>
  </div>
  <!-- <div class="icon" id="qq"></div> -->
</template>
<style scoped lang="scss">
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

.van-form {
  padding: 0 14px;

  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }

  // van-form 下添加
  .btn-send {
    color: var(--cp-primary);

    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
