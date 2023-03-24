<template>
  <div id="bill-table-root-box">
    <div class="top-bar">
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
        <el-date-picker class="date-picker" v-model="datePickerValue" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table class="table" :data="tableData" style="width: 100%;margin-top:10px" @sort-change="sortChange"
      :default-sort="{ prop: 'date', order: 'descending' }">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item style="width:100%" class="bill-image-item-box">
              <div v-if="props.row.billRemark == null || props.row.billRemark.length === 0"
                style="display:flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;">
                该账单无备注
              </div>
              <div v-else
                style="display:flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;"> {{
                  props.row.billRemark
                }}</div>
              <el-divider></el-divider>
              <div class="bill-image-box" v-if="props.row.billImages.length > 0"
                style="display:flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;">
                <!-- <img src="../../assets/images/1.webp" style="width:50px;margin-left:10px;margin-right:10px" />
                <img src="../../assets/images/2.webp" style="width:50px;margin-left:10px;margin-right:10px" />
                <img src="../../assets/images/3.webp" style="width:50px;margin-left:10px;margin-right:10px" />
                <img src="../../assets/images/4.webp" style="width:50px;margin-left:10px;margin-right:10px" /> -->
                <img v-for="(item, index) in props.row.billImages" :key="index" :src="item"
                  style="width:50px;margin-left:10px;margin-right:10px" />
              </div>
              <div v-else
                style="display:flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;">
                该账单没有图片</div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="billProperty" label="收入/支出" sortable="custom" width="150">
        <template slot-scope="scope">
          <i v-if="scope.row.billProperty > 0" class="iconfont icon-shouru" style="font-size: 20px; color: green;"></i>
          <i v-else class="iconfont icon-zhichu" style="font-size: 20px; color: red;"></i>
        </template>
      </el-table-column>
      <el-table-column prop="billDate" label="日期" sortable="custom" width="180" :formatter="billDateFormat">
      </el-table-column>
      <el-table-column prop="billMoney" label="金额" sortable="custom" width="150">
        <template slot-scope="scope">
          <el-statistic group-separator="," prefix decimal-separator="." :precision="2" :value=scope.row.billMoney>
            <template slot="prefix">
              <i v-if="scope.row.billProperty > 0" class="iconfont icon-jine" style="color: green"></i>
              <i v-else class="iconfont icon-jine" style="color: red"></i>
            </template>
          </el-statistic>
        </template>
      </el-table-column>

      <el-table-column prop="billCategory" sortable="custom" label="分类">
      </el-table-column>
      <el-table-column prop="billAccount" sortable="custom" label="账户">
      </el-table-column>
      <el-table-column prop="billShop" sortable="custom" label="商家">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-popconfirm title="确定删除吗？" @confirm="deleteBill(scope.row)">
            <el-button size="mini" type="danger" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="pagination" @size-change="pageSizeChange" @current-change="pageChange" :current-page="1"
      :page-sizes="[20, 50, 100, 200, 300, 400]" :page-size="pageSize" layout="sizes, prev, pager, next"
      :total="dataCount">
    </el-pagination>

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

Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.prototype.$moment = moment;

export default {
  components: {
  },
  data() {
    return {
      token: "",
      // 抽屉菜单
      drawer: false,
      direction: 'ltr',
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
      datePickerValue: "",
      // 表格数据
      tableData: [],
      startTime: 0,
      endTime: 0,
      pageNum: 1,
      pageSize: 20,
      sortName: "BillDate",
      sortOrder: "DESC",
      // 分页
      dataCount: 0,
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
      this.requestBillData();
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
      this.requestBillData();
    },
    handleClose(done) {
      done();
    },
    billDateFormat: function (row) {
      return this.$moment(new Date(row.billDate)).format("yyyy-MM-DD hh:mm");
    },
    editBill: function (row) {

      console.log(row.objectId);
    },
    deleteBill: function (row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.get("https://www.li-xyz.com/LifeKeeper/DeleteBill?objectId=" + row.objectId, {
        headers: {
          'Token': this.token
        }
      }).then((result) => {
        if (result.status === 200) {
          if (result.data.result) {
            this.requestBillData();
          } else {
            this.$message.error('删除出错，请稍候重试...');
          }
        } else {
          this.$message.error('删除出错，请稍候重试...');
        }
        loading.close();
      })
    },
    pageChange: function (index) {
      this.pageNum = index;
      this.requestBillData();
    },
    requestBillData: function () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.get("https://www.li-xyz.com/LifeKeeper/GetWebTableData?start=" + this.startTime + "&end=" + this.endTime + "&pageNum=" + this.pageNum + "&pageSize=" + this.pageSize + "&sortName=" + this.sortName + "&sortOrder=" + this.sortOrder, {
        headers: {
          'Token': this.token
        }
      }).then((result) => {
        if (result.status === 200) {
          if (result.data.result) {
            console.log(result.data.resultObject);
            this.dataCount = result.data.resultObject.Count;
            let bills = result.data.resultObject.Bills;
            this.tableData = [];
            for (var i = 0; i < bills.length; i++) {
              var list = [];
              if (bills[i].billImage.length > 0) {
                bills[i].billImage.forEach(element => {
                  list.push("https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperBillImage/" + this.token + "/webp/" + element);
                });
              } else {
                console.log("no pic");
              }
              let bill = {
                objectId: bills[i].objectId,
                billProperty: bills[i].billProperty,
                billDate: bills[i].billDate,
                billMoney: bills[i].billMoney,
                billCategory: bills[i].billCategory,
                billAccount: bills[i].billAccount,
                billShop: bills[i].billShop,
                billImages: list,
                billRemark: bills[i].billRemark,
              }
              this.tableData.push(bill);
            }
          } else {
            this.$message.error('删除出错，请稍候重试...');
          }
        } else {
          this.$message.error('删除出错，请稍候重试...');
        }
        loading.close();
      })
    },
    sortChange: function (event) {
      this.sortName = event.prop;
      if (event.order === "ascending") {
        this.sortOrder = "ASC";
      } else if (event.order === "descending") {
        this.sortOrder = "DESC";
      } else {
        this.sortName = "billDate";
        this.sortOrder = "DESC";
      }
      this.requestBillData();
    },
    pageSizeChange: function (size) {
      this.pageSize = size;
      this.requestBillData();
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
  },
  watch: {
  },
  mounted() {
    let storage = window.sessionStorage;
    this.token = storage.getItem("UserId");
    if (this.token == null) {
      $("#loginModal").modal({ backdrop: 'static', keyboard: false });
    } else {
      var date = new Date();
      this.startTime = moment(date).startOf('day').valueOf();
      this.endTime = moment(date).endOf('day').valueOf();
      this.datePickerValue = [this.startTime, this.endTime]
      this.requestBillData();
    }
  }
}
</script>

<style>
#bill-table-root-box {
  width: 80vw;
  margin: auto;
}

#bill-table-root-box .date-picker {
  margin-left: 10px;
}

#bill-table-root-box .time-button {
  margin-left: 0px !important;
}

#bill-table-root-box .time-button.selected {
  background-color: #1477FE;
  color: white;
}

#bill-table-root-box .date-buttons-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 0px !important;
  cursor: pointer;
}

#bill-table-root-box .account-selector {
  width: 100%;
  cursor: pointer;
}

#bill-table-root-box .selector-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#bill-table-root-box .el-icon-menu {
  color: white;
  margin-left: 30px;
}

#bill-table-root-box .top-bar {
  border-radius: 10px;
  background-color: #77bfa3;
  box-shadow: 5px 5px 5px #888888;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#bill-table-root-box .date-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#bill-table-root-box .menu-icon-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-start;
  font-size: 30px
}

#bill-table-root-box .el-range-editor.el-input__inner {
  display: flex;
  flex-direction: row;
}

#bill-table-root-box .time-button.selected {
  background-color: #1477FE;
  color: white;
}

#bill-table-root-box .table {
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;
}

#bill-table-root-box .pagination {
  border-radius: 10px;
  /* box-shadow: 5px 5px 5px #888888; */
  margin-bottom: 20px;
  margin-top: 20px;
}

#bill-table-root-box .bill-image-item-box>.el-form-item__content {
  width: 100%;
}

#bill-table-root-box .el-collapse-item__arrow {
  background-color: white;
  display: none !important;
}

#bill-table-root-box .is-active {
  width: 100%;
  background-color: white;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}

#bill-table-root-box .menu-divider {
  margin: 0px !important;
}

#bill-table-root-box .el-collapse {
  border-top: 0px !important;
  border-bottom: 0px !important;
}

#bill-table-root-box .el-collapse-item__header {
  border-bottom: 0px !important;
}

#bill-table-root-box .el-collapse-item__wrap {
  border-bottom: 0px !important;
}

#bill-table-root-box .menu-item {
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

#bill-table-root-box .menu-item-setting {
  width: 100%;
  background-color: white;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}


@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/c/font_2994771_x0hvrgci7v.woff2?t=1672931520478') format('woff2'),
    url('//at.alicdn.com/t/c/font_2994771_x0hvrgci7v.woff?t=1672931520478') format('woff'),
    url('//at.alicdn.com/t/c/font_2994771_x0hvrgci7v.ttf?t=1672931520478') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-jine:before {
  content: "\e6c3";
}

.icon-dingwei:before {
  content: "\e602";
}

.icon-xiangqing:before {
  content: "\e611";
}

.icon-guanbi:before {
  content: "\e610";
}

.icon-bianji:before {
  content: "\e60c";
}

.icon-bili:before {
  content: "\e635";
}

.icon-shouru1:before {
  content: "\e651";
}

.icon-zhichu1:before {
  content: "\e652";
}

.icon-yinhangqia:before {
  content: "\e665";
}

.icon-zhifubao:before {
  content: "\e68a";
}

.icon-weixin:before {
  content: "\e607";
}

.icon-shouru:before {
  content: "\e65c";
}

.icon-zhichu:before {
  content: "\e666";
}
</style>
