// 用来给项目中所有自定义组件添加类型声明
import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import CpConsultMore from '@/components/CpConsultMore.vue'
import CpPaySheet from '@/components/CpPaySheet.vue'
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
    CpConsultMore: typeof CpConsultMore
    CpPaySheet: typeof CpPaySheet
  }
}
