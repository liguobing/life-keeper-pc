<template>
  <div id="index-root-box">
    <div class="container" id="container">
      <div class="card" id="account_book" @click="navToAccount">
        <div class="imgBx">
          <img src="../assets/images/account_book.png" alt="">
        </div>
        <div class="contentBx">
          <h2>账本</h2>
        </div>
      </div>
      <div class="card" id="plan" @click="navToPlan">
        <div class="imgBx">
          <img src="../assets/images/plan.png" alt="">
        </div>
        <div class="contentBx">
          <h2>计划</h2>
        </div>
      </div>
      <div class="card" id="file" @click="navToFile">
        <div class="imgBx">
          <img src="../assets/images/file.png" alt="">
        </div>
        <div class="contentBx">
          <h2>文件</h2>
        </div>
      </div>
      <div class="card" id="image" @click="navToImage">
        <div class="imgBx">
          <img src="../assets/images/image.png" alt="">
        </div>
        <div class="contentBx">
          <h2>图片</h2>
        </div>
      </div>
      <div class="card" id="video" @click="navToVideo">
        <div class="imgBx">
          <img src="../assets/images/video.png" alt="">
        </div>
        <div class="contentBx">
          <h2>视频</h2>
        </div>
      </div>
      <div class="card" id="recording" @click="navToRecord">
        <div class="imgBx">
          <img src="../assets/images/recording.png" alt="">
        </div>
        <div class="contentBx">
          <h2>通话录音</h2>
        </div>
      </div>
    </div>
    <!--用户信息-->
    <div class="user_info">
      <img id="user_icon" :src="userIcon" style="width: 100px;height: 100px" class="rounded-circle"
        @click="navToUserCenter">
      <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <a id="user_name" @click="navToUserCenter">{{ nickName }}</a>
        <i class="iconfont icon-tuichu" @click="logout" id="logout-icon" style="font-size: 20px; color: gray;"></i>
      </div>
    </div>

    <el-dialog title="登录" :visible.sync="loginDialogVisible" width="30%" center>
      <el-input v-model="username" placeholder="请输入用户名/手机号"></el-input>
      <el-input v-model="password" placeholder="请输入密码" type="password" style="margin-top:10px"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="login">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import icon from "../assets/images/usericon.png"
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import $ from 'jquery'


Vue.use(ElementUI);
Vue.prototype.axios = axios;

export default {
  data() {
    return {
      token: "",
      loading: {},
      loginDialogVisible: false,
      username: "",
      password: "",
      userIcon: icon,
      nickName: "未登录",
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
    isLogin() {
      let storage = window.sessionStorage;
      let userId = storage.getItem("UserId");
      return userId != null;
    },
    logout() {
      let storage = window.sessionStorage;
      storage.removeItem("UserId");
      storage.removeItem("UserName");
      storage.removeItem("UserIconUrl");
      this.loginDialogVisible = true;
      this.token = "";
      this.userIcon = icon;
      this.nickName = "未登录";
      $("#logout-icon").hide();
    },
    login() {
      if (this.username.trim().length === 0) {
        this.$message.error('用户名/手机号不能为空');
        return;
      }
      if (this.password.trim().length === 0) {
        this.$message.error('用户名/手机号不能为空');
        return;
      }
      this.loginDialogVisible = false;
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/Login?phone=" + this.username + "&password=" + this.$md5(this.username.trim() + this.password.trim() + 'LifeKeeper')).then((result) => {
        if (result.status == 200) {
          if (result.data.result) {
            var userBean = result.data.resultObject;
            let sessionStorage = window.sessionStorage;
            sessionStorage.setItem("UserId", userBean.userId);
            sessionStorage.setItem("UserName", userBean.userName);
            sessionStorage.setItem("UserIconUrl", "https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperUserIcon/" + userBean.userIconUrl);

            this.token = userBean.userId;
            this.userIcon = "https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperUserIcon/" + userBean.userIconUrl;
            this.nickName = userBean.userName;
            $("#logout-icon").show();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
        this.username = "";
        this.password = "";
        this.hideLoading();
      })
    },
    navToAccount() {
      if (this.isLogin()) {
        this.$router.push({ name: "accountIndex" })
      } else {
        this.loginDialogVisible = true;
      }
    },
    navToUserCenter() {
      if (this.isLogin()) {
        this.$router.push({ name: "userCenter" })
      } else {
        this.loginDialogVisible = true;
      }
    },
    navToFile() {
      this.$message({
        message: '等我把我的 PDF 整理上传之后就开放',
        type: 'success'
      });
    },
    navToImage() {
      if (this.isLogin()) {
        this.$router.push({ name: "imageCategory" })
      } else {
        this.loginDialogVisible = true;
      }
    },
    navToVideo() {
      if (this.isLogin()) {
        this.$router.push({ name: "videoCategory" })
      } else {
        this.loginDialogVisible = true;
      }
    },
    navToRecord() {
      if (this.isLogin()) {
        this.$router.push({ name: "record" })
      } else {
        this.loginDialogVisible = true;
      }
    },
    navToPlan() {
      if (this.isLogin()) {
        this.$router.push({ name: "planIndex" })
      } else {
        this.loginDialogVisible = true;
      }
    },
    setUserInfo() {
      let storage = window.sessionStorage;
      this.nickName = storage.getItem("UserName");
      this.userIcon = storage.getItem("UserIconUrl");
    }
  },
  watch: {
  },
  mounted() {
    if (!this.isLogin()) {
      this.loginDialogVisible = true;
      $("#logout-icon").hide();
    } else {
      this.setUserInfo();
      $("#logout-icon").show();
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.container .card {
  width: 40vw;
  margin: 10px;
  padding: 40px 30px;
  background: #ebf5fc;
  border-radius: 40px;
  box-shadow: -6px -6px 20px rgba(255, 255, 255, 1),
    6px 6px 20px rgba(0, 0, 0, .1);
}

.container .card:hover {
  box-shadow: inset -6px -6px 10px rgba(255, 255, 255, 0.5),
    inset 6px 6px 20px rgba(0, 0, 0, 0.05);
}

.container .card .imgBx {
  position: relative;
  text-align: center;
}

.container .card .imgBx img {
  max-width: 50%;
}

.container .card .contentBx {
  position: relative;
  margin-top: 20px;
  text-align: center;
}

.container .card .contentBx h2 {
  color: #32a3b1;
  font-weight: 700;
  font-size: 1.4em;
  letter-spacing: 2px;
}

.container .card .contentBx p {
  color: #32a3b1;
}

.container .card .contentBx a {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 15px;
  border-radius: 40px;
  color: #32a3b1;
  font-size: 16px;
  text-decoration: none;
  box-shadow: -4px -4px 15px rgba(255, 255, 255, 1),
    4px 4px 15px rgba(0, 0, 0, .1);
}

.container .card .contentBx a:hover {
  box-shadow: inset -4px -4px 10px rgba(255, 255, 255, 0.5),
    inset 4px 4px 10px rgba(0, 0, 0, .1);
}

.container .card .contentBx a:hover span {
  display: block;
  transform: scale(0.98);
}

.container .card:hover .imgBx,
.container .card:hover .contentBx {
  transform: scale(0.98);
}

.user_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#user_icon {
  margin-top: 30px;
  border-radius: 50%;
  margin-bottom: 30px;
}


@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/c/font_2994771_gtu7cn13wwb.woff2?t=1673694041372') format('woff2'),
    url('//at.alicdn.com/t/c/font_2994771_gtu7cn13wwb.woff?t=1673694041372') format('woff'),
    url('//at.alicdn.com/t/c/font_2994771_gtu7cn13wwb.ttf?t=1673694041372') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-tuichu:before {
  content: "\e606";
}
</style>
