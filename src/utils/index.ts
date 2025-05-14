/*
 * @Description: 工具函数
 * @Author: jmguo2
 * @Date: 2023-08-10 11:50:39
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-08-11 10:20:11
 */

/**
 * @description: 获取文件后缀
 * @param {*} fileSuffix
 * @return {*}
 */
export const getFileType = (fileName: string) => {
  let fileType = '';
  if (/\.(mp4|avi|mkv|mov|rmvb|mpeg|mpg|wmv)$/.test(fileName)) {
    fileType = 'video';
  } else if (/\.(mp3|MP3)$/.test(fileName)) {
    fileType = 'audio';
  } else if (/\.(jpg|jpeg|png)$/.test(fileName)) {
    fileType = 'graphic';
  } else {
    fileType = 'document';
  }
  return fileType;
};

const accept = [
  {
    title: 'Image',
    extensions: '.jpg,.jpeg,.png',
    mimeTypes: 'image/jpeg,image/png'
  },
  {
    title: 'Video',
    extensions: '.mp4,.avi,.mkv,.mov,.rmvb,.mpeg,.mpg,.wmv',
    mimeTypes:
      'video/mp4,video/x-msvideo,video/x-matroska,video/quicktime,application/vnd.rn-realmedia-vbr,video/mpeg,video/x-ms-wmv'
  },
  {
    title: 'Audio',
    extensions: '.mp3',
    mimeTypes: 'audio/mpeg'
  },
  {
    title: 'PDF',
    extensions: '.pdf',
    mimeTypes: 'application/pdf'
  },
  {
    title: 'Word',
    extensions: '.doc,.docx',
    mimeTypes:
      'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  {
    title: 'Excel',
    extensions: '.xls,.xlsx',
    mimeTypes:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  {
    // pptx mac上无法识别，暂无解
    title: 'PPT',
    extensions: '.pptx,.ppt',
    mimeTypes:
      'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
  }
];

// 获取可接受的扩展名
export const getAcceptFileType = (typeList: Array<string>) => {
  const extensionsDict: Record<string, string> = {}
  accept.forEach((item) => {
    extensionsDict[item.title] = item.extensions;
  })
  const typeArr = typeList.map((typeItem) => 
    extensionsDict[typeItem]
  ).filter(Boolean);
  return typeArr.join(',');
}

// 获取文件后缀名
export const getFileExtension = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf('.'));
}