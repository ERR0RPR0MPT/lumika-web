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
        :key="dl.uuid"
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
        :key="bdl.uuid"
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
                <pre>{{ selectedTask.logCat }}</pre>
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
            <tr>
              <td>BV/av号</td>
              <td>{{ selectedTask.resourceId }}</td>
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
                <pre>{{ selectedTask.logCat }}</pre>
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
          <v-text-field label="请输入BV/av号" v-model="AVOrBVInputData"></v-text-field>
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
          color="red"
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
import axios from "axios";
import {onBeforeUnmount, onMounted, ref} from 'vue';

const dialogVisible2 = ref(false);
const dialogVisible3 = ref(false);
const URLInputData = ref("")
const FileNameInputData = ref("")
const DownloadThreadNumInputData = ref("")
const AVOrBVInputData = ref("");
const childDialogURLVisible = ref(false);
const childDialogBiliVisible = ref(false);
const selectedTask = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");
const dllist = ref([]);
const bdllist = ref([]);
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
    const response = await axios.get('/api/clear-dl-task-list');
    console.log("清空任务数据成功");
    console.log(response.data);
  } catch (error) {
    console.error("清空任务数据失败");
    console.error(error);
  }
};

const handleSendURLData = () => {
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

  axios.post('/api/get-file-from-url', formData, {
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
  if (AVOrBVInputData.value === "") {
    snackbarText.value = "请输入BV/av号";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }

  const formData = new FormData();
  formData.append('bili-id', AVOrBVInputData.value);

  axios.post('/api/get-encoded-video-files', formData, {
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
}

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
  if (dllist.value !== data.dlTaskList) {
    dllist.value = data.dlTaskList
  }
  if (bdllist.value !== data.bdlTaskList) {
    bdllist.value = data.bdlTaskList
  }
}

// 定义函数来获取下载任务列表数据
const getDlTaskList = async () => {
  try {
    const response = await axios.get('/api/get-dl-task-list');
    handleDlTaskListData(response.data)
  } catch (error) {
    console.error("获取下载任务列表数据失败");
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
  refreshTimer = setInterval(refreshList, 500); // 每隔 500ms 调用一次 fetchData
});

// 在组件销毁之前清除计时器
onBeforeUnmount(() => {
  clearInterval(refreshTimer);
});

</script>

<style scoped>

</style>
