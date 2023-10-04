<template>
  <v-card class="mx-auto overflow-y-auto overflow-x-hidden" max-width="800" max-height="93vh" elevation="12">
    <v-card-text>
      <div class="text-h4">日志</div>
    </v-card-text>
    <v-col cols="auto">
    <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refresh">
      刷新
    </v-btn>
    </v-col>
    <v-container>
      <v-code>
        <pre>{{ logCatString }}</pre>
      </v-code>
    </v-container>
  </v-card>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";

const logCatString = ref("")

const handleLogCatData = (data) => {
  if (logCatString.value !== data.logcat) {
    logCatString.value = data.logcat
  }
}

// 定义函数来获取 LogCat 数据
const getLogCat = async () => {
  try {
    const response = await axios.get('/api/get-logcat');
    handleLogCatData(response.data)
  } catch (error) {
    console.error("获取 LogCat 数据失败");
    console.error(error);
  }
};
getLogCat();

const refresh = () => {
  getLogCat();
};
</script>

<style scoped>

</style>
