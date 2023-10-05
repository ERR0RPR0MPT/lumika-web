<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">生成合集码</div>
    </v-card-text>
    <v-col v-if="base64JsonData !== ''" cols="auto">
      <v-text-field v-model="base64JsonData" label="生成的 Base64 配置"></v-text-field>
    </v-col>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-sync" size="x-large" @click="generateGroupData">生成</v-btn>
      <v-btn v-if="base64JsonData !== ''" prepend-icon="mdi-sync" size="x-large" @click="copyToClipboard(base64JsonData)">复制到剪贴板</v-btn>
      <v-btn v-if="base64JsonData !== ''" prepend-icon="mdi-delete-forever" size="x-large" @click="base64JsonData = ''">清除</v-btn>
      <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshGroupData">初始化</v-btn>
    </v-col>
    <v-col cols="auto">
      <v-text-field v-model="jsonData.nameText" label="请输入资源名称"></v-text-field>
      <v-text-field v-model="jsonData.summaryText" label="请输入简介"></v-text-field>
    </v-col>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-plus" size="x-large" @click="addInput"></v-btn>
      <v-btn prepend-icon="mdi-minus" size="x-large" @click="removeInput"></v-btn>
    </v-col>
    <v-col cols="auto">
      <v-row v-for="(item, index) in jsonData.groupData" :key="index">
        <v-col cols="4">
          <v-text-field v-model="item.id" label="请输入BV号"></v-text-field>
          <v-btn prepend-icon="mdi-plus" size="x-large" @click="null">选择哔哩源</v-btn>
        </v-col>
        <v-col cols="8">
          <v-text-field v-model="item.baseStr" label="请输入 Base64 配置"></v-text-field>
          <v-btn prepend-icon="mdi-plus" size="x-large" @click="null">选择已编码任务</v-btn>
        </v-col>
      </v-row>
    </v-col>
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
import {ref} from 'vue';

const snackbarFlag = ref(false);
const snackbarText = ref("");

const jsonData = ref(
  {
    nameText: "",
    summaryText: "",
    groupData: [
      {
        id: "",
        baseStr: ""
      }
    ],
  }
);
const base64JsonData = ref("");

const addInput = () => {
  jsonData.value.groupData.push({id: "", baseStr: ""});
};

const removeInput = () => {
  if (jsonData.value.groupData.length === 1) {
    return;
  }
  jsonData.value.groupData.pop();
};

const generateGroupData = () => {
  if (jsonData.value.nameText === "") {
    snackbarText.value = "请输入资源名称";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }
  if (jsonData.value.summaryText === "") {
    snackbarText.value = "请输入简介";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }
  base64JsonData.value = btoa(JSON.stringify(jsonData.value));
};

const refreshGroupData = () => {
  jsonData.value = {
    nameText: "",
    summaryText: "",
    groupData: [
      {
        id: "",
        baseStr: ""
      }
    ],
  };
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('内容已成功复制到剪贴板');
    snackbarText.value = "内容已成功复制到剪贴板";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (e) {
    console.log(e);
    console.error('无法复制内容到剪贴板');
    snackbarText.value = "无法复制内容到剪贴板";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
  }
};

</script>

<style scoped>

</style>
