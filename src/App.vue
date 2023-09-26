<template>
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
          <v-btn icon="mdi-magnify"></v-btn>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        temporary="true"
      >
        <v-list density="compact" nav>
          <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="主页" value="home"></v-list-item>
          <v-list-item>编码区</v-list-item>
          <v-list-item to="/get-hex-files" prepend-icon="mdi-download" title="拉取文件" value="get-hex-files"></v-list-item>
          <v-list-item to="/encode-tasks-list" prepend-icon="mdi-list-box" title="编码任务列表" value="encode-tasks-list"></v-list-item>
          <v-list-item to="/upload-to-bili" prepend-icon="mdi-cloud-upload" title="上传到哔哩源" value="upload-to-bili"></v-list-item>
          <v-list-item to="/generate-group-data" prepend-icon="mdi-file-code" title="生成合集码" value="generate-group-data"></v-list-item>
          <v-list-item>解码区</v-list-item>
          <v-list-item to="/get-encoded-video-files" prepend-icon="mdi-download-multiple" title="拉取视频" value="get-encoded-video-files"></v-list-item>
          <v-list-item to="/decode-tasks-list" prepend-icon="mdi-format-list-bulleted" title="解码任务列表" value="decode-tasks-list"></v-list-item>
          <v-list-item to="/load-group-data" prepend-icon="mdi-link-box-variant" title="解析合集码" value="load-group-data"></v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-navigation-drawer>
      <v-main style="height: 100vh">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import {ref} from "vue";

export default {
  setup() {
    const drawer = ref(null);

    return {
      drawer
    };
  }
}
</script>
