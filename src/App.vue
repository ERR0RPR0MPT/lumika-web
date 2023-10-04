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
            <v-list-item to="/download-list" prepend-icon="mdi-download" title="下载任务列表"
                         value="download-list"></v-list-item>
            <v-list-item to="/file-manager" prepend-icon="mdi-folder" title="文件管理"
                         value="file-manager"></v-list-item>
            <v-list-item to="/logcat" prepend-icon="mdi-clipboard-text" title="日志"
                         value="logcat"></v-list-item>
            <v-divider></v-divider>
            <v-list-item>编码区</v-list-item>
            <v-list-item to="/encode-tasks-list" prepend-icon="mdi-list-box" title="编码任务列表"
                         value="encode-tasks-list"></v-list-item>
            <v-list-item to="/upload-to-bili" prepend-icon="mdi-cloud-upload" title="上传到哔哩源"
                         value="upload-to-bili"></v-list-item>
            <v-list-item to="/generate-group-data" prepend-icon="mdi-qrcode" title="生成合集码"
                         value="generate-group-data"></v-list-item>
            <v-divider></v-divider>
            <v-list-item>解码区</v-list-item>
            <v-list-item to="/decode-tasks-list" prepend-icon="mdi-list-box" title="解码任务列表"
                         value="decode-tasks-list"></v-list-item>
            <v-list-item to="/load-group-data" prepend-icon="mdi-qrcode-scan" title="解析合集码"
                         value="load-group-data"></v-list-item>
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
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useTheme} from 'vuetify'

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

onMounted(() => {
  // 在组件挂载后绑定 resize 事件
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化时执行一次
});

onBeforeUnmount(() => {
  // 在组件销毁前解绑 resize 事件
  window.removeEventListener('resize', handleResize);
});

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
