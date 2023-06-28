// vue3：
//    createRouter：创建路由实例
//    路由模式：history(localhost:5173/login) hash(localhost:5173/#/login)
//      createWebHistory：设置 history 模式
//      createWebHashHistory：设置 hash 模式
//    import.meta.env.BASE_URL：去配置文件(vite.config.ts)中找到设置 base 路径
//      设置之后，开启服务时，会在服务前添加 base 对应的路径(默认值：/)
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 设置进度条的配置
NProgress.configure({
  showSpinner: false
})

// 创建路由对象
const router = createRouter({
  // 设置模式：history 模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页面
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    // 布局容器
    {
      path: '/layout',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '健康百科'
          }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: {
            title: '消息通知'
          }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '个人中心'
          }
        }
      ]
    },
    // 家庭档案
    {
      // 直接跳转到 /user/patient 进入到家庭档案
      // 直接跳转到 /user/patient?isChange=1 进入到选择患者页面
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: {
        title: '家庭档案'
      }
    },
    // 极速问诊
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: {
        title: '极速问诊'
      }
    },
    // 选择科室
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: {
        title: '选择科室'
      }
    },
    // 图文问诊
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: {
        title: '图文问诊'
      }
    },
    // 支付
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: {
        title: '问诊支付'
      }
    },
    // 问诊室
    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: {
        title: '问诊室'
      },
      beforeEnter: (to) => {
        if (to.query.payResult === 'false') {
          // 支付失败，跳转到问诊记录页面
          return '/user/consult'
        }
      }
    },
    // 问诊记录
    {
      path: '/user/consult',
      component: () => import('@/views/User/ConsultPage.vue'),
      meta: {
        title: '问诊记录'
      }
    },
    // 问诊详情
    {
      path: '/user/consult/:id',
      component: () => import('@/views/User/ConsultDetail.vue'),
      meta: {
        title: '问诊详情'
      }
    },
    // 药品支付
    {
      path: '/order/pay',
      component: () => import('@/views/Order/OrderPay.vue'),
      meta: {
        title: '药品支付'
      }
    },
    // 支付结果
    {
      path: '/order/pay/result',
      component: () => import('@/views/Order/OrderPayResult.vue'),
      meta: {
        title: '药品支付'
      }
    },
    // 订单详情
    {
      path: '/order/:id',
      component: () => import('@/views/Order/OrderDetail.vue'),
      meta: {
        title: '订单详情'
      }
    },
    // 物流详情
    {
      path: '/order/logistics/:id',
      component: () => import('@/views/Order/OrderLogistics.vue'),
      meta: {
        title: '物流详情'
      }
    }
  ]
})

// meta 属性是元信息，是路由对象中的一个属性，可以用来保存自定义的一些属性
// 设置导航守卫
router.beforeEach((to) => {
  // 开启进度条
  NProgress.start()
  if (to.meta.title) {
    document.title = `优医问诊 - ${to.meta.title}`
  }
  // 得到 token
  const store = useUserStore()
  const token = store.user?.token
  // 添加一个白名单
  const whiteList = ['/login', '/login/callback']
  // 判断 token 是否存在
  if (!token && !whiteList.includes(to.path)) {
    // 提示未登录
    showToast('对不起，您还未登录')
    return '/login'
  }
})

// 设置后置守卫
router.afterEach(() => {
  NProgress.done()
})

export default router
