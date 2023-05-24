<!--
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-03-13 10:08:16
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-05-23 15:38:21
-->
<template>
  <div class="addCourseware">
    <el-dialog
      v-model="isShowDialog"
      append-to-body
      width="800px"
      class="addCourseware"
    >
      <template #header> 这是标题 </template>
      <div class="progress-container">
        上传总进度：<el-progress
          :percentage="30"
          class="progress"
        ></el-progress>
      </div>
      <div class="upload-main-container">
        <div class="upload-main">
          <div class="upload-icon">点击上传</div>
        </div>
      </div>
      <!-- 上传须知 -->
      <div class="notic">
        <header>上传须知</header>
        <div class="default-accept-file-tips">
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
      </div>
      <!-- <iframe :src="webuploaderHtml" class="iframe-box" ref="iframe"></iframe> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElDialog, ElProgress } from "element-plus";
// import { ElMessage, ElMessageBox } from "element-plus";
// import { formatTime } from "@/utils/time";
import { onMounted, nextTick } from "vue";
// import { useUploadStore } from "@/stores/upload";

// enum CoursewareType {
//   video = 1,
//   audio = 2,
//   graphic = 3,
// }
// interface IProps {
//   title?: string;
//   isNeedDuration?: boolean;
// }

let isShowDialog = true;
// const iframe: any = $ref();
const webuploaderHtml = `http://localhost:5173/webuploader/index.html?timestamp=${new Date().valueOf()}`;
// // console.log('window',(window as any)['config'].adminClientUrl);
// const emit = defineEmits(["close", "onUploadComplete"]);
// const props = withDefaults(defineProps<IProps>(), {
//   title: "上传文件",
//   isNeedDuration: true,
// });
// let token = ''

// const listenFunc = (e: any) => {

//   const data = e.data;
//   switch (data.cmd) {
//     case "onUploadComplete":
//       handleFileData(data.fileData);
//       break;
//     case "onMessage":
//       (ElMessage as any)[data.msgData.type](data.msgData.msg);
//       break;
//     case "onExceedNumLimit":
//       ElMessage.warning(data.msg);
//       break;
//     case "onIllegalType":
//       ElMessage.warning(data.msg);
//       break;
//     case "isInProgress":
//       if (data.isInProgress) {
//         cancelUpload();
//       } else {
//         emit("close");
//       }
//       break;
//     case "onConfirm":
//       emit("close");
//       break;
//   }
// };

// const handleFileData = (data: any) => {
//   let seconds = 300; //默认5分钟
//   const temp: any = {};
//   const { fileId, fileName, coursewareType } = data;
//   temp.fileName = fileName;
//   temp.fileId = fileId;
//   temp.coursewareType = coursewareType;
//   temp.videoDuration = 0;
//   if (coursewareType === CoursewareType.video) {
//     temp.videoDuration = data.duration;
//   }

//   if (props.isNeedDuration) {
//     if (
//       coursewareType === CoursewareType.video ||
//       coursewareType === CoursewareType.audio
//     ) {
//       seconds = data.duration;
//     }
//     const { hour, min, sec } = formatTime(seconds);
//     temp.studyHours = hour;
//     temp.studyMinutes = min;
//     temp.studySeconds = sec;
//   }

//   // emit("onUploadComplete", temp);
//   window.parent.postMessage({
//     cmd: 'onUploadComplete',
//     data: temp
//   },'*')
// };
// const postMessage = () => {
//   const iframeWin = iframe["contentWindow"];

//   iframeWin.postMessage(
//     {
//       cmd: "openUploadDialog",
//       token,
//       host: `http://10.41.170.230:9020`,
//     },
//     "*"
//   );
// };
// const cancelUpload = () => {
//   ElMessageBox.confirm(
//     "列表中有未上传完成的文件，确定取消上传么？",
//     "取消上传",
//     {
//       confirmButtonText: "确定",
//       cancelButtonText: "取消",
//       type: "warning",
//     }
//   )
//     .then(() => {
//       emit("close");
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// };
// const checkIsInProgress = () => {
//   const iframe1 = iframe;
//   const iframeWin = iframe1["contentWindow"];
//   iframeWin.postMessage(
//     {
//       cmd: "checkIsInProgress",
//     },
//     "*"
//   );
// };
// const closeDialog = () => {
//   console.log("closeDialog");
//   // 从父组件发起关闭弹窗的指令，需要去查一下是否在上传
//   checkIsInProgress();
// };
// onMounted(async () => {
//   await nextTick();
//   const store = useUploadStore();
//   console.log('store',store.token);
//   token = store.token

//   iframe["onload"] = () => {
//     postMessage();
//     // https://blog.csdn.net/tang_jian_dong/article/details/104635123 通过addEventListener 绑定的事件会出现多次调用方法的情况
//     window.onmessage = (e) => {
//       listenFunc(e);

//     };
//   };
// });
onMounted(() => {
  console.log("这是在iframe中");
});
</script>

<style scoped lang="scss">
.progress-container {
  display: flex;
  .progress {
    width: 350px;
  }
}
.upload-main-container {
  border: 1px solid black;
  min-height: 400px;
}
.upload-main {
  // width: 200px;
  text-align: center;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  .upload-icon {
    // background: red;
    border: 1px solid black;
    cursor: pointer;
  }
}
.iframe-box {
  width: 100%;
  height: 634px;
}
.addCourseware {
  width: 750px;
  background: #fff;
  .from-tip {
    font-size: 13px;
    color: rgb(170, 170, 170);
  }

  .duration {
    flex-direction: row;
  }

  .cancel {
    background-color: rgb(217, 0, 27);
    color: #fff;
  }

  .import-upload_img {
    margin: -5px 0 20px;
  }

  .disabled {
    display: none;
  }

  .paddingLeft5 {
    padding-left: 5px;
  }

  .avatar-uploader ::v-deep .el-upload--text {
    width: 85%;
  }

  .course-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
}
</style>
