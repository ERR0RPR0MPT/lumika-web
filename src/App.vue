<template>
  <v-app>
    <v-card>
      <v-layout>
        <v-app-bar :elevation="2">
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer">
          </v-app-bar-nav-icon>
          <v-app-bar-title>
            Lumika
          </v-app-bar-title>
          <template v-slot:append>
            <v-btn icon="mdi-brightness-4" @click="toggleTheme"></v-btn>
            <!--            <v-btn icon="mdi-magnify"></v-btn>-->
            <!--            <v-btn icon="mdi-dots-vertical"></v-btn>-->
          </template>
        </v-app-bar>
        <v-navigation-drawer
          v-model="drawer"
          :permanent="isDrawerPermanent"
        >
          <v-list density="compact" nav>
            <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="主页" value="home"></v-list-item>
            <v-divider></v-divider>
            <v-list-item>编码流程</v-list-item>
            <v-list-item to="/file-manager" prepend-icon="mdi-folder" title="文件管理"
                         value="file-manager"></v-list-item>
            <v-list-item to="/encode-tasks-list" prepend-icon="mdi-list-box" title="编码列表"
                         value="encode-tasks-list"></v-list-item>
            <v-list-item to="/upload-to-bili" prepend-icon="mdi-cloud-upload" title="上传到哔哩源"
                         value="upload-to-bili"></v-list-item>
            <v-list-item to="/generate-group-data" prepend-icon="mdi-qrcode" title="生成合集码"
                         value="generate-group-data"></v-list-item>
            <v-divider></v-divider>
            <v-list-item>解码流程</v-list-item>
            <v-list-item to="/load-group-data" prepend-icon="mdi-qrcode-scan" title="解析合集码"
                         value="load-group-data"></v-list-item>
            <v-list-item to="/download-list" prepend-icon="mdi-download" title="下载列表"
                         value="download-list"></v-list-item>
            <v-list-item to="/decode-tasks-list" prepend-icon="mdi-list-box" title="解码列表"
                         value="decode-tasks-list"></v-list-item>
            <v-divider></v-divider>
            <v-list-item>高级</v-list-item>
            <v-list-item to="/logcat" prepend-icon="mdi-clipboard-text" title="日志"
                         value="logcat"></v-list-item>
            <v-list-item to="/resource" prepend-icon="mdi-speedometer" title="资源"
                         value="resource"></v-list-item>
            <v-list-item to="/settings" prepend-icon="mdi-cog" title="设置"
                         value="settings"></v-list-item>
          </v-list>
          <v-divider></v-divider>
        </v-navigation-drawer>
        <v-main style="height: 100vh">
          <router-view/>
        </v-main>
      </v-layout>
    </v-card>
  </v-app>
</template>

<script setup>
import GLOBAL from "./Common.vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useTheme} from 'vuetify'
import axios from "axios";

const drawer = ref(true); // Drawer 默认显示
const isDrawerPermanent = ref(false); // 是否固定 Drawer

const handleResize = () => {
  // 获取当前窗口的宽度
  const windowWidth = window.innerWidth;

  // 根据宽度设置 Drawer 的固定和可隐藏状态
  if (windowWidth > 768) {
    isDrawerPermanent.value = true; // 宽度较大，固定 Drawer
    drawer.value = true; // 显示 Drawer
  } else {
    isDrawerPermanent.value = false; // 宽度较小，可隐藏 Drawer
    drawer.value = false; // 隐藏 Drawer
  }
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

const getApiURLUserList = () => {
  const l = localStorage.getItem('Lumika_API_User_List');
  if (l !== "null" && l !== null) {
    GLOBAL.apiURLUserList = JSON.parse(l);
  } else {
    GLOBAL.apiURLUserList = [
      window.location.protocol + '//' + window.location.host + "/api",
      "http://localhost:7860/api",
    ];
    localStorage.setItem('Lumika_API_User_List', JSON.stringify(GLOBAL.apiURLUserList));
  }
}

const getApiURL = () => {
  const l = localStorage.getItem('Lumika_API');
  if (l === "null" || l === null) {
    const apiUrl = "http://localhost:7860/api"
    GLOBAL.apiURL = apiUrl;
    localStorage.setItem('Lumika_API', apiUrl);
  } else {
    GLOBAL.apiURL = localStorage.getItem('Lumika_API');
  }
}

const getAutoApiURL = () => {
  // 先检查 Lumika_API 是否能用
  const apiUrl = localStorage.getItem('Lumika_API');
  if (getAlive(apiUrl, 3000)) {
    GLOBAL.apiURL = apiUrl;
    return;
  }
  // 再检查 Lumika_API_User_List 是否有 API 能用
  const apiUrlUserList = JSON.parse(localStorage.getItem('Lumika_API_User_List'));
  for (let i = 0; i < apiUrlUserList.length; i++) {
    if (getAlive(apiUrlUserList[i], 3000)) {
      GLOBAL.apiURL = apiUrlUserList[i];
      return;
    }
  }
  // 再检查 localhost:7860 是否有 API 能用
  if (getAlive("http://localhost:7860/api", 200)) {
    GLOBAL.apiURL = "http://localhost:7860/api";
    return;
  }
  // 再检查当前 Host 地址的 API 是否能用
  const apiUrlHost = window.location.protocol + '//' + window.location.host + "/api";
  if (getAlive(apiUrlHost, 3000)) {
    GLOBAL.apiURL = apiUrlHost;
    return;
  }
  // 最后检查官方的12个节点的 API 是否能用
  for (let i = 1; i <= 12; i++) {
    const k = "https://weclont-lumika"+i+".hf.space/api"
    if (getAlive(k, 3000)) {
      GLOBAL.apiURL = k;
      return;
    }
  }
  // 如果没有一个 API 能用
  GLOBAL.apiURL = "http://localhost:7860/api";
}

const getThemeColor = () => {
  const themeColor = localStorage.getItem('Lumika_Theme');
  if (themeColor === "null" || themeColor === null) {
    localStorage.setItem('Lumika_Theme', 'dark');
    theme.global.name.value = 'dark';
  } else {
    theme.global.name.value = themeColor;
  }
}

onMounted(() => {
  // 获取用户设定的主题颜色
  getThemeColor();
  // 获取用户设定的后端 API 地址
  getApiURLUserList();
  // 获取后端 API 地址
  getApiURL();
  // 自动选择 API 地址
  getAutoApiURL();
  // 在组件挂载后绑定 resize 事件
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化时执行一次
  // 执行一次 meta 标签的添加
  toggleThemeMeta();
});

onBeforeUnmount(() => {
  // 在组件销毁前解绑 resize 事件
  window.removeEventListener('resize', handleResize);
});

const getAlive = (url, t) => {
  try {
    axios.get(url + '/version', { timeout: t });
    return true;
  } catch (error) {
    return false;
  }
};

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('Lumika_Theme', theme.global.name.value);
  toggleThemeMeta();
}
</script>
