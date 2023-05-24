<!--
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-03-13 09:53:15
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-03-30 11:36:57
-->


<template>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useUploadStore } from '@/stores/upload'
// import HelloWorld from './components/HelloWorld.vue'
onMounted(() => {
  const store = useUploadStore()
  window.onmessage = (e) => {
      console.log('看看',e);
      store.token = e.data.token
  };
  console.log('这是在iframe中');
  
})
</script>

<style scoped>
</style>
