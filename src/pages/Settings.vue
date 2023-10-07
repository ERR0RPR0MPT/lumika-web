<template>
  <v-card class="mx-auto overflow-y-auto overflow-x-hidden" max-width="800" max-height="93vh" elevation="12">
    <v-card-text>
      <div class="text-h4">设置</div>
    </v-card-text>

    <v-container>
      <v-card>
        <v-card-text>
          <div class="text-h5">Lumika 版本: {{ version === "" ? "获取中" : version }}</div>
        </v-card-text>
        <v-card-text>
          <div class="text-h5">Lumika Web 版本: v{{ webVersion === "" ? "获取失败" : webVersion }}</div>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container>
      <v-card>
        <v-col cols="auto">
          <v-card-title>配置修改</v-card-title>
        </v-col>

        <v-btn prepend-icon="mdi-refresh" size="x-large" @click="setDefaultVarSettingsConfig">
          恢复默认
        </v-btn>

        <v-card-text>
          <v-text-field v-model="maxThreadsText" label="编解码最大线程数"></v-text-field>
          <v-text-field v-model="biliDownloadGoRoutinesText" label="从哔哩源下载每P的最大线程数"></v-text-field>
          <v-text-field v-model="biliDownloadsMaxQueueNumText" label="从哔哩源下载最大同时下载分P数"></v-text-field>
          <v-text-field v-model="taskWorkerGoRoutinesText"
                        label="处理编解码任务的 Worker 数量(此项设置需要重启后端服务生效)"></v-text-field>
          <v-text-field v-model="dbCrontabSecondsText" label="数据库保存时间间隔"></v-text-field>
        </v-card-text>

        <v-btn prepend-icon="mdi-check" size="x-large" @click="setVarSettingsConfig">
          修改
        </v-btn>
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
import config from '../../package.json';
import {onMounted, ref} from "vue";
import {useTheme} from "vuetify";
import axios from "axios";

const snackbarFlag = ref(false);
const snackbarText = ref("");
const version = ref("");
const webVersion = ref("");

const maxThreadsText = ref("");
const biliDownloadGoRoutinesText = ref("");
const biliDownloadsMaxQueueNumText = ref("");
const taskWorkerGoRoutinesText = ref("");
const dbCrontabSecondsText = ref("");

const restartServer = () => {
  try {
    axios.get('/api/restart-server');
  } catch (error) {
    console.error(error);
  }
  console.log('重启请求已发送，请检查日志页面是否重启成功');
  snackbarText.value = "重启请求已发送，请检查日志页面是否重启成功";
  snackbarFlag.value = true;
  setTimeout(() => {
    snackbarFlag.value = false;
  }, 3000);
};

const handleVarSettingsData = (data) => {
  maxThreadsText.value = data.defaultMaxThreads.toString();
  biliDownloadGoRoutinesText.value = data.defaultBiliDownloadGoRoutines.toString();
  biliDownloadsMaxQueueNumText.value = data.defaultBiliDownloadsMaxQueueNum.toString();
  taskWorkerGoRoutinesText.value = data.defaultTaskWorkerGoRoutines.toString();
  dbCrontabSecondsText.value = data.defaultDbCrontabSeconds.toString();
};

const getVarSettingsConfig = async () => {
  try {
    const response = await axios.get('/api/get-var-settings-config');
    handleVarSettingsData(response.data);
  } catch (error) {
    console.error("配置获取失败");
  }
};

const setDefaultVarSettingsConfig = () => {
  maxThreadsText.value = "8";
  biliDownloadGoRoutinesText.value = "16";
  biliDownloadsMaxQueueNumText.value = "5";
  taskWorkerGoRoutinesText.value = "5";
  dbCrontabSecondsText.value = "10";
}

const setVarSettingsConfig = async () => {
  const inputData = {
    defaultMaxThreads: parseInt(maxThreadsText.value),
    defaultBiliDownloadGoRoutines: parseInt(biliDownloadGoRoutinesText.value),
    defaultBiliDownloadsMaxQueueNum: parseInt(biliDownloadsMaxQueueNumText.value),
    defaultTaskWorkerGoRoutines: parseInt(taskWorkerGoRoutinesText.value),
    defaultDbCrontabSeconds: parseInt(dbCrontabSecondsText.value),
  };
  try {
    const response = await axios.post('/api/set-var-settings-config', inputData);
    console.log('配置修改成功');
    console.log(response.data);
    snackbarText.value = "配置修改成功";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (error) {
    console.error("配置修改失败");
    console.error(error);
    snackbarText.value = "配置修改失败";
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
  webVersion.value = config.version;
  try {
    const response = await axios.get('/api/version');
    handleVersionData(response.data);
  } catch (error) {
    console.error("版本号获取失败");
    console.error(error);
  }
};

const refreshData = () => {
  getVersion();
  getVarSettingsConfig();
};

const toggleThemeMeta = () => {
  // 获取已存在的meta标签
  const metaTag = document.querySelector('meta[name="theme-color"]')

  if (metaTag) {
    // 修改meta标签的属性值
    metaTag.setAttribute('content', theme.global.current.value.dark ? '#121212' : '#ffffff') // 设置新的颜色值
  } else {
    // 创建meta标签
    const metaTag = document.createElement('meta')
    metaTag.setAttribute('name', 'theme-color')
    metaTag.setAttribute('content', theme.global.current.value.dark ? '#121212' : '#ffffff')
    document.head.appendChild(metaTag);
  }
}

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  toggleThemeMeta();
}

onMounted(() => {
  refreshData();
});

</script>

<style scoped>

</style>
