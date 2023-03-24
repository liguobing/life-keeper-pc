<template>
  <div id="dlXmWD">
    <div id="plan-content-box">
      <!-- topbar -->
      <div id="top-bar-box">
        <div id="week-box">
          <div v-for="item in weeks" :key="item" class="week-item">
            {{ item }}
          </div>
        </div>
      </div>
      <div id="day-box">
        <i class="el-icon-arrow-left date-control" @click="lastMonth"></i>
        <!-- 日期表格 -->
        <div id="plan-table">
          <div v-for="(item, index) in planForDays" :key="index" class="table-item" @click="dayOnClick(index)">
            <a class="table-item-content-year-month" v-if="getDay(item.date) > 0">{{ year }}-{{ month }}</a>
            <a class="table-item-content-day">{{ getDay(item.date) }}</a>
            <a class="table-item-content-plan-count" v-show="item.plans.length > 0"></a>
          </div>
        </div>
        <i class="el-icon-arrow-right date-control" @click="nextMonth"></i>
      </div>
      <!-- 当天计划抽屉菜单 -->
      <el-drawer :title="planDrawerTitle" :visible.sync="planDrawerOpen" :direction="direction"
        :before-close="handleClose" size="50%" @close="planListDrawerClose">
        <div id="plan-list">
          <div v-for="(item, index) in plansForDay" :key="index" class="plan-item" @click="planClick(item)">
            <img class="alarm" v-if="item.alarmTime < 0" src="../../assets/images/unalarm.png"
              @click="alarmClick(item.objectId)" />
            <img class="alarm" v-else :src="alarmIcon(item.alarmTime)" />
            <div id="name-time-box">
              <a>{{ item.planName }}</a>
              <a>{{ formartShortStartTime(item.startTime) }}</a>
            </div>
            <i v-if="item.isFinished > 0" class="iconfont icon-wancheng-copy" style="color: green;"></i>
          </div>
        </div>
      </el-drawer>
      <!-- 计划详情展示 Dialog -->
      <el-dialog title="计划展示" :visible.sync="planDialogVisible" width="30%" :before-close="dialogClose"
        :close-on-press-escape="true" :close-on-click-modal="true">
        <div class="visible-plan-box">
          <a class="visible-plan-title">计划名称:</a>
          <a class="visible-plan-content">{{ visiblePlan.planName }}</a>
        </div>
        <div class="visible-plan-box">
          <a class="visible-plan-title">执行时间:</a>
          <a class="visible-plan-content">{{ formartFullStartTime(visiblePlan.startTime) }}</a>
        </div>
        <div class="visible-plan-box">
          <a class="visible-plan-title">完成时间:</a>
          <a class="visible-plan-content" v-if="visiblePlan.isFinished > 0">{{
            formartFullStartTime(visiblePlan.finishTime)
          }}</a>
          <a class="visible-plan-content" v-else>未完成</a>
        </div>
        <div class="visible-plan-box">
          <a class="visible-plan-title">提醒时间:</a>
          <a class="visible-plan-content">{{ getAlarmTile(visiblePlan.alarmTime) }}</a>
        </div>
        <div class="visible-plan-box">
          <a class="visible-plan-title">重复计划:</a>
          <a class="visible-plan-content">{{ getRepeatMode(visiblePlan.repeatMode) }}</a>
        </div>
        <div class="visible-plan-box" v-if="visiblePlan.repeatMode > 1">
          <a class="visible-plan-title">重复次数:</a>
          <a class="visible-plan-content">{{ visiblePlan.repeatIndex }}/{{ visiblePlan.repeatCount }}</a>
        </div>
        <div class="visible-plan-box">
          <a class="visible-plan-title">计划描述:</a>
          <a class="visible-plan-content">{{ visiblePlan.planDescription }}</a>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="visiblePlan.isFinished > 0" type="warning" icon="el-icon-back" circle
            @click="unFinishPlan(visiblePlan)"></el-button>
          <el-button v-else type="success" icon="el-icon-check" circle @click="finishPlan(visiblePlan)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deletePlan(visiblePlan)"></el-button>
        </span>
      </el-dialog>
      <!-- 添加计划 -->
      <i class="el-icon-circle-plus-outline add-plan" @click="navToAddNewPlan" />
      <!-- 提醒列表 -->
      <i class="el-icon-alarm-clock show-notification" @click="navToPlanNotificationList" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"

import alarm from '../../assets/images/alarm.png'
import alarm5 from '../../assets/images/alarm_5.png'
import alarm10 from '../../assets/images/alarm_10.png'
import alarm15 from '../../assets/images/alarm_15.png'
import alarm30 from '../../assets/images/alarm_30.png'
import alarm60 from '../../assets/images/alarm_60.png'


Vue.use(ElementUI);
Vue.prototype.axios = axios;

export default {
  data() {
    return {
      planDialogVisible: false,
      token: "",
      year: 0,
      month: 0,
      planForDays: [
      ],
      weeks: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      planDrawerOpen: false,
      direction: 'btt',
      plansForDay: [],
      planDrawerTitle: "",
      visiblePlan: {},
    }
  },
  methods: {
    navToAddNewPlan() {
      this.$router.push({ name: "addPlan" })
    },
    navToPlanNotificationList() {
      this.$router.push({ name: "planNotification" });
    },
    repeatModeDrawerClose() {
      this.repeatModeDrawerOpen = false;
    },
    handleClose() {
      this.planDrawerOpen = false;
    },
    dialogClose() {
      this.planDialogVisible = false
    },
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
    requestPlans() {
      this.planForDays = [];
      var weekIndex = this.getMonthStartDay(this.year, this.month);
      for (var i = 0; i < weekIndex; i++) {
        var obj = {
          date: "",
          plans: []
        }
        this.planForDays.push(obj);
      }

      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/GetPlansForMonth?year=" + this.year + "&month=" + this.month, {
        headers: {
          'Token': this.token,
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            result.data.resultObject.forEach(element => {
              this.planForDays.push(element);
            });

            if (this.planForDays.length % 7 != 0) {
              var count = 7 - (this.planForDays.length % 7);
              for (var i = 0; i < count; i++) {
                var obj = {
                  date: "",
                  plans: []
                }
                this.planForDays.push(obj);
              }
            }

          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    dayOnClick(index) {
      if (this.planForDays[index].plans.length > 0) {
        var items = document.getElementsByClassName("table-item");
        for (var i = 0; i < items.length; i++) {
          if (index === i) {
            items[i].classList.add("click");
            this.planDrawerOpen = true;
            this.planDrawerTitle = this.planForDays[index].date
            this.plansForDay = this.planForDays[index].plans
          } else {
            items[i].classList.remove("click");
          }
        }
      }
    },
    getMonthStartDay(year, month,) {
      var date = new Date(year + "-" + month + "-" + 1);
      return date.getDay();
    },
    getDay(time) {
      if (time.length > 0) {
        return time.split("-")[2];
      }
    },
    formartShortStartTime(time) {
      var date = new Date(time);
      var H = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      return (H < 10 ? ('0' + H) : H) + ":" + (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s);
    },
    formartFullStartTime(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var M = date.getMonth() + 1;
      var d = date.getDate();
      var H = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      return y + '-' + (M < 10 ? ('0' + M) : M) + '-' + (d < 10 ? ('0' + d) : d) + " " + (H < 10 ? ('0' + H) : H) + ":" + (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s);
    },
    getAlarmTile(alarm) {
      switch (alarm) {
        case -1:
          return "不提醒";
        case 0:
          return "计划开始时提醒";
        case 5:
          return "计划开始前 5 分钟提醒";
        case 10:
          return "计划开始前 10 分钟提醒";
        case 15:
          return "计划开始前 15 分钟提醒";
        case 30:
          return "计划开始前半小时提醒";
        case 60:
          return "计划开始前 1 小时提醒";
      }
    },
    getRepeatMode(repeatMode) {
      switch (repeatMode) {
        case 1:
          return "一次性活动";
        case 2:
          return "每天提醒";
        case 3:
          return "每周提醒";
        case 4:
          return "每月提醒";
        case 5:
          return "每年提醒";
      }
    },
    planListDrawerClose() {
      var items = document.getElementsByClassName("click");
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("click");
      }
    },
    alarmIcon(alarmTime) {
      switch (alarmTime) {
        case 0:
          return alarm
        case 5:
          return alarm5
        case 10:
          return alarm10
        case 15:
          return alarm15
        case 30:
          return alarm30
        case 60:
          return alarm60
      }
    },
    planClick(item) {
      console.log(item);
      this.visiblePlan = item;
      this.planDialogVisible = true;
    },
    deletePlan(plan) {
      this.planDialogVisible = false;
      if (plan.groupId === null) {
        this.$confirm('确定删除该计划吗？', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showLoading();
          this.planDrawerOpen = false;
          axios.get("https://www.li-xyz.com/LifeKeeper/DeleteSinglePlan?objectId=" + plan.objectId, {
            headers: {
              'Token': this.token,
            }
          }).then((result) => {
            this.hideLoading();
            if (result.status == 200) {
              if (result.data.result) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.requestPlans();
              } else {
                this.$message.error('出错啦，请检查后重试');
              }
            } else {
              this.$message.error('出错啦，请检查后重试');
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.showLoading();
        this.planDrawerOpen = false;
        this.$confirm('是删除整组计划？还是只删除当次计划？', '注意', {
          confirmButtonText: '删除单个',
          cancelButtonText: '删除整组',
          type: 'warning',
          showClose: false
        }).then(() => {
          axios.get("https://www.li-xyz.com/LifeKeeper/DeleteSinglePlan?objectId=" + plan.objectId, {
            headers: {
              'Token': this.token,
            }
          }).then((result) => {
            this.hideLoading();
            if (result.status == 200) {
              if (result.data.result) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.requestPlans();
              } else {
                this.$message.error('出错啦，请检查后重试');
              }
            } else {
              this.$message.error('出错啦，请检查后重试');
            }
          })
        }).catch(() => {
          axios.get("https://www.li-xyz.com/LifeKeeper/DeleteGroupPlans?objectId=1&groupId=" + plan.groupId, {
            headers: {
              'Token': this.token,
            }
          }).then((result) => {
            this.hideLoading();
            if (result.status == 200) {
              if (result.data.result) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.requestPlans();
              } else {
                this.$message.error('出错啦，请检查后重试');
              }
            } else {
              this.$message.error('出错啦，请检查后重试');
            }
          })
        });
      }
    },
    finishPlan(plan) {
      this.planDialogVisible = false;
      this.$confirm('确定该计划完成了吗？', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading();
        this.planDrawerOpen = false;
        axios.get("https://www.li-xyz.com/LifeKeeper/FinishPlan?objectId=" + plan.objectId, {
          headers: {
            'Token': this.token,
          }
        }).then((result) => {
          this.hideLoading();
          if (result.status == 200) {
            if (result.data.result) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.requestPlans();
            } else {
              this.$message.error('出错啦，请检查后重试');
            }
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    unFinishPlan(plan) {
      this.planDialogVisible = false;
      this.$confirm('确定恢复未完成状态吗？', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading();
        this.planDrawerOpen = false;
        axios.get("https://www.li-xyz.com/LifeKeeper/BackoutFinishedPlan?objectId=" + plan.objectId, {
          headers: {
            'Token': this.token,
          }
        }).then((result) => {
          this.hideLoading();
          if (result.status == 200) {
            if (result.data.result) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.requestPlans();
            } else {
              this.$message.error('出错啦，请检查后重试');
            }
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    lastMonth() {
      this.month = this.month - 1;
      if (this.month == 0) {
        this.month = 12;
        this.year = this.year - 1;
      }
      this.requestPlans();
    },
    nextMonth() {
      this.month = this.month + 1;
      if (this.month == 13) {
        this.month = 1;
        this.year = this.year + 1;
      }
      this.requestPlans();
    },
  },
  watch: {
  },
  mounted() {
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.token = sessionStorage.getItem("UserId");
    this.requestPlans();
  }
}
</script>

<style>
#dlXmWD #plan-content-box {
  width: 80vw;
  background: #e9ecef;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

#dlXmWD .show-notification {
  font-size: 3vw;
  position: fixed;
  bottom: calc(40px + 3vw);
  right: 30px;
  color: #E6A23C;
  border-radius: 50%;
}

#dlXmWD .add-plan {
  font-size: 3vw;
  position: fixed;
  bottom: 30px;
  right: 30px;
  color: #67C23A;
}

#dlXmWD .visible-plan-box {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#dlXmWD .visible-plan-title {
  width: 30%;
}

#dlXmWD .visible-plan-content {
  flex-grow: 1;
}

#dlXmWD {
  width: 100vw;
  height: 100vh;
  background: #e9ecef;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

#dlXmWD #top-bar-box {
  width: 80vw;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

#dlXmWD #week-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 56vw;
}

#dlXmWD .week-item {
  width: calc(8vw - 30px);
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 15px;
  background: #e9ecef;
  color: #333;
  border-radius: 30px;
  box-shadow:
    7px 7px 12px rgba(0, 0, 0, .4),
    -7px -7px 12px rgba(255, 255, 255, .9);
}

#dlXmWD #plan-table {
  width: 56vw;
  height: 100%;
  background: #e9ecef;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: center; */
  align-items: center;
}

#dlXmWD #day-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#dlXmWD .date-control {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-shadow:
    1px 1px 1px #000,
    -1px -1px 1px #fff;
}

#dlXmWD .table-item {
  width: calc(8vw - 30px);
  height: calc(8vw - 30px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 15px;
  background: #e9ecef;
  color: #333;
  border-radius: 30px;
  box-shadow:
    7px 7px 12px rgba(0, 0, 0, .4),
    -7px -7px 12px rgba(255, 255, 255, .9);
}

#dlXmWD .table-item.click {
  box-shadow:
    inset -7px -7px 12px rgba(255, 255, 255, .9),
    inset 7px 7px 12px rgba(0, 0, 0, .4);
}

#dlXmWD .table-item-content-year-month {
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #e9ecef;
  text-shadow:
    1px 1px 1px #000,
    -1px -1px 1px #fff;
}

#dlXmWD .table-item-content-day {
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: #e9ecef;
  text-shadow:
    1px 1px 1px #000,
    -1px -1px 1px #fff;
}

#dlXmWD .table-item-content-plan-count {
  background-color: #F56C6C;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

#dlXmWD #plan-list {
  width: 80vw;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
}

#dlXmWD .plan-item {
  width: 10vw;
  height: 50px;
  margin: 5px;
  box-shadow:
    7px 7px 12px rgba(0, 0, 0, .4),
    -7px -7px 12px rgba(255, 255, 255, .9);
  border-radius: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}

#dlXmWD #name-time-box {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}


@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/c/font_2994771_jy0n9jeoe8p.woff2?t=1675868201647') format('woff2'),
    url('//at.alicdn.com/t/c/font_2994771_jy0n9jeoe8p.woff?t=1675868201647') format('woff'),
    url('//at.alicdn.com/t/c/font_2994771_jy0n9jeoe8p.ttf?t=1675868201647') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-wancheng-copy:before {
  content: "\e62f";
}
</style>
