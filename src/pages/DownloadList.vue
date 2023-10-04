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
      <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshList">
        刷新
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
        <v-progress-linear :model-value="dl.progressNum"></v-progress-linear>
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">mdi-download</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="childDialogURLVisible" max-width="1000">
      <v-card elevation="12" class="overflow-y-auto" max-height="93vh">
        <v-card-title>详细信息</v-card-title>
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
          <tr>
            <td>运行日志</td>
            <td>
              <v-container>
                <v-code>
                  <pre>{{ selectedTask.logCat }}</pre>
                </v-code>
              </v-container>
            </td>
          </tr>
          </tbody>
        </v-table>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="hideURLTaskDetails">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="childDialogBiliVisible" max-width="1000">
      <v-card elevation="12" class="overflow-y-auto" max-height="93vh">
        <v-card-title>详细信息</v-card-title>
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
          <tr>
            <td>运行日志</td>
            <td>
              <v-container>
                <v-code>
                  <pre>{{ selectedTask.logCat }}</pre>
                </v-code>
              </v-container>
            </td>
          </tr>
          </tbody>
        </v-table>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="hideBiliTaskDetails">确定</v-btn>
        </v-card-actions>
      </v-card>
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

const childDialogURLVisible = ref(false);
const childDialogBiliVisible = ref(false);
const selectedTask = ref(null);
const snackbarFlag = ref(false);
const snackbarText = ref("");
const dllist = ref([]);
const bdllist = ref([]);

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
getDlTaskList();

const refreshList = () => {
  getDlTaskList();
};

let refreshTimer = null;

// 在组件创建时启动计时器
onMounted(() => {
  refreshList(); // 首次立即获取数据
  refreshTimer = setInterval(refreshList, 1000); // 每隔一秒调用一次 fetchData
});

// 在组件销毁之前清除计时器
onBeforeUnmount(() => {
  clearInterval(refreshTimer);
});

</script>

<style scoped>

</style>
