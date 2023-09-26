// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
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
        component: () => Home,
      },
      {
        path: '/get-hex-files',
        name: 'GetHexFiles',
        component: () => GetHexFiles,
      },
      {
        path: '/encode-tasks-list',
        name: 'EncodeTasksList',
        component: () => EncodeTasksList,
      },
      {
        path: '/upload-to-bili',
        name: 'UploadToBili',
        component: () => UploadToBili,
      },
      {
        path: '/generate-group-data',
        name: 'GenerateGroupData',
        component: () => GenerateGroupData,
      },
      {
        path: '/get-encoded-video-files',
        name: 'GetEncodedVideoFiles',
        component: () => GetEncodedVideoFiles,
      },
      {
        path: '/decode-tasks-list',
        name: 'DecodeTasksList',
        component: () => DecodeTasksList,
      },
      {
        path: '/load-group-data',
        name: 'LoadGroupData',
        component: () => LoadGroupData,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router