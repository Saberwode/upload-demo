/*
 * @Author: jmguo2
 * @Date: 2023-03-27 15:53:18
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-08-11 14:18:58
 */
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUploadStore = defineStore("upload", () => {
  const token = ref("");
  const acceptFileType = ref([]); // 可接受的文件类型
  const acceptFileSize = ref(0); // 可接受的文件大小
  const fileNumLimit = ref(null); // 可上传几个文件
  const host = ref(""); // 目标host

  return { token, acceptFileType, acceptFileSize, fileNumLimit, host };
});
