<template>
  <v-card class="mx-auto overflow-y-auto overflow-x-hidden" max-width="800" max-height="93vh" elevation="12">
    <v-card-text>
      <div class="text-h4">日志</div>
    </v-card-text>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-refresh" size="x-large" @click="clearLogCat">
        清空日志
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
import {onBeforeUnmount, onMounted, ref} from "vue";

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

const clearLogCat = async () => {
  try {
    const response = await axios.get('/api/clear-logcat');
    console.log("清空 LogCat 数据成功");
    console.log(response.data);
  } catch (error) {
    console.error("清空 LogCat 数据失败");
    console.error(error);
  }
};

const refresh = () => {
  getLogCat();
};

let refreshTimer = null;

// 在组件创建时启动计时器
onMounted(() => {
  refresh(); // 首次立即获取数据
  refreshTimer = setInterval(refresh, 1000); // 每隔 500ms 调用一次 fetchData
});

// 在组件销毁之前清除计时器
onBeforeUnmount(() => {
  clearInterval(refreshTimer);
});

</script>

<style scoped>

</style>
