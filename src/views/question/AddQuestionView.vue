<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试输入用例配置"
        tooltip="一个输入用例一个文本文件，每个输入用例的顺序是其文件名顺序，推荐名字为input_xx.txt，最多允许上传1024个用例"
      >
        <a-upload
          action="/"
          :auto-upload="false"
          :file-list="inputList"
          @change="inputCaseOnChange"
          multiple
          :show-file-list="false"
          accept=".txt"
          :limit="1024"
        />
        共{{ inputList.length }}个
        <div v-show="inputList.length > 0">
          <a-popconfirm
            content="是否要清空所有的输入用例？"
            type="warning"
            @ok="inputCancelUpload"
          >
            <a-button>取消上传</a-button>
          </a-popconfirm>
        </div>
      </a-form-item>

      <a-form-item
        label="测试输出用例配置"
        tooltip="一个输出用例一个文本文件，每个输出用例的顺序是其文件名顺序，推荐名字为output_xx.txt，最多允许上传1024个用例"
      >
        <a-upload
          action="/"
          :auto-upload="false"
          :file-list="outputList"
          @change="outputCaseOnChange"
          multiple
          :show-file-list="false"
          accept=".txt"
          :limit="1024"
        />
        共{{ outputList.length }}个
        <div v-show="outputList.length > 0">
          <a-popconfirm
            content="是否要清空所有的输出用例？"
            type="warning"
            @ok="outputCancelUpload"
          >
            <a-button>取消上传</a-button>
          </a-popconfirm>
        </div>
      </a-form-item>

      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated/question";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

const inputList = ref([]);
const outputList = ref([]);
const router = useRouter();

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    // {
    //   input: "",
    //   output: "",
    // },
  ],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  if (inputList.value.length != outputList.value.length) {
    message.error("输入用例个数和输出用例个数不一致！");
    return;
  }

  if (inputList.value.length == 0) {
    message.error("输入和输出用例个数不能为零！");
    return;
  }

  // 对输入用例和输出用例按照文件明排序
  inputList.value = inputList.value.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  outputList.value = outputList.value.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  // console.log("inputList = ", inputList.value);
  // console.log("outputList = ", outputList.value);

  let intputCaseList: string[] = await fileList2stringList(inputList.value);
  let outputCaseList: string[] = await fileList2stringList(outputList.value);
  console.log(intputCaseList.length, "<--->", outputCaseList.length);
  const caseListLen = intputCaseList.length;
  // 构建输入用例对象
  for (let i = 0; i < caseListLen; i++) {
    form.value.judgeCase.push({
      input: intputCaseList[i],
      output: outputCaseList[i],
    });
  }
  console.log("form = ", form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
      router.push({
        path: "/questions",
        replace: true, //不会占用浏览器历史页面的堆栈,直接替换当前的登录页
      });
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

const inputCaseOnChange = (fileList) => {
  inputList.value = fileList;
};

const outputCaseOnChange = (fileList) => {
  outputList.value = fileList;
};
/**
 * 将文件列表中的内容读取出来
 */
const fileList2stringList = async (fileList: any[]): Promise<string[]> => {
  let ans: string[] = [];
  for (const fileItem of fileList) {
    let file: File = fileItem.file;
    // 读取文件
    const fileContent = await readTextFile(file);
    ans.push(fileContent);
  }
  return ans;
};

const readTextFile = async (file: File) => {
  const reader = new FileReader();
  reader.readAsText(file, "utf8");
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });
};

const inputCancelUpload = () => {
  inputList.value = [];
};

const outputCancelUpload = () => {
  outputList.value = [];
};
</script>

<style scoped>
#addQuestionView {
}
</style>
