<template>
  <div id="DsqUGM">
    <el-row :gutter="20" style="width:100%">
      <div class="top-bar" style="display:flex;flex-direction: row;font-size: 30px;color:white;">
        相册
      </div>
    </el-row>
    <div id="image-box">
      <div class="image-item-box" v-for="(item, index) in covers" :key="index">
        <img class="image" v-if="item.category.isPrivate > 0" :src="'https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperImage/' + item.category.categoryUser + '/blur/' +
        item.image.blurFileName" @click="imageClick(item)" />
        <img class="image" v-else
          :src="'https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperImage/' + item.category.categoryUser + '/thumbnail/' + item.image.thumbnailFileName"
          @click="imageClick(item)" />
        <div class="category-name">
          <div class="edit-category"></div>
          <span>{{ item.category.categoryName }}({{ item.imageCount }}) </span>
          <el-dropdown class="edit-category" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-edit el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ command: 'edit', item: item }">编辑</el-dropdown-item>
              <el-dropdown-item :command="{ command: 'del', item: item }">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="image-item-box" @click="addCategory">
        <i id="addCategoryIcon" class="iconfont icon-tianjia1" style="font-size: 200px;"></i>
        <div class="category-name">
          <span>新增相册</span>
        </div>
      </div>
    </div>
    <!-- 加密相册输入密码 Dialog -->
    <el-dialog title="该相册是加密相册" :visible.sync="passwordDialogVisible" width="30%" center>
      <el-input placeholder="请输入相册密码" v-model="categoryPassword" type="password"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="verifyCategoryPassword">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除/编辑相册验证密码 Dialog -->
    <el-dialog :title="verifyPasswordDialogMessage" :visible.sync="editCategoryPasswordDialogVisible" width="30%"
      center>
      <el-input placeholder="请输入相册密码~" v-model="categoryPassword" type="password"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategoryVerifyPassword">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除相册确认 Dialog -->
    <el-dialog title="您确定要删除该相册吗？" :visible.sync="deleteConfirmDialogVisible" width="30%" center>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑相册 Dialog -->
    <el-dialog title="编辑相册" :visible.sync="editCategoryDialogVisible" width="30%" center>
      <el-input placeholder="请输入相册名称" v-model="editCategoryObj.categoryName" clearable>
      </el-input>

      <el-checkbox style="margin-top:10px" :value="editCategoryObj.isPrivate > 0"
        @change="updateCategoryPrivate">加密相册</el-checkbox>

      <el-input style="margin-top:10px" v-show="editCategoryObj.isPrivate > 0" placeholder="请输入相册密码"
        v-model="editCategoryObj.password" clearable type="password">
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateImageCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加相册 Dialog -->
    <el-dialog title="添加相册" :visible.sync="addCategoryDialogVisible" width="30%" center>
      <el-input placeholder="请输入相册名称" v-model="addCategoryObj.categoryName" clearable>
      </el-input>

      <el-checkbox style="margin-top:10px" :value="addCategoryObj.isPrivate > 0"
        @change="updateAddCategoryPrivate">加密相册</el-checkbox>

      <el-input style="margin-top:10px" v-show="addCategoryObj.isPrivate > 0" placeholder="请输入相册密码"
        v-model="addCategoryObj.password" clearable type="password">
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNewCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import { v4 as uuidv4 } from 'uuid'
import md5 from 'js-md5';


Vue.use(ElementUI);
Vue.prototype.axios = axios;

export default {
  data() {
    return {
      token: "",
      loading: {},
      covers: [],
      passwordDialogVisible: false,
      targetCategoryId: "",
      categoryPassword: "",

      editCategoryObj: {},
      verifyPasswordDialogMessage: "",
      editCategoryPasswordDialogVisible: false,
      editMode: 1, //1：编辑；2：删除
      deleteConfirmDialogVisible: false,
      editCategoryDialogVisible: false,
      addCategoryDialogVisible: false,
      addCategoryObj: {
        "objectId": uuidv4(),
        "categoryId": uuidv4(),
        "categoryName": "",
        "categoryUser": this.token,
        "isPrivate": -1,
        "password": "",
        "categoryStatus": 1,
        "categoryType": 0,
        "createTime": new Date().getTime(),
        "updateTime": 0
      },
      host:"127.0.0.1"
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
    requeatCover() {
      axios.get("https://www.li-xyz.com/LifeKeeper/GetImageCategoryAndCover", {
        headers: {
          'Token': this.token
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            this.covers = result.data.resultObject;
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
      this.hideLoading();
    },
    imageClick(item) {
      this.targetCategoryId = item.category.categoryId;
      this.categoryPassword = "";
      if (item.category.isPrivate > 0) {
        this.passwordDialogVisible = true;
      } else {
        sessionStorage.pass = this.$md5('LifeKeeper');
        sessionStorage.imageCategoryId = this.targetCategoryId;
        sessionStorage.ImageCategoryIsPrivate = -1;
        this.$router.push({ name: "imagesForCategory" })
      }
    },
    verifyCategoryPassword() {
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/VerifyImageCategoryPassword", {
        headers: {
          'Token': this.token,
          'Password': this.$md5(this.categoryPassword.trim() + 'LifeKeeper'),
          'CategoryId': this.targetCategoryId
        }
      }).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            sessionStorage.pass = this.$md5(this.categoryPassword.trim() + 'LifeKeeper');
            sessionStorage.imageCategoryId = this.targetCategoryId;
            sessionStorage.ImageCategoryIsPrivate = 1;
            this.$router.push({ name: "imagesForCategory" });
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
        this.hideLoading();
      })
    },
    handleCommand(commandObj) {
      this.targetCategoryId = commandObj.item.category.categoryId;
      this.editCategoryObj = commandObj.item.category;
      this.editCategoryObj.password = "";
      if (commandObj.command === "edit") {
        this.editMode = 1;
        if (commandObj.item.category.isPrivate > 0) {
          this.editCategoryPasswordDialogVisible = true;
          this.categoryPassword = "";
          this.verifyPasswordDialogMessage = "您要编辑的相册是加密相册，请验证相册密码"
        } else {
          this.editCategoryDialogVisible = true;
        }
      } else {
        this.editMode = 2;
        if (commandObj.item.category.isPrivate > 0) {
          this.editCategoryPasswordDialogVisible = true;
          this.categoryPassword = "";
          this.verifyPasswordDialogMessage = "您要删除的相册是加密相册，请验证相册密码"
        } else {
          this.deleteConfirmDialogVisible = true;
          this.editCategoryPasswordDialogVisible = false;
        }
      }
    },
    editCategoryVerifyPassword() {
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/VerifyImageCategoryPassword", {
        headers: {
          'Token': this.token,
          'Password': this.$md5(this.categoryPassword.trim() + 'LifeKeeper'),
          'CategoryId': this.targetCategoryId
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          this.editCategoryPasswordDialogVisible = false;
          if (result.data.result) {
            if (this.editMode === 1) {
              this.editCategoryDialogVisible = true;
            } else {
              this.deleteConfirmDialogVisible = true;
            }
          } else {
            this.$message.error('密码错误，无法进行操作');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    deleteCategory() {
      this.showLoading();
      this.deleteConfirmDialogVisible = false;
      axios.get("https://www.li-xyz.com/LifeKeeper/DeleteImageCategory", {
        headers: {
          'Token': this.token,
          'CategoryId': this.editCategoryObj.categoryId
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          this.editCategoryPasswordDialogVisible = false;
          if (result.data.result) {
            this.deleteConfirmDialogVisible = false;
            this.$message({
              message: '相册删除成功',
              type: 'success'
            });
            this.requeatCover();
          } else {
            this.$message.error('密码错误，无法进行操作');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    updateCategoryPrivate(e) {
      if (e) {
        this.editCategoryObj.isPrivate = 1;
      } else {
        this.editCategoryObj.isPrivate = -1;
      }
    },
    updateImageCategory() {
      this.showLoading();
      if (this.editCategoryObj.isPrivate > 0) {
        if (this.editCategoryObj.password.length === 0) {
          this.$message.error('还没有输入密码！');
          return;
        }
      }
      if (this.editCategoryObj.categoryName.length === 0) {
        this.$message.error('还没有输入相册名！');
        return;
      }

      this.editCategoryObj.passowrd = this.$md5(this.editCategoryObj.password.trim() + this.resetPasswordValue.trim() + 'LifeKeeper')

      axios.post("https://www.li-xyz.com/LifeKeeper/EditImageCategory", JSON.stringify(this.editCategoryObj), {
        headers: {
          'Token': this.token,
          "Content-Type": "application/json",
          dataType: "json",
        }
      }).then((result) => {
        this.editCategoryDialogVisible = false;
        if (result.status == 200) {
          this.requeatCover();
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
        this.hideLoading();
      })
    },
    addCategory() {
      this.addCategoryDialogVisible = true;
      this.addCategoryObj.objectId = uuidv4();
      this.addCategoryObj.categoryId = uuidv4();
      this.addCategoryObj.categoryName = "";
      this.addCategoryObj.categoryUser = this.token;
      this.addCategoryObj.isPrivate = -1;
      this.addCategoryObj.password = "";
      this.addCategoryObj.categoryStatus = 1;
      this.addCategoryObj.categoryType = 0;
      this.addCategoryObj.createTime = new Date().getTime();
      this.addCategoryObj.updateTime = 0;
    },
    updateAddCategoryPrivate(isPrivate) {
      if (isPrivate) {
        this.addCategoryObj.isPrivate = 1;
      } else {
        this.addCategoryObj.isPrivate = -1;
      }
    },
    submitNewCategory() {
      this.showLoading();
      if (this.addCategoryObj.isPrivate > 0) {
        if (this.addCategoryObj.password.length === 0) {
          this.$message.error('还没有输入密码！');
          return;
        }
      }
      if (this.addCategoryObj.categoryName.length === 0) {
        this.$message.error('还没有输入相册名！');
        return;
      }

      this.addCategoryObj.password = this.$md5(this.addCategoryObj.password.trim() + 'LifeKeeper')

      axios.post("https://www.li-xyz.com/LifeKeeper/AddImageCategory", JSON.stringify(this.addCategoryObj), {
        headers: {
          'Token': this.token,
          "Content-Type": "application/json",
          dataType: "json",
        }
      }).then((result) => {
        this.editCategoryDialogVisible = false;
        if (result.status == 200) {
          if (result.data.result) {
            sessionStorage.pass = this.addCategoryObj.password;
            sessionStorage.imageCategoryId = this.addCategoryObj.categoryId;
            sessionStorage.ImageCategoryIsPrivate = this.addCategoryObj.isPrivate;
            this.$router.push({ name: "imagesForCategory" })
          } else {
            this.$message.error(result.data.exceptionMessage);
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
        this.hideLoading();
      })
    }
  },
  watch: {
  },
  mounted() {
    let storage = window.sessionStorage;
    this.token = storage.getItem("UserId");
    this.showLoading();
    this.requeatCover();
  }
}
</script>

<style>
#DsqUGM {
  width: 80vw;
  margin: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  padding-bottom: 20px;
}

#DsqUGM .top-bar {
  border-radius: 10px;
  background-color: #77bfa3;
  box-shadow: 5px 5px 5px #888888;
  height: 10vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#DsqUGM #image-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}


#DsqUGM .image-item-box {
  width: calc((100% - 100px)/5);
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  font-size: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

#DsqUGM .image {
  width: 80%;
  height: 80%;
  margin-top: 10px;
  box-shadow: 5px 5px 5px #888888;
  border-radius: 10px;
}

#DsqUGM .category-name {
  /* background-color: #77bfa3; */
  width: 80%;
  height: 50px;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

#DsqUGM .edit-category {
  flex-grow: 1;
  justify-self: flex-end;
}

@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/c/font_2994771_6ugbsdsczmj.woff2?t=1673246835735') format('woff2'),
    url('//at.alicdn.com/t/c/font_2994771_6ugbsdsczmj.woff?t=1673246835735') format('woff'),
    url('//at.alicdn.com/t/c/font_2994771_6ugbsdsczmj.ttf?t=1673246835735') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-tianjia1:before {
  content: "\e61a";
}
</style>
