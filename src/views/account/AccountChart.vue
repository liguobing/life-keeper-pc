<template>
  <div id="ZaPYVk">
    <div class="bill_chart_top_bar">
      <div class="menu-icon-box">
        <i class="el-icon-menu" @click="drawer = true"></i>
      </div>
      <div class="selector-box">
        <el-select class="account-selector" v-model="value" multiple filterable allow-create default-first-option
          placeholder="全部家庭账户">
          <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="date-box">
        <el-row class="date-buttons-box">
          <el-button class="time-button selected" @click="timeButtonClick(0)">当天</el-button>
          <el-button class="time-button" @click="timeButtonClick(1)">本周</el-button>
          <el-button class="time-button" @click="timeButtonClick(2)">本月</el-button>
          <el-button class="time-button" @click="timeButtonClick(3)">三个月</el-button>
        </el-row>
        <div id="date-picker-box">
          <el-date-picker class="date-picker" v-model="datePickerValue" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
    </div>
    <!-- 仪表盘 -->
    <ChartDashboard :update="chartUpdate" :percent="percent" style="margin-top:10px"></ChartDashboard>
    <!-- 饼状图 -->
    <div class="pie-chart-box">
      <ChartPie :update="chartUpdate" title=收入分类比例图 :key="1" :id="incomeId" :idStr="incomeId"
        :categoryData="incomeCategoryData">
      </ChartPie>
      <ChartPie :update="chartUpdate" title=支出分类比例图 :key="2" :id="expendId" :idStr="expendId"
        :categoryData="expendCategoryData">
      </ChartPie>
    </div>
    <!-- 柱状图 -->
    <div class="histogram-chart-box">
      <ChartHistogram :update="chartUpdate" :days="histogramDays" :incomes="histogramIncomes"
        :expends="histogramExpends">
      </ChartHistogram>
    </div>
    <!-- 抽屉菜单 -->
    <el-drawer size="10%" title="账本菜单" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <div class="menu-box">
        <el-divider class="menu-divider"></el-divider>
        <div class="menu-item" @click="navToBillList">
          明细
        </div>
        <el-divider class="menu-divider"></el-divider>
        <div class="menu-item" @click="navToBillChart">
          图表
        </div>
        <el-divider class="menu-divider"></el-divider>
        <el-collapse accordion class="menu-item-setting">
          <el-collapse-item>
            <template slot="title">
              <div
                style="width: 100%;background-color:white;font-size: 20px;display: flex;flex-direction: row;justify-content: center;align-items: center;">
                设置
              </div>
            </template>
            <div class="menu-item" @click="navToBillCategory">
              账单分类设置</div>
            <div class="menu-item" @click="navToBillAccount">
              消费账户设置</div>
            <div class="menu-item" @click="navToBillShop">
              常用商家设置</div>
          </el-collapse-item>
        </el-collapse>
        <el-divider class="menu-divider"></el-divider>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import ChartDashboard from '../../components/account/chart-dashboard.vue'
import ChartPie from '../../components/account/chart-pie.vue'
import ChartHistogram from '../../components/account/chart-histogram.vue'

Vue.use(ElementUI);
Vue.component('ChartDashboard', ChartDashboard)
Vue.component('ChartPie', ChartPie)
Vue.component('ChartHistogram', ChartHistogram)
Vue.prototype.axios = axios;
Vue.prototype.$moment = moment;

export default {
  data() {
    return {
      drawer: false,
      direction: 'ltr',
      chartUpdate: 0,
      token: "",
      // 账户选择
      accountOptions: [{
        value: '1',
        label: '爸爸'
      }, {
        value: '2',
        label: '妈妈'
      }, {
        value: '3',
        label: '宝宝'
      }],
      value: [],
      //日期选择
      datePickerValue: [],
      percent: 0,
      incomeId: "incomeId",
      expendId: "expendId",
      incomeCategoryData: [],
      expendCategoryData: [],
      histogramDays: [],
      histogramIncomes: [],
      histogramExpends: [],
      startTime: 0,
      endTime: 0
    }
  },
  methods: {
    dateChange(time) {
      var buttons = document.getElementsByClassName("time-button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
      }
      this.startTime = Date.parse(time[0]);
      this.endTime = Date.parse(time[1]);
      this.requestChartData();
    },
    timeButtonClick(index) {
      var buttons = document.getElementsByClassName("time-button");
      for (var i = 0; i < buttons.length; i++) {
        if (index === i) {
          buttons[i].classList.add("selected");
        } else {
          buttons[i].classList.remove("selected");
        }
      }
      switch (index) {
        case 0:
          var date = new Date();
          this.startTime = moment(date).startOf('day').valueOf();
          break;
        case 1:
          var date = new Date();
          this.startTime = moment(date).startOf('week').valueOf();
          break;
        case 2:
          var date = new Date();
          this.startTime = moment(date).startOf('month').valueOf();
          break;
        case 3:
          var date = new Date();
          this.startTime = moment(date).subtract(3, 'months').startOf('month').valueOf();
          break;
      }
      this.endTime = new Date().getTime();
      this.datePickerValue = [this.startTime, this.endTime]
      this.requestChartData();
    },
    handleClose(done) {
      done();
    },
    navToBillList: function () {
      this.$router.push({ name: "billList" })
    },
    navToBillChart: function () {
      this.$router.push({ name: "billChart" })
    },
    navToBillCategory: function () {
      this.$router.push({ name: "billCategory" })
    },
    navToBillAccount: function () {
      this.$router.push({ name: "billAccount" })
    },
    navToBillShop: function () {
      this.$router.push({ name: "billShop" })
    },
    requestChartData() {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中，请耐心等候',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.get("https://www.li-xyz.com/LifeKeeper/GetBillChartData?start=" + this.startTime + "&end=" + this.endTime, {
        headers: {
          'Token': this.token
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            // 仪表盘
            this.income = result.data.resultObject.income
            this.expend = result.data.resultObject.expend
            this.percent = parseFloat(((this.expend / this.income) * 100).toFixed(2));
            // 饼状图
            this.incomeCategoryData = [];
            for (let i = 0; i < result.data.resultObject.incomeCategoryData.length; i++) {
              let obj = {};
              obj.value = result.data.resultObject.incomeCategoryData[i].moneyCount;
              obj.name = result.data.resultObject.incomeCategoryData[i].billCategory;
              this.incomeCategoryData.push(obj);
            }
            this.expendCategoryData = [];
            for (let i = 0; i < result.data.resultObject.expendCategoryData.length; i++) {
              let obj = {};
              obj.value = result.data.resultObject.expendCategoryData[i].moneyCount;
              obj.name = result.data.resultObject.expendCategoryData[i].billCategory;
              this.expendCategoryData.push(obj);
            }

            // 柱状图
            this.histogramDays = [];
            this.histogramIncomes = [];
            this.histogramExpends = [];
            for (let i = 0; i < result.data.resultObject.billMoneyCountForDays.length; i++) {
              this.histogramDays.push(result.data.resultObject.billMoneyCountForDays[i].date);
              this.histogramIncomes.push(result.data.resultObject.billMoneyCountForDays[i].income)
              this.histogramExpends.push(result.data.resultObject.billMoneyCountForDays[i].expend)
            }
            this.chartUpdate = new Date().getTime();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
        loading.close();
      })
    }
  },
  watch: {
  },
  mounted() {
    let storage = window.sessionStorage;
    this.token = storage.getItem("UserId");
    var date = new Date();
    this.startTime = moment(date).startOf('day').valueOf();
    this.endTime = moment(date).endOf('day').valueOf();
    this.datePickerValue = [this.startTime, this.endTime]
    this.requestChartData();
  }
}
</script>

<style>
#ZaPYVk .el-range-editor.el-input__inner {
  display: flex;
  flex-direction: row;
}

#ZaPYVk .time-button.selected {
  background-color: #1477FE;
  color: white;
}

#ZaPYVk {
  width: 80vw;
  margin: auto;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#ZaPYVk .bill_chart_top_bar {
  width: 100%;
  border-radius: 10px;
  background-color: #77bfa3;
  box-shadow: 5px 5px 5px #888888;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#ZaPYVk .menu-icon-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-start;
  font-size: 30px
}

#ZaPYVk .account-selector {
  width: 100%;
  cursor: pointer;
}

#ZaPYVk .el-icon-menu {
  color: white;
  margin-left: 30px;
}

#ZaPYVk .selector-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#ZaPYVk .date-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#ZaPYVk .date-buttons-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 0px !important;
  cursor: pointer;
}

#ZaPYVk .time-button {
  margin-left: 0px !important;
}

#ZaPYVk .time-button.selected {
  background-color: #1477FE;
  color: white;
}

#ZaPYVk .date-picker {
  margin-left: 10px;
}

#ZaPYVk .el-collapse {
  border-top: 0px !important;
  border-bottom: 0px !important;
}

#ZaPYVk .el-collapse-item__header {
  border-bottom: 0px !important;
}

#ZaPYVk .el-collapse-item__wrap {
  border-bottom: 0px !important;
}

#ZaPYVk .el-tabs__nav {
  display: flex;
  flex-direction: row;
}

#ZaPYVk .menu-divider {
  margin: 0px !important;
}

#ZaPYVk .menu-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}

#ZaPYVk .menu-item {
  width: 100%;
  height: 50px;
  background-color: white;
  font-size: 20px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

#ZaPYVk .menu-item-setting {
  width: 100%;
  background-color: white;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}

#ZaPYVk .el-collapse-item__arrow {
  background-color: white;
  display: none !important;
}

#ZaPYVk #chartDashboard {
  height: 500px;
  width: 100%;
}

#ZaPYVk .pie-chart-box {
  width: 80vw;
  height: 400px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;
  margin-top: 10px;
}

#ZaPYVk .histogram-chart-box {
  width: 100%;
  padding-top: 20px;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;
  background-color: white;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
