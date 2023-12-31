<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">解码列表</div>
    </v-card-text>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-plus" size="x-large" @click="openDialog">
        添加任务
      </v-btn>
      <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="clearGetTaskList">
        清空任务列表
      </v-btn>
    </v-col>
    <v-list lines="three">
      <v-list-item
        v-for="task in decodeTaskList"
        :key="task.taskInfo.dirName"
        :title="task.taskInfo.dirName + ' - 进度: ' + (Math.floor(task.progressNum)).toString() + '% ' + task.status"
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
          <v-card-title>添加解码任务</v-card-title>
          <v-card-text>请选择要解码的文件</v-card-text>

          <v-col cols="auto">
            <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshList">
              刷新
            </v-btn>
          </v-col>

          <v-list lines="one">
            <v-list-item
              v-for="file in decodeFileListTemp"
              :key="file.filename"
              :title="file.filename"
              :subtitle="null"
              v-model="file.selected"
              @click="toggleSelection(file)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary">
                  <v-icon color="white">{{ fileTypeComputed(file.type) ? "mdi-file" : "mdi-folder" }}</v-icon>
                </v-avatar>
              </template>

              <template v-slot:append>
                <v-checkbox v-model="file.selected"></v-checkbox>
              </template>
            </v-list-item>

            <v-text-field label="请输入编码生成的 Base64 配置" v-model="baseStrInputData"></v-text-field>
            <v-text-field label="请输入解码视频的线程数(默认为 CPU 线程数量)"
                          v-model="threadNumInputData"></v-text-field>
          </v-list>

          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="handleSendDecodeTaskData">确定</v-btn>
            <v-btn color="primary" @click="closeDialog">取消</v-btn>
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
            <v-btn v-if="selectedTask.status !== '已完成' && selectedTask.status !== '执行失败'" prepend-icon="mdi-play" size="x-large" @click="pauseGetTask">
              暂停/执行任务
            </v-btn>
            <v-btn v-if="selectedTask.status === '已完成' && selectedTask.filename !== ''" prepend-icon="mdi-download" size="x-large" @click="openDownloadURL(selectedTask)">
              下载文件
            </v-btn>
            <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="deleteGetTask">
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
              <td>{{ (Math.floor(selectedTask.progressNum)).toString() + "%" }}</td>
            </tr>
            <tr v-if="selectedTask.duration !== ''">
              <td>用时</td>
              <td>{{ selectedTask.duration }}</td>
            </tr>
            <tr>
              <td>解码目录</td>
              <td>{{ selectedTask.taskInfo.dirName }}</td>
            </tr>
            <tr v-if="selectedTask.status === '已完成' && selectedTask.filename !== ''">
              <td>生成文件名</td>
              <td>{{ selectedTask.filename }}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{ selectedTask.timestamp }}</td>
            </tr>
            <tr>
              <td>Base64 配置</td>
              <td>{{ selectedTask.taskInfo.baseStr }}</td>
            </tr>
            <tr>
              <td>线程数</td>
              <td>{{ selectedTask.taskInfo.decodeThread }}</td>
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
import axios from "axios";

const decodeTaskList = ref([]);
const decodeFileList = ref([]);
const decodeFileListTemp = ref([]);
const dialogVisible = ref(false);
const childDialogVisible = ref(false);
const selectedTask = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");

const threadNumInputData = ref("");
const baseStrInputData = ref("");

const selectedItems = ref([]);
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

const openDownloadURL = (task) => {
  window.open(GLOBAL.apiURL + "/dl/decodeOutput/" + task.filename, '_blank');
}

const clearGetTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/clear-get-task-list');
    console.log("清空任务数据成功");
    console.log(response.data);
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    refreshList();
  } catch (error) {
    console.error("清空任务数据失败");
    console.error(error);
    snackbarText.value = "清空任务数据失败";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    refreshList();
  }
};

const pauseGetTask = async () => {
  const formData = new FormData();
  formData.append('uuid', selectedTask.value.uuid);

  axios.post(GLOBAL.apiURL + '/pause-get-task', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log("已切换执行状态", response);
      console.log(response.data);
      snackbarText.value = "已切换执行状态";
      snackbarFlag.value = true;
      childDialogVisible.value = false;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
      refreshList();
    })
    .catch(error => {
      console.error("执行状态切换失败", error);
      console.error(error);
      snackbarText.value = "执行状态切换失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
      refreshList();
    });
};

const deleteGetTask = async () => {
  const formData = new FormData();
  formData.append('uuid', selectedTask.value.uuid);

  axios.post(GLOBAL.apiURL + '/delete-get-task', formData, {
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
      refreshList();
    })
    .catch(error => {
      console.error("任务删除失败", error);
      console.error(error);
      snackbarText.value = "任务删除失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
      refreshList();
    });
};

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
  decodeFileListTemp.value = decodeFileList.value;
  dialogVisible.value = true;
};
const closeDialog = () => {
  dialogVisible.value = false;
};
const fileTypeComputed = (type) => {
  return type === 'file';
};

const handleSendDecodeTaskData = () => {
  if (selectedItems.value.length === 0) {
    snackbarFlag.value = true;
    snackbarText.value = "请选择一个目录";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  } else if (selectedItems.value.length > 1) {
    selectedItems.value = [];
    snackbarFlag.value = true;
    snackbarText.value = "你只能一次性选择一个目录";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }
  if (baseStrInputData.value === "") {
    snackbarFlag.value = true;
    snackbarText.value = "请输入编码时生成的 Base64 配置";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }
  if (threadNumInputData.value === "") {
    threadNumInputData.value = "0"
  }

  const inputData = {
    "dirName": selectedItems.value[0],
    "decodeThread": parseInt(threadNumInputData.value),
    "baseStr": baseStrInputData.value
  }
  selectedItems.value = [];

  axios.post(GLOBAL.apiURL + '/add-decode-task', inputData)
    .then(response => {
      console.log('已添加解码任务', response);
      console.log(response.data);
      snackbarText.value = "已添加解码任务";
      snackbarFlag.value = true;
      dialogVisible.value = false;
      selectedItems.value = [];
      threadNumInputData.value = "";
      baseStrInputData.value = "";
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
      refreshList();
    })
    .catch(error => {
      console.error('解码任务创建失败', error);
      console.error(error);
      snackbarText.value = "解码任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
      refreshList();
    });
};

// 定义函数来获取文件列表数据
const handleFileListData = (data) => {
  data.decode = data.decode.filter(item => item.type !== "file");
  if (decodeFileList.value !== data.decode) {
    decodeFileList.value = data.decode
  }
}
const getFileList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-file-list');
    handleFileListData(response.data)
  } catch (error) {
    console.error("获取文件列表数据失败");
    console.error(error);
  }
};

// 定义函数来获取任务列表数据
const handleAddTaskListData = (data) => {
  if (data.decodeTaskList !== null) {
    data.decodeTaskList.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (decodeTaskList.value !== data.decodeTaskList) {
    decodeTaskList.value = data.decodeTaskList;
  }
}
const getTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-get-task-list');
    handleAddTaskListData(response.data)
  } catch (error) {
    console.error("获取编码列表数据失败");
    console.error(error);
  }
};

const refreshList = () => {
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
});

</script>

<style scoped>
.max-width-table {
  max-width: 100%; /* 设置表格最大宽度 */
  width: 100%; /* 设置表格宽度为 100% */
  table-layout: fixed; /* 固定表格布局 */
}
</style>
