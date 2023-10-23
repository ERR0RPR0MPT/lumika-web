<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">编码列表</div>
    </v-card-text>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-plus" size="x-large" @click="openDialog">
        添加任务
      </v-btn>
      <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="clearAddTaskList">
        清空任务列表
      </v-btn>
    </v-col>
    <v-list lines="three">
      <v-list-item
        v-for="task in encodeTaskList"
        :key="task.taskInfo.fileNameList[0]"
        :title="task.taskInfo.fileNameList[0] + ' - 进度: ' + Math.floor(task.progressNum) + '% ' + task.status"
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
          <v-card-title>添加编码任务</v-card-title>
          <v-card-text>请选择要编码的文件</v-card-text>

          <v-col cols="auto">
            <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshList">
              刷新
            </v-btn>
          </v-col>

          <v-list lines="one">
            <v-list-item
              v-for="file in encodeFileListTemp"
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

            <v-checkbox
              v-model="showAdvancedSettings"
              label="高级设置"
            ></v-checkbox>

            <v-card v-if="showAdvancedSettings">
              <v-text-field label="请输入简介(默认为空)" v-model="summaryInputData"></v-text-field>
              <v-text-field label="请输入 M 的值(默认: 90)" v-model="MInputData"></v-text-field>
              <v-text-field label="请输入 K 的值(默认: 81)" v-model="KInputData"></v-text-field>
              <v-text-field label="请输入 MG 的值(默认: 200)" v-model="MGInputData"></v-text-field>
              <v-text-field label="请输入 KG 的值(默认: 130)" v-model="KGInputData"></v-text-field>
              <v-select label="请选择编码函数的版本(默认: 5)" :items="['5', '4', '3']" v-model="encodeVersionInputData"></v-select>
              <v-text-field v-if="encodeVersionInputData === '5'" label="请输入 Ver5ColorGA 的值(默认: 0)" v-model="encodeVer5ColorGAInputData"></v-text-field>
              <v-text-field v-if="encodeVersionInputData === '5'" label="请输入 Ver5ColorBA 的值(默认: 0)" v-model="encodeVer5ColorBAInputData"></v-text-field>
              <v-text-field v-if="encodeVersionInputData === '5'" label="请输入 Ver5ColorGB 的值(默认: 255)" v-model="encodeVer5ColorGBInputData"></v-text-field>
              <v-text-field v-if="encodeVersionInputData === '5'" label="请输入 Ver5ColorBB 的值(默认: 255)" v-model="encodeVer5ColorBBInputData"></v-text-field>
              <v-text-field label="请输入生成视频的分辨率大小(单位: 像素，默认: 224)"
                            v-model="resolutionInputData"></v-text-field>
              <v-text-field label="请输入生成视频的帧率(单位: FPS，默认: 1)" v-model="FPSInputData"></v-text-field>
              <v-text-field label="请输入生成视频的最大长度(单位: 秒，默认: 35990)"
                            v-model="maxDurationInputData"></v-text-field>
              <v-text-field label="请输入编码视频的线程数(默认为 CPU 线程数量)"
                            v-model="threadNumInputData"></v-text-field>
              <v-text-field label="请输入编码视频的 FFmpeg 预设(默认: medium)"
                            v-model="ffmpegPresetInputData"></v-text-field>
              <v-card-text>提示：如果不知道如何填写高级设置，请使用默认配置(留空即可)。</v-card-text>
            </v-card>
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
            <v-btn v-if="selectedTask.status !== '已完成' && selectedTask.status !== '执行失败'" prepend-icon="mdi-play" size="x-large" @click="pauseAddTask">
              暂停/执行任务
            </v-btn>
            <v-btn v-if="selectedTask.status === '已完成' && selectedTask.baseStr !== ''" prepend-icon="mdi-clipboard-edit" size="x-large" @click="copyToClipboard(selectedTask.baseStr)">
              复制生成的 Base64 配置
            </v-btn>
            <v-btn prepend-icon="mdi-delete-forever" size="x-large" @click="deleteAddTask(selectedTask)">
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
              <td>文件名</td>
              <td>{{ selectedTask.taskInfo.fileNameList[0] }}</td>
            </tr>
            <tr>
              <td>简介</td>
              <td>{{ selectedTask.taskInfo.defaultSummary }}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{ selectedTask.timestamp }}</td>
            </tr>
            <tr>
              <td>Base64 配置</td>
              <td>{{ selectedTask.baseStr }}</td>
            </tr>
            <tr>
              <td>M 值</td>
              <td>{{ selectedTask.taskInfo.defaultM }}</td>
            </tr>
            <tr>
              <td>K 值</td>
              <td>{{ selectedTask.taskInfo.defaultK }}</td>
            </tr>
            <tr>
              <td>MG 值</td>
              <td>{{ selectedTask.taskInfo.mgValue }}</td>
            </tr>
            <tr>
              <td>KG 值</td>
              <td>{{ selectedTask.taskInfo.kgValue }}</td>
            </tr>
            <tr>
              <td>分辨率</td>
              <td>{{ selectedTask.taskInfo.videoSize }}</td>
            </tr>
            <tr>
              <td>帧率</td>
              <td>{{ selectedTask.taskInfo.outputFPS }}</td>
            </tr>
            <tr>
              <td>最大长度</td>
              <td>{{ selectedTask.taskInfo.encodeMaxSeconds }}</td>
            </tr>
            <tr>
              <td>线程数</td>
              <td>{{ selectedTask.taskInfo.encodeThread }}</td>
            </tr>
            <tr>
              <td>FFmpeg 预设参数</td>
              <td>{{ selectedTask.taskInfo.encodeFFmpegMode }}</td>
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

const encodeTaskList = ref([]);
const encodeFileList = ref([]);
const encodeFileListTemp = ref([]);
const dialogVisible = ref(false);
const childDialogVisible = ref(false);
const selectedTask = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");
const MInputData = ref("");
const KInputData = ref("");
const MGInputData = ref("");
const KGInputData = ref("");
const resolutionInputData = ref("");
const encodeVersionInputData = ref("");
const encodeVer5ColorGAInputData = ref("");
const encodeVer5ColorBAInputData = ref("");
const encodeVer5ColorGBInputData = ref("");
const encodeVer5ColorBBInputData = ref("");
const FPSInputData = ref("");
const maxDurationInputData = ref("");
const threadNumInputData = ref("");
const ffmpegPresetInputData = ref("");
const summaryInputData = ref("");
const showAdvancedSettings = ref(false);
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

const copyToClipboard = (text) => {
  try {
    navigator.clipboard.writeText(text);
    console.log('内容已成功复制到剪贴板');
    snackbarText.value = "内容已成功复制到剪贴板";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
  } catch (e) {
    try {
      // eslint-disable-next-line no-undef
      ClipboardInterface.copyToClipboard(text);
      console.log('内容已成功复制到剪贴板');
      snackbarText.value = "内容已成功复制到剪贴板";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 3000);
    } catch (e) {
      console.log(e);
      console.error('无法复制内容到剪贴板');
      snackbarText.value = "无法复制内容到剪贴板";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
    }
  }
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
  encodeFileListTemp.value = encodeFileList.value;
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
    snackbarText.value = "请选择一个文件";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  } else if (selectedItems.value.length > 1) {
    selectedItems.value = [];
    snackbarFlag.value = true;
    snackbarText.value = "你只能一次性选择一个文件";
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 3000);
    return;
  }
  if (MInputData.value === "") {
    MInputData.value = "90"
  }
  if (KInputData.value === "") {
    KInputData.value = "81"
  }
  if (MGInputData.value === "") {
    MGInputData.value = "200"
  }
  if (KGInputData.value === "") {
    KGInputData.value = "130"
  }
  if (encodeVersionInputData.value === "") {
    encodeVersionInputData.value = "5"
  }
  if (encodeVer5ColorGAInputData.value === "") {
    encodeVer5ColorGAInputData.value = "0"
  }
  if (encodeVer5ColorBAInputData.value === "") {
    encodeVer5ColorBAInputData.value = "0"
  }
  if (encodeVer5ColorGBInputData.value === "") {
    encodeVer5ColorGBInputData.value = "255"
  }
  if (encodeVer5ColorBBInputData.value === "") {
    encodeVer5ColorBBInputData.value = "255"
  }
  if (resolutionInputData.value === "") {
    resolutionInputData.value = "224"
  }
  if (FPSInputData.value === "") {
    FPSInputData.value = "1"
  }
  if (threadNumInputData.value === "") {
    threadNumInputData.value = "0"
  }
  if (maxDurationInputData.value === "") {
    maxDurationInputData.value = "35990"
  }
  if (ffmpegPresetInputData.value === "") {
    ffmpegPresetInputData.value = "medium"
  }

  const inputData = {
    "fileNameList": selectedItems.value,
    "defaultM": parseInt(MInputData.value),
    "defaultK": parseInt(KInputData.value),
    "mgValue": parseInt(MGInputData.value),
    "kgValue": parseInt(KGInputData.value),
    "videoSize": parseInt(resolutionInputData.value),
    "outputFPS": parseInt(FPSInputData.value),
    "encodeMaxSeconds": parseInt(maxDurationInputData.value),
    "encodeThread": parseInt(threadNumInputData.value),
    "encodeVersion": parseInt(encodeVersionInputData.value),
    "encodeVer5ColorGA": parseInt(encodeVer5ColorGAInputData.value),
    "encodeVer5ColorBA": parseInt(encodeVer5ColorBAInputData.value),
    "encodeVer5ColorGB": parseInt(encodeVer5ColorGBInputData.value),
    "encodeVer5ColorBB": parseInt(encodeVer5ColorBBInputData.value),
    "encodeFFmpegMode": ffmpegPresetInputData.value,
    "defaultSummary": summaryInputData.value
  }
  selectedItems.value = [];

  axios.post(GLOBAL.apiURL + '/add-encode-task', inputData)
    .then(response => {
      console.log('已添加编码任务', response);
      console.log(response.data);
      dialogVisible.value = false;
      selectedItems.value = [];
      MInputData.value = "";
      KInputData.value = "";
      MGInputData.value = "";
      KGInputData.value = "";
      resolutionInputData.value = "";
      encodeVersionInputData.value = "";
      encodeVer5ColorGAInputData.value = "";
      encodeVer5ColorBAInputData.value = "";
      encodeVer5ColorGBInputData.value = "";
      encodeVer5ColorBBInputData.value = "";
      FPSInputData.value = "";
      maxDurationInputData.value = "";
      threadNumInputData.value = "";
      ffmpegPresetInputData.value = "";
      summaryInputData.value = "";
      refreshList();
      snackbarText.value = "已添加编码任务";
      snackbarFlag.value = true;
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
}

const clearAddTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/clear-add-task-list');
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

const pauseAddTask = async () => {
  const formData = new FormData();
  formData.append('uuid', selectedTask.value.uuid);

  axios.post(GLOBAL.apiURL + '/pause-add-task', formData, {
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

const deleteAddTask = async () => {
  const formData = new FormData();
  formData.append('uuid', selectedTask.value.uuid);

  axios.post(GLOBAL.apiURL + '/delete-add-task', formData, {
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

// 定义函数来获取文件列表数据
const handleFileListData = (data) => {
  data.encode = data.encode.filter(item => item.type === "file");
  if (data.encode !== null) {
    data.encode.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (encodeFileList.value !== data.encode) {
    encodeFileList.value = data.encode
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
const handleAddTaskListData = (data) => {
  if (data.encodeTaskList !== null) {
    data.encodeTaskList.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
  }
  if (encodeTaskList.value !== data.encodeTaskList) {
    encodeTaskList.value = data.encodeTaskList;
  }
}
const getTaskList = async () => {
  try {
    const response = await axios.get(GLOBAL.apiURL + '/get-add-task-list');
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
