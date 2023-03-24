<template>
  <div id="GGQbNF">
    <div id="plan-notification-content-box">
      <a id="title">提醒列表</a>
      <el-table :data="notifications" id="table" :fit=true>
        <el-table-column prop="planName" label="计划名称" min-width="33%">
        </el-table-column>
        <el-table-column prop="time" label="执行时间" min-width="33%">
        </el-table-column>
        <el-table-column prop="formatTime" label="格式化后执行时间" min-width="34%">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"

Vue.use(ElementUI);
Vue.prototype.axios = axios;

export default {
  data() {
    return {
      token: "",
      notifications: [],
    }
  },
  methods: {
    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    hideLoading() {
      this.loading.close();
    },
    requestNotification() {
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/GetAllNotification", {
        headers: {
          'Token': this.token,
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            this.notifications = result.data.resultObject;
            console.log(this.notifications[0]);
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    }
  },
  watch: {
  },
  mounted() {
    this.token = sessionStorage.getItem("UserId");
    this.requestNotification();
  }
}
</script>

<style scoped>
#GGQbNF {
  width: 100%;
  background-color: #e9ecef;
}

#GGQbNF #plan-notification-content-box {
  width: 80vw;
  height: 100vh;
  margin: auto;
  background-color: #e9ecef;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#GGQbNF #title {
  font-size: 50px;
  text-shadow: 1px 1px 1px #000,
    -1px -1px 1px #fff;
}

#GGQbNF #table {
  width: 100%;
  height: 100%;
  margin: 20px;
  background-color: white;
}
</style>
