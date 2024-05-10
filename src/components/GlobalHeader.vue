<template>
  <a-row
    id="globalHeader"
    style="margin-bottom: 16px"
    align="center"
    :wrap="false"
  >
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.jpg" />
            <div class="title">OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div v-if="store.state.user?.loginUser?.userName">
        <a-popover title="">
          <a-button>{{ store.state.user?.loginUser?.userName }}</a-button>
          <template #content>
            <a-button status="danger" @click="logoutClick">注销</a-button>
          </template>
        </a-popover>
      </div>
      <div v-else>
        <a-popover title="">
          <a-button>未登录</a-button>
          <template #content>
            <a-button type="primary" @click="loginClick">登录</a-button>
            <a-button type="primary" @click="registerClick">注册</a-button>
          </template>
        </a-popover>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

import { UserControllerService } from "../../generated/user";

const loginClick = async () => {
  router.push({
      path: "/user/login",
      replace: false, 
    });
};

const registerClick = async () => {
  router.push({
      path: "/user/register",
      replace: false, 
    });
};

const logoutClick = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if(res.code == 0){
    // 注销成功,跳转到主页
    await store.dispatch("user/logoutUser");
    router.push({
      path: "/",
      replace: true, //不会占用浏览器历史页面的堆栈,直接替换当前的登录页
    });
  } else {
    message.error("注销失败，" + res.message);
  }
};
const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // todo 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后,更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
