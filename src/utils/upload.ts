import axios from "axios";
import SparkMD5 from "spark-md5";

const spark = new SparkMD5.ArrayBuffer();

interface UploadOptions {
  enableChunking: boolean; // 开启分片上传
  maxThreads: number; // 大文件开启分片上传时，同时上传的最大线程数，不写默认为3
  chunkSize: number; // 分片大小设置，默认为10MB
  token: string;
  baseUrl: string; // 请求api公共部分
}

export default class FileUploader {
  private maxThreads: number;
  private chunkSize: number;
  private token: string;
  private prepareUrl: string;
  private completeUrl: string;
  private enableChunking: boolean;

  constructor(options: UploadOptions) {
    this.maxThreads = options.maxThreads;
    this.chunkSize = options.chunkSize;
    this.token = options.token;
    this.prepareUrl = options.baseUrl + "/upload/file/storage/prepare";
    this.completeUrl = options.baseUrl + "/upload/file/storage/complete";
    this.enableChunking = options.enableChunking;
  }

  getHashByFile(file: File) {
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
        console.log("===文件读取进度===>", progress);
      };
    });
  }

  async uploadFile(file: File) {
    const md5 = await this.getHashByFile(file)
    const params = {
      chunks: 0,
      filename: file.name,
      md5,
      duration: 0,
    };
    const { data } = await axios.post(this.prepareUrl, params, {
      headers: {
        "user-token": 'd9b50e6487b847e2ae8e0777b8207cd5',
      },

    });
    const { uploads, contextId } = data.data;
    if (!uploads) {
      return;
    }
    const completeParams = {
      chunks: 0,
      contextId,
      filename: file.name,
      md5,
      duration: 0,
    };
    const res = await axios.post(this.completeUrl, completeParams, {
      headers: {
        'user-token': 'd9b50e6487b847e2ae8e0777b8207cd5'
      }
    })
    console.log('res',res);
    
  }
  
}
