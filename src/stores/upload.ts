/*
 * @Author: jmguo2
 * @Date: 2023-03-27 15:53:18
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-03-27 15:53:52
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUploadStore = defineStore('upload', () => {
  const token = ref('')
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return { token }
})
