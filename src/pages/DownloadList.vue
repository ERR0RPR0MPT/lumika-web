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
<!--    <v-col cols="auto">-->
<!--      <v-btn prepend-icon="mdi-plus" size="x-large" @click="openDialog">-->
<!--        添加任务-->
<!--      </v-btn>-->
<!--    </v-col>-->
    <v-list lines="three">
      <v-list-subheader inset>下载任务</v-list-subheader>

      <v-list-item
        v-for="dl in dllist"
        :key="dl.title"
        :title="dl.title"
        :subtitle="dl.subtitle"
        @click="null"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-download</v-icon>
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

<!--    <v-dialog v-model="dialogVisible" max-width="1000">-->
<!--      <v-card elevation="12" class="overflow-y-auto overflow-x-hidden" max-height="93vh">-->
<!--        <v-card-title>添加编码任务</v-card-title>-->
<!--        <v-card-text>请选择要编码的文件夹</v-card-text>-->

<!--        <v-list lines="one">-->
<!--          <v-list-item-->
<!--            v-for="dl in dllist"-->
<!--            :key="dl.title"-->
<!--            :title="dl.title"-->
<!--            :subtitle="dl.subtitle"-->
<!--            @click="(isAnydllistelectedFlag && !dl.selected) ? null : dialogSelectDLTask(dl)"-->
<!--          >-->
<!--            <template v-slot:prepend>-->
<!--              <v-avatar color="grey-lighten-1">-->
<!--                <v-icon color="white">mdi-folder</v-icon>-->
<!--              </v-avatar>-->
<!--            </template>-->

<!--            <template v-slot:append>-->
<!--              <v-checkbox v-model="dl.selected"-->
<!--                          :disabled="isAnydllistelectedFlag && !dl.selected"></v-checkbox>-->
<!--            </template>-->
<!--          </v-list-item>-->
<!--        </v-list>-->

<!--        <v-card-actions class="justify-end">-->
<!--          <v-btn color="primary" @click="acceptDialog">确定</v-btn>-->
<!--          <v-btn color="primary" @click="closeDialog">取消</v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->

  </v-card>
</template>

<script setup>
import {ref} from 'vue';

// const dialogVisible = ref(false);
// const openDialog = () => {
//   dialogVisible.value = true;
// };
// const closeDialog = () => {
//   dialogVisible.value = false;
// };
// const acceptDialog = () => {
//   dialogVisible.value = false;
// };
// const dialogSelectDLTask = (dl) => {
//   const temp = dl.selected
//   for (let i = 0; i < dllist.value.length; i++) {
//     dllist.value[i].selected = false;
//   }
//   dl.selected = !temp;
//   isAnydllistelectedFlag.value = !isAnydllistelectedFlag.value;
// };

const isAnydllistelectedFlag = ref(false);

const dllist = ref([
  {
    title: 'test.zip',
    subtitle: '从URL下载',
  },
  {
    title: 'BV1Kb411W7ZB',
    subtitle: '从哔哩源下载',
  },
]);
</script>

<style scoped>

</style>
