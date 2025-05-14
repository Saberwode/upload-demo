<!--
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-03-13 09:53:15
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-08-30 16:03:50
-->

<template>
  <upload-file ref="uploader"></upload-file>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUploadStore } from "@/stores/upload";
import UploadFile from "@/views/Upload.vue";
const count = ref(0);
const obj = {}

const uploader = ref<typeof UploadFile>();
onMounted(() => {
  const store = useUploadStore();
  window.onmessage = (e) => {
    const data = e.data;
    switch (data.cmd) {
      case "openUploadDialog":
        // 获取父窗口传过来的配置
        console.log('e',e);
        
        store.token = data.token;
        store.acceptFileType = data.acceptFileType || [];
        store.acceptFileSize = data.acceptFileSize || 0;
        store.fileNumLimit = data.fileNumLimit || null;
        store.host = data.host;
        // 等状态都写完之后，初始化uploader
        uploader.value?.init();
        break;
      case "checkIsInProgress":
        uploader.value?.getUploadStatus();
        break;
      default:
        break;
    }
  };
});
</script>

<style scoped>
body {
  background-color: #fff;
}
</style>

