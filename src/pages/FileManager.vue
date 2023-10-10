<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">文件管理</div>
    </v-card-text>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-upload" size="x-large" @click="openDialog1">
        从本机上传文件
      </v-btn>
      <v-btn prepend-icon="mdi-upload" size="x-large" @click="openDialog4">
        从本机上传已编码的视频目录
      </v-btn>
    </v-col>
    <v-list lines="three">
      <v-list-subheader inset>Encode 目录</v-list-subheader>

      <v-list-item
        v-for="file in encodeFileList"
        :key="file.filename"
        :title="file.filename"
        :subtitle="file.timestamp + ', ' + file.sizeStr"
        @click="showFileDetails(file)"
      >
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">{{ fileTypeComputed(file.type) ? "mdi-file" : "mdi-folder" }}</v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-subheader inset>Encode 输出目录</v-list-subheader>
      <v-list-item
        v-for="file in encodeOutputFileList"
        :key="file.filename"
        :title="file.filename"
        :subtitle="file.timestamp + ', ' + file.sizeStr"
        @click="showFileDetails(file)"
      >
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">{{ fileTypeComputed(file.type) ? "mdi-file" : "mdi-folder" }}</v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-subheader inset>Decode 目录</v-list-subheader>
      <v-list-item
        v-for="file in decodeFileList"
        :key="file.filename"
        :title="file.filename"
        :subtitle="file.timestamp + ', ' + file.sizeStr"
        @click="showFileDetails(file)"
      >
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">{{ fileTypeComputed(file.type) ? "mdi-file" : "mdi-folder" }}</v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-subheader inset>Decode 输出目录</v-list-subheader>
      <v-list-item
        v-for="file in decodeOutputFileList"
        :key="file.filename"
        :title="file.filename"
        :subtitle="file.timestamp + ', ' + file.sizeStr"
        @click="showFileDetails(file)"
      >
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">{{ fileTypeComputed(file.type) ? "mdi-file" : "mdi-folder" }}</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="childDialogVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto" max-height="93vh">
          <v-card-title>详细信息</v-card-title>
          <v-col cols="auto">
            <v-btn prepend-icon="mdi-arrow-left" size="x-large" @click="hideFileDetails">
              返回
            </v-btn>
            <v-btn prepend-icon="mdi-download" size="x-large" @click="openLinkInNewTab(selectedFile)">
              下载
            </v-btn>
            <v-btn v-if="selectedFile.filename.endsWith('.zip')" prepend-icon="mdi-folder-zip" size="x-large" @click="unzipFileFromAPI(selectedFile)">
              解压
            </v-btn>
            <v-btn prepend-icon="mdi-rename" size="x-large" @click="renameFileFromAPI(selectedFile)">
              重命名
            </v-btn>
            <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="deleteFileFromAPI(selectedFile)">
              删除
            </v-btn>
          </v-col>
          <v-text-field v-model="selectedFile.filename" label="名称"></v-text-field>
          <v-divider></v-divider>

          <v-table>
            <thead>
            <tr>
              <th class="text-left">
                Key
              </th>
              <th class="text-left">
                Value
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>名称</td>
              <td>{{ selectedFile.filename }}</td>
            </tr>
            <tr>
              <td>大小</td>
              <td>{{ selectedFile.sizeStr }}</td>
            </tr>
            <tr>
              <td>修改时间</td>
              <td>{{ selectedFile.timestamp }}</td>
            </tr>
            </tbody>
          </v-table>
          <v-col cols="auto">
            <v-card>
              <v-card-title
                v-if="selectedFile.type === 'file' && (extComputed(selectedFile) === 'image' || extComputed(selectedFile) === 'video' || extComputed(selectedFile) === 'audio')">
                预览
              </v-card-title>
              <v-img
                v-if="selectedFile.type === 'file' && extComputed(selectedFile) === 'image'"
                :src="GLOBAL.apiURL + '/dl/'+selectedFile.parentDir+'/'+selectedFile.filename"
                :lazy-src="GLOBAL.apiURL + '/dl/'+selectedFile.parentDir+'/'+selectedFile.filename"
                aspect-ratio="1"
                class="grey lighten-2"
              ></v-img>
              <video controls v-if="selectedFile.type === 'file' && extComputed(selectedFile) === 'video'">
                <source :src="GLOBAL.apiURL + '/dl/'+selectedFile.parentDir+'/'+selectedFile.filename" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <audio controls v-if="selectedFile.type === 'file' && extComputed(selectedFile) === 'audio'">
                <source :src="GLOBAL.apiURL + '/dl/'+selectedFile.parentDir+'/'+selectedFile.filename" type="audio/mpeg">
                Your browser does not support the audio tag.
              </audio>
            </v-card>
          </v-col>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="hideFileDetails">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="dialogVisible1" max-width="500">
      <v-container>
        <v-card>
          <v-card-title>从本机上传文件</v-card-title>
          <v-select
            label="上传到"
            :items="['encode', 'encodeOutput', 'decode', 'decodeOutput']"
            v-model="parentDir"
          ></v-select>
          <v-file-input label="点此上传" ref="fileInput" multiple></v-file-input>
          <v-progress-linear v-if="uploadProgress > 0 && uploadProgress <= 100" :model-value="uploadProgress"
                             color="primary"></v-progress-linear>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleEncodeFileUpload">确定</v-btn>
            <v-btn color="primary" @click="closeDialog1">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="dialogVisible4" max-width="500">
      <v-container>
        <v-card>
          <v-card-title>从本机上传已编码的视频目录</v-card-title>
          <v-select
            label="上传到"
            :items="['encode', 'encodeOutput', 'decode', 'decodeOutput']"
            v-model="parentDir"
          ></v-select>
          <v-text-field label="请设置上传的目录名称" v-model="dirNameInput"></v-text-field>
          <v-file-input label="选择目录" ref="dirInput" @change="selectDirectory" webkitdirectory></v-file-input>
          <v-progress-linear v-if="uploadProgress > 0 && uploadProgress <= 100" :model-value="uploadProgress"
                             color="primary"></v-progress-linear>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleDecodeFileUpload">确定</v-btn>
            <v-btn color="primary" @click="closeDialog4">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-snackbar
      v-model="snackbarFlag"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          color="purple"
          variant="text"
          @click="snackbarFlag = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup>
import GLOBAL from "../Common.vue";
import axios from "axios";
import {onBeforeUnmount, onMounted, ref} from 'vue';

const dialogVisible1 = ref(false);
const dialogVisible4 = ref(false);
const uploadProgress = ref(0);
const fileInput = ref(null);
const dirInput = ref(null);
const dirNameInput = ref("");
const encodeFileList = ref([]);
const encodeOutputFileList = ref([]);
const decodeFileList = ref([]);
const decodeOutputFileList = ref([]);
const selectedFile = ref(null);
const childDialogVisible = ref(false);
const snackbarFlag = ref(false);
const snackbarText = ref("");
const parentDir = ref("");
const fileTypeComputed = (type) => {
  return type === 'file';
};
const openDialog1 = () => {
  dialogVisible1.value = true;
};
const closeDialog1 = () => {
  dialogVisible1.value = false;
};
const openDialog4 = () => {
  dialogVisible4.value = true;
};
const closeDialog4 = () => {
  dialogVisible4.value = false;
};
const selectDirectory = () => {
  const files = fileInput.value.files;
  if (files.length > 0) {
    this.directory = files[0];
  }
};

const handleEncodeFileUpload = () => {
  if (parentDir.value === "") {
    snackbarText.value = "请选择父目录来存储上传的文件";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (fileInput.value.files.length === 0) {
    snackbarText.value = "请选择文件";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }

  let files = Array.from(fileInput.value.files);

  axios.interceptors.request.use(config => {
    config.onUploadProgress = function (event) {
      uploadProgress.value = Math.round((event.loaded * 100) / event.total);
    };
    return config;
  });

  const formData = new FormData();
  formData.append('parentDir', parentDir.value);
  files.forEach(file => {
    formData.append('files', file);
  });

  axios.post(GLOBAL.apiURL + '/upload/encode', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      console.log("上传成功")
      console.log(response.data);
      snackbarText.value = "上传成功";
      snackbarFlag.value = true;
      dialogVisible1.value = false;
      fileInput.value = null;
      uploadProgress.value = 0;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.log("上传失败")
      console.error(error);
      snackbarText.value = "上传失败";
      snackbarFlag.value = true;
      uploadProgress.value = 0;
      fileInput.value = null;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

const handleDecodeFileUpload = () => {
  if (parentDir.value === "") {
    snackbarText.value = "请选择父目录来存储上传的文件";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (dirInput.value.files.length === 0 || dirNameInput.value === "") {
    snackbarText.value = "请选择文件并设置上传目录的名称";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }

  let files = Array.from(dirInput.value.files);

  axios.interceptors.request.use(config => {
    config.onUploadProgress = function (event) {
      uploadProgress.value = Math.round((event.loaded * 100) / event.total);
    };
    return config;
  });

  const formData = new FormData();
  files.forEach(file => {
    formData.append('directory', file);
  });
  formData.append('folderName', dirNameInput.value);
  formData.append('parentDir', parentDir.value);

  axios.post(GLOBAL.apiURL + '/upload/decode', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      console.log("上传成功")
      console.log(response.data);
      snackbarText.value = "上传成功";
      snackbarFlag.value = true;
      dialogVisible4.value = false;
      dirInput.value = null;
    })
    .catch(error => {
      console.log("上传失败")
      console.error(error);
      snackbarText.value = "上传失败";
      snackbarFlag.value = true;
      dirInput.value = null;
    });
};

const extComputed = (file) => {
  if (file.filename.endsWith('.jpg') || file.filename.endsWith('.png') || file.filename.endsWith('.jpeg') || file.filename.endsWith('.gif')) {
    return "image";
  } else if (file.filename.endsWith('.mp4')) {
    return "video";
  } else if (file.filename.endsWith('.mp3')) {
    return "audio";
  } else {
    return null;
  }
};

const showFileDetails = (file) => {
  selectedFile.value = file;
  selectedFile.value.originName = file.filename;
  childDialogVisible.value = true;
}
const hideFileDetails = () => {
  getFileList();
  childDialogVisible.value = false;
}

const handleDlTaskListData = (data) => {
  if (data.encode !== null) {
    data.encode.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (data.decode !== null) {
    data.decode.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (data.encodeOutput !== null) {
    data.encodeOutput.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (data.decodeOutput !== null) {
    data.decodeOutput.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (encodeFileList.value !== data.encode) {
    encodeFileList.value = data.encode
  }
  if (decodeFileList.value !== data.decode) {
    decodeFileList.value = data.decode
  }
  if (encodeOutputFileList.value !== data.encodeOutput) {
    encodeOutputFileList.value = data.encodeOutput
  }
  if (decodeOutputFileList.value !== data.decodeOutput) {
    decodeOutputFileList.value = data.decodeOutput
  }
}

const deleteFileFromAPI = (file) => {
  const formData = new FormData();
  formData.append('dir', file.parentDir);
  formData.append('file', file.filename);

  axios.post(GLOBAL.apiURL + '/delete-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('"' + file.filename + '"已删除', response);
      console.log(response.data);
      snackbarText.value = '"' + file.filename + '"已删除';
      snackbarFlag.value = true;
      childDialogVisible.value = false;
      selectedFile.value = null;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('"' + file.filename + '"删除失败', error);
      console.error(error);
      snackbarText.value = '"' + file.filename + '"删除失败';
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

const unzipFileFromAPI = (file) => {
  const formData = new FormData();
  formData.append('dir', file.parentDir);
  formData.append('file', file.filename);

  axios.post(GLOBAL.apiURL + '/unzip', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('解压成功', response);
      console.log(response.data);
      snackbarText.value = '解压成功';
      snackbarFlag.value = true;
      childDialogVisible.value = false;
      selectedFile.value = null;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('解压失败', error);
      console.error(error);
      snackbarText.value = '解压失败';
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
}

const renameFileFromAPI = (file) => {
  const formData = new FormData();
  formData.append('dir', file.parentDir);
  formData.append('originName', file.originName);
  formData.append('name', file.filename);

  axios.post(GLOBAL.apiURL + '/rename-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('已重命名为"' + file.filename + '"', response);
      console.log(response.data);
      snackbarText.value = '已重命名为"' + file.filename + '"';
      snackbarFlag.value = true;
      childDialogVisible.value = false;
      selectedFile.value = null;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('重命名失败', error);
      console.error(error);
      snackbarText.value = '重命名失败';
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

const openLinkInNewTab = (file) => {
  window.open(GLOBAL.apiURL + "/dl/" + file.parentDir + "/" + file.filename, '_blank');
}

// 定义函数来获取文件列表数据
const getFileList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-file-list');
    handleDlTaskListData(response.data)
  } catch (error) {
    console.error("获取下载列表数据失败");
    console.error(error);
  }
};

let refreshTimer = null;

// 在组件创建时启动计时器
onMounted(() => {
  getFileList(); // 首次立即获取数据
  refreshTimer = setInterval(getFileList, 1000); // 每隔 1000ms 调用一次 fetchData
});

// 在组件销毁之前清除计时器
onBeforeUnmount(() => {
  clearInterval(refreshTimer);
});

</script>

<style scoped>

</style>
