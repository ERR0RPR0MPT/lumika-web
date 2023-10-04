// Composables
import {createRouter, createWebHashHistory} from 'vue-router'

import Home from '@/pages/Home.vue'
import DownloadList from '@/pages/DownloadList.vue'
import FileManager from '@/pages/FileManager.vue'
import LogCat from '@/pages/LogCat.vue'
import GetHexFiles from '@/pages/encode/GetHexFiles.vue'
import EncodeTasksList from '@/pages/encode/EncodeTasksList.vue'
import UploadToBili from '@/pages/encode/UploadToBili.vue'
import GenerateGroupData from '@/pages/encode/GenerateGroupData.vue'
import GetEncodedVideoFiles from '@/pages/decode/GetEncodedVideoFiles.vue'
import DecodeTasksList from '@/pages/decode/DecodeTasksList.vue'
import LoadGroupData from '@/pages/decode/LoadGroupData.vue'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/download-list',
        name: 'DownloadList',
        component: DownloadList,
      },
      {
        path: '/file-manager',
        name: 'FileManager',
        component: FileManager,
      },
      {
        path: '/get-hex-files',
        name: 'GetHexFiles',
        component: GetHexFiles,
      },
      {
        path: '/encode-tasks-list',
        name: 'EncodeTasksList',
        component: EncodeTasksList,
      },
      {
        path: '/upload-to-bili',
        name: 'UploadToBili',
        component: UploadToBili,
      },
      {
        path: '/generate-group-data',
        name: 'GenerateGroupData',
        component: GenerateGroupData,
      },
      {
        path: '/get-encoded-video-files',
        name: 'GetEncodedVideoFiles',
        component: GetEncodedVideoFiles,
      },
      {
        path: '/decode-tasks-list',
        name: 'DecodeTasksList',
        component: DecodeTasksList,
      },
      {
        path: '/load-group-data',
        name: 'LoadGroupData',
        component: LoadGroupData,
      },
      {
        path: '/logcat',
        name: 'LogCat',
        component: LogCat,
      },
    ],
  },
]

const router = createRouter({
  // history: createWebHashHistory(process.env.BASE_URL),
  history: createWebHashHistory("/ui/"),
  routes,
})

export default router
