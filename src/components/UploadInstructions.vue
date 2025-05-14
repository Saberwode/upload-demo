<!--
 * @Description: 考试须知
 * @Author: jmguo2
 * @Date: 2023-07-28 15:07:54
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-08-11 15:53:42
-->
<template>
  <div>
    <h4>上传须知</h4>
    <template v-if="!props.text">
      <p>
        1. 支持的文档格式为：doc、docx、ppt、pptx、xls、xlsx、pdf，请上传小于
        100MB 的文档；
      </p>

      <p>2. 支持的图片格式为：jpg、jpeg、png，请上传小于 10MB 的图片；</p>

      <p>
        3.
        支持的视频格式为：mp4、avi、mkv、mov、rmvb、mpeg、mpg、wmv，请上传小于
        2GB 的视频；
      </p>

      <p>4. 支持的音频格式为：mp3，请上传小于 500MB 的音频；</p>

      <p>
        其他格式课件可通过“格式工厂”等多媒体格式转换软件，转成系统支持的格式后上传
      </p>
    </template>
    <p v-else>{{ props.text }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    defalut: "",
  },
});
</script>

<style scoped lang="scss"></style>
