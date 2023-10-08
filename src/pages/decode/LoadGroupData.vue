<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">解析合集码</div>
    </v-card-text>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-sync" size="x-large" @click="loadGroupData">解析</v-btn>
      <v-btn v-if="base64JsonData !== ''" prepend-icon="mdi-delete-forever" size="x-large"
             @click="base64JsonData = ''; jsonData = null;">
        清除
      </v-btn>
      <v-btn v-if="base64JsonData !== '' && jsonData !== null" prepend-icon="mdi-arrow-right" size="x-large"
             @click="sendAllDlTask">
        发送全部任务到下载列表
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-textarea v-model="base64JsonData" label="请输入合集码"></v-textarea>
    </v-col>

    <v-container v-if="jsonData !== null">
      <v-card elevation="12" max-height="93vh">
        <v-card-title>解析结果</v-card-title>
        <v-col cols="auto">
          <v-table>
            <thead>
            <tr>
              <th class="text-left">
                名称
              </th>
              <th class="text-left">
                简介
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ jsonData.nameText }}</td>
              <td>{{ jsonData.summaryText }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-list lines="three">
          <v-list-item
            v-for="(item, index) in jsonData.groupData"
            :key="index"
            :title="item.id"
            :subtitle="item.baseStr"
            @click="sendDlTask(index, item)"
          >
            <template v-slot:prepend>
              <v-avatar color="primary">
                <v-icon color="white">mdi-book</v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>

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
import GLOBAL from "../../Common.vue";
import {ref, watch} from 'vue';
import axios from "axios";

const snackbarFlag = ref(false);
const snackbarText = ref("");
const base64JsonData = ref("");
const jsonData = ref(null);

watch(base64JsonData, () => {
  autoLoadGroupData();
});

const loadGroupData = () => {
  if (base64JsonData.value === "") {
    snackbarText.value = "请输入合集码";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  try {
    const base64String = base64JsonData.value;
    const decodedData = atob(base64String);
    const decoder = new TextDecoder();
    jsonData.value = JSON.parse(decoder.decode(new Uint8Array([...decodedData].map(char => char.charCodeAt(0)))));
    console.log('成功解析配置', jsonData.value);
    console.log(jsonData.value);
    snackbarText.value = "成功解析配置";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (e) {
    console.error('配置解析失败: ' + e.toString());
    snackbarText.value = '配置解析失败: ' + e.toString();
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
  }
};

const autoLoadGroupData = () => {
  try {
    const base64String = base64JsonData.value;
    const decodedData = atob(base64String);
    const decoder = new TextDecoder();
    jsonData.value = JSON.parse(decoder.decode(new Uint8Array([...decodedData].map(char => char.charCodeAt(0)))));
    console.log('成功解析配置', jsonData.value);
    console.log(jsonData.value);
    snackbarText.value = "成功解析配置";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (e) {
    console.error('配置解析失败: ' + e.toString());
    jsonData.value = null;
  }
};

const sendDlTask = (index, item) => {
  if (item.id === "" || item.baseStr === "") {
    snackbarText.value = "请输入配置正确的合集码";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }

  const formData = new FormData();
  formData.append('biliId', item.id);
  formData.append('baseStr', item.baseStr);
  formData.append('parentDir', "decode");

  axios.post(GLOBAL.apiURL + '/get-bili-encoded-video-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log("已添加第" + (index + 1) + "个任务到下载列表", response);
      console.log(response.data);
      // 去除已添加的任务
      jsonData.value.groupData.splice(index, 1);
      snackbarText.value = "已添加第" + (index + 1) + "个任务到下载列表";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('下载任务创建失败', error);
      console.error(error);
      snackbarText.value = "下载任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

const sendAllDlTask = () => {
  // 遍历发送所有任务
  jsonData.value.groupData.forEach((item, index) => {
    if (item.id === "" || item.baseStr === "") {
      console.log("添加第" + index + 1 + "个任务出现错误: 请输入配置正确的合集码");
      return;
    }
    const formData = new FormData();
    formData.append('biliId', item.id);
    formData.append('baseStr', item.baseStr);
    formData.append('parentDir', "decode");

    axios.post(GLOBAL.apiURL + '/get-bili-encoded-video-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log("已添加第" + (index + 1) + "个任务到下载列表", response);
        console.log(response.data);
      })
      .catch(error => {
        console.error('下载任务创建失败', error);
        console.error(error);
      });
  });
  jsonData.value.groupData = [];
  snackbarText.value = "已添加所有任务到下载列表";
  snackbarFlag.value = true;
  setTimeout(() => {
    snackbarFlag.value = false;
  }, 3000);
}

</script>

<style scoped>

</style>
