<template>
  <v-card class="mx-auto overflow-y-auto overflow-x-hidden" max-width="800" max-height="93vh" elevation="12">
    <v-card-text>
      <div class="text-h4">设置</div>
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
          <tr>
            <td>Lumika 版本</td>
            <td>{{ version }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-brightness-4" size="x-large" @click="toggleTheme">
        {{ theme.global.current.value.dark ? '关闭夜间模式' : '开启夜间模式' }}
      </v-btn>
      <v-btn prepend-icon="mdi-restart" size="x-large" @click="restartServer">
        重启服务
      </v-btn>
    </v-col>
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
import {useTheme} from "vuetify";

const status = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");
const version = ref("");

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
const restartServer = async () => {
  try {
    const response = await axios.get('/api/restart-server');
    handleServerStatusData(response.data);
    console.log('服务重启成功');
    snackbarText.value = "服务重启成功";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (error) {
    console.error("服务重启失败");
    console.error(error);
    snackbarText.value = "服务重启失败";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
  }
};

const handleVersionData = (data) => {
  if (version.value !== data.version) {
    version.value = data.version;
  }
}
const getVersion = async () => {
  try {
    const response = await axios.get('/api/version');
    handleVersionData(response.data);
    console.log('成功获取版本号');
  } catch (error) {
    console.error("版本号获取失败");
    console.error(error);
  }
};

const refresh = () => {
  getVersion();
  getServerStatus();
};

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

let refreshTimer = null;

// 在组件创建时启动计时器
onMounted(() => {
  refresh(); // 首次立即获取数据
  refreshTimer = setInterval(refresh, 1000); // 每隔 1000ms 调用一次 fetchData
});

// 在组件销毁之前清除计时器
onBeforeUnmount(() => {
  clearInterval(refreshTimer);
});

</script>

<style scoped>

</style>
