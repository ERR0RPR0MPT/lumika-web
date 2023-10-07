<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">生成合集码</div>
    </v-card-text>
    <v-col v-if="base64JsonData !== ''" cols="auto">
      <v-textarea v-model="base64JsonData" label="生成的 Base64 配置"></v-textarea>
    </v-col>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-sync" size="x-large" @click="generateGroupData">生成</v-btn>
      <v-btn v-if="base64JsonData !== ''" prepend-icon="mdi-sync" size="x-large" @click="copyToClipboard(base64JsonData)">复制到剪贴板</v-btn>
      <v-btn v-if="base64JsonData !== ''" prepend-icon="mdi-delete-forever" size="x-large" @click="base64JsonData = ''">清除</v-btn>
      <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshGroupData">初始化</v-btn>
    </v-col>
    <v-col cols="auto">
      <v-text-field v-model="jsonData.nameText" label="请输入资源名称"></v-text-field>
      <v-text-field v-model="jsonData.summaryText" label="请输入简介"></v-text-field>
    </v-col>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-plus" size="x-large" @click="addInput"></v-btn>
      <v-btn prepend-icon="mdi-minus" size="x-large" @click="removeInput"></v-btn>
    </v-col>
    <v-col cols="auto">
      <v-row v-for="(item, index) in jsonData.groupData" :key="index">
        <v-col cols="4">
          <v-text-field v-model="item.id" label="请输入BV号"></v-text-field>
          <v-btn prepend-icon="mdi-plus" size="x-large" @click="showBiliDetails(index)">选择哔哩源</v-btn>
        </v-col>
        <v-col cols="8">
          <v-text-field v-model="item.baseStr" label="请输入 Base64 配置"></v-text-field>
          <v-btn prepend-icon="mdi-plus" size="x-large" @click="showTaskDetails(index)">选择已编码任务</v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-dialog v-model="dialogBiliVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">
          <v-card-title>选择哔哩源任务</v-card-title>
          <v-card-text>请选择填入 BV 号的哔哩源任务</v-card-text>

          <v-col cols="auto">
            <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshList">
              刷新
            </v-btn>
          </v-col>

          <v-list lines="three">
            <v-list-item
              v-for="task in bulTaskList"
              :key="task.taskInfo.fileName"
              :title="task.taskInfo.fileName + ' - ' + (task.bvid !== '' ? task.bvid : '') + ' 进度: ' + Math.floor(task.progressNum) + '% ' + task.status"
              :subtitle="task.timestamp + ' UUID: ' + task.uuid"
              @click="acceptBiliDialog(task)"
            >
              <v-progress-linear color="primary" :model-value="task.progressNum"></v-progress-linear>
              <template v-slot:prepend>
                <v-avatar color="primary">
                  <v-icon color="white">mdi-book</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog v-model="dialogTaskVisible" max-width="1000">
      <v-container>
        <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">
          <v-card-title>选择已编码任务</v-card-title>
          <v-card-text>请选择填入 Base64 配置的已编码任务</v-card-text>

          <v-col cols="auto">
            <v-btn prepend-icon="mdi-refresh" size="x-large" @click="refreshList">
              刷新
            </v-btn>
          </v-col>

          <v-list lines="three">
            <v-list-item
              v-for="task in encodeTaskList"
              :key="task.taskInfo.fileNameList[0]"
              :title="task.taskInfo.fileNameList[0] + ' - 进度: ' + Math.floor(task.progressNum) + '% ' + task.status"
              :subtitle="task.timestamp + ' UUID: ' + task.uuid"
              @click="acceptTaskDialog(task)"
            >
              <v-progress-linear color="primary" :model-value="task.progressNum"></v-progress-linear>
              <template v-slot:prepend>
                <v-avatar color="primary">
                  <v-icon color="white">mdi-book</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
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
import {onBeforeUnmount, onMounted, ref} from 'vue';
import axios from "axios";

const jsonData = ref(
  {
    nameText: "",
    summaryText: "",
    groupData: [
      {
        id: "",
        baseStr: ""
      }
    ],
  }
);
const base64JsonData = ref("");

const selectedIndex = ref(0);
const snackbarText = ref("");
const bulTaskList = ref([]);
const encodeTaskList = ref([]);
const dialogBiliVisible = ref(false);
const dialogTaskVisible = ref(false);
const snackbarFlag = ref(false);


const showBiliDetails = (index) => {
  refreshList();
  selectedIndex.value = index;
  dialogBiliVisible.value = true;
}
const acceptBiliDialog = (task) => {
  if (task.status !== "已完成") {
    snackbarText.value = "当前任务未执行完成，请选择已完成的任务";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  jsonData.value.groupData[selectedIndex.value].id = task.bvid;
  dialogBiliVisible.value = false;
};

const showTaskDetails = (index) => {
  refreshList();
  selectedIndex.value = index;
  dialogTaskVisible.value = true;
}
const acceptTaskDialog = (task) => {
  if (task.status !== "已完成") {
    snackbarText.value = "当前任务未执行完成，请选择已完成的任务";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  jsonData.value.groupData[selectedIndex.value].baseStr = task.baseStr;
  dialogTaskVisible.value = false;
};

// 定义函数来获取任务列表数据
const handleBUlTaskListData = (data) => {
  if (bulTaskList.value !== data.bulTaskList) {
    bulTaskList.value = data.bulTaskList;
  }
}
const getBiliList = async () => {
  try {
    const response = await axios.get('/api/get-bul-task-list');
    handleBUlTaskListData(response.data)
  } catch (error) {
    console.error("获取上传到哔哩源列表数据失败");
    console.error(error);
  }
};
const refreshList = () => {
  getBiliList();
  getTaskList();
};

// 定义函数来获取任务列表数据
const handleEncodeTaskListData = (data) => {
  if (encodeTaskList.value !== data.encodeTaskList) {
    encodeTaskList.value = data.encodeTaskList;
  }
}
const getTaskList = async () => {
  try {
    const response = await axios.get('/api/get-add-task-list');
    handleEncodeTaskListData(response.data)
  } catch (error) {
    console.error("获取编码列表数据失败");
    console.error(error);
  }
};

const addInput = () => {
  jsonData.value.groupData.push({id: "", baseStr: ""});
};

const removeInput = () => {
  if (jsonData.value.groupData.length === 1) {
    return;
  }
  jsonData.value.groupData.pop();
};

const generateGroupData = () => {
  if (jsonData.value.nameText === "") {
    snackbarText.value = "请输入资源名称";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  if (jsonData.value.summaryText === "") {
    snackbarText.value = "请输入简介";
    snackbarFlag.value = true;
    setTimeout(() => {
      snackbarFlag.value = false;
    }, 5000);
    return;
  }
  // 遍历检查是否有未填写的数据
  for (let i = 0; i < jsonData.value.groupData.length; i++) {
    if (jsonData.value.groupData[i].id === "") {
      snackbarText.value = "请填写第" + (i + 1) + "个资源的BV号";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
      return;
    }
    if (jsonData.value.groupData[i].baseStr === "") {
      snackbarText.value = "请填写第" + (i + 1) + "个资源的 Base64 编码";
      snackbarFlag.value = true;
      setTimeout(() => {
        snackbarFlag.value = false;
      }, 5000);
      return;
    }
  }
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(jsonData.value));
  base64JsonData.value = btoa(String.fromCharCode.apply(null, encodedData));
};

const refreshGroupData = () => {
  jsonData.value = {
    nameText: "",
    summaryText: "",
    groupData: [
      {
        id: "",
        baseStr: ""
      }
    ],
  };
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
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
