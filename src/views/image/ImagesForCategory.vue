<template>
  <div id="RfHRrZ">
    <div class="images-top-bar">
      <div style="display: flex;flex-direction: column;">
        <a style="margin-left:10px">{{ categoryName }}</a>
        <a style="font-size:5px;margin-left: 10px;">该相册共有 {{ categoryImageCount }} 张照片</a>
      </div>
      <div style="flex-grow: 1;"></div>
      <el-button :type="hdModel" round @click="hdPreview">高清预览</el-button>
      <!-- 完成按钮 -->
      <el-button class="edit-item" v-show="isEdit" type="primary" icon="el-icon-check" round
        @click="editable(false)">完成</el-button>
      <!-- 编辑按钮 -->
      <el-button class="edit-item" v-show="!isEdit" type="primary" icon="el-icon-edit" round
        @click="editable(true)">编辑</el-button>
      <!-- 上传图片按钮 -->
      <el-button class="edit-item" type="primary" icon="el-icon-upload" round @click="showUploadDialog">上传图片</el-button>
    </div>
    <div class="images-edit-box" id="images-edit-box">
      <div style="flex-grow: 1;"></div>
      <!-- 移动相册 -->
      <el-button class="edit-item" v-show="isEdit" type="primary" icon="el-icon-guide" @click="moveImageButtonClick"
        round>移动到其他相册</el-button>
      <!-- 删除 -->
      <el-button class="edit-item" v-show="isEdit" type="danger" icon="el-icon-delete" @click="deleteImageButtonClick"
        round>删除选中</el-button>
      <!-- 私密状态 -->
      <el-button @click="resetPrivateStatus" class="edit-item" v-show="isEdit" type="warning" icon="el-icon-unlock" round>
        {{ privateStatusResetMessage }}</el-button>
    </div>
    <div id="images-images-box">
      <div class="images-image-item-box" v-for="(item, index) in imageBeans" :key="index">
        <el-image class="images-image" :src="'https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperImage/' + item.imageUser + '/thumbnail/' +
          item.thumbnailFileName" :preview-src-list="getSrcList(index)">
        </el-image>
        <div class="images-mask" v-show="isEdit" @click="maskClick(index)">
          <span @click.stop>
            <el-checkbox @change="checkStatusChange($event, index)" v-model="item.checked"></el-checkbox>
          </span>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination class="pagination" @size-change="pageSizeChange" @current-change="pageChange" :current-page="1"
      :page-sizes="[20, 50, 100, 200, 300, 400]" :page-size="pageSize" layout="sizes, prev, pager, next"
      :total="dataCount">
    </el-pagination>
    <!-- 移动照片Dialog -->
    <el-dialog title="移动照片" :visible.sync="moveImageDdialogVisible" width="30%" :before-close="closeMoveImageDialog">
      <span>确定要将这些照片移动到 {{ targetCategoryName }} 相册吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveImageDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMoveImage">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除照片 Dialog -->
    <el-dialog title="删除照片" :visible.sync="deleteImageDdialogVisible" :show-close=false width="30%"
      :before-close="closeMoveImageDialog">
      <span>确定要删除这些照片吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteImageDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDeleteImage">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 更改相册私密状态 Dialog -->
    <el-dialog title="" :show-close=false :visible.sync="resetPrivateStatusDdialogVisible" width="30%"
      :before-close="closeMoveImageDialog">
      <span>确定要将该相册设置为公开吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPrivateStatusDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetCategoryPublic">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置相册密码 Dialog -->
    <el-dialog title="请输入密码" :show-close=false :visible.sync="setPasswordDdialogVisible" width="30%"
      :before-close="closeMoveImageDialog">
      <el-input v-model="newPassword" placeholder="请输入密码" type="password"></el-input>
      <el-input v-model="repeatPassword" placeholder="请重复密码" type="password" style="margin-top:10px"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPasswordDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetCategoryPrivate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传图片 Dialog -->
    <el-dialog title="上传图片" :show-close=false :visible.sync="uploadDdialogVisible" width="30%"
      :before-close="closeUploadImageDialog">
      <div>
        <UploadImageItem v-for="(item, index) in uploadFileList" :key="index" v-on:itemDeleteClick="removeItem"
          :FileName="item.fileName" :Percent="item.progress" :ObjectId="item.objectId">
        </UploadImageItem>
      </div>
      <div id="images-upload-button-container">
        <input type="file" name="file" id="file" class="images-input-file" @change="showPreview($event)" accept="image/*"
          multiple />
        <label for="file" class="label_container"
          style="display: flex;flex-direction: column;justify-content: center;align-items: center">
          <i class="el-icon-upload" style="color:black"></i>
          <a style="color: #777777">点击选择图片</a>
        </label>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUploadImageDialog">取 消</el-button>
        <el-button type="primary" @click="startUpload">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 抽屉菜单-其他相册 -->
    <el-drawer title="移动到哪个相册？" :visible.sync="otherCategoryDrawerOpen" :direction="direction"
      :before-close="otherCategoryClose">
      <div id="other-category-box">
        <a class="other-category-item" v-for="(item, index) in otherCategory" :key="index" @click="moveImage(item)">
          {{ item.label }}</a>
      </div>
    </el-drawer>


  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import { v4 as uuidv4 } from 'uuid'
import UploadImageItem from '../../components/image/upload-image-item.vue'
import $ from 'jquery'

Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.component("UploadImageItem", UploadImageItem);



export default {
  data() {
    return {
      otherCategoryDrawerOpen: false,
      direction: 'rtl',
      hdModel: "info",//高清预览模式
      loading: {},
      menuIsOpen: false,//编辑菜单是否打开
      isEdit: false,//是否是编辑状态
      otherCategory: [],//其他相册
      otherCategoryValue: "",
      privateStatusResetMessage: "",
      token: "",
      categoryId: "",
      password: "",
      newPassword: "",
      repeatPassword: "",
      pageNum: 1,
      pageSize: 50,
      isPrivate: 0,
      categoryName: "",
      categoryImageCount: 0,
      dataCount: 0,
      imageBeans: [],
      thumbnailImages: [],
      sourceImages: [],
      checkedImageCount: 0,
      moveImageDdialogVisible: false,
      targetCategoryId: "",
      targetCategoryName: "",
      deleteImageDdialogVisible: false,
      resetPrivateStatusDdialogVisible: false,
      setPasswordDdialogVisible: false,
      uploadDdialogVisible: false,
      uploadFileList: [],
      host: "127.0.0.1"
    }
  },

  methods: {
    closeUploadImageDialog() {
      this.uploadDdialogVisible = false;
      this.uploadFileList = [];
      var file = document.getElementById("file");
      file.value = "";
    },
    otherCategoryClose() {
      this.otherCategoryDrawerOpen = false;
    },
    moveImage(item) {
      this.targetCategoryId = item.value
      this.targetCategoryName = item.label
      this.moveImageDdialogVisible = true;
      this.otherCategoryValue = "";
      this.otherCategoryDrawerOpen = false;
    },
    hdPreview() {
      if (this.hdModel === "info") {
        this.hdModel = "primary";
      } else {
        this.hdModel = "info";

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
    requestImages() {
      var self = this;
      axios.get("https://www.li-xyz.com/LifeKeeper/GetImages?cp=" + this.pageNum + "&ps=" + this.pageSize, {
        headers: {
          'Token': this.token,
          "CategoryId": this.categoryId,
          "Password": this.password.trim(),
        }
      }).then((result) => {
        this.hideLoading();
        this.closeMenu();
        if (result.status == 200) {
          this.sourceImages = [];
          this.imageBeans = [];
          this.thumbnailImages = [];
          if (result.data.result) {
            this.categoryImageCount = result.data.resultObject.imageCount;
            this.categoryName = result.data.resultObject.categoryName
            result.data.resultObject.images.forEach(function (item) {
              item.checked = false;
              self.imageBeans.push(item);
            })
            this.dataCount = result.data.resultObject.imageCount;
            this.thumbnailImages = [];
            for (var i = 0; i < this.imageBeans.length; i++) {
              var thumbnailSrc = 'https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperImage/' + this.imageBeans[i].imageUser + '/cover/' +
                this.imageBeans[i].coverFileName;
              this.thumbnailImages.push(thumbnailSrc);

              var sourceSrc = 'https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperImage/' + this.imageBeans[i].imageUser + '/source/' +
                this.imageBeans[i].sourceFileName;
              this.sourceImages.push(sourceSrc);
            }
          } else {
            this.$message.error('出错啦，请检查后重试1');
          }
        } else {
          this.$message.error('出错啦，请检查后重试2');
        }
      })
      this.hideLoading();
    },
    requestOtherCategory() {
      let self = this;
      axios.get("https://www.li-xyz.com/LifeKeeper/GetOtherImageCategory", {
        headers: {
          'Token': this.token,
          "CategoryId": this.categoryId,
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            result.data.resultObject.forEach(function (item) {
              var obj = {};
              obj.label = item.categoryName;
              obj.value = item.categoryId;
              self.otherCategory.push(obj);
            })
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
      this.hideLoading();
    },
    getSrcList(index) {
      if (this.hdModel === "primary") {
        return this.sourceImages.slice(index).concat(this.sourceImages.slice(0, index))
      } else {
        return this.thumbnailImages.slice(index).concat(this.thumbnailImages.slice(0, index))
      }
    },
    pageSizeChange: function (size) {
      this.pageSize = size;
      this.requestImages();
    },
    deleteImageButtonClick() {
      if (this.checkedImageCount > 0) {
        this.deleteImageDdialogVisible = true;
      } else {
        this.$message.error('还没有选择要删除的照片呢');
      }
    },
    moveImageButtonClick() {
      if (this.checkedImageCount > 0) {
        this.otherCategoryDrawerOpen = true;
      } else {
        this.$message.error('还没有选择要删除的照片呢');
      }
    },
    pageChange(index) {
      this.pageNum = index;
      this.requestImages();
    },
    checkStatusChange(event, index) {
      var bean = this.imageBeans[index];
      bean.checked = event;
      if (event) {
        this.checkedImageCount++;
      } else {
        this.checkedImageCount--;
      }
    },
    maskClick(index) {
      var bean = this.imageBeans[index];
      bean.checked = !bean.checked;
      if (bean.checked) {
        this.checkedImageCount++;
      } else {
        this.checkedImageCount--;
      }
    },
    openMenu() {
      let div = document.getElementById("images-edit-box");
      div.style.animation = "openMenu 0.5s";
      div.style.animationFillMode = "forwards";
      this.menuIsOpen = true;
      div.style.height = "3vw";
    },
    closeMenu() {
      let div = document.getElementById("images-edit-box");
      div.style.animation = "closeMenu 0.5s";
      div.style.animationFillMode = "forwards";
      this.menuIsOpen = false;
      this.isEdit = false;
      div.style.height = "0px";
      if (this.checkedImageCount > 0) {
        this.imageBeans.forEach(item => {
          item.checked = false;
        });
      }
      this.checkedImageCount = 0;
    },
    editable(status) {
      this.isEdit = status;
      if (status) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    },
    closeMoveImageDialog() {
      this.moveImageDdialogVisible = false;
      this.uploadDdialogVisible = false
    },
    submitMoveImage() {
      this.moveImageDdialogVisible = false;
      this.showLoading();
      this.isEdit = false;
      var list = [];
      if (this.checkedImageCount > 0) {
        this.imageBeans.forEach(item => {
          if (item.checked) {
            list.push(item.objectId);
          }
        })
        var obj = {
          "targetCategoryId": this.targetCategoryId,
          "images": list
        }
        axios.post("https://www.li-xyz.com/LifeKeeper/MoveImages", JSON.stringify(obj), {
          headers: {
            'Token': this.token,
            "Content-Type": "application/json",
            dataType: "json",
          }
        }).then((result) => {
          if (result.status == 200) {
            this.requestImages();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
          this.hideLoading();
        })
      } else {
        this.hideLoading();
        this.$message.error('还没有选择要移动的照片呢');
      }
    },
    submitDeleteImage() {
      this.deleteImageDdialogVisible = false;
      this.showLoading();
      this.isEdit = false;
      var list = [];
      if (this.checkedImageCount > 0) {
        this.imageBeans.forEach(item => {
          if (item.checked) {
            list.push(item.objectId);
          }
        })
        axios.post("https://www.li-xyz.com/LifeKeeper/DeleteImage", JSON.stringify(list), {
          headers: {
            'Token': this.token,
            "Content-Type": "application/json",
            dataType: "json",
          }
        }).then((result) => {
          if (result.status == 200) {
            this.requestImages();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
          this.hideLoading();
        })
      } else {
        this.hideLoading();
        this.$message.error('还没有选择要删除的照片呢');
      }
    },
    resetPrivateStatus() {
      if (this.isPrivate > 0) {
        this.resetPrivateStatusDdialogVisible = true;
      } else {
        this.setPasswordDdialogVisible = true;
        this.newPassword = "";
        this.repeatPassword = "";
      }
    },
    submitSetCategoryPublic() {
      this.resetPrivateStatusDdialogVisible = false;
      this.closeMenu();
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/SetImageCategoryPublic", {
        headers: {
          'Token': this.token,
          "CategoryId": this.categoryId,
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            this.$message({
              message: '设置成功',
              type: 'success'
            });
            this.isPrivate = -1;
            this.privateStatusResetMessage = "将相册设置为加密";
            this.password = this.$md5("" + 'LifeKeeper');
            sessionStorage.setItem("pass", this.password);
            sessionStorage.setItem("ImageCategoryIsPrivate", -1);
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
      this.hideLoading();
    },
    submitSetCategoryPrivate() {
      this.setPasswordDdialogVisible = false;
      if (this.newPassword.length === 0 || this.repeatPassword.length === 0) {
        this.$message({
          message: '密码不能为空',
          type: 'warning'
        });
        return;
      }
      if (this.newPassword != this.repeatPassword) {
        this.$message({
          message: '密码两次输入不一致',
          type: 'warning'
        });
        return;
      }

      this.closeMenu();
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/SetImageCategoryPrivate", {
        headers: {
          'Token': this.token,
          "CategoryId": this.categoryId,
          "Password": this.$md5(this.newPassword.trim() + 'LifeKeeper'),
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            this.$message({
              message: '设置成功',
              type: 'success'
            });
            this.isPrivate = 1;
            this.privateStatusResetMessage = "将相册设置为非加密";
            this.password = this.$md5(this.newPassword.trim() + 'LifeKeeper');
            sessionStorage.setItem("pass", this.password);
            sessionStorage.setItem("ImageCategoryIsPrivate", 1);
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
      this.hideLoading();
    },
    showUploadDialog() {
      $("#images-upload-button-container").show();
      this.uploadDdialogVisible = true;
    },
    showPreview(source) {
      let fileList = source.target.files;
      for (var i = 0; i < fileList.length; i++) {
        var obj = {
          objectId: uuidv4(),
          progress: 0,
          file: fileList[i],
          fileName: fileList[i].name
        }
        this.uploadFileList.push(obj);
      }
      $("#images-upload-button-container").hide();
    },
    startUpload() {
      for (var i = 0; i < this.uploadFileList.length; i++) {
        this.uploadRequest(this.uploadFileList[i]);
      }
      var file = document.getElementById("file");
      file.value = "";
    },
    uploadRequest(item) {
      let self = item;
      let message = {
        "objectId": uuidv4(),
        "imageId": uuidv4(),
        "sha1": "",
        "fileCategory": this.categoryId,
        "originalFileName": item.file.name,
        "sourceFileName": item.file.name,
        "coverFileName": uuidv4() + ".webp",
        "thumbnailFileName": uuidv4() + ".webp",
        "blurFileName": uuidv4() + ".webp",
        "imageUser": this.token,
        "imageStatus": 1,
        "imageType": 0,
        "createTime": Math.round(new Date().getTime()),
        "updateTime": 0
      }
      let data = new FormData();
      data.append('sourceFile', item.file);
      data.append('imageBean', JSON.stringify(message));
      return axios.request({
        url: 'https://www.li-xyz.com/LifeKeeper/UploadImage',
        headers: {
          "Token": this.token
        },
        method: 'post',
        data: data,
        onUploadProgress: progressEvent => {
          const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
          item.progress = complete;
        },
      }).then((result) => {
        if (result.data.result) {
          this.uploadFileList = this.uploadFileList.filter((item) => {
            return item.objectId !== self.objectId
          })
          if (this.uploadFileList.length === 0) {
            this.uploadDdialogVisible = false;
            this.requestImages();
          }
        }
      })
    },
    removeItem(fileName, objectId) {
      this.uploadFileList = this.uploadFileList.filter((item) => {
        return item.objectId !== objectId
      })
      if (this.uploadFileList.length === 0) {
        $("#images-upload-button-container").show();
        var file = document.getElementById("file");
        file.value = "";
      }
    }
  },
  watch: {

  },
  mounted() {
    this.showLoading();
    let storage = window.sessionStorage;
    this.token = storage.getItem("UserId");
    this.categoryId = storage.imageCategoryId;
    this.password = storage.pass;
    this.isPrivate = storage.ImageCategoryIsPrivate;
    console.log(this.isPrivate);
    if (this.isPrivate > 0) {
      this.privateStatusResetMessage = "将相册设置为非加密";
    } else {
      this.privateStatusResetMessage = "将相册设置为加密";
    }
    console.log(this.privateStatusResetMessage);
    this.requestImages();
    this.requestOtherCategory();
    this.closeMenu();
  }
}
</script>

<style>
#RfHRrZ #other-category-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#RfHRrZ .other-category-item {
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 15px;
}

#RfHRrZ .other-category-item:hover {
  background-color: #77bfa3;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

#RfHRrZ {
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: auto;
  background-color: white;
}

#RfHRrZ .images-top-bar {
  width: 80vw;
  height: 5vw;
  color: white;
  font-size: 30px;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  background-color: #77bfa3;
  box-shadow: 5px 5px 5px #888888;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  position: sticky;
  top: 0px;
}

#RfHRrZ .images-edit-box {
  width: 80vw;
  height: 3vw;
  background-color: #77bfa3;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;
  margin-top: 0.5vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  position: sticky;
  top: 5.5vw;
  z-index: 999;
}

#RfHRrZ .move-image {
  flex-grow: 1;
}

#RfHRrZ .edit-item {
  margin-left: 10px;
  margin-right: 10px;
}


@keyframes openMenu {
  0% {
    transform: translate(0, -3vw);
  }

  100% {
    transform: translate(0, 0vw);
  }
}

@keyframes closeMenu {
  0% {
    transform: translate(0, 0vw);
  }

  100% {
    transform: translate(0, -5vw);
  }
}


#RfHRrZ #images-images-box {
  width: 80vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: white;
}

#RfHRrZ .images-image-item-box {
  width: 15vw;
  height: 15vw;
  margin: 0.5vw;
  position: relative;
}

#RfHRrZ .images-image {
  width: 100%;
  height: 100%;
  margin: 0px;
}

#RfHRrZ .images-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

#RfHRrZ #images-upload-button-container {
  border-style: dotted;
  border-width: 1px;
  width: 100%;
}

#RfHRrZ .images-input-file {
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

#RfHRrZ .images-input-file+label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  display: inline-block;
}


@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/c/font_2994771_tffa6hkhpwa.woff2?t=1673629929340') format('woff2'),
    url('//at.alicdn.com/t/c/font_2994771_tffa6hkhpwa.woff?t=1673629929340') format('woff'),
    url('//at.alicdn.com/t/c/font_2994771_tffa6hkhpwa.ttf?t=1673629929340') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-gaoqing:before {
  content: "\e601";
}
</style>
