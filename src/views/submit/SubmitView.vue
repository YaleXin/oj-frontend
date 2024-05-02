<template>
  <div id="submitsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题目" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入题目ID" />
      </a-form-item>
      <a-form-item field="userId" label="用户" style="min-width: 240px">
        <a-input-tag v-model="searchParams.userId" placeholder="请输入用户ID" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">提交</a-button>
      </a-form-item>
    </a-form>

    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <!-- 处理时间 -->
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:MM:SS") }}
      </template>

      <!-- 处理判题情况 -->
      <template #judgeInfo="{ record }">
        <a-tag :color="record.judgeInfo.message == 'Accept' ? 'green' : 'red'">
          {{ record.judgeInfo.message }}
        </a-tag>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Page_Question_,
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
  QuestionSubmitQueryRequest,
} from "../../../generated/question";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    console.log("submit = ", res.data);
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "提交ID",
    dataIndex: "id",
  },
  {
    title: "提交者ID",
    dataIndex: "userId",
  },
  {
    title: "所属题目ID",
    dataIndex: "questionId",
  },
  {
    title: "语言",
    dataIndex: "language",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
  {
    title: "提交情况",
    slotName: "judgeInfo",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();
</script>

<style scoped>
#submitsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
