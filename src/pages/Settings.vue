<template>
  <v-card class="mx-auto overflow-y-auto overflow-x-hidden" max-width="800" max-height="93vh" elevation="12">
    <v-card-text>
      <div class="text-h4">设置</div>
    </v-card-text>

    <v-container>
      <v-card>
        <v-col cols="auto">
          <v-card-title>配置修改</v-card-title>
        </v-col>

        <v-btn prepend-icon="mdi-refresh" size="x-large" @click="setDefaultVarSettingsConfig">
          恢复默认
        </v-btn>

        <v-card-text>
          <v-combobox label="后端 API 地址" v-model="apiURLText" :items="GLOBAL.apiURLUserList"></v-combobox>
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

    <v-container>
      <v-card>
        <v-card-text>
          <div class="text-h5">Lumika 最新发行版: {{ latestVersionMsg.latestVersion === "" ? "获取中" : latestVersionMsg.latestVersion }}</div>
        </v-card-text>
        <v-card-text>
          <div class="text-h7">版本说明: {{ latestVersionMsg.latestVersionSummary === "" ? "无" : latestVersionMsg.latestVersionSummary }}</div>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-text>
          <div class="text-h5">Lumika 版本: {{ version === "" ? "获取中" : version }}</div>
        </v-card-text>
        <v-card-text>
          <div class="text-h5">Lumika Web 版本: v{{ webVersion === "" ? "获取失败" : webVersion }}</div>
        </v-card-text>
      </v-card>
      <v-btn v-if="latestVersionMsg.latestVersion !== '' && latestVersionMsg.latestVersion !== null && latestVersionMsg.latestVersion !== version" prepend-icon="mdi-check" size="x-large" @click="updateVersion">
        升级到最新版
      </v-btn>
    </v-container>

    <v-container>
      <v-card>
        <v-col cols="auto">
          <v-card-title>其他设置</v-card-title>
          <v-btn prepend-icon="mdi-brightness-4" size="x-large" @click="toggleTheme">
            {{ theme.global.current.value.dark ? '关闭夜间模式' : '开启夜间模式' }}
          </v-btn>
          <v-btn prepend-icon="mdi-restart" size="x-large" @click="restartServer">
            重启服务
          </v-btn>
        </v-col>
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
import GLOBAL from "../Common.vue";
import config from '../../package.json';
import {onMounted, ref} from "vue";
import {useTheme} from "vuetify";
import axios from "axios";

const snackbarFlag = ref(false);
const snackbarText = ref("");
const version = ref("");
const latestVersionMsg = ref(null);
const webVersion = ref("");

const apiURLText = ref("");
const maxThreadsText = ref("");
const biliDownloadGoRoutinesText = ref("");
const biliDownloadsMaxQueueNumText = ref("");
const taskWorkerGoRoutinesText = ref("");
const dbCrontabSecondsText = ref("");

const restartServer = () => {
  try {
    axios.get(GLOBAL.apiURL + '/restart-server');
  } catch (error) {
    console.error(error);
  }
  console.log('重启请求已发送，请检查日志页面是否重启成功');
  snackbarText.value = "重启请求已发送，请检查日志页面是否重启成功";
  snackbarFlag.value = true;
  setTimeout(() => {
    snackbarFlag.value = false;
  }, 3000);
  refreshData();
};

const handleVarSettingsData = (data) => {
  maxThreadsText.value = data.defaultMaxThreads.toString();
  biliDownloadGoRoutinesText.value = data.defaultBiliDownloadGoRoutines.toString();
  biliDownloadsMaxQueueNumText.value = data.defaultBiliDownloadsMaxQueueNum.toString();
  taskWorkerGoRoutinesText.value = data.defaultTaskWorkerGoRoutines.toString();
  dbCrontabSecondsText.value = data.defaultDbCrontabSeconds.toString();
};

const getVarSettingsConfig = async () => {
  apiURLText.value = GLOBAL.apiURL;
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-var-settings-config');
    handleVarSettingsData(response.data);
  } catch (error) {
    console.error("配置获取失败");
  }
};

const setDefaultVarSettingsConfig = () => {
  apiURLText.value = "http://localhost:7860/api";
  maxThreadsText.value = "8";
  biliDownloadGoRoutinesText.value = "4";
  biliDownloadsMaxQueueNumText.value = "25";
  taskWorkerGoRoutinesText.value = "5";
  dbCrontabSecondsText.value = "10";
  GLOBAL.apiURLUserList = [
    GLOBAL.apiURL,
  ];
}

const setVarSettingsConfig = async () => {
  GLOBAL.apiURL = apiURLText.value;
  localStorage.setItem('Lumika_API', apiURLText.value);
  if (!GLOBAL.apiURLUserList.includes(GLOBAL.apiURL)) {
    GLOBAL.apiURLUserList.push(GLOBAL.apiURL);
  }
  localStorage.setItem('Lumika_API_User_List', JSON.stringify(GLOBAL.apiURLUserList));
  const inputData = {
    defaultMaxThreads: parseInt(maxThreadsText.value),
    defaultBiliDownloadGoRoutines: parseInt(biliDownloadGoRoutinesText.value),
    defaultBiliDownloadsMaxQueueNum: parseInt(biliDownloadsMaxQueueNumText.value),
    defaultTaskWorkerGoRoutines: parseInt(taskWorkerGoRoutinesText.value),
    defaultDbCrontabSeconds: parseInt(dbCrontabSecondsText.value),
  };
  try {
    const response = await axios.post(GLOBAL.apiURL + '/set-var-settings-config', inputData);
    console.log('配置修改成功');
    console.log(response.data);
    snackbarText.value = "配置修改成功";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    refreshData();
  } catch (error) {
    console.error("配置修改失败");
    console.error(error);
    snackbarText.value = "配置修改失败";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    refreshData();
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
    const response = await axios.get(GLOBAL.apiURL + '/version');
    handleVersionData(response.data);
  } catch (error) {
    console.error("版本号获取失败");
    console.error(error);
  }
};

const handleLatestVersionData = (data) => {
  if (latestVersionMsg.value !== data) {
    latestVersionMsg.value = data;
  }
}
const getLatestVersion = async () => {
  axios.post(GLOBAL.apiURL + '/get-update')
    .then(response => {
      handleLatestVersionData(response.data);
      console.log('最新版本获取成功', response.data);
    })
    .catch(error => {
      console.error('最新版本获取失败', error);
      console.error(error);
    });
};

const updateVersion = async () => {
  axios.post(GLOBAL.apiURL + '/update')
    .then(response => {
      snackbarText.value = "已发送更新请求，请稍后查看更新日志";
      snackbarFlag.value = true;
      console.log(response.data)
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('更新请求发送失败', error);
      console.error(error);
    });
};

const refreshData = () => {
  getVersion();
  getLatestVersion();
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
  localStorage.setItem('Lumika_Theme', theme.global.name.value);
  toggleThemeMeta();
}

onMounted(() => {
  refreshData();
});

</script>

<style scoped>

</style>
