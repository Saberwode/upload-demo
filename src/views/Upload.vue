
<!--
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-03-13 10:08:16
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-06-26 16:12:03
-->
<template>
  <div class="upload-container">
    <div class="progress-container">
      上传总进度：<el-progress
        :percentage="percentage"
        class="progress"
      ></el-progress>
    </div>
    <div class="upload-main-container flexCenter">
      <el-upload
      :before-upload="beforeUpload"
      >
        <el-button type="primary">上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
    </div>
    <!-- 上传须知 -->
    <div class="notic">
      <header>
        <el-popover>
          <template #reference>
            <el-icon><QuestionFilled /></el-icon>
          </template>
          <template #default>
            <div v-if="acceptFileType.length">
              <div class="test">
                1.
                支持的文档格式为：doc、docx、ppt、pptx、xls、xlsx、pdf，请上传小于
                100MB 的文档；
              </div>
              <div>
                2. 支持的图片格式为：jpg、jpeg、png，请上传小于 10MB 的图片；
              </div>
              <div>
                3.
                支持的视频格式为：mp4、avi、mkv、mov、rmvb、mpeg、mpg、wmv，请上传小于
                2GB 的视频；
              </div>
              <div>4. 支持的音频格式为：mp3，请上传小于 500MB 的音频；</div>
              <div>
                其他格式课件可通过“格式工厂”等多媒体格式转换软件，转成系统支持的格式后上传
              </div>
            </div>
            <div v-else>
              {{ noticText }}
            </div>
          </template>
        </el-popover>
        上传须知
      </header>
      <div class="default-accept-file-tips" v-if="isShowNotic">
        <div v-if="acceptFileType.length">
          <p>
            1.
            支持的文档格式为：doc、docx、ppt、pptx、xls、xlsx、pdf，请上传小于
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
        </div>
        <div v-else class="flexCenter">
          {{ noticText }}
        </div>
      </div>
    </div>
    <!-- 继续添加button，确定button -->
    <div id="footer" class="element-invisible">
      <el-button>确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElDialog, ElProgress, ElPopper } from "element-plus";
import { onMounted, nextTick, ref, computed } from "vue";
import FileUploader from '@/utils/upload';
// 界面参数（除去uploader外的参数）
let percentage = ref(0); // 上传总进度
let isShowNotic = true;

let isShowDialog = true;
let noticText = ref("");
let acceptFileType = ref([]);

const uploader = new FileUploader({enableChunking: true, maxThreads: 3, chunkSize: 10, token: '', baseUrl: 'http://10.41.170.230:9020/admin'})

/**
 * @description: 文件上传前回调，文件类型、大小校验
 * @return {*}
 */
const beforeUpload = async (file: File) => {
  console.log('before-upload');
  // const res = await uploader.getHashByFile(file);
  // console.log('md5',res);
  uploader.uploadFile(file)
  
  return false;
}

</script>

<style scoped lang="scss">
.upload-container {
  background-color: #fff;
  width: 600px;
  height: 600px;
  margin: auto;
}
.progress-container {
  display: flex;
  .progress {
    width: 350px;
  }
}
.upload-main-container {
}
.flexCenter {
  display: flex;
  justify-content: center;
}
</style>
