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
    </v-col>
    <v-list lines="three">
<!--      <v-list-subheader inset>解码列表</v-list-subheader>-->

      <v-list-item
        v-for="task in tasks"
        :key="task.title"
        :title="task.title"
        :subtitle="task.subtitle"
        @click="null"
      >
        <template v-slot:prepend>
          <v-avatar color="purple">
            <v-icon color="white">mdi-book</v-icon>
          </v-avatar>
        </template>

        <!--        <template v-slot:append>-->
        <!--          <v-btn-->
        <!--            color="purple"-->
        <!--            icon="mdi-information"-->
        <!--            variant="text"-->
        <!--          ></v-btn>-->
        <!--        </template>-->
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogVisible" max-width="1000">
      <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">
        <v-card-title>添加解码任务</v-card-title>
        <v-card-text>请选择要解码的文件夹</v-card-text>

        <v-list lines="one">
          <v-list-item
            v-for="task in tasks"
            :key="task.title"
            :title="task.title"
            :subtitle="task.subtitle"
            @click="(isAnyFolderSelectedFlag && !task.selected) ? null : dialogSelectFolder(task)"
          >
            <template v-slot:prepend>
              <v-avatar color="purple">
                <v-icon color="white">mdi-book</v-icon>
              </v-avatar>
            </template>

            <template v-slot:append>
              <v-checkbox v-model="task.selected"
                          :disabled="isAnyFolderSelectedFlag && !task.selected"></v-checkbox>
            </template>
          </v-list-item>
        </v-list>

        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="acceptDialog">确定</v-btn>
          <v-btn color="primary" @click="closeDialog">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script setup>
import {ref} from 'vue';

const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};
const closeDialog = () => {
  dialogVisible.value = false;
};
const acceptDialog = () => {
  dialogVisible.value = false;
};
const dialogSelectFolder = (task) => {
  const temp = task.selected
  for (let i = 0; i < tasks.value.length; i++) {
    tasks.value[i].selected = false;
  }
  task.selected = !temp;
  isAnyFolderSelectedFlag.value = !isAnyFolderSelectedFlag.value;
};

const isAnyFolderSelectedFlag = ref(false);

const tasks = ref([
  {
    title: '【YUZUSOFT】千戀＊萬花（千恋＊万花 / Senren*Banka）【完整汉化】【全CG存档】【哔哩源】【11.3G】',
    subtitle: '2023-09-28 12:11:57',
  },
]);
</script>

<style scoped>

</style>
