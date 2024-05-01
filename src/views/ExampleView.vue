<template>
  <div id="exampleView">
    <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MdEditor from "@/components/MdEditor.vue";

const codeValue = ref();
const mdValue = ref();

const onCodeChange = (v: string) => {
  CodeEditor.value = v;
};
const onMdChange = (v: string) => {
  MdEditor.value = v;
};
</script>
