<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          height="144"
          min-width="300"
          @click="openDialogEncodeUpload1"
        >
          从本机上传文件
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn
          height="144"
          min-width="300"
          @click="openDialogEncodeUpload2"
        >
          从远程URL拉取文件
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogVisibleEncodeUpload1" max-width="500">
      <v-card>
        <v-card-title>从本机上传文件</v-card-title>
        <v-file-input label="点此上传"></v-file-input>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="acceptDialogEncodeUpload1">确定</v-btn>
          <v-btn color="primary" @click="closeDialogEncodeUpload1">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogVisibleEncodeUpload2" max-width="500">
      <v-card>
        <v-card-title>远程URL文件拉取</v-card-title>
        <v-text-field label="https://"></v-text-field>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="acceptDialogEncodeUpload2">确定</v-btn>
          <v-btn color="primary" @click="closeDialogEncodeUpload2">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {ref} from "vue";

const dialogVisibleEncodeUpload1 = ref(false);
const openDialogEncodeUpload1 = () => {
  dialogVisibleEncodeUpload1.value = true;
};
const closeDialogEncodeUpload1 = () => {
  dialogVisibleEncodeUpload1.value = false;
};
const acceptDialogEncodeUpload1 = () => {
  dialogVisibleEncodeUpload1.value = false;
};

const dialogVisibleEncodeUpload2 = ref(false);
const openDialogEncodeUpload2 = () => {
  dialogVisibleEncodeUpload2.value = true;
};
const closeDialogEncodeUpload2 = () => {
  dialogVisibleEncodeUpload2.value = false;
};
const acceptDialogEncodeUpload2 = () => {
  dialogVisibleEncodeUpload2.value = false;
};

</script>

<style scoped>

</style>
