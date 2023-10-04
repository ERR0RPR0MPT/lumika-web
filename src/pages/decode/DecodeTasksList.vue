<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">解码任务列表</div>
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
        :key="task.uuid"
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
            <v-btn color="primary" @click="handleSendEncodeTaskData">确定</v-btn>
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
            <v-btn prepend-icon="mdi-play" size="x-large" @click="pauseGetTask">
              暂停/执行任务
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
            <tr>
              <td>解码目录</td>
              <td>{{ selectedTask.taskInfo.dirName }}</td>
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

const clearGetTaskList = async () => {
  try {
    const response = await axios.get('/api/clear-get-task-list');
    console.log("清空任务数据成功");
    console.log(response.data);
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (error) {
    console.error("清空任务数据失败");
    console.error(error);
    snackbarText.value = "清空任务数据失败(当有任务执行时无法清空列表)";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
  }
};

const pauseGetTask = async () => {
  const formData = new FormData();
  formData.append('uuid', selectedTask.value.uuid);

  axios.post('/api/pause-get-task', formData, {
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
    })
    .catch(error => {
      console.error("执行状态切换失败", error);
      console.error(error);
      snackbarText.value = "执行状态切换失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
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

const handleSendEncodeTaskData = () => {
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

  axios.post('/api/add-decode-task', inputData)
    .then(response => {
      console.log('已添加编码任务', response);
      console.log(response.data);
      snackbarText.value = "已添加编码任务";
      snackbarFlag.value = true;
      dialogVisible.value = false;
      selectedItems.value = [];
      threadNumInputData.value = "";
      baseStrInputData.value = "";
      refreshList();
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('编码任务创建失败', error);
      console.error(error);
      snackbarText.value = "编码任务创建失败";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
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
    const response = await axios.get('/api/get-file-list');
    handleFileListData(response.data)
  } catch (error) {
    console.error("获取文件列表数据失败");
    console.error(error);
  }
};

// 定义函数来获取任务列表数据
const handleAddTaskListData = (data) => {
  if (decodeTaskList.value !== data.decodeTaskList) {
    decodeTaskList.value = data.decodeTaskList;
  }
}
const getTaskList = async () => {
  try {
    const response = await axios.get('/api/get-get-task-list');
    handleAddTaskListData(response.data)
  } catch (error) {
    console.error("获取编码任务列表数据失败");
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
  refreshTimer = setInterval(refreshList, 500); // 每隔 500ms 调用一次 fetchData
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
