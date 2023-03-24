<template>
  <div id="account-index-root-box">
    <!-- topbar -->
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
        <div id="date-picker-box">
          <el-date-picker class="date-picker" v-model="datePickerValue" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
    </div>
    <!-- 概述和添加账单 -->
    <div id="overview-and-add-bill">
      <div id="overview" style="height:300px">
        <IndexOverView :income="incomeCount" :expend="expendCount" :percent="percent"></IndexOverView>
      </div>
      <div id="add-bill">
        <IndexAddBill @addNewBill="addNewBill" @importWeChatBill="importWeChatBill"
          @importAlipayBill="importAlipayBill">
        </IndexAddBill>
      </div>
    </div>
    <!-- 排行 -->
    <div id="order-box">
      <IndexBillTop10 class="top-10" title="收入 Top 10" :items="incomeTop10"></IndexBillTop10>
      <IndexBillTop10 class="top-10 expend-top" title="支出 Top 10" :items="expendTop10"></IndexBillTop10>
      <IndexCategoryTop10 class="top-10" :incomeCategoryTop10="incomeCategoryTop10"
        :expendCategoryTop10="expendCategoryTop10" :allCategoryTop10="allCategoryTop10"></IndexCategoryTop10>
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

    <!-- 添加账单 Dialog -->
    <el-dialog title="添加账单" :visible.sync="addBillDialogVisible">
      <!-- 金额和Property -->
      <div style="display:flex;flex-direction: row;">
        <!-- 金额 -->
        <el-input placeholder="请输入金额" @input="billMoneyChange" v-model="newBillObj.billMoney" type="number"
          style="width:60%">
          <template slot="prepend">金额￥</template>
        </el-input>
        <!-- 收入/支出 -->
        <el-select v-model="newBillProperty" placeholder="收入/支出" style="width:40%;margin-left: 10px;"
          @change="billPropertySelected">
          <el-option v-for="item in addBillProperties" :key="item.property" :label="item.name" :value="item.property">
          </el-option>
        </el-select>
      </div>
      <!-- 分类和账户 -->
      <div style="display:flex;flex-direction: row;margin-top: 10px;">
        <!-- 分类 -->
        <el-select v-model="newBillCategory" placeholder="请选择消费分类" @change="billCategorySelected" style="width:50%">
          <el-option v-for="item in showCategory" :key="item.objectId" :label="item.categoryName" :value="item">
          </el-option>
        </el-select>
        <!-- 账户 -->
        <el-select v-model="newBillAccount" placeholder="请选择消费账户" style="width:50%;margin-left: 10px;"
          @change="billAccountSelected">
          <el-option v-for="item in allAccount" :key="item.objectId" :label="item.accountName" :value="item">
          </el-option>
        </el-select>
      </div>
      <!-- 位置和时间 -->
      <div style="display:flex;flex-direction: row;margin-top: 10px;">
        <el-input placeholder="发生地点" v-model="newBillObj.billShop" style="width:50%">
          <template slot="prepend">位置</template>
        </el-input>
        <el-date-picker @change="newBillDateChange" v-model="newBillDate" type="datetime" placeholder="选择日期时间"
          style="width:50%;margin-left: 10px;">
        </el-date-picker>
      </div>
      <!-- 备注 -->
      <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="newBillObj.billRemark" style="margin-top: 10px;">
      </el-input>
      <!-- 图片 -->
      <div style="margin-top: 10px;display: flex;flex-direction: row;width:100%;height: 20vh;">
        <div v-loading="uploadBillImageLoading" v-if="uploadBillPreviewShow" id="upload_image_ul"
          style="width:100%;height:100%;display: flex;flex-direction: row;align-items: center;justify-content: center;">
          <el-image style="width: 100px; height: 100px" v-for="(item, index) in newBillImages" :key="index" :src="item"
            fit="cover"></el-image>
        </div>
        <div id="upload_button_container"
          style="border-style: dotted;border-width: 1px;width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;">
          <input style="width: 0;height: 0;opacity: 0;overflow: hidden;position: absolute;z-index: -1;" type="file"
            name="file" id="file" class="input_file" v-on:change="showPreview($event)" accept="image/*" multiple />
          <label for="file" class="label_container"
            style="display: flex;flex-direction: column;justify-content: center;align-items: center;width: 100%;height: 100%;padding-top: 10%;padding-bottom: 10%;">
            <i class="el-icon-upload" style="color: #777777">&#xe624;</i>
            <a style="color: #777777">点击为账单添加图片</a>
          </label>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBillDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNewBill" :disabled="submitNewBillButtonDisabled">确
          定</el-button>
      </div>
    </el-dialog>

    <!-- 导入微信账单 Dialog -->
    <el-dialog title="导入微信账单" :visible.sync="importWechatBillDialogVisible" :close-on-press-escape="false"
      :close-on-click-modal="false" :show-close="false">
      <!-- 文件选择 -->
      <div class="file-select" v-if="!wechatFileIsSelected"
        style="border-style: dotted;border-width: 1px;width: 100%;height: 20vh;display: flex;flex-direction: column;justify-content: center;align-items: center;">
        <input style="width: 0;height: 0;opacity: 0;overflow: hidden;position: absolute;z-index: -1;" type="file"
          name="file" id="fileSelect" class="input_file" v-on:change="wechatFileSelected($event)" accept=".csv" />
        <label for="fileSelect" class="label_container"
          style="display: flex;flex-direction: column;justify-content: center;align-items: center;padding-top: 10%;padding-bottom: 10%;">
          <i class="el-icon-upload" style="color: #777777">&#xe624;</i>
          <a style="color: #777777">选择从微信导出的 csv 文件</a>
        </label>
      </div>
      <!-- 内容展示 -->
      <div class="server-message" v-if="wechatFileIsSelected"
        style="border-style: dotted;border-width: 1px;width: 100%;height: 20vh;display: flex;flex-direction: column;justify-content: center;align-items: center;">
        <a v-for="(item, index) in importWechatServerResultMessage" :key="index"> {{ item }}</a>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="importWechatBillButtonDisabled" @click="closeImportWechatDialog">确
          定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue';
import ElementUI, { Form } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import IndexOverView from '../../components/account/index-overview.vue'
import IndexAddBill from '../../components/account/index-add-bill.vue'
import IndexBillTop10 from '../../components/account/index-money-top-10.vue'
import IndexCategoryTop10 from '../../components/account/index-category-top-10.vue'
import axios from "axios"
import $ from 'jquery'
import { v4 as uuidv4 } from 'uuid'

Vue.use(ElementUI);
Vue.component('IndexOverView', IndexOverView)
Vue.component('IndexAddBill', IndexAddBill)
Vue.component('IndexBillTop10', IndexBillTop10)
Vue.component('IndexCategoryTop10', IndexCategoryTop10)
Vue.prototype.$moment = moment;
Vue.prototype.axios = axios;



export default {
  data() {
    return {
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
      datePickerValue: [],
      alarmValue: -1,
      drawer: false,
      direction: 'ltr',
      token: "",
      startTime: 0,
      endTime: 0,
      timeRange: 0,
      incomeCount: 0,
      expendCount: 0,
      percent: "",
      incomeTop10: [],
      expendTop10: [],
      allCategoryTop10: [],
      incomeCategoryTop10: [],
      expendCategoryTop10: [],
      addBillDialogVisible: false,
      allCategory: [],//所有分类
      allIncomeCategory: [],//收入分类
      allExpendCategory: [],//支出分类
      showCategory: [],//展示分类
      allAccount: [],
      addBillProperties: [
        {
          name: "收入",
          property: 1
        },
        {
          name: "支出",
          property: -1
        },
      ],
      newBillDate: "",
      newBillMoney: 0,
      newBillProperty: "收入/支出",
      newBillCategory: "",
      newBillAccount: "",
      newBillRemark: "",
      newBillUser: "",
      newBillShop: "",
      newBillImages: [],
      newBillObj: {
        objectId: "",
        billId: "",
        billDate: "",
        billMoney: "",
        billProperty: 0,
        billCategory: "",
        billAccount: "",
        billRemark: "",
        billUser: "",
        billShop: "",
        billStatus: 1,
        billType: 0,
        billImage: [],
        createTime: Date.now(),
        updateTime: 0
      },
      uploadBillImageLoading: true,
      uploadBillPreviewShow: false,
      submitNewBillButtonDisabled: false,
      // 以下数据为导入微信账单属性
      importWechatBillDialogVisible: false,
      wechatFileIsSelected: false,
      importWechatServerResultMessage: [],
      socket: "",
      importWechatBillButtonDisabled: false
    }
  },
  methods: {
    importWeChatBill: function () {
      this.importWechatBillDialogVisible = true;
    },
    wechatFileSelected(source) {
      this.importWechatBillButtonDisabled = true;
      this.importWechatServerResultMessage.push("正在将文件上传至服务器...");
      let files = source.target.files;
      this.wechatFileIsSelected = true;
      let data = new FormData();
      data.append('sourceFile', files[0]);
      axios.request({
        url: 'https://www.li-xyz.com/LifeKeeper/ImportWechatBill',
        headers: {
          "Token": this.token
        },
        method: 'post',
        data: data,
        onUploadProgress: progressEvent => {
          const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
          this.importWechatServerResultMessage.push("上传进度 " + complete + "%");
        },
      }).then((result) => {
        if (result.data.result) {
          this.importWechatServerResultMessage.push("开始解析文件，请稍候...");
          // 实例化socket
          this.socket = new WebSocket('wss://www.li-xyz.com/LifeKeeper/web/socket/' + result.data.resultObject.split(".")[0]);
          // 监听socket连接
          this.socket.onopen = this.open;
          // 监听socket错误信息
          this.socket.onerror = this.error;
          // 监听socket消息
          this.socket.onmessage = this.getMessage;
          // 监听socket关闭消息
          this.socket.onclose = this.close;
        }
      })
    },
    open: function () {
      console.log("socket连接成功")
    },
    error: function () {
      console.log("连接错误")
      this.importWechatBillButtonDisabled = false;
    },
    getMessage: function (msg) {
      if (this.importWechatServerResultMessage.length > 4) {
        this.importWechatServerResultMessage.shift();
      }
      if (msg.data == 1) {
        this.socket.close();
        this.importWechatServerResultMessage.push("导入完成");
        this.importWechatBillButtonDisabled = false;
      } else {
        this.importWechatServerResultMessage.push(msg.data);
      }
    },
    closeImportWechatDialog() {
      this.importWechatBillDialogVisible = false;
      this.wechatFileIsSelected = false;
      this.importWechatServerResultMessage = [];
    },
    send: function () {
      this.socket.send(params)
    },
    close: function () {
      console.log("socket已经关闭")
      if (this.importWechatServerResultMessage[this.importWechatServerResultMessage.length - 1] != "导入完成") {
        this.importWechatServerResultMessage.push("服务器出错，请稍候重试...");
        this.importWechatBillButtonDisabled = false;
      }
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
    showAddNewBillDialog() {
      $('#upload_button_container').show();
      $('#upload_image_ul').hide();
      var file = document.getElementById("file");
      if (file != null) {
        file.value = "";
      }

      this.addBillDialogVisible = true;
      this.newBillDate = Date.now(),
        this.newBillMoney = 0;
      this.newBillProperty = "收入/支出";
      this.newBillCategory = "";
      this.newBillAccount = "";
      this.newBillRemark = "";
      this.newBillUser = "";
      this.newBillShop = "";
      this.newBillImages = [];
      this.newBillObj = {
        objectId: "",
        billId: "",
        billDate: Date.now(),
        billMoney: "",
        billProperty: 0,
        billCategory: "",
        billAccount: "",
        billRemark: "",
        billUser: "",
        billShop: "",
        billStatus: 1,
        billType: 0,
        billImage: [],
        createTime: Date.now(),
        updateTime: 0
      }
    },
    submitNewBill() {
      if (this.newBillObj.billMoney <= 0) {
        this.$message.error('您的金额还没填写呢');
      }

      if (this.newBillObj.billMoney.startsWith(".")) {
        this.newBillObj.billMoney = "0" + this.newBillObj.billMoney;
      }

      if (this.newBillObj.billProperty === 0) {
        this.$message.error('该账单是收入还是支出呢？');
        return;
      }

      if (this.newBillObj.billCategory.length === 0) {
        this.$message.error('分类还没选呢');
        return;
      }

      if (this.newBillObj.billAccount.length === 0) {
        this.$message.error('账户还没选呢');
        return;
      }

      this.newBillObj.objectId = uuidv4();
      this.newBillObj.billId = uuidv4();

      this.newBillObj.billUser = this.token;
      this.newBillObj.billStatus = 1;
      this.newBillObj.billType = 0;
      this.newBillObj.createTime = Date.now();
      this.newBillObj.updateTime = 0;
      this.showLoading();
      axios.post("https://www.li-xyz.com/LifeKeeper/AddBill", JSON.stringify(this.newBillObj), {
        headers: {
          'Token': this.token,
          "Content-Type": "application/json",
          dataType: "json",
        }
      }).then((result) => {
        this.editCategoryDialogVisible = false;
        this.hideLoading();
        if (result.status == 200) {
          this.getBillOverview(this.startTime, this.endTime);
          this.addBillDialogVisible = false;
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
        this.hideLoading();
      })
    },
    billMoneyChange(event) {
      //限制不能输入 00.11 的格式
      if (this.newBillObj.billMoney.split('')[0] == '0' && this.newBillObj.billMoney.split('')[1] != '.') {
        this.newBillObj.billMoney = '0'
        return;
      }
      //只能输入到小数点后两位
      this.newBillObj.billMoney = (event.toString().match(/^\d*(\.?\d{0,2})/g)[0])
    },
    showPreview: function (source) {
      let self = this;
      let files = source.target.files
      if (files.length > 3) {
        this.$message({
          message: '最多只能设置三张',
          type: 'warning'
        });
      } else {
        this.submitNewBillButtonDisabled = true;
        this.uploadBillPreviewShow = true;
        if (window.FileReader) {
          for (let i = 0; files.length > i; i++) {
            // 创建FileReader对象, 并设置onload事件
            let fr = new FileReader();
            fr.onloadend = function (e) {
              self.newBillImages.push(e.target.result);
              $('#upload_button_container').hide();
              $('#upload_image_ul').show();
            }
            // 读图片
            fr.readAsDataURL(files[i]);
          }
        }

        let param = new FormData();
        for (var i = 0; i < files.length; i++) {
          param.append("sourceFile", files[i]);
        }
        param.append("billId", this.newBillObj.billId);

        axios.post("https://www.li-xyz.com/LifeKeeper/UploadBillImage", param, {
          headers: {
            'Token': this.token,
            'Content-Type': 'multipart/form-data'
          }
        }).then((result) => {
          if (result.status == 200) {
            if (result.data.result) {
              this.uploadBillImageLoading = false;
              this.submitNewBillButtonDisabled = false;
            } else {
              this.$message.error('出错啦，请检查后重试');
            }
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        })
      }
    },
    newBillDateChange(date) {
      this.newBillObj.billDate = new Date(date).getTime()
    },
    billCategorySelected(item) {
      this.newBillCategory = item.categoryName
      this.newBillObj.billCategory = item.categoryId;
      if (item.isIncome > 0) {
        this.newBillProperty = "收入";
        this.newBillObj.billProperty = 1;
        this.showCategory = this.allIncomeCategory;
      } else {
        this.newBillProperty = "支出";
        this.newBillObj.billProperty = -1;
        this.showCategory = this.allExpendCategory;
      }
    },
    billPropertySelected(item) {
      this.newBillCategory = "请选择消费分类"
      this.newBillObj.billCategory = null
      if (item > 0) {
        this.newBillProperty = "收入";
        this.newBillObj.billProperty = 1;
        this.showCategory = this.allIncomeCategory;
      } else {
        this.newBillProperty = "支出";
        this.newBillObj.billProperty = -1;
        this.showCategory = this.allExpendCategory;
      }
    },
    billAccountSelected(item) {
      this.newBillAccount = item.accountName;
      this.newBillObj.billAccount = item.accountId;
    },
    dateChange(time) {
      var buttons = document.getElementsByClassName("time-button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
      }
      this.startTime = Date.parse(time[0]);
      this.endTime = Date.parse(time[1]);
      this.getBillOverview(this.startTime, this.endTime);
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
      this.getBillOverview(this.startTime, this.endTime);
    },
    handleClose(done) {
      done();
    },
    addNewBill: function () {
      this.showAddNewBillDialog();
    },
    importAlipayBill: function () {
      console.log(3);
    },
    getBillOverview: function (startTime, endTime) {
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/GetRangeOverview?start=" + startTime + "&end=" + endTime, {
        headers: {
          'Token': this.token
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            let resultObject = JSON.parse(JSON.stringify(result.data["resultObject"]));
            let startTime = resultObject["start"];
            let endTime = resultObject["end"];
            this.timeRange = startTime + " - " + endTime;
            this.incomeCount = resultObject["income"];
            this.expendCount = resultObject["expend"];
            if (resultObject["income"] === 0) {
              this.percent = "-";
            } else {
              this.percent = (resultObject["expend"] / resultObject["income"] * 100).toFixed(2) + "%";
            }
            let incomeTop10 = resultObject["incomeTop10"]
            for (let i = 0; i < incomeTop10.length; i++) {
              incomeTop10[i].billDate = this.$moment(new Date(incomeTop10[i].billDate)).format("yyyy-MM-DD hh:mm");
            }
            this.incomeTop10 = incomeTop10;
            let expendTop10 = resultObject["expendTop10"];
            for (let i = 0; i < expendTop10.length; i++) {
              expendTop10[i].billDate = this.$moment(new Date(expendTop10[i].billDate)).format("yyyy-MM-DD hh:mm");
            }
            this.expendTop10 = expendTop10;

            this.allCategoryTop10 = resultObject["allCategoryTop10"];
            this.incomeCategoryTop10 = resultObject["incomeCategoryTop10"];
            this.expendCategoryTop10 = resultObject["expendCategoryTop10"];
            this.hideLoading();
          } else {
            this.hideLoading();
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.hideLoading();
          this.$message.error('出错啦，请检查后重试');
        }
      })
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
    getBillCategoryAndBillAccount() {
      axios.get("https://www.li-xyz.com/LifeKeeper/GetBillCategoryAndBillAccount", {
        headers: {
          'Token': this.token
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            this.allCategory = result.data.resultObject.allBillCategories;
            this.allIncomeCategory = result.data.resultObject.incomeBillCategories;
            this.allExpendCategory = result.data.resultObject.expendBillCategories;
            this.allAccount = result.data.resultObject.billAccounts;
            this.showCategory = this.allCategory;
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
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
      this.getBillOverview(this.startTime, this.endTime);
      this.getBillCategoryAndBillAccount();
    }
  }
}
</script>

<style>
#account-index-root-box .el-range-editor.el-input__inner {
  display: flex;
  flex-direction: row;
}

#account-index-root-box #date-picker-box {
  display: flex;
  flex-direction: row;
}

#account-index-root-box #overview-and-add-bill {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

#account-index-root-box #overview {
  /* flex-grow: 4; */
  width: 80vw;
}

#account-index-root-box #add-bill {
  /* flex-grow: 1; */
  width: 20%;
  margin-left: 10px;
}

#account-index-root-box #order-box {
  display: flex;
  flex-direction: row;
  width: 100%;
}

#account-index-root-box .top-10 {
  /* flex-grow: 1; */
  width: 33%;
  background-color: #dde7c7;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;

}

#account-index-root-box .expend-top {
  margin-left: 10px;
  margin-right: 10px;
}

#account-index-root-box .menu-divider {
  margin: 0px !important;
}

#account-index-root-box .el-collapse-item__arrow {
  background-color: white;
  display: none !important;
}

#account-index-root-box .is-active {
  width: 100%;
  background-color: white;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}

#account-index-root-box .el-collapse {
  border-top: 0px !important;
  border-bottom: 0px !important;
}

#account-index-root-box .el-collapse-item__header {
  border-bottom: 0px !important;
}

#account-index-root-box .el-collapse-item__wrap {
  border-bottom: 0px !important;
}

#account-index-root-box .el-tabs__nav {
  display: flex;
  flex-direction: row;
}

#account-index-root-box .el-date-editor {
  display: flex;
  flex-direction: row;
}

#account-index-root-box {
  width: 80vw;
  margin: auto;

}

#account-index-root-box .menu-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}

#account-index-root-box .menu-item {
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

#account-index-root-box .menu-item-setting {
  width: 100%;
  background-color: white;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}

#account-index-root-box .top-bar {
  border-radius: 10px;
  background-color: #77bfa3;
  box-shadow: 5px 5px 5px #888888;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#account-index-root-box .menu-icon-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-start;
  font-size: 30px
}

#account-index-root-box .account-selector {
  width: 100%;
  cursor: pointer;
}

#account-index-root-box .el-icon-menu {
  color: white;
  margin-left: 30px;
}

#account-index-root-box .selector-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#account-index-root-box .date-box {
  flex-grow: 3;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#account-index-root-box .date-buttons-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 0px !important;
  cursor: pointer;
}

#account-index-root-box .time-button {
  margin-left: 0px !important;
}

#account-index-root-box .time-button.selected {
  background-color: #1477FE;
  color: white;
}

#account-index-root-box .date-picker {
  margin-left: 10px;
}

#account-index-root-box .el-row {
  margin-bottom: 20px;
}
</style>
