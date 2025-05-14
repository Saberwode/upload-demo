<!--
 * @Description: 文件上传组件
 * @Author: jmguo2
 * @Date: 2023-03-13 10:08:16
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-08-17 16:15:20
-->
<template>
  <div class="upload-container">
    <div class="progress-container">
      上传总进度：<el-progress
        :percentage="percentage"
        class="progress"
        :format="totalUploadPercentageFormat"
      ></el-progress>
    </div>
    <div class="upload-main-container">
      <!-- 文件列表 -->
      <template v-if="fileList.length">
        <UploadListItem
          v-for="(file, index) in fileList"
          :key="`file-${index}`"
          :name="file.name"
          :scan-percentage="file.scanPercentage"
          :upload-percentage="file.uploadPercentage"
          class="file-item"
        />
      </template>
      <!-- 文件列表 -->
      <el-upload
        :before-upload="beforeUpload"
        multiple
        class="flexCenter"
        :accept="acceptFileType"
        :http-request="httpRequest"
        v-else
      >
        <div class="upload-placeholder">
          <img src="@/assets/uploadImg/icon_import.png" alt="" />
          <el-button type="primary">点击选择文件</el-button>
        </div>
      </el-upload>
      <!-- 上传须知 -->
      <div v-if="!fileList.length">
        <div class="row-divider"></div>
        <UploadInstructions :text="changeinstructionText" />
      </div>
      <!-- 上传须知 -->
    </div>
    <el-popover
      :width="600"
      placement="top-start"
      :show-arrow="false"
      v-if="fileList.length"
    >
      <UploadInstructions :text="changeinstructionText" />
      <template #reference>
        <div style="display: inline-block">
          <div class="pop-instructions-container">
            <el-icon><QuestionFilled /></el-icon>
            上传须知
          </div>
        </div>
      </template>
    </el-popover>

    <!-- 继续添加button，确定button -->
    <div class="footer flexCenter" v-if="fileList.length">
      <el-upload
        :before-upload="beforeUpload"
        multiple
        :accept="acceptFileType"
        :http-request="httpRequest"
      >
        <el-button type="primary">继续添加</el-button>
      </el-upload>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import FileUploader from "@/utils/upload";
import { getAcceptFileType, getFileExtension } from "@/utils/index";
import UploadInstructions from "@/components/UploadInstructions.vue";
import UploadListItem from "@/components/UploadListItem.vue";
import { useUploadStore } from "@/stores/upload";

interface ExtendFile {
  name: string;
  uploadPercentage: number;
  scanPercentage: number;
}
let percentage = ref(0); // 上传总进度
let acceptFileType = ref("");
let uploader: FileUploader;

// 自定义上传须知内容
let changeinstructionText = ref("");

let fileList = ref([] as ExtendFile[]);
const store = useUploadStore();

const totalUploadPercentageFormat = (percentage: number) => {
  return `已上传${percentage}%`;
};

// 覆盖原有的默认上传行为
// 解决 POST本机地址报错问题
const httpRequest = () => {
  return new Promise(() => {});
};

/**
 * @description: 终止文件上传等
 * @return {*}
 */
const abort = () => {
  return uploader.abort;
};

const onTotalProgressUpdate = () => {
  const currnetProgress = fileList.value.reduce((total, currnet) => {
    return total + currnet.uploadPercentage;
  }, 0);
  percentage.value = Math.trunc(
    (currnetProgress / (fileList.value.length * 100)) * 100
  );
};

// 初始化登录对象
const initUploader = () => {
  console.log("store.token", store.token);

  uploader = new FileUploader({
    enableChunking: true,
    maxThreads: 3,
    chunkSize: 1024 * 1024 * 10,
    token: store.token,
    baseUrl: "http://10.41.170.230:9020/admin",
    // baseUrl: `${store.host}/admin`
  });

  initHooks(uploader);
};

// 注册钩子函数
const initHooks = (uploader: FileUploader) => {
  // 单文件进度
  uploader.onScanProgressUpdate = (progress: number, index: number) => {
    console.log("进度", progress, index);
    fileList.value[index].scanPercentage = progress;
  };
  // 文件总进度
  uploader.onUploadProgressUpdate = (progress: number, index: number) => {
    console.log("上传进度", progress, index);
    fileList.value[index].uploadPercentage = progress;
    onTotalProgressUpdate();
  };
  // 文件上传完成回调
  uploader.onUploadComplete = (fileData: any) => {
    window.parent.postMessage(
      {
        cmd: "onUploadComplete",
        fileData,
      },
      "*"
    );
  };
};

// 初始化父窗口传入的配置
const initSetting = () => {
  // 限制文件类型
  // --默认全都有
  const defaultTypeList = [
    "Image",
    "Video",
    "Audio",
    "PDF",
    "Word",
    "Excel",
    "PPT",
  ];
  const typeList = store.acceptFileType.length
    ? store.acceptFileType
    : defaultTypeList;
  acceptFileType.value = getAcceptFileType(typeList);
  // --通过accept仅仅是对浏览器文件列表层面进行限制，代码层面也需要进行限制

  // 设置上传须知内容
  let acceptTypeText = "";
  let acceptSizeText = "";
  if (store.acceptFileType.length) {
    // changeinstructionText.value =
    const convertedString = acceptFileType.value
      .split(",")
      .map((extension) => extension.replace(".", ""))
      .join("、");
    acceptTypeText = `支持的格式为：${convertedString}`;
    if (store.acceptFileSize) {
      acceptSizeText = `，请上传小于${store.acceptFileSize}M的文件`;
      acceptTypeText += acceptSizeText;
    }
    changeinstructionText.value = acceptTypeText;
  }
};

// 限制文件类型
const limitFileType = (name: string) => {
  // 获取name后缀
  const fileExtension = getFileExtension(name);
  if (acceptFileType.value.includes(fileExtension)) {
    console.log("文件类型匹配");
    return true;
  } else {
    console.log("文件类型不匹配");
    return false;
  }
};

// 限制文件大小
const limitFileSize = (fileSize: number) => {
  const fileSizeToMB = fileSize / 1024 / 1024;
  return !store.acceptFileSize || fileSizeToMB <= store.acceptFileSize;
};
// 限制文件数量
const limitFileCount = () => {
  const maxCount = store.acceptFileSize;
  return !maxCount || maxCount > fileList.value.length;
};

// 限制场景合并函数
const fileLimitCheck = (file: File) => {
  // 文件限制判断
  let typeFlag = limitFileType(file.name);
  if (!typeFlag) {
    window.parent.postMessage(
      {
        cmd: "onMessage",
        msgData: {
          type: "warning",
          msg: "不能上传不支持的文件格式",
        },
      },
      "*"
    );
    return false;
  }
  // 大小限制判断
  let sizeflag = limitFileSize(file.size);
  if (!sizeflag) {
    window.parent.postMessage(
      {
        cmd: "onMessage",
        msgData: {
          type: "warning",
          msg: `请上传小于${store.acceptFileSize}M的文件`,
        },
      },
      "*"
    );
    return false;
  }
  // 数量限制
  let countLimitFlag = limitFileCount();
  if (!countLimitFlag) {
    window.parent.postMessage(
      {
        cmd: "onMessage",
        msgData: {
          type: "warning",
          msg: `最多上传${store.acceptFileSize}个文件`,
        },
      },
      "*"
    );
    return false;
  }
  return true;
};

/**
 * @description: 文件上传前回调，文件类型、大小校验
 * @return {*}
 */
const beforeUpload = async (file: File) => {
  // 文件限制检查
  const limitCheckFlag = fileLimitCheck(file);
  if (!limitCheckFlag) {
    return false;
  }
  console.log("通过了检查");

  // 维护组件自身的文件列表信息，仅包含必要的名称进度信息，没有文件本身的内容
  fileList.value.push({
    name: file.name,
    scanPercentage: 0,
    uploadPercentage: 0,
  });
  // 向文件下载类中添加文件，进入文件池后会进行排队上传
  uploader.addFile(file);
};

/**
 * @description: 确定
 * @return {*}
 */
const onConfirm = () => {
  window.parent.postMessage(
    {
      cmd: "onConfirm",
    },
    "*"
  );
};

/**
 * @description: 获取当前文件上传情况
 * @return {*}
 */
const getUploadStatus = () => {
  let isInProgress =
    fileList.value.length && percentage.value !== 100 ? true : false;
  window.parent.postMessage(
    {
      cmd: "isInProgress",
      isInProgress,
    },
    "*"
  );
};

const init = () => {
  initUploader();
  initSetting();
};

// 抛出公共方法
defineExpose({
  init,
  getUploadStatus,
});
</script>

<style scoped lang="scss">
@import url("@/styles/element-ui.scss");
@import "../styles/upload.scss";
</style>
