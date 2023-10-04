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
    <v-list lines="three">
      <v-list-subheader inset>Encode 目录</v-list-subheader>

      <v-list-item
        v-for="file in encodeFileList"
        :key="file.filename"
        :title="file.filename"
        :subtitle="null"
        @click="null"
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
        :subtitle="null"
        @click="null"
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
        :subtitle="null"
        @click="null"
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
        :subtitle="null"
        @click="null"
      >
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">{{ fileTypeComputed(file.type) ? "mdi-file" : "mdi-folder" }}</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import {ref} from 'vue';
import axios from "axios";

const encodeFileList = ref([]);
const encodeOutputFileList = ref([]);
const decodeFileList = ref([]);
const decodeOutputFileList = ref([]);
const fileTypeComputed = (type) => {
  return type === 'file';
};

const handleDlTaskListData = (data) => {
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

// 定义函数来获取文件列表数据
const getFileList = async () => {
  try {
    const response = await axios.get('/api/get-file-list');
    handleDlTaskListData(response.data)
  } catch (error) {
    console.error("获取下载任务列表数据失败");
    console.error(error);
  }
};
getFileList()

</script>

<style scoped>

</style>
