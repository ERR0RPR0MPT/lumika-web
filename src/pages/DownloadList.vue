<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">下载列表</div>
    </v-card-text>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="clearDlTaskList">
        清空任务列表
      </v-btn>
      <v-btn v-if="bdllist !== null && bdllist.length !== 0" prepend-icon="mdi-arrow-right" size="x-large" @click="sendAllDecodeTask">
        发送所有已完成任务到解码列表
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-download" size="x-large" @click="openDialog2">
        从远程URL拉取文件
      </v-btn>
      <v-btn prepend-icon="mdi-download" size="x-large" @click="openDialog3">
        从哔哩源下载
      </v-btn>
    </v-col>

    <v-list lines="three">
      <v-list-subheader inset>从URL下载</v-list-subheader>

      <v-list-item
        v-for="dl in dllist"
        :key="dl.fileName"
        :title="dl.fileName + ' - 进度: ' + (Math.floor(dl.progressNum)).toString() + '% ' + dl.status"
        :subtitle="dl.timestamp + ' UUID: ' + dl.uuid"
        @click="showURLTaskDetails(dl)"
      >
        <v-progress-linear color="primary" :model-value="dl.progressNum"></v-progress-linear>
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">mdi-download</v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-subheader inset>从哔哩源下载</v-list-subheader>

      <v-list-item
        v-for="bdl in bdllist"
        :key="bdl.resourceId"
        :title="bdl.resourceId + ' - 进度: ' + (Math.floor(bdl.progressNum)).toString() + '% ' + bdl.status"
        :subtitle="bdl.timestamp + ' UUID: ' + bdl.uuid"
        @click="showBiliTaskDetails(bdl)"
      >
        <v-progress-linear color="primary" :model-value="bdl.progressNum"></v-progress-linear>
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">mdi-download</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="childDialogURLVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto" max-height="93vh">
          <v-card-title>详细信息</v-card-title>
          <v-col cols="auto">
            <v-btn prepend-icon="mdi-arrow-left" size="x-large" @click="hideURLTaskDetails">
              返回
            </v-btn>
            <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="deleteDlTask(selectedTask.uuid)">
              删除任务
            </v-btn>
          </v-col>
          <v-table>
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
              <td>{{ (Math.floor(selectedTask.progressNum)).toString() + "%" }}</td>
            </tr>
            <tr v-if="selectedTask.duration !== ''">
              <td>用时</td>
              <td>{{ selectedTask.duration }}</td>
            </tr>
            <tr>
              <td>文件名</td>
              <td>{{ selectedTask.fileName }}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{ selectedTask.timestamp }}</td>
            </tr>
            <tr>
              <td>线程数</td>
              <td>{{ selectedTask.taskInfo.numThreads }}</td>
            </tr>
            <tr>
              <td>URL</td>
              <td>{{ selectedTask.taskInfo.url }}</td>
            </tr>
            <tr>
              <td>Referer</td>
              <td>{{ selectedTask.taskInfo.referer }}</td>
            </tr>
            <tr>
              <td>UserAgent</td>
              <td>{{ selectedTask.taskInfo.userAgent }}</td>
            </tr>
            </tbody>
          </v-table>
          <v-container>
            <v-card>
              <v-card-title>运行日志</v-card-title>
              <v-code>
                <v-textarea
                  v-model="selectedTask.logCat"
                  variant="outlined"
                  auto-grow
                  readonly
                ></v-textarea>
              </v-code>
            </v-card>
          </v-container>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="hideURLTaskDetails">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="childDialogBiliVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto" max-height="93vh">
          <v-card-title>详细信息</v-card-title>
          <v-col cols="auto">
            <v-btn prepend-icon="mdi-arrow-left" size="x-large" @click="hideBiliTaskDetails">
              返回
            </v-btn>
            <v-btn v-if="selectedTask.baseStr !== '' && selectedTask.resourceId !== '' && selectedTask.status === '已完成'" prepend-icon="mdi-arrow-right"
                   size="x-large" @click="sendDecodeTask">
              发送到解码列表
            </v-btn>
            <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="deleteBDlTask(selectedTask.uuid)">
              删除任务
            </v-btn>
          </v-col>
          <v-table>
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
              <td>{{ (Math.floor(selectedTask.progressNum)).toString() + "%" }}</td>
            </tr>
            <tr v-if="selectedTask.duration !== ''">
              <td>用时</td>
              <td>{{ selectedTask.duration }}</td>
            </tr>
            <tr>
              <td>BV/av号</td>
              <td>{{ selectedTask.resourceId }}</td>
            </tr>
            <tr>
              <td>Base64 配置</td>
              <td>{{ selectedTask.baseStr }}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{ selectedTask.timestamp }}</td>
            </tr>
            </tbody>
          </v-table>
          <v-container>
            <v-card>
              <v-card-title>运行日志</v-card-title>
              <v-code>
                <v-textarea
                  v-model="selectedTask.logCat"
                  variant="outlined"
                  auto-grow
                  readonly
                ></v-textarea>
              </v-code>
            </v-card>
          </v-container>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="hideBiliTaskDetails">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="dialogVisible2" max-width="500">
      <v-container>
        <v-card>
          <v-card-title>远程URL文件拉取</v-card-title>
          <v-select
            label="下载到"
            :items="['encode', 'encodeOutput', 'decode', 'decodeOutput']"
            v-model="parentDir"
          ></v-select>
          <v-text-field label="请输入URL地址" v-model="URLInputData"></v-text-field>
          <v-text-field label="请输入自定义文件名(可为空)" v-model="FileNameInputData"></v-text-field>
          <v-text-field label="请输入线程数(默认为8)" v-model="DownloadThreadNumInputData"></v-text-field>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleSendURLData">确定</v-btn>
            <v-btn color="primary" @click="closeDialog2">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="dialogVisible3" max-width="500">
      <v-container>
        <v-card>
          <v-card-title>从哔哩源下载</v-card-title>
          <v-select
            label="下载到"
            :items="['encode', 'encodeOutput', 'decode', 'decodeOutput']"
            v-model="parentDir"
          ></v-select>
          <v-text-field label="请输入BV/av号" v-model="AVOrBVInputData"></v-text-field>
          <v-text-field label="请输入 Base64 编码配置(可为空)" v-model="baseStrInputData"></v-text-field>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleSendAVOrBVData">确定</v-btn>
            <v-btn color="primary" @click="closeDialog3">取消</v-btn>
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
import GLOBAL from "../Common.vue";
import axios from "axios";
import {onBeforeUnmount, onMounted, ref} from 'vue';

const dialogVisible2 = ref(false);
const dialogVisible3 = ref(false);
const URLInputData = ref("")
const FileNameInputData = ref("")
const DownloadThreadNumInputData = ref("")
const AVOrBVInputData = ref("");
const baseStrInputData = ref("");
const childDialogURLVisible = ref(false);
const childDialogBiliVisible = ref(false);
const selectedTask = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");
const dllist = ref([]);
const bdllist = ref([]);
const parentDir = ref("");
const openDialog2 = () => {
  dialogVisible2.value = true;
};
const closeDialog2 = () => {
  dialogVisible2.value = false;
};
const openDialog3 = () => {
  dialogVisible3.value = true;
};
const closeDialog3 = () => {
  dialogVisible3.value = false;
};

const clearDlTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/clear-dl-task-list');
    console.log("清空任务数据成功");
    console.log(response.data);
  } catch (error) {
    console.error("清空任务数据失败");
    console.error(error);
  }
};

const handleSendURLData = () => {
  if (parentDir.value === "") {
    snackbarText.value = "请选择父目录来存储下载的文件";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (URLInputData.value === "") {
    snackbarText.value = "请输入URL地址";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }

  const formData = new FormData();
  formData.append('url', URLInputData.value);
  formData.append('fileName', FileNameInputData.value);
  formData.append("DownloadThreadNumInputData", DownloadThreadNumInputData.value)
  formData.append('parentDir', parentDir.value);

  axios.post(GLOBAL.apiURL + '/get-file-from-url', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('已添加下载任务', response);
      console.log(response.data);
      snackbarText.value = "已添加下载任务";
      snackbarFlag.value = true;
      dialogVisible2.value = false;
      URLInputData.value = ""
      FileNameInputData.value = ""
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('任务创建失败', error);
      console.error(error);
      snackbarText.value = "任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

const handleSendAVOrBVData = () => {
  if (parentDir.value === "") {
    snackbarText.value = "请选择父目录来存储下载的文件";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (AVOrBVInputData.value === "") {
    snackbarText.value = "请输入BV/av号";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }

  const formData = new FormData();
  formData.append('biliId', AVOrBVInputData.value);
  formData.append('baseStr', baseStrInputData.value);
  formData.append('parentDir', parentDir.value);

  axios.post(GLOBAL.apiURL + '/get-bili-encoded-video-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('已添加哔哩源下载任务', response);
      console.log(response.data);
      snackbarText.value = "已添加哔哩源下载任务";
      snackbarFlag.value = true;
      dialogVisible3.value = false;
      AVOrBVInputData.value = ""
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('任务创建失败', error);
      console.error(error);
      snackbarText.value = "任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

const deleteDlTask = async (uuid) => {
  const formData = new FormData();
  formData.append('uuid', uuid);

  axios.post(GLOBAL.apiURL + '/delete-dl-task', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log("任务已删除", response);
      console.log(response.data);
      snackbarText.value = "任务已删除";
      snackbarFlag.value = true;
      childDialogURLVisible.value = false;
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

const sendDecodeTask = () => {
  if (selectedTask.value.baseStr === "" || selectedTask.value.status !== "已完成") {
    snackbarFlag.value = true;
    snackbarText.value = "参数错误";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }

  const inputData = {
    "dirName": selectedTask.value.resourceId,
    "decodeThread": 0,
    "baseStr": selectedTask.value.baseStr,
  }

  axios.post(GLOBAL.apiURL + '/add-decode-task', inputData)
    .then(response => {
      deleteBDlTask(selectedTask.value.uuid);
      console.log('已添加解码任务', response);
      console.log(response.data);
      snackbarText.value = "已添加解码任务";
      snackbarFlag.value = true;
      childDialogBiliVisible.value = false;
      refreshList();
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('解码任务创建失败', error);
      console.error(error);
      snackbarText.value = "解码任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    });
};

const sendAllDecodeTask = () => {
  // 遍历所有任务
  for (let i = 0; i < bdllist.value.length; i++) {
    const task = bdllist.value[i];
    if (task.status !== "已完成") {
      continue;
    }
    if (task.baseStr === "") {
      console.log("任务参数错误");
      continue;
    }

    const inputData = {
      "dirName": task.resourceId,
      "decodeThread": 0,
      "baseStr": task.baseStr,
    }

    axios.post(GLOBAL.apiURL + '/add-decode-task', inputData)
      .then(response => {
        deleteBDlTask(task.uuid);
        console.log('已添加解码任务', response);
        console.log(response.data);
      })
      .catch(error => {
        console.error('解码任务创建失败', error);
        console.error(error);
      });
  }
  snackbarText.value = "已添加所有任务到解码列表";
  snackbarFlag.value = true;
  refreshList();
  setTimeout(() => {
    snackbarFlag.value = false;
  }, 3000);
};

const deleteBDlTask = async (uuid) => {
  const formData = new FormData();
  formData.append('uuid', uuid);

  axios.post(GLOBAL.apiURL + '/delete-bdl-task', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log("任务已删除", response);
      console.log(response.data);
      snackbarText.value = "任务已删除";
      snackbarFlag.value = true;
      childDialogBiliVisible.value = false;
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

const showURLTaskDetails = (dl) => {
  refreshList();
  selectedTask.value = dl;
  childDialogURLVisible.value = true;
}
const hideURLTaskDetails = () => {
  refreshList();
  childDialogURLVisible.value = false;
}
const showBiliTaskDetails = (bdl) => {
  refreshList();
  selectedTask.value = bdl;
  childDialogBiliVisible.value = true;
}
const hideBiliTaskDetails = () => {
  refreshList();
  childDialogBiliVisible.value = false;
}

const handleDlTaskListData = (data) => {
  if (data.dlTaskList !== null) {
    data.dlTaskList.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (data.bdlTaskList !== null) {
    data.bdlTaskList.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (dllist.value !== data.dlTaskList) {
    dllist.value = data.dlTaskList
  }
  if (bdllist.value !== data.bdlTaskList) {
    bdllist.value = data.bdlTaskList
  }
}

// 定义函数来获取下载列表数据
const getDlTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-dl-task-list');
    handleDlTaskListData(response.data)
  } catch (error) {
    console.error("获取下载列表数据失败");
    console.error(error);
  }
};

const refreshList = () => {
  getDlTaskList();
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
});

</script>

<style scoped>

</style>
