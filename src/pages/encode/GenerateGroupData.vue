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
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-sync" size="x-large" @click="null">生成合集码</v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn prepend-icon="mdi-plus" size="x-large" @click="addInput"></v-btn>
      <v-btn prepend-icon="mdi-minus" size="x-large" @click="removeInput"></v-btn>
    </v-col>
    <v-col cols="auto">
      <v-row v-for="(item, index) in jsonData" :key="index">
        <v-col cols="4">
          <v-text-field v-model="item.id" label="请输入BV号"></v-text-field>
          <v-btn prepend-icon="mdi-plus" size="x-large" @click="null">选择哔哩源</v-btn>
        </v-col>
        <v-col cols="8">
          <v-text-field v-model="item.baseStr" label="请输入 Base64 配置"></v-text-field>
          <v-btn prepend-icon="mdi-plus" size="x-large" @click="null">选择已编码任务</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
const jsonData = ref([{ id: "", baseStr: "" }]);

const addInput = () => {
  jsonData.value.push({ id: "", baseStr: "" });
};

const removeInput = () => {
  jsonData.value.pop();
};
</script>

<style scoped>

</style>
