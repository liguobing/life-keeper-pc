<template>
  <div id="WSvovC">
    <div class="top-bar">
      <div class="menu-icon-box">
        <i class="el-icon-menu" @click="drawer = true"></i>
      </div>
      <div style="display:flex;flex-direction: row;font-size: 30px;color:white;">
        账单分类
      </div>
      <div class="menu-icon-box">
        <i v-show="false" @click="drawer = true"></i>
      </div>
    </div>

    <el-table id="table" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <!-- 选择框 -->
      <el-table-column type="null" width="50" v-show="isEdit">
      </el-table-column>
      <!-- 图标 -->
      <el-table-column label="日期" width=50 prop="">
        <template slot-scope="scope">
          <i v-if="scope.row.isIncome > 0" class="iconfont icon-shouru" style="font-size: 20px; color: green;"></i>
          <i v-else class="iconfont icon-zhichu" style="font-size: 20px; color: red;"></i>
        </template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column prop="categoryName" label="分类名称" :width=itemWidth>
      </el-table-column>
      <!-- 收入/支出 -->
      <el-table-column prop="property" label="收入/支出" :width="itemWidth">
        <template slot-scope="scope">
          <a v-if="scope.row.isIncome > 0">收入</a>
          <a v-else>支出</a>
        </template>
      </el-table-column>
      <!-- 编辑/删除 -->
      <el-table-column prop="objectId" label="编辑/删除" :width="100">
        <template slot-scope="scope">
          <el-button @click="editCategory(scope.row)" type="text" size="small">编辑</el-button>
          <el-popconfirm title="确定要删除这个分类吗？" @confirm="deleteCategory(scope.row)">
            <el-button slot="reference" type="text" size="small" style="margin-left:10px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 修改分类Dialog -->
    <el-dialog title="编辑账单分类" :visible.sync="editBillDialogVisible" width="30%" center>
      <el-form ref="billForm" :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.categoryName" :placeholder="editCategoryName"></el-input>
        </el-form-item>
        <el-form-item label="收入/支出">
          <el-radio-group v-model="radio" @input="changeBillProperty">
            <el-radio label="收入"></el-radio>
            <el-radio label="支出"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.prototype.axios = axios;

export default {
  data() {
    return {
      radio: "1",
      editBillDialogVisible: false,
      itemWidth: 0,
      isEdit: false,
      token: "",
      drawer: false,
      direction: 'ltr',
      tableData: [],
      multipleSelection: [],
      form: {
        objectId: "",
        categoryId: "",
        categoryUser: "",
        categoryName: "",
        isIncome: 1,
        categoryStatue: 1,
        categoryType: 0,
        createTime: 0,
        updateTime: 0,
        orderIndex: 0,
      },
      editCategoryName: ""
    }
  },
  methods: {
    handleClose(done) {
      done();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    editCategory(row) {
      this.editBillDialogVisible = true
      this.form = row;
      if (row.isIncome > 0) {
        this.radio = "收入";
      } else {
        this.radio = "支出";
      }
    },
    deleteCategory(row) {
      var obj = [row.objectId]
      axios.post("https://www.li-xyz.com/LifeKeeper/DeleteBillCategory", JSON.stringify(obj), {
        headers: {
          'Token': this.token,
          "Content-Type": "application/json",
          dataType: "json",
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            this.requestCategory();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    requestCategory() {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中，请耐心等候',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.get("https://www.li-xyz.com/LifeKeeper/GetBillCategoryData", {
        headers: {
          'Token': this.token
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            console.log(result.data.resultObject);
            this.tableData = result.data.resultObject;
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
        loading.close();
      })
    },
    onSubmit() {
      this.editBillDialogVisible = false;
      axios.post("https://www.li-xyz.com/LifeKeeper/UpdateBillCategory", JSON.stringify(this.form), {
        headers: {
          'Token': this.token,
          "Content-Type": "application/json",
          dataType: "json",
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            this.requestCategory();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    changeBillProperty(val) {
      if (val === "收入") {
        this.form.isIncome = 1;
      } else {
        this.form.isIncome = -1;
      }
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
    this.requestCategory();
    let table = document.getElementById("table");
    this.itemWidth = (table.clientWidth - 200) / 2
  }
}
</script>

<style>
#WSvovC{
  width:80vw;
  margin: auto;
}
#WSvovC .top-bar{
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
#WSvovC .menu-icon-box{
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-start;
  font-size: 30px
}

#WSvovC .el-icon-menu{
  color: white;
  margin-left: 30px;
}

#WSvovC .el-collapse {
  border-top: 0px !important;
  border-bottom: 0px !important;
}

#WSvovC .el-collapse-item__header {
  border-bottom: 0px !important;
}

#WSvovC .el-collapse-item__wrap {
  border-bottom: 0px !important;
}

#WSvovC .el-tabs__nav {
  display: flex;
  flex-direction: row;
}

#WSvovC .menu-divider {
  margin: 0px !important;
}

#WSvovC .menu-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}

#WSvovC .menu-item {
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

#WSvovC .menu-item-setting {
  width: 100%;
  background-color: white;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}

#WSvovC .el-collapse-item__arrow {
  background-color: white;
  display: none !important;
}

#WSvovC #table {
  border-radius: 20px;
  background-color: #98c9a3;
  box-shadow: 5px 5px 5px #888888;
  margin-top: 10px;
  margin-bottom: 20px;
}

@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/font_2994771_lx1x7ez0y0d.woff2?t=1640353637765') format('woff2'),
    url('//at.alicdn.com/t/font_2994771_lx1x7ez0y0d.woff?t=1640353637765') format('woff'),
    url('//at.alicdn.com/t/font_2994771_lx1x7ez0y0d.ttf?t=1640353637765') format('truetype');
}


/* 阿里图标库 */
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
