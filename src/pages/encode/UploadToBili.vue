<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">上传到哔哩源</div>
    </v-card-text>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-cloud-upload" size="x-large" @click="openDialog">
        添加上传任务
      </v-btn>
      <v-btn prepend-icon="mdi-cookie" size="x-large" @click="openCookieDialog">
        获取登录 Cookie
      </v-btn>
      <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="clearBUlTaskList">
        清空任务列表
      </v-btn>
    </v-col>
    <v-list lines="three">
      <v-list-item
        v-for="task in bulTaskList"
        :key="task.taskInfo.fileName"
        :title="task.taskInfo.fileName + ' - ' + (task.bvid !== '' ? task.bvid : '') + ' 进度: ' + Math.floor(task.progressNum) + '% ' + task.status"
        :subtitle="task.timestamp + ' UUID: ' + task.uuid"
        @click="showTaskDetails(task)"
      >
        <v-progress-linear color="primary" :model-value="task.progressNum"></v-progress-linear>
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">mdi-book</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">
          <v-card-title>添加上传到哔哩源任务</v-card-title>
          <v-card-text>请选择要上传的编码视频目录</v-card-text>

          <v-col cols="auto">
            <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshList">
              刷新
            </v-btn>
          </v-col>

          <v-list lines="one">
            <v-list-item
              v-for="file in bulFileListTemp"
              :key="file.filename"
              :title="file.filename"
              :subtitle="null"
              v-model="file.selected"
              @click="toggleSelection(file)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary">
                  <v-icon color="white">mdi-book</v-icon>
                </v-avatar>
              </template>

              <template v-slot:append>
                <v-checkbox v-model="file.selected"></v-checkbox>
              </template>
            </v-list-item>

            <v-card>
              <v-text-field label="请输入视频标题" v-model="titleText"></v-text-field>
              <v-text-field label="请输入简介(可为空)" v-model="descriptionText"></v-text-field>
              <v-text-field label="请输入标签(使用英文逗号分割)" v-model="tagText"></v-text-field>
              <v-text-field label="请输入分区 id(默认: 232)" v-model="tidText"></v-text-field>
              <v-text-field label="请选择上传线路(默认: ws)" v-model="uploadLinesText"></v-text-field>
              <v-text-field label="请输入上传线程数(默认: 10)" v-model="threadsText"></v-text-field>
              <v-btn prepend-icon="mdi-check" size="x-large" @click="saveDraftData">
                保存草稿
              </v-btn>
              <v-card-text>Cookie 设置</v-card-text>
              <v-text-field label="请输入 SESSDATA" v-model="SESSDATAText"></v-text-field>
              <v-text-field label="请输入 bili_jct" v-model="biliJctText"></v-text-field>
              <v-text-field label="请输入 DedeUserID" v-model="DedeUserIDText"></v-text-field>
              <v-text-field label="请输入 DedeUserID__ckMd5" v-model="DedeUserIDckMd5Text"></v-text-field>
              <v-text-field label="请输入 access_token" v-model="accessTokenText"></v-text-field>
              <v-btn prepend-icon="mdi-check" size="x-large" @click="saveDraftCookieData">
                保存 Cookie
              </v-btn>
            </v-card>
          </v-list>

          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleSendBUlTaskData">确定</v-btn>
            <v-btn color="primary" @click="closeDialog">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="dialogCookieVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">
          <v-card-title>获取登录 Cookie</v-card-title>
          <v-card-text>请先扫描二维码，然后在手机上点击确认登录</v-card-text>

          <v-col cols="auto">
            <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshQRCode">
              刷新二维码
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <vue-qr v-if="qrCodeURL !== ''" class="qr-code" :text="qrCodeURL" :size="280"/>
            <v-card-text v-if="qrCodeURL !== ''">当前状态：{{ biliStatus }}</v-card-text>
          </v-col>

          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="closeCookieDialog">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="childDialogVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">
          <v-card-title>详细信息</v-card-title>
          <v-col cols="auto">
            <v-btn prepend-icon="mdi-arrow-left" size="x-large" @click="hideTaskDetails">
              返回
            </v-btn>
            <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="deleteBUlTask()">
              删除任务
            </v-btn>
          </v-col>
          <v-table class="max-width-table">
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
              <td>UUID</td>
              <td>{{ selectedTask.uuid }}</td>
            </tr>
            <tr>
              <td>状态</td>
              <td>{{ selectedTask.status }}</td>
            </tr>
            <tr>
              <td>状态信息</td>
              <td>{{ selectedTask.statusMsg }}</td>
            </tr>
            <tr>
              <td>进度</td>
              <td>{{
                  Math.floor(selectedTask.progressNum) + "%"
                }}
              </td>
            </tr>
            <tr v-if="selectedTask.duration !== ''">
              <td>用时</td>
              <td>{{ selectedTask.duration }}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{ selectedTask.timestamp }}</td>
            </tr>
            <tr>
              <td>BV号</td>
              <td>{{ selectedTask.bvid }}</td>
            </tr>
            <tr>
              <td>视频标题</td>
              <td>{{ selectedTask.taskInfo.videoInfos.title }}</td>
            </tr>
            <tr>
              <td>视频简介</td>
              <td>{{ selectedTask.taskInfo.videoInfos.description }}</td>
            </tr>
            <tr>
              <td>视频标签</td>
              <td>{{ selectedTask.taskInfo.videoInfos.tag.join(",") }}</td>
            </tr>
            <tr>
              <td>上传线路</td>
              <td>{{ selectedTask.taskInfo.uploadLines }}</td>
            </tr>
            <tr>
              <td>上传线程数</td>
              <td>{{ selectedTask.taskInfo.threads }}</td>
            </tr>
            </tbody>
          </v-table>
          <v-container>
            <v-card>
              <v-card-title>运行日志</v-card-title>
              <v-code>
                <pre>{{ selectedTask.logCat }}</pre>
              </v-code>
            </v-card>
          </v-container>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="hideTaskDetails">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

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
  </v-card>
</template>

<script setup>
import GLOBAL from "../../Common.vue";
import {onBeforeUnmount, onMounted, ref} from 'vue';
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import axios from "axios";

const bulTaskList = ref([]);
const bulFileList = ref([]);
const bulFileListTemp = ref([]);
const dialogVisible = ref(false);
const dialogCookieVisible = ref(false);
const childDialogVisible = ref(false);
const selectedTask = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");
const selectedItems = ref([]);

const qrCodeURL = ref("");
const qrCodeKey = ref("");
const biliStatus = ref("");

const titleText = ref("");
const descriptionText = ref("");
const tagText = ref("");
const uploadLinesText = ref("");
const threadsText = ref("");
const tidText = ref("");
const SESSDATAText = ref("");
const biliJctText = ref("");
const DedeUserIDText = ref("");
const DedeUserIDckMd5Text = ref("");
const accessTokenText = ref("");

const toggleSelection = (file) => {
  file.selected = !file.selected; // 更新文件的选中状态
  if (file.selected) {
    selectedItems.value.push(file.filename); // 将选中的文件添加到selectedItems数组中
  } else {
    const index = selectedItems.value.findIndex(item => item === file.filename);
    if (index !== -1) {
      selectedItems.value.splice(index, 1); // 从selectedItems数组中移除取消选中的文件
    }
  }
}

let refreshPollTimer = null;

const refreshQRCode = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/bilibili/qrcode');
    qrCodeURL.value = response.data.data.url;
    qrCodeKey.value = response.data.data.auth_code;
    refreshPollTimer = setInterval(refreshPollSync, 1000);
  } catch (e) {
    console.error("获取登录二维码出错");
    console.error(e);
    snackbarFlag.value = true;
    snackbarText.value = "获取登录二维码出错";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    console.error(e);
  }
}

const refreshPollSync = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/bilibili/poll/' + qrCodeKey.value);
    if (response.data.code === 0) {
      biliStatus.value = "登录成功，请直接添加上传任务即可";
      SESSDATAText.value = response.data.data.cookie_info.cookies[0].value;
      biliJctText.value = response.data.data.cookie_info.cookies[1].value;
      DedeUserIDText.value = response.data.data.cookie_info.cookies[2].value;
      DedeUserIDckMd5Text.value = response.data.data.cookie_info.cookies[3].value;
      accessTokenText.value = response.data.data.access_token;
      saveCookieData();
      dialogCookieVisible.value = false;
      snackbarFlag.value = true;
      snackbarText.value = "登录成功，请直接添加上传任务即可";
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
      refreshList();
      clearInterval(refreshPollTimer);
      refreshPollTimer = null;
    } else if (response.data.code === 86038) {
      biliStatus.value = "二维码已失效";
      clearInterval(refreshPollTimer);
      refreshPollTimer = null;
    } else if (response.data.code === 86039) {
      biliStatus.value = "未登录";
    } else if (response.data.code === 86090) {
      biliStatus.value = "已扫描，未确认";
    } else {
      biliStatus.value = "出现未知错误, code=" + response.data.code;
    }
  } catch (e) {
    console.error("获取登录二维码出错");
    console.error(e);
    snackbarFlag.value = true;
    snackbarText.value = "获取登录二维码出错";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    console.error(e);
  }
}

const checkDialogVisable = () => {
  if (!dialogCookieVisible.value && refreshPollTimer !== null) {
    clearInterval(refreshPollTimer);
    refreshPollTimer = null;
  }
}

const showTaskDetails = (task) => {
  refreshList();
  selectedTask.value = task;
  childDialogVisible.value = true;
}
const hideTaskDetails = () => {
  refreshList();
  childDialogVisible.value = false;
}

const openDialog = () => {
  loadCookieData();
  bulFileListTemp.value = bulFileList.value;
  dialogVisible.value = true;
};
const closeDialog = () => {
  dialogVisible.value = false;
};
const openCookieDialog = () => {
  refreshQRCode();
  dialogCookieVisible.value = true;
};
const closeCookieDialog = () => {
  clearInterval(refreshPollTimer);
  refreshPollTimer = null;
  dialogCookieVisible.value = false;
};

const saveCookieData = () => {
  if (titleText.value !== "") {
    localStorage.setItem('Lumika_BUl_title', titleText.value);
  }
  if (descriptionText.value !== "") {
    localStorage.setItem('Lumika_BUl_description', descriptionText.value);
  }
  if (tagText.value !== "") {
    localStorage.setItem('Lumika_BUl_tag', tagText.value);
  }
  if (tidText.value !== "") {
    localStorage.setItem('Lumika_BUl_tid', tidText.value);
  }
  if (uploadLinesText.value !== "") {
    localStorage.setItem('Lumika_BUl_uploadLines', uploadLinesText.value);
  }
  if (threadsText.value !== "" && threadsText.value !== "null") {
    localStorage.setItem('Lumika_BUl_threads', threadsText.value);
  }
  if (SESSDATAText.value !== "") {
    localStorage.setItem('Lumika_BUl_SESSDATA', SESSDATAText.value);
  }
  if (biliJctText.value !== "") {
    localStorage.setItem('Lumika_BUl_bili_jct', biliJctText.value);
  }
  if (DedeUserIDText.value !== "") {
    localStorage.setItem('Lumika_BUl_DedeUserID', DedeUserIDText.value);
  }
  if (DedeUserIDckMd5Text.value !== "") {
    localStorage.setItem('Lumika_BUl_DedeUserIDckMd5', DedeUserIDckMd5Text.value);
  }
  if (accessTokenText.value !== "") {
    localStorage.setItem('Lumika_BUl_access_token', accessTokenText.value);
  }
  console.log('Cookie 数据已保存到 localStorage');
};

const saveDraftData = () => {
  if (titleText.value !== "") {
    localStorage.setItem('Lumika_BUl_title', titleText.value);
  }
  if (descriptionText.value !== "") {
    localStorage.setItem('Lumika_BUl_description', descriptionText.value);
  }
  if (tagText.value !== "") {
    localStorage.setItem('Lumika_BUl_tag', tagText.value);
  }
  if (tidText.value !== "") {
    localStorage.setItem('Lumika_BUl_tid', tidText.value);
  }
  if (uploadLinesText.value !== "") {
    localStorage.setItem('Lumika_BUl_uploadLines', uploadLinesText.value);
  }
  if (threadsText.value !== "" && threadsText.value !== "null") {
    localStorage.setItem('Lumika_BUl_threads', threadsText.value);
  }
  snackbarFlag.value = true;
  snackbarText.value = "草稿数据已保存";
  setTimeout(() => {
    snackbarFlag.value = false;
  }, 3000);
  console.log('草稿数据已保存到 localStorage');
};

const saveDraftCookieData = () => {
  if (SESSDATAText.value !== "") {
    localStorage.setItem('Lumika_BUl_SESSDATA', SESSDATAText.value);
  }
  if (biliJctText.value !== "") {
    localStorage.setItem('Lumika_BUl_bili_jct', biliJctText.value);
  }
  if (DedeUserIDText.value !== "") {
    localStorage.setItem('Lumika_BUl_DedeUserID', DedeUserIDText.value);
  }
  if (DedeUserIDckMd5Text.value !== "") {
    localStorage.setItem('Lumika_BUl_DedeUserIDckMd5', DedeUserIDckMd5Text.value);
  }
  if (accessTokenText.value !== "") {
    localStorage.setItem('Lumika_BUl_access_token', accessTokenText.value);
  }
  snackbarFlag.value = true;
  snackbarText.value = "Cookie 数据已保存";
  setTimeout(() => {
    snackbarFlag.value = false;
  }, 3000);
  console.log('Cookie 数据已保存到 localStorage');
};

const loadCookieData = () => {
  titleText.value = localStorage.getItem('Lumika_BUl_title') !== "null" ? localStorage.getItem('Lumika_BUl_title') : "";
  descriptionText.value = localStorage.getItem('Lumika_BUl_description') !== "null" ? localStorage.getItem('Lumika_BUl_description') : "";
  tagText.value = localStorage.getItem('Lumika_BUl_tag') !== "null" ? localStorage.getItem('Lumika_BUl_tag') : "";
  uploadLinesText.value = localStorage.getItem('Lumika_BUl_uploadLines') !== "null" ? localStorage.getItem('Lumika_BUl_uploadLines') : "";
  threadsText.value = localStorage.getItem('Lumika_BUl_threads') !== "null" ? localStorage.getItem('Lumika_BUl_threads') : "";
  tidText.value = localStorage.getItem('Lumika_BUl_tid') !== "null" ? localStorage.getItem('Lumika_BUl_tid') : "";
  SESSDATAText.value = localStorage.getItem('Lumika_BUl_SESSDATA') !== "null" ? localStorage.getItem('Lumika_BUl_SESSDATA') : "";
  biliJctText.value = localStorage.getItem('Lumika_BUl_bili_jct') !== "null" ? localStorage.getItem('Lumika_BUl_bili_jct') : "";
  DedeUserIDText.value = localStorage.getItem('Lumika_BUl_DedeUserID') !== "null" ? localStorage.getItem('Lumika_BUl_DedeUserID') : "";
  DedeUserIDckMd5Text.value = localStorage.getItem('Lumika_BUl_DedeUserIDckMd5') !== "null" ? localStorage.getItem('Lumika_BUl_DedeUserIDckMd5') : "";
  accessTokenText.value = localStorage.getItem('Lumika_BUl_access_token') !== "null" ? localStorage.getItem('Lumika_BUl_access_token') : "";
  console.log('Cookie 数据已从 localStorage 加载');
};

const handleSendBUlTaskData = () => {
  if (selectedItems.value.length === 0) {
    snackbarFlag.value = true;
    snackbarText.value = "请选择一个编码目录";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  } else if (selectedItems.value.length > 1) {
    selectedItems.value = [];
    snackbarFlag.value = true;
    snackbarText.value = "你只能一次性选择一个编码目录";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }
  if (titleText.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入视频标题";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (tagText.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入视频标签";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (tidText.value === "") {
    tidText.value = "232";
  }
  if (uploadLinesText.value === "") {
    uploadLinesText.value = "ws";
  }
  if (threadsText.value === "" || threadsText.value === "null") {
    threadsText.value = "10";
  }
  if (SESSDATAText.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入 SESSDATA";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (biliJctText.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入 bili_jct";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (DedeUserIDText.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入 DedeUserID";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (DedeUserIDckMd5Text.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入 DedeUserID__ckMd5";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (accessTokenText.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入 access_token";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  saveCookieData();

  const inputData = {
    "fileName": selectedItems.value[0],
    "uploadLines": uploadLinesText.value,
    "threads": parseInt(threadsText.value),
    "cookie": {
      "SESSDATA": SESSDATAText.value,
      "bili_jct": biliJctText.value,
      "DedeUserID": DedeUserIDText.value,
      "DedeUserID__ckMd5": DedeUserIDckMd5Text.value,
      "access_token": accessTokenText.value
    },
    "videoInfos": {
      "tid": parseInt(tidText.value),
      "title": titleText.value,
      "tag": tagText.value.split(","),
      "source": "",
      "cover": "",
      "cover_path": "",
      "description": descriptionText.value,
    }
  }
  selectedItems.value = [];

  axios.post(GLOBAL.apiURL + '/add-bul-task', inputData)
    .then(response => {
      console.log('已添加上传到哔哩源任务', response);
      console.log(response.data);
      dialogVisible.value = false;
      selectedItems.value = [];
      uploadLinesText.value = "";
      threadsText.value = "";
      SESSDATAText.value = "";
      biliJctText.value = "";
      DedeUserIDText.value = "";
      DedeUserIDckMd5Text.value = "";
      accessTokenText.value = "";
      titleText.value = "";
      tagText.value = "";
      descriptionText.value = "";
      refreshList();
      snackbarText.value = "已添加上传到哔哩源任务";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('上传到哔哩源任务创建失败', error);
      console.error(error);
      snackbarText.value = "上传到哔哩源任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
}

const clearBUlTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/clear-bul-task-list');
    console.log("清空任务数据成功");
    console.log(response.data);
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (error) {
    console.error("清空任务数据失败");
    console.error(error);
    snackbarText.value = "清空任务数据失败";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
  }
};

const deleteBUlTask = async () => {
  const formData = new FormData();
  formData.append('uuid', selectedTask.value.uuid);

  axios.post(GLOBAL.apiURL + '/delete-bul-task', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log("任务已删除", response);
      console.log(response.data);
      snackbarText.value = "任务已删除";
      snackbarFlag.value = true;
      childDialogVisible.value = false;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error("任务删除失败", error);
      console.error(error);
      snackbarText.value = "任务删除失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

// 定义函数来获取文件列表数据
const handleFileListData = (data) => {
  if (data.encodeOutput !== null) {
    data.encodeOutput.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  data.encodeOutput = data.encodeOutput.filter(item => item.type !== "file");
  if (bulFileList.value !== data.encodeOutput) {
    bulFileList.value = data.encodeOutput
  }
}
const getFileList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-file-list');
    handleFileListData(response.data);
  } catch (error) {
    console.error("获取文件列表数据失败");
    console.error(error);
  }
};

// 定义函数来获取任务列表数据
const handleBUlTaskListData = (data) => {
  if (bulTaskList.value !== data.bulTaskList) {
    bulTaskList.value = data.bulTaskList;
  }
}
const getTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-bul-task-list');
    handleBUlTaskListData(response.data)
  } catch (error) {
    console.error("获取上传到哔哩源列表数据失败");
    console.error(error);
  }
};

const refreshList = () => {
  checkDialogVisable();
  getFileList();
  getTaskList();
};

let refreshTimer = null;

// 在组件创建时启动计时器
onMounted(() => {
  refreshList(); // 首次立即获取数据
  refreshTimer = setInterval(refreshList, 1000); // 每隔 1000ms 调用一次 fetchData
});

// 在组件销毁之前清除计时器
onBeforeUnmount(() => {
  clearInterval(refreshTimer);
  clearInterval(refreshPollTimer);
  refreshTimer = null;
  refreshPollTimer = null;
});
</script>

<style scoped>
.max-width-table {
  max-width: 100%; /* 设置表格最大宽度 */
  width: 100%; /* 设置表格宽度为 100% */
  table-layout: fixed; /* 固定表格布局 */
}
</style>
