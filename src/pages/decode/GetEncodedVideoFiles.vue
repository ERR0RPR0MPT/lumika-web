<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-text>
      <div class="text-h4">拉取视频</div>
    </v-card-text>
    <v-container>
      <v-row justify="center">
        <v-col cols="auto">
        <v-btn
          height="144"
          min-width="300"
          @click="openDialog1"
        >
          <div class="text-h5">从哔哩源下载</div>
        </v-btn>
      </v-col>
        <v-col cols="auto">
          <v-btn
            height="144"
            min-width="300"
            @click="openDialog2"
          >
            <div class="text-h5">从本机上传已编码的视频</div>
          </v-btn>
        </v-col>
      </v-row>

      <v-dialog v-model="dialogVisible1" max-width="500">
        <v-card>
          <v-card-title>从哔哩源下载</v-card-title>
          <v-text-field label="请输入BV/av号"></v-text-field>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="acceptDialog1">确定</v-btn>
            <v-btn color="primary" @click="closeDialog1">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <v-dialog v-model="dialogVisible2" max-width="500">
        <v-card>
          <v-card-title>从本机上传已编码的视频</v-card-title>
          <v-text-field label="请设置上传的目录名称" v-model="fileNameInput"></v-text-field>
          <v-file-input label="选择目录" ref="fileInput" @change="selectDirectory" webkitdirectory></v-file-input>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleDecodeFileUpload">确定</v-btn>
            <v-btn color="primary" @click="closeDialog2">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script setup>
import {ref} from "vue";
import {uploadDecodeFiles} from "@/api/UploadDecodeVideos";

const dialogVisible1 = ref(false);
const fileInput = ref(null);
const fileNameInput = ref("")
const snackbarFlag = ref(false)
const snackbarText = ref("")
const dialogVisible2 = ref(false);

const openDialog1 = () => {
  dialogVisible1.value = true;
};
const closeDialog1 = () => {
  dialogVisible1.value = false;
};
const acceptDialog1 = () => {
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

const selectDirectory = () => {
  const files = fileInput.value.files;
  if (files.length > 0) {
    this.directory = files[0];
  }
}

const handleDecodeFileUpload = () => {
  let files = Array.from(fileInput.value.files);

  uploadDecodeFiles(files, fileNameInput.value)
    .then(response => {
      console.log("上传成功")
      console.log(response.data);
      snackbarText.value = "上传成功";
      snackbarFlag.value = true;
      dialogVisible1.value = false;
      fileInput.value = null;
    })
    .catch(error => {
      console.log("上传失败")
      console.error(error);
      snackbarText.value = "上传失败";
      snackbarFlag.value = true;
      fileInput.value = null;
    });
}

</script>

<style scoped>

</style>
