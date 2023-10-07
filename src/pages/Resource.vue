<template>
  <v-card class="mx-auto overflow-y-auto overflow-x-hidden" max-width="800" max-height="93vh" elevation="12">
    <v-card-text>
      <div class="text-h4">资源</div>
    </v-card-text>

    <v-container>
      <v-card>
        <v-card-title>服务器状态</v-card-title>
        <v-col cols="auto">
          <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refresh">
            刷新
          </v-btn>
        </v-col>
        <v-table v-if="status !== null">
          <thead>
          <tr>
            <th class="text-left">
              Key
            </th>
            <th class="text-left">
              Value
            </th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>运行系统</td>
            <td>{{ status.osName }}</td>
          </tr>
          <tr>
            <td>CPU 占用</td>
            <td>{{ Math.floor(status.cpuUsagePercent) + '%' }}</td>
          </tr>
          <tr>
            <td>内存占用</td>
            <td>{{ Math.floor(status.memUsagePercent) + '%' }}</td>
          </tr>
          <tr>
            <td>磁盘占用</td>
            <td>{{ Math.floor(status.diskUsagePercent) + '%' }}</td>
          </tr>
          <tr>
            <td>默认网卡</td>
            <td>{{ status.networkInterfaceName }}</td>
          </tr>
          <tr>
            <td>上传速度</td>
            <td>{{ status.uploadSpeed }}</td>
          </tr>
          <tr>
            <td>下载速度</td>
            <td>{{ status.downloadSpeed }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </v-card>

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
</template>

<script setup>
import axios from "axios";
import {onBeforeUnmount, onMounted, ref} from "vue";

const status = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");

const getServerStatus = async () => {
  try {
    const response = await axios.get('/api/get-server-status');
    handleServerStatusData(response.data);
  } catch (error) {
    console.error("获取 ServerStatus 数据失败");
    console.error(error);
  }
};

const handleServerStatusData = (data) => {
  if (status.value !== data.status) {
    status.value = data.status
  }
}

const refresh = () => {
  getServerStatus();
};

let refreshTimer = null;

// 在组件创建时启动计时器
onMounted(() => {
  refresh(); // 首次立即获取数据
  refreshTimer = setInterval(refresh, 500); // 每隔 500ms 调用一次 fetchData
});

// 在组件销毁之前清除计时器
onBeforeUnmount(() => {
  clearInterval(refreshTimer);
});

</script>

<style scoped>

</style>
