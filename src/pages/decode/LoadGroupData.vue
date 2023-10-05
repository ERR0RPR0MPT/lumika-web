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
      <v-btn v-if="base64JsonData !== ''" prepend-icon="mdi-delete-forever" size="x-large" @click="base64JsonData = ''; jsonData = null;">
        清除
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-textarea v-model="base64JsonData" label="请输入合集码"></v-textarea>
    </v-col>

    <v-container v-if="jsonData !== null">
      <v-card>
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

        <v-col cols="auto">
          <v-table>
            <thead>
            <tr>
              <th class="text-left">
                BV号
              </th>
              <th class="text-left">
                Base64 配置
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in jsonData.groupData" :key="index">
              <td>{{ item.id }}</td>
              <td>{{ item.baseStr }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-col>
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
import {ref} from 'vue';

const snackbarFlag = ref(false);
const snackbarText = ref("");
const base64JsonData = ref("");
const jsonData = ref(null);

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
    jsonData.value = JSON.parse(atob(base64JsonData.value));
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

// const copyToClipboard = async (text) => {
//   try {
//     await navigator.clipboard.writeText(text);
//     console.log('内容已成功复制到剪贴板');
//     snackbarText.value = "内容已成功复制到剪贴板";
//     snackbarFlag.value = true;
//     setTimeout(() => {
//       snackbarFlag.value = false;
//     }, 3000);
//   } catch (e) {
//     console.log(e);
//     console.error('无法复制内容到剪贴板');
//     snackbarText.value = "无法复制内容到剪贴板";
//     snackbarFlag.value = true;
//     setTimeout(() => {
//       snackbarFlag.value = false;
//     }, 5000);
//   }
// };

</script>

<style scoped>

</style>
