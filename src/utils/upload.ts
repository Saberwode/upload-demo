import axios from "axios";
import type { Method } from "axios";
import SparkMD5 from "spark-md5";

const spark = new SparkMD5.ArrayBuffer();

const CancelToken = axios.CancelToken;
let cancel: Function | undefined;

const cancelUploadRequest = () => {
  if (cancel) {
    console.log("Request canceled");
    cancel("Request canceled.");
  }
};

interface UploadOptions {
  enableChunking?: boolean; // 开启分片上传
  maxThreads?: number; // 大文件开启分片上传时，同时上传的最大线程数，不写默认为3
  chunkSize?: number; // 分片大小设置，默认为10MB
  token: string;
  baseUrl: string; // 请求api公共部分
}
interface UploadConfig {
  host: string;
  method: Method;
  params: {
    appKey: string;
    contextId: string;
    expires: string;
    token: string;
  };
}

interface CompleteParams {
  totalChunks: number;
  contextId: string;
  name: string;
  md5: string;
  duration: any;
}
export default class FileUploader {
  private maxThreads: number; // 最大线程数，默认为3
  private chunkSize: number; // 分片大小，每一片大小，默认为10M
  private enableChunking: boolean; // 是否开启分片，默认开启
  private token: string; // 用户token
  private prepareUrl: string; // 准备url，用于获取上传地址以及上传配置
  private completeUrl: string; // 完成url，通知后端上传完成
  private fileList: File[]; // 文件池
  private currentUploadFileIndex: number;

  // 文件扫描进度回调（默认为undeined，需要外部调用进行注册重写）
  public onScanProgressUpdate: Function | undefined = undefined;
  // 文件上传进度回调（默认为undeined，需要外部调用进行注册重写）
  public onUploadProgressUpdate: Function | undefined = undefined;
  // 文件上传完成回调（默认为undeined，需要外部调用进行注册重写）
  public onUploadComplete: Function | undefined = undefined;

  constructor(options: UploadOptions) {
    this.maxThreads = options.maxThreads ?? 3;
    this.chunkSize = options.chunkSize ?? 1024 * 1024 * 10;
    this.token = options.token;
    this.prepareUrl = options.baseUrl + "/upload/file/storage/prepare";
    this.completeUrl = options.baseUrl + "/upload/file/storage/complete";
    this.enableChunking = options.enableChunking ?? true;
    this.fileList = [];
    this.currentUploadFileIndex = 0;
  }

  // 获取文件的md5
  getHashByFile(file: File, fileIndex: number):Promise<string> {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      // 1.读取文件，并得到一个ArrayBuffer的对象文件数据
      fileReader.readAsArrayBuffer(file);

      // 2.文件读取完成回调函数
      fileReader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        spark.append(buffer);

        // 唯一标识
        const HASH = spark.end();
        resolve(HASH);
      };

      // 2.文件读取进度回调函数
      fileReader.onprogress = (e) => {
        const progress = (e.loaded / file.size) * 100;

        if (
          this.onScanProgressUpdate &&
          Object.prototype.toString.call(this.onScanProgressUpdate) ===
            "[object Function]"
        ) {
          // 取整
          this.onScanProgressUpdate(Math.trunc(progress), fileIndex);
        }
      };
    });
  }

  private getDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const fileUrl = URL.createObjectURL(file);
      const audioElement = new Audio(fileUrl);

      const setDuration = () => {
        console.log('Math.round(audioElement.duration',Math.round(audioElement.duration));
        resolve(Math.round(audioElement.duration));
        
        
      };

      audioElement.addEventListener("loadedmetadata", setDuration);
      audioElement.addEventListener("error", reject);
      // 释放资源
      setTimeout(() => {
        audioElement.removeEventListener("loadedmetadata", setDuration);
        window.URL.revokeObjectURL(fileUrl);
      }, 800);
    });
  }

  // 分片上传
  async getChunks(file: File, md5: string) {
    let chunks = 0;
    let duration = null;
    // 获取视频时长
    if (/\.(mp3|mp4|mkv|mov)$/i.test(file.name)) {
      duration = await this.getDuration(file).catch(() => {});
      console.log('看看到底收到',duration);
      
    }
    // 判断分片数（需要启用分片且文件大小需要大于分片大小才有意义）
    if (this.enableChunking && file.size > this.chunkSize) {
      // 传参异常
      if (!this.chunkSize) {
        this.chunkSize = 1024 * 1024 * 10;
      }
      // 向上取整
      chunks = Math.ceil(file.size / this.chunkSize);
    }
    // 获取文件上传地址
    const params = {
      chunks,
      filename: file.name,
      md5,
      duration
    };
    console.log('token',this,this.token);
    
    const { data } = await axios.post(this.prepareUrl, params, {
      headers: {
        "user-token": this.token,
      },
      cancelToken: new CancelToken(function (c) {
        cancel = c;
      }),
    });
    const { uploads, contextId } = data.data as {
      uploads: Array<UploadConfig>;
      contextId: string;
    };
    // 文件秒传（文件已经存在）
    if (!uploads) {
      // 更新文件上传状态
      if (
        this.onUploadProgressUpdate &&
        Object.prototype.toString.call(this.onUploadProgressUpdate) ===
          "[object Function]"
      ) {
        // 取整
        this.onUploadProgressUpdate(100, this.currentUploadFileIndex);
      }
      if (
        this.onUploadComplete &&
        Object.prototype.toString.call(this.onUploadComplete) ===
          "[object Function]"
      ) {
        // 文件上传完成返回文件信息
        this.onUploadComplete(data.data);
      }
      return;
    }
    // 文件分片
    const maxConcurrentRequests = this.maxThreads;
    const totalChunks = uploads.length;
    // 当前已经上传的分片数
    let uploadedChunksNumber = 0;
    const requests: Promise<void>[] = [];

    // 自定义函数，控制并发上传的数量
    async function controlConcurrency(uploadPromise: Promise<void>) {
      requests.push(uploadPromise);
      if (requests.length >= maxConcurrentRequests) {
        // 如果当前并发请求数量超过阈值，等待最先完成的请求
        await Promise.race(requests);
      }
    }

    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);
      const chunk = file.slice(start, end);
      const uploadPromise = this.uploadChunk(chunk, uploads[i])
        .then(() => {
          // 当上传请求完成时，从requests数组中移除该请求
          const index = requests.indexOf(uploadPromise);
          if (index !== -1) {
            requests.splice(index, 1);
          }
          uploadedChunksNumber++;
          // 更新上传进度
          if (
            this.onUploadProgressUpdate &&
            Object.prototype.toString.call(this.onUploadProgressUpdate) ===
              "[object Function]"
          ) {
            // 取整
            this.onUploadProgressUpdate(
              Math.trunc((uploadedChunksNumber / totalChunks) * 100),
              this.currentUploadFileIndex
            );
          }
        })
        .catch((error) => {
          console.error("上传失败:", error);
          // 在此处处理上传失败的情况
        });

      await controlConcurrency(uploadPromise);
    }

    // 等待所有上传请求完成
    await Promise.all(requests);
    const completeParams = {
      totalChunks,
      contextId,
      name: file.name,
      md5,
      duration,
    };
    this.uploadComplete(completeParams);
  }

  private async uploadComplete(params: CompleteParams) {
    const { totalChunks, contextId, md5, duration, name } = params;
    const completeParams = {
      chunks: totalChunks,
      contextId,
      filename: name,
      md5,
      duration,
    };
    // 上传完成
    const { data } = await axios.post(this.completeUrl, completeParams, {
      headers: {
        "user-token": this.token,
      },
      cancelToken: new CancelToken(function (c) {
        cancel = c;
      }),
    });
    if (
      this.onUploadComplete &&
      Object.prototype.toString.call(this.onUploadComplete) ===
        "[object Function]"
    ) {
      // 文件上传完成返回文件信息
      this.onUploadComplete(data.data);
    }
  }

  async uploadChunk(file: Blob, config: UploadConfig) {
    const formData = new FormData();
    for (const key in config.params) {
      formData.append(key, config.params[key as keyof UploadConfig["params"]]);
    }
    formData.append("file", file);

    await axios({
      url: config.host,
      method: config.method,
      data: formData,
      cancelToken: new CancelToken(function (c) {
        cancel = c;
      }),
    });
  }

  public async addFile(file: File) {
    this.fileList.push(file);
    // 整体思路，因为upload 会被调用多次，每次被调用就会向fileList中加入新的文件
    // 此时仅需要判断目前新增的这个文件是否需要立即上传，如果不需要，则排队等待上传
    // 对比文件池与currnetUploadFileIndex与当前fileList的长度，如果+1 = 长度，则需要立即上传
    if (this.currentUploadFileIndex + 1 === this.fileList.length) {
      // 上传操作
      this.upload();
    } else {
      // 等待排队
      return;
    }
  }
  async upload() {
    // 上传currentUploadFileIndex的文件
    if (this.fileList[this.currentUploadFileIndex]) {
      const md5 = await this.getHashByFile(
        this.fileList[this.currentUploadFileIndex],
        this.currentUploadFileIndex
      );
      await this.getChunks(this.fileList[this.currentUploadFileIndex], md5);
      console.log(`上传完成这是第${this.currentUploadFileIndex + 1}个文件`);

      this.currentUploadFileIndex++;
      // 递归将所有文件都上传完
      this.upload();
    } else {
      return;
    }
  }
  // 取消上传
  public abort() {
    cancelUploadRequest();
  }
}
