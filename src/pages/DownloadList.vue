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
    <v-list lines="three">
      <v-list-subheader inset>从URL下载</v-list-subheader>

      <v-list-item
        v-for="dl in dllist"
        :key="dl.uuid"
        :title="dl.filename"
        :subtitle="dl.timestamp"
        @click="null"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-download</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
      <v-list-subheader inset>从哔哩源下载</v-list-subheader>

      <v-list-item
        v-for="bdl in bdllist"
        :key="bdl.uuid"
        :title="bdl.resourceId"
        :subtitle="bdl.timestamp"
        @click="null"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-download</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

  </v-card>
</template>

<script setup>
import {ref} from 'vue';
import axios from "axios";

const rawDlListData = ref([])
const dllist = ref([]);
const bdllist = ref([]);

const handleDlTaskListData = (data) => {
  if (rawDlListData.value === data.data) {
    return
  }
  rawDlListData.value = data.data
  for (const dl of data.data) {
    if (dl.type === 'dl') {
      dllist.value.push({
        uuid: dl.uuid,
        type: "dl",
        timestamp: dl.timestamp,
        resourceId: dl.resourceId,
        filename: dl.fileName,
        progressRate: dl.progressRate,
      })
    } else if (dl.type === 'bdl') {
      bdllist.value.push({
        uuid: dl.uuid,
        type: "bdl",
        timestamp: dl.timestamp,
        resourceId: dl.resourceId,
        filename: dl.fileName,
        progressRate: dl.progressRate,
      })
    }
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
getDlTaskList()

</script>

<style scoped>

</style>
