<!--
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-07-28 17:31:08
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-08-09 16:33:19
-->
<template>
  <div class="item-container">
    <img :src="imgSrc" alt="" />
    <div class="right">
      <div class="file-info">
        <div class="title">
          {{ props.name }}
        </div>
        <div class="upload-progress">
          <el-progress :percentage="props.uploadPercentage">
            <template #default="{ percentage }">
              <span v-if="isShowScanPercentage">
                <p>正在扫描</p>
                <p>{{ props.scanPercentage }}%</p>
              </span>
              <span class="percentage-value" v-else>{{ percentage }}%</span>
            </template>
          </el-progress>
        </div>
      </div>
      <!-- <div class="status" v-if="isShowScanPercentage">
       
        <p>正在扫描</p>
        <p>{{ props.scanPercentage }}%</p>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  name: string;
  uploadPercentage: number;
  scanPercentage: number;
}
const props = withDefaults(defineProps<Props>(), {
  name: "",
  uploadPercentage: 0,
  scanPercentage: 0,
});
const fileMappings = [
  { extensions: ["txt", "doc", "docx", "pdf"], imageType: "documents" },
  { extensions: ["jpg", "jpeg", "png"], imageType: "photos" },
  { extensions: ["mp3", "wav", "mp4", "avi", "mov"], imageType: "media" },
];

/**
 * @description: 获取文件类型（documents、photos、media）
 * @param {*} extension
 * @return {*}
 */
const getImageTypeByExtension = (extension: string | undefined): string => {
  for (let mapping of fileMappings) {
    if (mapping.extensions.includes(extension || "")) {
      return mapping.imageType;
    }
  }
  return "unknown";
};

const imgPath = {
  documents: new URL("../assets/uploadImg/pdf.png", import.meta.url).href,
  photos: new URL("../assets/uploadImg/photo.png", import.meta.url).href,
  media: new URL("../assets/uploadImg/video.png", import.meta.url).href,
};

const imgSrc = computed(() => {
  const fileExtension = props.name.split(".").pop()?.toLowerCase();
  const fileType = getImageTypeByExtension(
    fileExtension
  ) as keyof typeof imgPath;
  return imgPath[fileType];
});

const isShowScanPercentage = computed(() => {
  // 有上传进度就隐藏进度
  return !props.uploadPercentage;
});
</script>

<style scoped lang="scss">
.file-info {
  .title {
    margin-bottom: 8px;
  }
}
.right {
  flex: 2;
  margin-left: 24px;
}
.item-container {
  display: flex;
  img {
    width: 44px;
    height: 44px;
  }
}
// ::v-deep .el-progress-bar__inner {
//   background-color: #38bba8;
// }
</style>
