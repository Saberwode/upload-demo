<!--
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-03-13 10:08:16
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-06-13 10:49:04
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
          :percentage="percentage"
          class="progress"
        ></el-progress>
      </div>
      <div class="upload-main-container">
        <div class="upload-main">
          <!-- <div class="upload-icon" id="filePicker">点击上传</div> -->
          <div id="filePicker"></div>
        </div>
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
          <div v-else>
            {{ noticText }}
          </div>
        </div>
      </div>
      <!-- 继续添加button，确定button -->
      <div id="footer" class="element-invisible">
        <div class="button" id="continueButton"></div>
        <div class="button element-invisible" id="confirmButton">确定</div>
      </div>
      <!-- <iframe :src="webuploaderHtml" class="iframe-box" ref="iframe"></iframe> -->
    </el-dialog>
    <!-- <div id="filePicker"> 
    </div> -->
  </div>
</template>

<!-- <script src="../../public/webuploader/js/jquery.min.js"></script> -->

<script setup lang="ts">
import { ElDialog, ElProgress, ElPopper } from "element-plus";
import { onMounted, nextTick, ref, computed } from "vue";
// 界面参数（除去uploader外的参数）
let percentage = ref(0); // 上传总进度
let isShowNotic = true;

let isShowDialog = true;
let noticText = ref("");

// 传递给upload的参数
const accept = [
  {
    title: "Image",
    extensions: "jpg,jpeg,png",
    mimeTypes: "image/jpeg,image/png",
  },
  {
    title: "Video",
    extensions: "mp4,avi,mkv,mov,rmvb,mpeg,mpg,wmv",
    mimeTypes:
      "video/mp4,video/x-msvideo,video/x-matroska,video/quicktime,application/vnd.rn-realmedia-vbr,video/mpeg,video/x-ms-wmv",
  },
  {
    title: "Audio",
    extensions: "mp3",
    mimeTypes: "audio/mpeg",
  },
  {
    title: "PDF",
    extensions: "pdf",
    mimeTypes: "application/pdf",
  },
  {
    title: "Word",
    extensions: "doc,docx",
    mimeTypes:
      "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  {
    title: "Excel",
    extensions: "xls,xlsx",
    mimeTypes:
      "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    // pptx mac上无法识别，暂无解
    title: "PPT",
    extensions: "pptx,ppt",
    mimeTypes:
      "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
];
let uploader: any;
let verify: boolean; // 当前文件校验状态
let token = "";
let host = "";
let acceptFileType: string[] = [];
let acceptFileSize = 0; //仅当acceptFileType存在时才生效
let fileNumLimit: number | null = null;
// const webuploaderHtml = `http://localhost:5173/webuploader/index.html?timestamp=${new Date().valueOf()}`;

/**
 * @description: 检测文件大小
 * @param {*} file
 * @return {*}
 */
const verifyFileSize = (file: any) => {
  const rules = new Map([
    ["video", { size: 2048, msg: "请上传小于2GB的视频" }],
    ["audio", { size: 500, msg: "请上传小于500MB的音频" }],
    ["graphic", { size: 10, msg: "请上传小于10MB的图片" }],
    ["document", { size: 100, msg: "请上传小于100MB的文档" }],
    [
      "any",
      {
        size: acceptFileSize,
        msg: `请上传小于${acceptFileSize}MB的文件`,
      },
    ],
  ]);

  const fileType = getFileType(file.name);
  const fileSize = file.size / 1024 / 1024; // 文件大小转化为M
  const condition = rules.get(
    acceptFileType.length && acceptFileSize ? "any" : fileType
  );
  if (condition !== undefined && fileSize > condition.size) {
    window.parent.postMessage(
      {
        cmd: "onMessage",
        msgData: {
          msg: condition.msg,
          type: "warning",
        },
      },
      "*"
    ); //传值给父层
    return true;
  }
};
/**
 * @description: 刷新总进度条
 * @param {*} percent
 * @return {*}
 */
const changeTotalBar = (percent: number) => {
  // const $bar = $('#progress-bar');
  // $bar.width(percent);
  percentage.value = percent;
};

/**
 * @description: 获取文件后缀
 * @param {*} fileSuffix
 * @return {*}
 */
const getFileType = (fileSuffix: string) => {
  // changeTotalBar()
  let fileType = "";
  if (/\.(mp4|avi|mkv|mov|rmvb|mpeg|mpg|wmv)$/.test(fileSuffix)) {
    fileType = "video";
  } else if (/\.(mp3|MP3)$/.test(fileSuffix)) {
    fileType = "audio";
  } else if (/\.(jpg|jpeg|png)$/.test(fileSuffix)) {
    fileType = "graphic";
  } else {
    fileType = "document";
  }
  return fileType;
};
/**
 * @description: 获取音视频文件的长度
 * @param {*} file
 * @return {*}
 */
const getDuration = (file: any) => {
  return new Promise((resolve) => {
    const fileUrl = URL.createObjectURL(file.source.source);
    const audioElement = new Audio(fileUrl);

    const setDuration = () => {
      let duration: any = audioElement.duration;
      duration = duration.toFixed();
      duration = parseInt(duration);
      resolve(duration);
    };

    audioElement.addEventListener("loadedmetadata", setDuration);
    // 释放资源
    setTimeout(() => {
      audioElement.removeEventListener("loadedmetadata", setDuration);
      window.URL.revokeObjectURL(fileUrl);
    }, 800);
  });
};
/**
 * @description: 入口方法
 * @param {*}
 * @return {*}
 */
const main = async () => {
  // UI相关变量定义
  const percentages = {}; // 所有文件的进度信息，Key为File ID, Value为 [fileSize，uploadedSize]
  let fileCount = 0; // 添加的文件数量
  let fileSize = 0; // 添加的文件总大小
  let state = "pending"; // 可能有pending、ready、uploading、confirm、done

  // acceptFileType为可配置项，由父页面传入，如果存在该项，则
  // 替换原有的上传须知
  const tempAccept: any[] = [];
  if (acceptFileType.length) {
    let pText = "支持的格式为：";
    acceptFileType.forEach((type) => {
      const a = accept.find((o) => o.title === type);
      if (a) {
        tempAccept.push(a);
        pText += a.extensions.split(",").join("、") + "、";
      }
    });

    pText = pText.slice(0, pText.length - 1); //去掉最后的顿号
    if (acceptFileSize) {
      pText += `，请上传小于${acceptFileSize}MB的文件`;
    }

    // 更改提示文字 注：此部分是将上传须知插入到html中，也就是展示上传须知文字
    noticText.value = pText;
  }

  // 创建WebUploader实例
  await nextTick();
  uploader = (window as any).WebUploader.create({
    accept: tempAccept.length ? tempAccept : accept,
    prepareNextFile: true,
    chunked: true, // 开启分片上传
    threads: 3, // 大文件开启分片上传时，同时上传的最大线程数，不写默认为3
    compress: false, // 关闭图片压缩功能，否则会导致图片的MD5秒传功能失效
    chunkSize: 5242880, // 分片大小设置，默认为5MB（5,242,880字节）
    timeout: 5 * 60 * 1000, // 超时时间设置为五分钟，不写默认为两分钟
    // 注：指定选择文件的按钮容器，不指定则不创建按钮
    pick: {
      id: "#filePicker", // 上传按钮的ID
      innerHTML: "点击选择文件", // 上传按钮的文字信息
    },
    extension: {
      token: token,
      host: host,
    },
    fileNumLimit: fileNumLimit,
  });
  console.log("看看window", uploader);
  let filePicker = document.getElementById("filePicker");
  console.log("filepicker", filePicker);

  // 增加“继续添加”按钮
  uploader.addButton({
    id: "#continueButton",
    label: '<img src="./image/icon_continue.png" alt="">继续添加',
  });

  /**
   * @description: 设置状态信息
   * @param {*} val
   * @return {*}
   */
  const setState = (val: string) => {
    let stats;
    // 可能有pending、ready、uploading、confirm、done
    if (val === state) {
      return;
    }
    const upload = document.getElementById
    // $upload.removeClass("state-" + state).addClass("state-" + val);
    state = val;

    switch (state) {
      case "pending":
        // 隐藏 状态栏，进度和控制按钮
        // 展示文件上传列表
        // $placeHolder.removeClass(hiddenClass);
        // $queue.hide();
        // $statusBar.addClass(hiddenClass);
        uploader.refresh();
        break;

      case "ready":
        // 隐藏文件上传列表 上传须知
        // 展示 状态栏，进度和控制按钮 文件队列容器
        // $placeHolder.addClass(hiddenClass);
        // $notice.addClass(hiddenClass);
        // $queue.show();
        // $statusBar.removeClass(hiddenClass);
        uploader.refresh();
        break;

      case "uploading":
        // $upload.text('暂停上传');
        break;

      case "paused":
        // $upload.text('继续上传');
        break;

      case "confirm":
        // $upload.text('刷新页面');

        stats = uploader.getStats();

        if (stats.successNum && !stats.uploadFailNum) {
          setState("finish");
          return;
        }
        break;

      case "finish":
        stats = uploader.getStats();
        if (!stats.successNum) {
          state = "done";
          location.reload();
        }
        break;
    }

    updateStatus();
  };

  /**
   * @description: 检测空文件，没有这一步的话，会被解析成 Q_TYPE_DENIED，导致提示语错误
   * @param {*} file
   * @return {*}
   */
  uploader.onBeforeFileQueued = (file) => {
    if (file.size === 0) {
      window.parent.postMessage(
        { cmd: "onIllegalType", msg: "不能上传空文件" },
        "*"
      ); //传值给父层
      return false;
    }
  };

  /**
   * @description: 当有文件被加入列表时
   * @param {*} file
   * @return {*}
   */
  uploader.onFileQueued = (file) => {
    const ext = file.ext;
    const singleFileSize = window.WebUploader.formatSize(file.size);
    const audioVideoExts = [
      "mp3",
      "mp4",
      "avi",
      "mkv",
      "mov",
      "rmvb",
      "mpeg",
      "mpg",
      "wmv",
    ];
    const mediaSkipGetDuration = ["avi", "rmvb", "mpeg", "mpg", "wmv"]; //不支持getDuration的多媒体文件类型
    const documentExts = ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"];
    const photoExts = ["jpg", "jpeg", "png"];

    /**
     * @description: 获取上传文件对应的图标URL
     * @param {*} extension
     * @return {*} value: photo.png、pdf.png、video.png
     */
    const getFileIconURL = (extension) => {
      const extsArray = [
        { type: "video", arr: [...audioVideoExts] },
        { type: "pdf", arr: [...documentExts] },
        {
          type: "photo",
          arr: [...photoExts],
        },
      ];
      const ext = extension.toLowerCase();

      for (let i = 0, len = extsArray.length; i < len; i++) {
        if (extsArray[i].arr.indexOf(ext) !== -1) {
          return `${extsArray[i].type}.png`;
        }
      }
    };

    /**
     * @description: 当有文件添加进来时执行，负责View的创建
     * @param {*} file
     * @return {*}
     */
    const addFile = () => {
      // const $li = $(
      //   `<li id="${file.id}" class="uploading-file-container">
      //         <img src="./image/${getFileIconURL(ext)}" />
      //         <div class="uploading-file-info">
      //           <div class="title">${
      //             file.name
      //           }  <span>${singleFileSize}</span> </div>
      //           <div class="uploading-file-progress-container">
      //             <div class="progress-bar"></div>
      //             <div class="progress-bg-bar"></div>
      //           </div>
      //         </div>
      //         <div class="uploading-file-controller">
      //           <div class="progress-txt">0%</div>
      //           <div class="cancel-single-button ${hiddenClass}">取消</div>
      //         </div>
      //       </li>`
      // );
      // const $info = $('<p class="error"></p>');
      // const $cancelSingleButton = $li.find('.cancel-single-button');
      const showError = (code) => {
        switch (code) {
          case "interrupt":
            // var text = '上传暂停'
            break;
          default:
            uploader.stop();
            // var text = '上传失败，请重试'
            break;
        }

        // $info.text(text).appendTo($li)
      };

      // $cancelSingleButton.on('click', () => {
      //   uploader.removeFile(file);
      //   return false;
      // });
      // 文件不合格
      if (file.getStatus() === "invalid") {
        showError(file.statusText);
      } else {
        // 文件进度
        percentages[file.id] = [file.size, 0];
        file.rotation = 0;
      }
      /**
       * 文件状态值，具体包括以下几种类型：
       * * `inited` 初始状态
       * * `queued` 已经进入队列, 等待上传
       * * `progress` 上传中
       * * `complete` 上传完成。
       * * `error` 上传出错，可重试
       * * `interrupt` 上传中断，可续传。
       * * `invalid` 文件不合格，不能重试上传。会自动从队列中移除。
       * * `cancelled` 文件被移除。
       */
      file.on("statuschange", function (cur, prev) {
        if (prev === "progress") {
          //
        } else if (prev === "queued") {
          // $li.off('mouseenter mouseleave');
        }

        if (cur === "error" || cur === "invalid") {
          showError(file.statusText);
          percentages[file.id][1] = 1;
          // $cancelSingleButton.addClass(hiddenClass);
        } else if (cur === "interrupt") {
          showError("interrupt");
        } else if (cur === "queued") {
          // $cancelSingleButton.removeClass(hiddenClass);
          percentages[file.id][1] = 0;
        } else if (cur === "progress") {
          // 文件总体选择信息
          // $info.remove();
        } else if (cur === "complete") {
          // 手动给秒传的文件进度设为1
          if (file.md5Exists) {
            percentages[file.id][1] = 1;
            // 更新单个文件进度
            updateSingleFileProgress(file);
          }
          // $cancelSingleButton.addClass(hiddenClass);
        }
        // 更新总体进度
        updateTotalProgress();
      });
      // 将新上传的文件添加到文件队列中
      // $li.appendTo($queue);
    };

    const start = (duration) => {
      fileCount++;
      fileSize += file.size;

      file.duration = duration;

      if (fileCount >= 1) {
        // 隐藏上传图标 隐藏notic 显示upload的notic、进度条
        // $placeHolder.addClass(hiddenClass);
        // $notice.addClass(hiddenClass);
        // $uploadingNotice.removeClass(hiddenClass);
        // $footer.removeClass(hiddenClass);
        // $statusBar.show();
      }

      addFile();
      setState("ready");
      updateTotalProgress();

      uploader.upload(); //添加后直接上传
    };

    // 获取当前文件校验状态 此时如果校验不合格，会返回true
    verify = verifyFileSize(file);
    if (verify) {
      // 标记文件状态为已取消
      uploader.cancelFile(file);
      return false;
    }
    // 获取视频的时长
    if (
      mediaSkipGetDuration.findIndex((el) => {
        return el.toLowerCase() === ext.toLowerCase();
      }) < 0 &&
      audioVideoExts.findIndex((el) => {
        return el.toLowerCase() === ext.toLowerCase();
      }) != -1
    ) {
      // 获取视频的时长
      getDuration(file).then((duration) => {
        start(duration);
      });
    } else {
      // 不用获取视频的时长
      start(null);
    }
  };

  /**
   * @description: 当有文件被从列表中移除时，未使用，目前不给删除
   * @param {*} file
   * @return {*}
   */
  uploader.onFileDequeued = function (file) {
    // 校验不通过不做处理
    if (verify) {
      return;
    }

    /**
     * @description: 文件从队列中删除时，负责View的销毁
     * @param {*} file
     * @return {*}
     */
    // const removeFile = (file) => {
    //   var $li = $("#" + file.id);
    //   delete percentages[file.id];
    //   updateTotalProgress();
    //   $li.off().find(".file-panel").off().end().remove();
    // };

    fileCount--;
    fileSize -= file.size;

    if (!fileCount) {
      setState("pending");
    }

    removeFile(file);
    updateTotalProgress();
  };

  /**
   * @description: 当MD5计算进度发生变化时
   * @param {*} percentage
   * @param {*} file
   * @return {*}
   */
  uploader.onMd5Progress = (percentage, file) => {
    // const $li = $(`#${file.id}`);
    // const $progressTxt = $li.find(".progress-txt");
    // $progressTxt.text("正在扫描：" + Math.round(percentage * 100) + "%");
    // 扫描进度文案更新
  };

  /**
   * @description: 当文件的上传进度变化时
   * @param {*} file
   * @param {*} percentage
   * @return {*}
   */
  uploader.onUploadProgress = (file, percentage) => {
    percentages[file.id][1] = percentage;
    updateSingleFileProgress(file);
    updateTotalProgress();
  };

  /**
   * @description: 当文件上传过程中出现错误时执行,把该文件的进度置为0
   * @param {*} file
   * @param {*} reason
   * @return {*}
   */
  uploader.onUploadError = (file, reason) => {
    percentages[file.id][1] = 0;
    updateSingleFileProgress(file);
    updateTotalProgress();
  };

  /**
   * @description: 当单个文件上传成功时
   * @param {*} file
   * @param {*} response
   * @return {*}
   */
  uploader.onUploadSuccess = (file, response) => {
    // 秒传成功
    if (file.md5Exists) {
      // 秒传时，用的是prepare的数据
      window.parent.postMessage(
        { cmd: "onUploadComplete", fileData: file.prepareInfo },
        "*"
      ); //传值给父层
    }
  };

  // 当单个文件上传完成时（无论成败）
  // uploader.onUploadComplete = function (file) {
  // };

  /**
   * @description: 当组件发生错误时
   * @param {*} code
   * @return {*}
   */
  uploader.onError = (code) => {
    if (code === "Q_TYPE_DENIED") {
      window.parent.postMessage(
        { cmd: "onIllegalType", msg: "不能上传不支持的文件格式" },
        "*"
      ); //传值给父层
    }
  };

  /**
   * @description: 更新状态信息
   * @param {*}
   * @return {*}
   */
  uploader.on("all", (type) => {
    switch (type) {
      case "uploadFinished":
        setState("confirm");
        // $cancelBtn.addClass(hiddenClass);
        // $confirmButton.removeClass(hiddenClass);
        // 上传成功后显示确定
        break;

      case "startUpload":
        setState("uploading");
        // $cancelBtn.removeClass(hiddenClass);
        // $confirmButton.addClass(hiddenClass);
        // 隐藏确定按钮
        break;

      case "stopUpload":
        setState("paused");
        // $cancelBtn.addClass(hiddenClass);
        break;
    }
  });

  /**
   * @description: 更新总体进度信息
   * @param {*}
   * @return {*}
   */
  const updateTotalProgress = () => {
    // 已上传进度条百分比 ·已上传 <i id="total-progress">0%</i>·
    // const totalProgress = $("#total-progress");
    let loaded = 0; //已上传的 总fileSize
    let total = 0; //所有文件的 总fileSize
    // 遍历所有的文件进度信息
    // $.each(percentages, function (k, v) {
    //   total += v[0];
    //   loaded += v[0] * v[1];
    // });

    const percent = total ? loaded / total : 0;

    // const showPercentage = Math.round(percent * 100) + "%";
    const showPercentage = Math.round(percent * 100);
    // totalProgress.text(showPercentage);
    // 调整进度
    changeTotalBar(showPercentage);
    updateStatus();
  };

  /**
   * @description: 更新单个文件的进度
   * @param {*}
   * @return {*}
   */
  const updateSingleFileProgress = (file) => {
    // const $li = $(`#${file.id}`);
    // const $bar = $li.find(".progress-bar");
    // const $progressTxt = $li.find(".progress-txt");
    const percentage = percentages[file.id][1];
    const showPercentage = Math.round(percentage * 100) + "%";
    if (percentage === 1) {
      // $progressTxt.html('<img src="./image/icon_finished.png" />');
    } else {
      // $progressTxt.text(showPercentage);
    }

    // $bar.width(showPercentage);
  };

  // 进度提示相关
  // $upload.addClass('state-' + state);

  /**
   * @description: 更新状态信息
   * @param {*}
   * @return {*}
   */
  const updateStatus = () => {
    var text = "",
      stats;

    if (state === "ready") {
      text =
        "已添加" +
        fileCount +
        "个文件，共" +
        window.WebUploader.formatSize(fileSize) +
        "B";
    } else if (state === "confirm") {
      stats = uploader.getStats();
      if (stats.uploadFailNum) {
        text =
          "已成功上传" +
          stats.successNum +
          "个文件，" +
          stats.uploadFailNum +
          '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件';
        // 或<a class="ignore" href="#">忽略</a>
      }
    } else {
      stats = uploader.getStats();
      // text = '共' + fileCount + '个文件（' + WebUploader.formatSize(fileSize) + 'B），已完成' + stats.successNum + '个文件'
      // text = '共' + fileCount + '个文件（' + WebUploader.formatSize(fileSize) + 'B）'

      // if (stats.uploadFailNum) {
      //   text += '，失败' + stats.uploadFailNum + '个文件';
      // }
    }

    // $info.html(text);
  };

  // 按钮交互相关
  // $upload.on("click", () => {
  //   if (state === "ready") {
  //     uploader.upload();
  //   } else if (state === "paused") {
  //     uploader.upload();
  //   } else if (state === "uploading") {
  //     uploader.stop(true);
  //   } else {
  //     window.location.reload();
  //   }
  // });

  // 重新上传
  // $info.on("click", ".retry", () => {
  //   uploader.retry();
  // });

  // $cancelBtn.on("click", () => {
  //   uploader.stop(true);
  // });
};
onMounted(() => {
  // 入口方法
  main();
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
// .upload-main {
//   // width: 200px;
//   text-align: center;
//   height: 200px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   .upload-icon {
//     // background: red;
//     border: 1px solid black;
//     cursor: pointer;
//   }
// }
.iframe-box {
  width: 100%;
  height: 634px;
}
.addCourseware {
  width: 750px;
  background: #fff;
}
.test {
  width: 100%;
}
</style>
