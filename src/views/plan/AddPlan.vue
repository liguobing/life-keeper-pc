<template>
  <div id="UuAWfm">
    <div id="add-plan-content-box">
      <a id="title">添加计划</a>
      <!-- 计划标题 -->
      <el-input v-model="newPlanObj.planName" placeholder="请输入计划标题" clearable></el-input>
      <el-divider></el-divider>
      <!-- 是否是全天计划 -->
      <div style="width:100%;display: flex;flex-direction: row;align-items: center;">
        全天计划:
        <div style="flex-grow:1"></div>
        <el-switch v-model="isAllDaySwitchValue" active-color="#13ce66" inactive-color="#C5C6B6" @change="allDayChange">
        </el-switch>
      </div>
      <el-divider></el-divider>
      <!-- 计划开始时间 -->
      <div style="width:100%;display: flex;flex-direction: row;align-items: center;">
        开始时间:开启之后，默认从开始时间到 22:00 每小时提醒一次
        <div style="flex-grow:1"></div>
        <el-date-picker v-model="newPlanObj.startTime" type="datetime" placeholder="选择日期时间" default-time="12:00:00"
          @change="startTimeValueChange">
        </el-date-picker>
      </div>
      <el-divider></el-divider>
      <!-- 是否重复 -->
      <div style="width:100%;display: flex;flex-direction: row;align-items: center;">
        是否重复:
        <div style="flex-grow:1"></div>
        <a @click="repeatModeDrawerOpen = true">{{ repeatModeName }}</a>
      </div>
      <el-divider v-if="newPlanObj.repeatType > 1"></el-divider>
      <!-- 重复结束模式 -->
      <div style="width:100%;display: flex;flex-direction: row;align-items: center;" v-if="newPlanObj.repeatType > 1">
        重复模式:
        <div style="flex-grow:1"></div>
        <a @click="endRepeatModeDrawerOpen = true">{{ endRepeatModeTypeName }}</a>
      </div>
      <el-divider v-if="newPlanObj.repeatType > 1"></el-divider>
      <!-- 重复结束值 -->
      <div style="width:100%;display: flex;flex-direction: row;align-items: center;" v-if="newPlanObj.repeatType > 1">
        结束模式:
        <div style="flex-grow:1"></div>
        <a>{{ endRepeatModeValueName }}</a>
        <!-- 结束时间 -->
        <el-date-picker v-model="endRepeatTimeValue" type="datetime" placeholder="选择结束日期时间"
          @change="endRepeatTimeValueChange" v-if="newPlanObj.endRepeatType === 1">
        </el-date-picker>
        <!-- 计数器 -->
        <el-input-number v-model="endRepeatCountValue" @change="endRepeatCountChange" :min="1" label="描述文字"
          v-if="newPlanObj.endRepeatType === 2"></el-input-number>
      </div>
      <el-divider></el-divider>
      <!-- 计划提醒 -->
      <div style="width:100%;display: flex;flex-direction: row;align-items: center;">
        是否提醒:
        <div style="flex-grow:1"></div>
        <a @click="alarmDrawerOpen = true">{{ alarmName }}</a>
      </div>
      <el-divider></el-divider>
      <!-- 计划描述 -->
      <div style="width:100%;display: flex;flex-direction: row;align-items: center;">
        <div style="flex-grow:1"></div>
        <el-input type="textarea" :rows="2" placeholder="请输入计划描述" v-model="newPlanObj.planDescription">
        </el-input>
      </div>
      <el-divider></el-divider>

      <!-- 保存按钮 -->
      <div id="save-plan" @click="savePlan">
        <i class="iconfont icon-hold" style="font-size:30px"></i>
      </div>
      <!-- 重复模式抽屉 -->
      <el-drawer title="重复模式" :visible.sync="repeatModeDrawerOpen" direction="rtl"
        :before-close="repeatModeDrawerClose">
        <div id="repeatModeBox">
          <a class="repeatModeItem" v-for="(item, index) in repeatMode" :key="index" @click="repeatModeClick(item)">
            {{ item.name }}</a>
        </div>
      </el-drawer>
      <!-- 结束重复模式抽屉 -->
      <el-drawer title="重复结束模式" :visible.sync="endRepeatModeDrawerOpen" direction="rtl"
        :before-close="endRepeatModeDrawerClose">
        <div id="repeatModeBox">
          <a class="repeatModeItem" v-for="(item, index) in endRepeatMode" :key="index"
            @click="endRepeatModeClick(item)">
            {{ item.name }}
          </a>
        </div>
      </el-drawer>
      <!-- 计划提醒抽屉 -->
      <el-drawer title="计划提醒" :visible.sync="alarmDrawerOpen" direction="rtl" :before-close="alarmDrawerClose">
        <div id="repeatModeBox">
          <a class="repeatModeItem" v-for="(item, index) in alarms" :key="index" @click="alarmClick(item)">
            {{ item.name }}
          </a>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import { v4 as uuidv4 } from 'uuid'

Vue.use(ElementUI);
Vue.prototype.axios = axios;

export default {
  data() {
    return {
      weeks: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      token: "",
      repeatModeName: "一次性活动",
      endRepeatModeTypeName: "次数",
      endRepeatModeValueName: "重复次数:",
      endRepeatTimeValue: "",
      endRepeatCountValue: 10,
      newPlanObj: {
        objectId: "",
        ruleId: "",
        isAllDay: -1,
        planName: "",
        planDescription: "",
        planLocation: "",
        planUser: "",
        startTime: 0,
        alarmTime: 0,
        repeatType: 1,
        endRepeatType: 2,
        endRepeatValue: 10,
        createTime: 0,
        updateTime: 0,
      },
      isAllDaySwitchValue: false,
      repeatModeDrawerOpen: false,
      repeatMode: [],
      endRepeatModeDrawerOpen: false,
      endRepeatMode: [{
        value: 1,
        name: "时间"
      }, {
        value: 2,
        name: "次数"
      }],
      alarmDrawerOpen: false,
      alarms: [
        { value: -1, name: "不提醒" },
        { value: 0, name: "计划开始时提醒" },
        { value: 5, name: "开始前 5 分钟提醒" },
        { value: 10, name: "开始前 10 分钟提醒" },
        { value: 15, name: "开始前 15 分钟提醒" },
        { value: 30, name: "开始前 30 分钟提醒" },
        { value: 60, name: "开始前 1 小时提醒" }
      ],
      alarmName: "计划开始时提醒"
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
    savePlan() {
      if (this.newPlanObj.endRepeatType == 1 && this.newPlanObj.startTime > this.newPlanObj.endRepeatValue) {
        this.$message.error('结束时间不能早于开始时间');
        return;
      }
      if (this.newPlanObj.planName.trim().length === 0) {
        this.$message.error('任务标题不能为空');
        return;
      }
      if (this.newPlanObj.isAllDay > 0) {
        var date = new Date(this.newPlanObj.startTime);
        if (date.getHours() * 3600000 + date.getMinutes() * 60000 > 36000000) {
          this.$message.error('晚上 10 点之后无法创建全天任务');
          return;
        }
      }
      if (this.newPlanObj.startTime === 0) {
        this.$message.error('开始时间还没有设置');
        return;
      }

      this.showLoading();
      this.newPlanObj.objectId = uuidv4();
      this.newPlanObj.ruleId = uuidv4();
      this.newPlanObj.planUser = this.token;
      this.newPlanObj.createTime = new Date().getTime();

      axios.post('https://www.li-xyz.com/LifeKeeper/AddPlan', this.newPlanObj, {
        headers: {
          'Token': this.token,
        }
      }).then((res) => {
        this.hideLoading();
        if (res.status == 200) {
          if (res.data.result) {
            this.$confirm('计划添加成功', '提示', {
              confirmButtonText: '再添加一条',
              cancelButtonText: '返回计划列表',
              type: 'success'
            }).then(() => {
              this.newPlanObj = {
                objectId: "",
                ruleId: "",
                isAllDay: -1,
                planName: "",
                planDescription: "",
                planLocation: "",
                planUser: "",
                startTime: 0,
                alarmTime: 0,
                repeatType: 1,
                endRepeatType: 2,
                endRepeatValue: 10,
                createTime: 0,
                updateTime: 0,
              };
            }).catch(() => {
              this.$router.go(-1);
            });
          } else {
            this.$message.error(res.data.exceptionMessage + ',请检查后重试');
          }
        } else {
          this.$message.error('保存失败,请检查后重试');
        }
      }).catch(function (error) {
        console.log(error);
        this.$message.error('保存失败,请检查后重试,' + error);
      });
    },
    startTimeValueChange(time) {
      this.newPlanObj.startTime = new Date(time).getTime();
    },
    alarmClick(item) {
      this.alarmDrawerOpen = false;
      this.newPlanObj.alarmTime = item.value;
      this.alarmName = item.name;
    },
    endRepeatTimeValueChange(date) {
      this.newPlanObj.endRepeatValue = new Date(date).getTime();
    },
    endRepeatCountChange(count) {
      this.newPlanObj.endRepeatValue = count;
    },
    repeatModeDrawerClose() {
      this.repeatModeDrawerOpen = false;
    },
    endRepeatModeDrawerClose() {
      this.endRepeatModeDrawerOpen = false;
    },
    alarmDrawerClose() {
      this.alarmDrawerOpen = false;
    },
    repeatModeClick(item) {
      this.repeatModeDrawerOpen = false;
      this.newPlanObj.repeatType = item.value;
      this.repeatModeName = item.name;
    },
    endRepeatModeClick(item) {
      this.endRepeatModeDrawerOpen = false;
      this.newPlanObj.endRepeatType = item.value;
      this.endRepeatModeTypeName = item.name;
      if (item.value === 1) {//时间
        this.newPlanObj.endRepeatValue = 0;
        this.endRepeatModeValueName = "结束时间:";
      } else {//次数
        this.newPlanObj.endRepeatValue = 10;
        this.endRepeatModeValueName = "重复次数:";
      }
    },
    getWeekIndex(year, month, day) {
      var date = new Date(year + "-" + month + "-" + day);
      return date.getDay();
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
    getTime(time) {
      var date = new Date(time);
      var H = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      return (H < 10 ? ('0' + H) : H) + ":" + (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s);
    },
    resetRepeatMode() {
      var once = {
        value: 1,
        name: "一次性活动"
      }
      this.repeatMode.push(once);
      var day = {
        value: 2,
        name: "每天提醒"
      }
      this.repeatMode.push(day);

      var date = new Date(this.newPlanObj.startTime);
      var y = date.getFullYear();
      var M = date.getMonth() + 1;
      var d = date.getDate();
      var week = {
        value: 3,
        name: "每周的" + this.weeks[this.getWeekIndex(y, M, d)] + "提醒"
      }
      this.repeatMode.push(week);

      var month = {
        value: 4,
        name: "每月的" + d + "号提醒"
      }
      this.repeatMode.push(month);

      var month = {
        value: 5,
        name: "每年的" + M + "月" + d + "日提醒"
      }
      this.repeatMode.push(month);



    },
    allDayChange(value) {
      if (value) {
        this.newPlanObj.isAllDay = 1;
      } else {
        this.newPlanObj.isAllDay = -1;
      }
    }
  },
  watch: {
  },
  mounted() {
    this.token = sessionStorage.getItem("UserId");
    this.newPlanObj.startTime = new Date().getTime();
    this.resetRepeatMode();
  }
}
</script>

<style>
#UuAWfm {
  background: white;
}

#UuAWfm #add-plan-content-box {
  width: 60vw;
  height: 100vh;
  margin: auto;
  background: #e9ecef;
  box-shadow:
    7px 7px 12px rgba(0, 0, 0, .4),
    -7px -7px 12px rgba(255, 255, 255, .9);
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}

#UuAWfm #title {
  font-size: 50px;
  text-shadow:
    1px 1px 1px #000,
    -1px -1px 1px #fff;
  margin-bottom: 10px;
  margin-top: 10px;
}

#UuAWfm #save-plan {
  width: 100px;
  height: 100px;
  background-color: greenyellow;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#UuAWfm #repeatModeBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#UuAWfm .repeatModeItem {
  margin-top: 10px;
  margin-bottom: 10px;
}

@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/c/font_2994771_hbc9yn3pr9n.woff2?t=1676013542829') format('woff2'),
    url('//at.alicdn.com/t/c/font_2994771_hbc9yn3pr9n.woff?t=1676013542829') format('woff'),
    url('//at.alicdn.com/t/c/font_2994771_hbc9yn3pr9n.ttf?t=1676013542829') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-hold:before {
  content: "\e700";
}
</style>
