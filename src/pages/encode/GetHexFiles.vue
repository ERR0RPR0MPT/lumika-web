<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-text>
      <div class="text-h4">拉取文件</div>
    </v-card-text>
    <v-container>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            height="144"
            min-width="300"
            @click="openDialog1"
          >
            <div class="text-h5">从本机上传文件</div>
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            height="144"
            min-width="300"
            @click="openDialog2"
          >
            <div class="text-h5">从远程URL拉取文件</div>
          </v-btn>
        </v-col>
      </v-row>

      <v-dialog v-model="dialogVisible1" max-width="500">
        <v-card>
          <v-card-title>从本机上传文件</v-card-title>
          <v-file-input label="点此上传" ref="fileInput" multiple></v-file-input>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleEncodeFileUpload">确定</v-btn>
            <v-btn color="primary" @click="closeDialog1">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogVisible2" max-width="500">
        <v-card>
          <v-card-title>远程URL文件拉取</v-card-title>
          <v-text-field label="请输入URL地址" v-model="URLInputData"></v-text-field>
          <v-text-field label="请输入自定义文件名(可为空)" v-model="FileNameInputData"></v-text-field>
          <v-checkbox label="使用单线程下载(适用于不支持多线程分段下载的地址)" v-model="UseSingleThreadToDownloadInputData"></v-checkbox>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleSendURLData">确定</v-btn>
            <v-btn color="primary" @click="closeDialog2">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>

    <v-snackbar
      v-model="snackbarFlag"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          color="red"
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
import {ref} from "vue";
import {uploadEncodeFiles} from "@/api/UploadEncodeFiles";
import axios from "axios";

const dialogVisible1 = ref(false);
const dialogVisible2 = ref(false);
const fileInput = ref(null);
const snackbarFlag = ref(false)
const snackbarText = ref("")
const URLInputData = ref("")
const FileNameInputData = ref("")
const UseSingleThreadToDownloadInputData = ref(false)

const openDialog1 = () => {
  dialogVisible1.value = true;
};
const closeDialog1 = () => {
  dialogVisible1.value = false;
};

const openDialog2 = () => {
  dialogVisible2.value = true;
};
const closeDialog2 = () => {
  dialogVisible2.value = false;
};
// const acceptDialog2 = () => {
//   dialogVisible2.value = false;
// };

const handleEncodeFileUpload = () => {
  if (fileInput.value.files.length === 0) {
    snackbarText.value = "请选择文件";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }

  let files = Array.from(fileInput.value.files);

  uploadEncodeFiles(files)
    .then(response => {
      console.log("上传成功")
      console.log(response.data);
      snackbarText.value = "上传成功";
      snackbarFlag.value = true;
      dialogVisible1.value = false;
      fileInput.value = null;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.log("上传失败")
      console.error(error);
      snackbarText.value = "上传失败";
      snackbarFlag.value = true;
      fileInput.value = null;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
}

const handleSendURLData = () => {
  if (URLInputData.value === "") {
    snackbarText.value = "请输入URL地址";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }

  const formData = new FormData();
  formData.append('url', URLInputData.value);
  formData.append('fileName', FileNameInputData.value);
  formData.append("useSingleThreadToDownload", UseSingleThreadToDownloadInputData.value)

  axios.post('/api/get-file-from-url', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('已添加下载任务', response);
      console.log(response.data);
      snackbarText.value = "已添加下载任务";
      snackbarFlag.value = true;
      dialogVisible2.value = false;
      URLInputData.value = ""
      FileNameInputData.value = ""
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('任务创建失败', error);
      console.error(error);
      snackbarText.value = "任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
}

</script>

<style scoped>

</style>
