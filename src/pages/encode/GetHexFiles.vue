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
            从本机上传文件
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            height="144"
            min-width="300"
            @click="openDialog2"
          >
            从远程URL拉取文件
          </v-btn>
        </v-col>
      </v-row>

      <v-dialog v-model="dialogVisible1" max-width="500">
        <v-card>
          <v-card-title>从本机上传文件</v-card-title>
          <v-file-input label="点此上传"></v-file-input>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="acceptDialog1">确定</v-btn>
            <v-btn color="primary" @click="closeDialog1">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogVisible2" max-width="500">
        <v-card>
          <v-card-title>远程URL文件拉取</v-card-title>
          <v-text-field label="请输入URL地址"></v-text-field>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="acceptDialog2">确定</v-btn>
            <v-btn color="primary" @click="closeDialog2">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script setup>
import {ref} from "vue";

const dialogVisible1 = ref(false);
const openDialog1 = () => {
  dialogVisible1.value = true;
};
const closeDialog1 = () => {
  dialogVisible1.value = false;
};
const acceptDialog1 = () => {
  dialogVisible1.value = false;
};

const dialogVisible2 = ref(false);
const openDialog2 = () => {
  dialogVisible2.value = true;
};
const closeDialog2 = () => {
  dialogVisible2.value = false;
};
const acceptDialog2 = () => {
  dialogVisible2.value = false;
};

</script>

<style scoped>

</style>
