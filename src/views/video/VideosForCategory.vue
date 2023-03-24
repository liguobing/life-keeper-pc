<template>
  <div id="VomCie">
    <div class="videos-top-bar">
      <div style="display: flex;flex-direction: column;">
        <a style="margin-left:10px">{{ categoryName }}</a>
        <a style="font-size:5px">该分类共有 {{ categoryVideoCount }} 个视频</a>
      </div>
      <div style="flex-grow: 1;"></div>
      <!-- 完成按钮 -->
      <el-button class="edit-item" v-show="isEdit" type="primary" icon="el-icon-check" round
        @click="editable(false)">完成</el-button>
      <!-- 编辑按钮 -->
      <el-button class="edit-item" v-show="!isEdit" type="primary" icon="el-icon-edit" round
        @click="editable(true)">编辑</el-button>
      <!-- 上传视频按钮 -->
      <el-button class="edit-item" type="primary" icon="el-icon-upload" round @click="showUploadDialog">上传视频</el-button>
    </div>
    <div class="videos-edit-box" id="videos-edit-box">
      <!-- 全选 -->
      <div style="flex-grow: 1;"></div>
      <!-- 移动分类 -->
      <el-button class="edit-item" v-show="isEdit" type="primary" icon="el-icon-guide" @click="moveVideoButtonClick"
        round>移动到其他分类</el-button>
      <!-- 删除 -->
      <el-button class="edit-item" v-show="isEdit" type="danger" icon="el-icon-delete" @click="deleteVideoButtonClick"
        round>删除选中</el-button>
      <!-- 私密状态 -->
      <el-button @click="resetPrivateStatus" class="edit-item" v-show="isEdit" type="warning" icon="el-icon-unlock" round>
        {{ privateStatusResetMessage }}</el-button>
    </div>
    <div id="videos-videos-box">
      <div class="videos-video-item-box" v-for="(item, index) in videoBeans" :key="index">
        <el-image class="videos-video" :src="'https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperPhoneVideo/' + item.videoUser + '/thumbnail/' +
          item.thumbnailFileName" @click="playVideo(item)">
        </el-image>
        <div class="videos-mask" v-show="isEdit" @click="maskClick(index)">
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
    <!-- 移动视频Dialog -->
    <el-dialog title="移动视频" :visible.sync="moveVideoDdialogVisible" width="30%" :before-close="closeMoveVideoDialog"
      :show-close=false>
      <span>确定要将这些视频移动到 {{ targetCategoryName }} 分类吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveVideoDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMoveVideo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除视频 Dialog -->
    <el-dialog title="删除视频" :visible.sync="deleteVideoDdialogVisible" width="30%" :before-close="closeMoveVideoDialog"
      :show-close=false>
      <span>确定要删除这些视频吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVideoDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDeleteVideo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 更改分类私密状态 Dialog -->
    <el-dialog title="" :visible.sync="resetPrivateStatusDdialogVisible" width="30%" :before-close="closeMoveVideoDialog"
      :show-close=false>
      <span>确定要将该分类设置为公开吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPrivateStatusDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetCategoryPublic">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置分类密码 Dialog -->
    <el-dialog title="请输入密码" :visible.sync="setPasswordDdialogVisible" width="30%" :before-close="closeMoveVideoDialog"
      :show-close=false>
      <el-input v-model="newPassword" placeholder="请输入密码" type="password"></el-input>
      <el-input v-model="repeatPassword" placeholder="请重复密码" type="password" style="margin-top:10px"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPasswordDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetCategoryPrivate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传视频 Dialog -->
    <el-dialog title="上传视频" :visible.sync="uploadDdialogVisible" width="30%" :before-close="closeUploadVideoDialog"
      :show-close=false>
      <div>
        <UploadImageItem v-for="(item, index) in uploadFileList" :key="index" v-on:itemDeleteClick="removeItem"
          :FileName="item.fileName" :Percent="item.progress" :ObjectId="item.objectId">
        </UploadImageItem>
      </div>
      <div id="videos-upload-button-container">
        <input type="file" name="file" id="file" class="videos-input-file" @change="showPreview($event)" accept="video/*"
          multiple />
        <label for="file" class="label_container"
          style="display: flex;flex-direction: column;justify-content: center;align-items: center">
          <i class="el-icon-upload" style="color:black"></i>
          <a style="color: #777777">点击选择视频</a>
        </label>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUploadVideoDialog">取 消</el-button>
        <el-button type="primary" @click="startUpload">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 播放 Dialog -->
    <el-dialog :visible.sync="playerDdialogVisible" width='680px' heigth="400px" top="15vh"
      :before-close="closePlayDialog">
      <video-player :volume="volume" class="vjs-default-skin vjs-big-play-centered" :options="playerOptions"
        @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" ref="videoPlayRef">
      </video-player>
    </el-dialog>
    <!-- 其他视频分类抽屉菜单 -->
    <el-drawer title="将视频移动到其他分类" :visible.sync="otherCategoryDrawerOpen" :direction="direction"
      :before-close="otherCategoryClose">
      <div id="other-category-box">
        <a class="other-category-item" v-for="(item, index) in otherCategory" :key="index" @click="moveVideo(item)">
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
import md5 from 'js-md5';

Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.component("UploadImageItem", UploadImageItem);

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)


export default {
  data() {
    return {
      host: "127.0.0.1",
      otherCategoryDrawerOpen: false,
      direction: 'rtl',
      volume: 0.1,
      hdModel: "info",//高清预览模式
      loading: {},
      menuIsOpen: false,//编辑菜单是否打开
      isEdit: false,//是否是编辑状态
      otherCategory: [],//其他分类
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
      categoryVideoCount: 0,
      dataCount: 0,
      videoBeans: [],
      checkedVideoCount: 0,
      moveVideoDdialogVisible: false,
      targetCategoryId: "",
      targetCategoryName: "",
      deleteVideoDdialogVisible: false,
      resetPrivateStatusDdialogVisible: false,
      setPasswordDdialogVisible: false,
      uploadDdialogVisible: false,
      uploadFileList: [],
      playerDdialogVisible: false,
      playerOptions: {
        volume: 0.1,
        autoplay: true, //如果true,浏览器准备好时开始回放。实现自动播放，autoplay、muted都设置为true
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "https://www.ziguizhifu.com:10377/zipTest/Demo/20220701115406.mp4", //url地址
          },
        ],
        width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
    }
  },

  methods: {
    closeUploadVideoDialog() {
      this.uploadDdialogVisible = false;
      this.uploadFileList = [];
      var file = document.getElementById("file");
      file.value = "";
    },
    otherCategoryClose() {
      this.otherCategoryDrawerOpen = false;
    },
    moveVideoButtonClick() {
      if (this.checkedVideoCount > 0) {
        this.otherCategoryDrawerOpen = true;
      } else {
        this.$message.error('还没有选择要删除的照片呢');
      }
    },
    maskClick(index) {
      var bean = this.videoBeans[index];
      bean.checked = !bean.checked;
      if (bean.checked) {
        this.checkedVideoCount++;
      } else {
        this.checkedVideoCount--;
      }
    },
    deleteVideoButtonClick() {
      if (this.checkedVideoCount > 0) {
        this.deleteVideoDdialogVisible = true
      } else {
        this.$message.error('还没有选择要删除的照片呢');
      }
    },
    moveVideo(item) {
      this.targetCategoryId = item.value
      this.targetCategoryName = item.label
      this.moveVideoDdialogVisible = true;
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
    requestVideos() {
      var self = this;
      axios.get("https://www.li-xyz.com/LifeKeeper/GetVideos?cp=" + this.pageNum + "&ps=" + this.pageSize, {
        headers: {
          'Token': this.token,
          "CategoryId": this.categoryId,
          "Password": this.password.trim(),
        }
      }).then((result) => {
        this.hideLoading();
        this.closeMenu();
        if (result.status == 200) {
          if (result.data.result) {
            this.videoBeans = [];
            this.categoryName = result.data.resultObject.categoryName;
            this.categoryVideoCount = result.data.resultObject.videoCount;
            this.dataCount = result.data.resultObject.videoCount;
            result.data.resultObject.videos.forEach(function (item) {
              item.checked = false;
              self.videoBeans.push(item);
            })
          } else {
            this.$message.error('出错啦，请检查后重试1');
          }
        } else {
          this.$message.error('出错啦，请检查后重试2');
        }
      })
      this.hideLoading();
    },
    // 获取其他视频分类
    requestOtherCategory() {
      let self = this;
      axios.get("https://www.li-xyz.com/LifeKeeper/GetOtherVideoCategory", {
        headers: {
          'Token': this.token,
          "Category": this.categoryId,
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
    pageSizeChange: function (size) {
      this.pageSize = size;
      this.requestVideos();
    },
    pageChange(index) {
      this.pageNum = index;
      this.requestVideos();
    },
    checkStatusChange(event, index) {
      var bean = this.videoBeans[index];
      bean.checked = event;
      if (event) {
        this.checkedVideoCount++;
      } else {
        this.checkedVideoCount--;
      }
    },
    openMenu() {
      let div = document.getElementById("videos-edit-box");
      div.style.animation = "openMenu 0.5s";
      div.style.animationFillMode = "forwards";
      this.menuIsOpen = true;
      div.style.height = "3vw";
    },
    closeMenu() {
      let div = document.getElementById("videos-edit-box");
      div.style.animation = "closeMenu 0.5s";
      div.style.animationFillMode = "forwards";
      this.menuIsOpen = false;
      this.isEdit = false;
      div.style.height = "0px";
      if (this.checkedVideoCount > 0) {
        this.videoBeans.forEach(item => {
          item.checked = false;
        });
      }
      this.checkedVideoCount = 0;
    },
    editable(status) {
      this.isEdit = status;
      if (status) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    },
    otherCategorySelected(event) {
      let choosenItem = this.otherCategory.filter((val) => {
        return event == val.value;
      });
      this.targetCategoryId = choosenItem[0].value
      this.targetCategoryName = choosenItem[0].label
      this.moveVideoDdialogVisible = true;
      this.otherCategoryValue = "";
    },
    closeMoveVideoDialog() {
      this.moveVideoDdialogVisible = false;
      this.uploadDdialogVisible = false
    },
    submitMoveVideo() {
      this.moveVideoDdialogVisible = false;
      this.showLoading();
      this.isEdit = false;
      var list = [];
      if (this.checkedVideoCount > 0) {
        this.videoBeans.forEach(item => {
          if (item.checked) {
            list.push(item.objectId);
          }
        })
        var obj = {
          "targetCategoryId": this.targetCategoryId,
          "videos": list
        }
        axios.post("https://www.li-xyz.com/LifeKeeper/MoveVideos", JSON.stringify(obj), {
          headers: {
            'Token': this.token,
            "Content-Type": "application/json",
            dataType: "json",
          }
        }).then((result) => {
          if (result.status == 200) {
            this.requestVideos();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
          this.hideLoading();
        })
      } else {
        this.hideLoading();
        this.$message.error('还没有选择要移动的视频呢');
      }
    },
    submitDeleteVideo() {
      this.deleteVideoDdialogVisible = false;
      this.showLoading();
      this.isEdit = false;
      var list = [];
      if (this.checkedVideoCount > 0) {
        this.videoBeans.forEach(item => {
          if (item.checked) {
            list.push(item.objectId);
          }
        })
        axios.post("https://www.li-xyz.com/LifeKeeper/DeleteVideo", JSON.stringify(list), {
          headers: {
            'Token': this.token,
            "Content-Type": "application/json",
            dataType: "json",
          }
        }).then((result) => {
          if (result.status == 200) {
            this.requestVideos();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
          this.hideLoading();
        })
      } else {
        this.hideLoading();
        this.$message.error('还没有选择要删除的视频呢');
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
      axios.get("https://www.li-xyz.com/LifeKeeper/SetVideoCategoryPublic", {
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
            this.privateStatusResetMessage = "将分类设置为加密";
            this.password = this.$md5("" + 'LifeKeeper');
            sessionStorage.setItem("pass",this.password);
            sessionStorage.setItem("categoryIsPrivate", -1);
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
      axios.get("https://www.li-xyz.com/LifeKeeper/SetVideoCategoryPrivate", {
        headers: {
          'Token': this.token,
          "CategoryId": this.categoryId,
          "Password": this.$md5(this.newPassword.trim() + 'LifeKeeper')
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
            this.privateStatusResetMessage = "将分类设置为非加密";
            this.password = this.$md5(this.newPassword + 'LifeKeeper');
            sessionStorage.setItem("pass", this.password);
            sessionStorage.setItem("categoryIsPrivate", 1);
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
      $("#videos-upload-button-container").show();
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
      $("#videos-upload-button-container").hide();
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
        "videoId": uuidv4(),
        "sha1": "",
        "duration": 0,
        "fileCategory": this.categoryId,
        "originalFileName": item.file.name,
        "sourceFileName": item.file.name,
        "coverFileName": uuidv4() + ".webp",
        "thumbnailFileName": uuidv4() + ".webp",
        "blurFileName": uuidv4() + ".webp",
        "videoUser": this.token,
        "videoStatus": 1,
        "createTime": Math.round(new Date().getTime()),
        "videoWidth": 0,
        "videoHeight": 0
      }
      let data = new FormData();
      data.append('sourceFile', item.file);
      data.append('videoBean', JSON.stringify(message));
      return axios.request({
        url: 'https://www.li-xyz.com/LifeKeeper/UploadVideo',
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
            this.requestVideos();
          }
        }
      })
    },
    removeItem(fileName, objectId) {
      this.uploadFileList = this.uploadFileList.filter((item) => {
        return item.objectId !== objectId
      })
      if (this.uploadFileList.length === 0) {
        $("#videos-upload-button-container").show();
        var file = document.getElementById("file");
        file.value = "";
      }
    },
    playVideo(item) {
      this.playerDdialogVisible = true;
      this.playerOptions.sources[0].src = "https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperPhoneVideo/" + item.videoUser + "/videos/" + item.sourceFileName;
    },
    onPlayerPlay(event) {
      let myPlayer = this.$refs.videoPlayRef.player;
      myPlayer.volume(0.1);
    },
    onPlayerEnded(event) {
    },
    onPlayerLoadeddata(event) {
    },
    onPlayerPause(event) {
    },
    closePlayDialog() {
      this.playerDdialogVisible = false
      let myPlayer = this.$refs.videoPlayRef.player;
      myPlayer.pause();
    }
  },
  watch: {

  },
  mounted() {
    this.showLoading();
    let storage = window.sessionStorage;
    this.token = storage.getItem("UserId");
    this.categoryId = sessionStorage.videoCategoryId;
    this.password = sessionStorage.pass;
    this.isPrivate = sessionStorage.categoryIsPrivate;
    if (this.isPrivate > 0) {
      this.privateStatusResetMessage = "将分类设置为非加密";
    } else {
      this.privateStatusResetMessage = "将分类设置为加密";
    }
    this.requestVideos();
    this.requestOtherCategory();
    this.closeMenu();
  }
}
</script>

<style>
#VomCie #other-category-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#VomCie .other-category-item {
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 15px;
}

#VomCie {
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: auto;
  background-color: white;
}

#VomCie .videos-top-bar {
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

#VomCie .videos-edit-box {
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
  position: sticky;
  top: 5.5vw;
  z-index: 999;
  padding-bottom: 10px;
  padding-top: 10px;
}

#VomCie .move-video {
  flex-grow: 1;
}

#VomCie .edit-item {
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


#VomCie #videos-videos-box {
  width: 80vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: white;
}

#VomCie .videos-video-item-box {
  width: 15vw;
  height: 15vw;
  margin: 0.5vw;
  position: relative;
}

#VomCie .videos-video {
  width: 100%;
  height: 100%;
  margin: 0px;
}

#VomCie .videos-mask {
  /* position: relative;
  top: -15vw;
  left: -7vw; */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

#VomCie #videos-upload-button-container {
  border-style: dotted;
  border-width: 1px;
  width: 100%;
}

#VomCie .videos-input-file {
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

#VomCie .videos-input-file+label {
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
