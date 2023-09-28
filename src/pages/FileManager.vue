<template>
  <v-card
    elevation="12"
    class="mx-auto overflow-y-auto overflow-x-hidden"
    max-height="93vh"
    max-width="800"
  >
    <v-card-text>
      <div class="text-h4">文件管理</div>
    </v-card-text>
<!--    <v-col cols="auto">-->
<!--      <v-btn prepend-icon="mdi-plus" size="x-large" @click="openDialog">-->
<!--        添加文件-->
<!--      </v-btn>-->
<!--    </v-col>-->
    <v-list lines="three">
      <v-list-subheader inset>文件夹</v-list-subheader>

      <v-list-item
        v-for="folder in folders"
        :key="folder.title"
        :title="folder.title"
        :subtitle="folder.subtitle"
        @click="null"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-folder</v-icon>
          </v-avatar>
        </template>

        <!--        <template v-slot:append>-->
        <!--          <v-btn-->
        <!--            color="grey-lighten-1"-->
        <!--            icon="mdi-information"-->
        <!--            variant="text"-->
        <!--          ></v-btn>-->
        <!--        </template>-->
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-subheader inset>文件</v-list-subheader>

      <v-list-item
        v-for="file in files"
        :key="file.title"
        :title="file.title"
        :subtitle="file.subtitle"
        @click="null"
      >
        <template v-slot:prepend>
          <v-avatar :color="'blue'">
            <v-icon color="white">mdi-clipboard-text</v-icon>
          </v-avatar>
        </template>

        <!--        <template v-slot:append>-->
        <!--          <v-btn-->
        <!--            color="grey-lighten-1"-->
        <!--            icon="mdi-information"-->
        <!--            variant="text"-->
        <!--          ></v-btn>-->
        <!--        </template>-->
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogVisible" max-width="1000">
      <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">
        <v-card-title>添加编码任务</v-card-title>
        <v-card-text>请选择要编码的文件夹</v-card-text>

        <v-list lines="one">
          <v-list-item
            v-for="folder in folders"
            :key="folder.title"
            :title="folder.title"
            :subtitle="folder.subtitle"
            @click="(isAnyFolderSelectedFlag && !folder.selected) ? null : dialogSelectFolder(folder)"
          >
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-1">
                <v-icon color="white">mdi-folder</v-icon>
              </v-avatar>
            </template>

            <template v-slot:append>
              <v-checkbox v-model="folder.selected"
                          :disabled="isAnyFolderSelectedFlag && !folder.selected"></v-checkbox>
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
const dialogSelectFolder = (folder) => {
  const temp = folder.selected
  for (let i = 0; i < folders.value.length; i++) {
    folders.value[i].selected = false;
  }
  folder.selected = !temp;
  isAnyFolderSelectedFlag.value = !isAnyFolderSelectedFlag.value;
};

const isAnyFolderSelectedFlag = ref(false);

const files = ref([
  {
    subtitle: 'Sep 20, 2023',
    title: 'Vacation itinerary',
  },
]);

const folders = ref([
  {
    subtitle: 'Sep 9, 2023',
    title: 'Photos',
  },
  {
    subtitle: 'Sep 17, 2023',
    title: 'Recipes',
  },
  {
    subtitle: 'Sep 27, 2023',
    title: 'Work',
  },
  {
    subtitle: 'Sep 9, 2023',
    title: 'Photos',
  },
  {
    subtitle: 'Sep 17, 2023',
    title: 'Recipes',
  },
  {
    subtitle: 'Sep 27, 2023',
    title: 'Work',
  },
  {
    subtitle: 'Sep 9, 2023',
    title: 'Photos',
  },
  {
    subtitle: 'Sep 17, 2023',
    title: 'Recipes',
  },
  {
    subtitle: 'Sep 27, 2023',
    title: 'Work',
  },
]);
</script>

<style scoped>

</style>
