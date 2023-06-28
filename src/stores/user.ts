// 保存与用户相关的数据
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const user = ref<User>()
    // 设置用户信息
    const setUser = (u: User) => {
      user.value = u
    }
    // 清除用户信息
    const removeUser = () => {
      user.value = undefined
    }
    return { user, setUser, removeUser }
  },
  {
    persist: true
  }
)
