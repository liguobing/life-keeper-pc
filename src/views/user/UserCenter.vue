<template>
  <div id="LSqOECVc">
    <div id="grecaptcha"></div>
    <div id="user-center-content-box">
      <div id="user-center-userIcon-box">
        <el-avatar id="user-center-userIcon" :src="userIcon"></el-avatar>
        <div id="user-center-userIcon-mask" @click="editAvatar">点击修改</div>
      </div>


      <el-collapse v-model="activeNames" @change="handleChange" id="collapse" accordion style="margin-top:20px">
        <el-collapse-item title="修改密码" name="1" class="collapse-item">
          <div id="user-center-change-password-box">
            <div
              style="margin-top:10px;margin-bottom:10px;display: flex;flex-direction: row;justify-content: center;align-items: center;">
              <el-input v-model="resetPasswordPhone" placeholder="请输入登录的手机号"></el-input>
              <el-button type="primary" round style="width:10vw;margin-left: 10px;" @click="resetPasswordGetCode"
                :disabled="requerstChangePasswordSMSCodeButtonDisabled">{{ resetPasswordRequestCodeButtonContent
                }}</el-button>
            </div>
            <el-input v-model="resetPasswordVerifyCode" style="margin-bottom: 10px;" placeholder="请输入收到的验证码"></el-input>
            <el-input v-model="resetPasswordValue" type="password" placeholder="请输入新密码"></el-input>
            <el-input v-model="repeatPasswordValue" type="password" placeholder="请重复输入密码"
              style="margin-top:10px;margin-bottom:10px"></el-input>
            <el-button type="primary" round style="width:100%" @click="submitResetPassword"
              :disabled="resetPasswordButtonDisabled">提交修改</el-button>
          </div>
        </el-collapse-item>

        <el-collapse-item title="更新手机号" name="2" class="collapse-item">
          <div id="user-center-change-password-box">
            <el-carousel :interval="5000" arrow="never" indicator-position="none" :initial-index=0 :autoplay=false
              ref="carousel">
              <el-carousel-item v-for="item in 2" :key="item">
                <!-- 原来手机验证 -->
                <div v-if="item === 1"
                  style="width:50vw;height:100%;display: flex;flex-direction: column;justify-content: center;align-items: center;">
                  <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                    <el-input style="width:40vw;" v-model="resetPhone.oldPhonePage.phone"
                      placeholder="请输入当前绑定的手机号"></el-input>
                    <el-button type="primary" round style="width:9vw;margin-left: 1vw;" @click="oldPhoneGetCode"
                      :disabled="resetPhone.oldPhonePage.requestCodeButtonDisabled">获取验证码</el-button>
                  </div>
                  <el-input v-model="resetPhone.oldPhonePage.code" style="margin-bottom: 10px;margin-top: 10px;"
                    placeholder="请输入收到的验证码"></el-input>
                  <el-button type="primary" round style="width:100%" @click="verifyOldPhoneCode">提交验证</el-button>
                </div>
                <!-- 新手机验证 -->
                <div v-else
                  style="width:50vw;height:100%;display: flex;flex-direction: column;justify-content: center;align-items: center;">
                  <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                    <el-input style="width:40vw;" v-model="resetPhone.newPhonePage.phone"
                      placeholder="请输入新的登录手机号"></el-input>
                    <el-button type="primary" round style="width:9vw;margin-left: 1vw;" @click="newPhoneGetCode"
                      :disabled="resetPhone.newPhonePage.requestCodeButtonDisabled">获取验证码</el-button>
                  </div>
                  <el-input v-model="resetPhone.newPhonePage.code" style="margin-bottom: 10px;margin-top: 10px;"
                    placeholder="请输入收到的验证码"></el-input>
                  <el-button type="primary" round style="width:100%" @click="submitResetPhone">提交修改</el-button>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-collapse-item>
        <!-- <el-collapse-item title="注销帐号" name="3" class="collapse-item">
          <el-button type="primary" round style="width:100%" @click="submitResetPassword">注销帐号</el-button>
        </el-collapse-item>
        <el-collapse-item title="退出登录" name="4" class="collapse-item">
          <el-button type="primary" round style="width:100%" @click="submitResetPassword">退出登录</el-button>
        </el-collapse-item> -->
      </el-collapse>

      <el-dialog title="修改头像" :visible.sync="editAvatarDialog" width="40%">
        <el-row type="flex" justify="center">
          <div class="cropper">
            <VueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"
              :info="option.info" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
              :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime"></VueCropper>
          </div>
          <div class="previewBox">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
            <el-row type="flex" justify="center">
              <el-upload action="" :show-file-list="false" :auto-upload="false" :on-change="uploadImg">
                <el-button size="mini" type="primary"> 更换头像
                </el-button>
              </el-upload>
            </el-row>
            <br>
          </div>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAvatarDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveEditAvatar">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import { VueCropper } from 'vue-cropper'
import md5 from 'js-md5';

Vue.use(ElementUI);
Vue.component("VueCropper", VueCropper);
Vue.prototype.axios = axios;
Vue.prototype.$md5 = md5;

export default {
  data() {
    return {
      token: "",
      userIcon: "",
      avatarURL: this.userIcon,
      editAvatarDialog: false,
      previews: {},
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: 'png', // 裁剪生成额图片的格式
        canMove: true,  // 能否拖动图片
        original: false,  // 上传图片是否显示原始宽高
        canMoveBox: true,  // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true // 截图框固定大小
      },
      activeNames: "",
      //修改密码
      resetPasswordPhone: "",
      requerstChangePasswordSMSCodeButtonDisabled: false,
      resetPasswordButtonDisabled: false,
      resetPasswordRequestCodeButtonContent: "获取验证码",
      resetPasswordSec: 15,
      resetPasswordCodeStamp: "",
      resetPasswordVerifyCode: "",
      resetPasswordValue: "",
      repeatPasswordValue: "",
      //修改手机号
      resetPhone: {
        oldPhonePage: {
          phone: "",
          code: "",
          codestamp: "",
          phoneSec: 15,
          requestCodeButtonContent: "获取验证码",
          requestCodeButtonDisabled: false,
          verifyCodeButtonDisabled: false
        },
        newPhonePage: {
          phone: "",
          code: "",
          codestamp: "",
          phoneSec: 15,
          requestCodeButtonContent: "获取验证码",
          requestCodeButtonDisabled: false,
          verifyCodeButtonDisabled: false
        }
      },


      phone: "",
      password: "",
      repeatPass: "",
    }
  },
  methods: {
    // 提交修改手机号
    submitResetPhone() {
      if (this.resetPhone.newPhonePage.phone.trim().length === 0) {
        this.$message.error('手机号还没填呢');
        return;
      }

      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.resetPhone.newPhonePage.phone.trim())) {
        this.$message.error('你瞅瞅你那是手机号么');
        return;
      }

      if (this.resetPhone.newPhonePage.code.trim().length < 6) {
        this.$message.error('验证码输入出错');
        return;
      }

      this.showLoading();
      let self = this;
      axios.get("https://www.li-xyz.com/LifeKeeper/ResetPhone?phone=" +
        self.resetPhone.newPhonePage.phone.trim() + "&code=" +
        self.resetPhone.newPhonePage.code.trim() + "&codeStamp=" +
        self.resetPhone.newPhonePage.codestamp.trim(), {
        headers: {
          "Token": self.token
        }
      }).then((result) => {
        this.hideLoading();
        if (result.data.result) {
          this.$refs.carousel.setActiveItem(0);
          self.$message({
            message: '手机号已重新绑定',
            type: 'success'
          });
          this.$refs.carousel.setActiveItem(0);
          self.resetPhone.newPhonePage.phone = "";
          self.resetPhone.newPhonePage.code = "";
          self.resetPhone.newPhonePage.codestamp = "";
          self.resetPhone.newPhonePage.phoneSec = 15;
          self.resetPhone.newPhonePage.requestCodeButtonContent = "获取验证码";
          self.resetPhone.newPhonePage.requestCodeButtonDisabled = false;
          self.resetPhone.newPhonePage.verifyCodeButtonDisabled = false;
          self.resetPhone.oldPhonePage.phone = "";
          self.resetPhone.oldPhonePage.code = "";
          self.resetPhone.oldPhonePage.codestamp = "";
          self.resetPhone.oldPhonePage.phoneSec = 15;
          self.resetPhone.oldPhonePage.requestCodeButtonContent = "获取验证码";
          self.resetPhone.oldPhonePage.requestCodeButtonDisabled = false;
          self.resetPhone.oldPhonePage.verifyCodeButtonDisabled = false;
        } else {
          self.$message.error('修改手机号出错啦，请检查后重试');
        }
      }).catch((error) => {
        self.hideLoading()
        this.$message.error('出错啦，请检查后重试');
      });
    },
    //重新绑定手机号 - 新手机获取验证码
    newPhoneGetCode() {
      let self = this;
      if (this.resetPhone.newPhonePage.phone.trim().length === 0) {
        this.$message.error('手机号还没填呢');
        return;
      }

      if (this.resetPhone.newPhonePage.phone.trim() === this.resetPhone.oldPhonePage.phone.trim()) {
        this.$message.error('俩手机号一样你瞎绑定你妈呢！');
        return;
      }

      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.resetPhone.newPhonePage.phone.trim())) {
        this.$message.error('你瞅瞅你那是手机号么');
        return;
      }

      this.showLoading();
      grecaptcha.ready(function () {
        grecaptcha.execute('6Ld8e5IkAAAAAFt7Deyk2b_cQQwQ_hv4o6GDVJRV', { action: 'submit' }).then(function (googleToken) {
          axios.get("https://www.li-xyz.com/LifeKeeper/RequestSMSCodeWithOutLogin?phone=" + self.resetPhone.newPhonePage.phone.trim() + "&googleToken=" + googleToken).then((result) => {
            self.hideLoading()
            console.log(result.data);
            if (result.data.result) {
              self.$message({
                message: '验证码已发送，请注册查收',
                type: 'success'
              });
              self.resetPhone.newPhonePage.codestamp = result.data.resultObject;
              self.resetPhone.newPhonePage.requestCodeButtonDisabled = true;
              self.resetPhone.newPhonePage.verifyCodeButtonDisabled = true;
              let clock = window.setInterval(() => {
                self.resetPhone.newPhonePage.phoneSec--;
                self.resetPhone.newPhonePage.requestCodeButtonContent = self.resetPasswordSec;
                if (self.resetPhone.newPhonePage.phoneSec === 0) {
                  self.resetPhone.newPhonePage.phoneSec = 15;
                  self.resetPhone.newPhonePage.requestCodeButtonDisabled = false;
                  self.resetPhone.newPhonePage.requestCodeButtonContent = "获取验证码"
                  window.clearInterval(clock);
                }
              }, 1000);
            } else {
              self.$message.error(result.data.exceptionMessage);
            }
          }).catch((error) => {
            self.hideLoading()
            self.$message.error('出错啦，请检查后重试2');
          });
        });
      });
    },
    //验证旧手机号的验证码
    verifyOldPhoneCode() {
      if (this.resetPhone.oldPhonePage.phone.trim().length === 0) {
        this.$message.error('手机号还没填呢');
        return;
      }

      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.resetPhone.oldPhonePage.phone.trim())) {
        this.$message.error('你瞅瞅你那是手机号么');
        return;
      }

      if (this.resetPhone.oldPhonePage.code.trim().length < 6) {
        this.$message.error('验证码输入出错');
        return;
      }

      this.showLoading();
      let self = this;
      axios.get("https://www.li-xyz.com/LifeKeeper/VerifySMSCode?phone=" + self.resetPhone.oldPhonePage.phone.trim() + "&code=" + self.resetPhone.oldPhonePage.code.trim() + "&codeStamp=" + self.resetPhone.oldPhonePage.codestamp.trim()).then((result) => {
        this.hideLoading()
        if (result.data.result) {
          this.$refs.carousel.setActiveItem(1);
        } else {
          self.$message.error('校验验证码出错啦，请检查后重试');
        }
      }).catch((error) => {
        self.hideLoading()
        this.$message.error('出错啦，请检查后重试');
      });

    },
    //旧手机获取验证码
    oldPhoneGetCode() {
      let self = this;
      if (this.resetPhone.oldPhonePage.phone.trim().length === 0) {
        this.$message.error('手机号还没填呢');
        return;
      }

      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.resetPhone.oldPhonePage.phone.trim())) {
        this.$message.error('你瞅瞅你那是手机号么');
        return;
      }

      this.showLoading();
      grecaptcha.ready(function () {
        grecaptcha.execute('6Ld8e5IkAAAAAFt7Deyk2b_cQQwQ_hv4o6GDVJRV', { action: 'submit' }).then(function (googleToken) {
          axios.get("https://www.li-xyz.com/LifeKeeper/RequestSMSCodeWithLogin?phone=" + self.resetPhone.oldPhonePage.phone.trim() + "&googleToken=" + googleToken, {
            headers: {
              'Token': self.token,
            }
          }).then((result) => {
            self.hideLoading()
            if (result.data.result) {
              self.$message({
                message: '验证码已发送，请注册查收',
                type: 'success'
              });
              self.resetPhone.oldPhonePage.codestamp = result.data.resultObject;
              self.resetPhone.oldPhonePage.requestCodeButtonDisabled = true;
              self.resetPhone.oldPhonePage.verifyCodeButtonDisabled = true;
              let clock = window.setInterval(() => {
                self.resetPhone.oldPhonePage.phoneSec--;
                self.resetPhone.oldPhonePage.requestCodeButtonContent = self.resetPasswordSec;
                if (self.resetPhone.oldPhonePage.phoneSec === 0) {
                  self.resetPhone.oldPhonePage.phoneSec = 15;
                  self.resetPhone.oldPhonePage.requestCodeButtonDisabled = false;
                  self.resetPhone.oldPhonePage.requestCodeButtonContent = "获取验证码"
                  window.clearInterval(clock);
                }
              }, 1000);
            } else {
              self.$message.error(result.data.exceptionMessage);
            }
          }).catch((error) => {
            self.hideLoading()
            this.$message.error('出错啦，请检查后重试');
          });
        });
      });
    },
    //重置密码，获取验证码
    resetPasswordGetCode() {
      let self = this;
      //验证手机号合规
      if (this.resetPasswordPhone.trim().length === 0) {
        this.$message.error('手机号还没填呢');
        return;
      }
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.resetPasswordPhone.trim())) {
        this.$message.error('你瞅瞅你那是手机号么');
        return;
      }
      this.showLoading();
      //向服务器请求验证码，服务器会先验证谷歌验证码是否正确，验证通过才会下发验证码
      grecaptcha.ready(function () {
        grecaptcha.execute('6Ld8e5IkAAAAAFt7Deyk2b_cQQwQ_hv4o6GDVJRV', { action: 'submit' }).then(function (googleToken) {
          axios.get("https://www.li-xyz.com/LifeKeeper/RequestSMSCodeWithLogin?phone=" + self.resetPasswordPhone.trim() + "&googleToken=" + googleToken, {
            headers: {
              'Token': self.token,
            }
          }).then((result) => {
            self.hideLoading()
            if (result.data.result) {
              self.$message({
                message: '验证码已发送，请注册查收',
                type: 'success'
              });
              self.resetPasswordCodeStamp = result.data.resultObject;
              self.requerstChangePasswordSMSCodeButtonDisabled = true;
              self.resetPasswordButtonDisabled = false;
              let clock = window.setInterval(() => {
                self.resetPasswordSec--;
                self.resetPasswordRequestCodeButtonContent = self.resetPasswordSec;
                if (self.resetPasswordSec === 0) {
                  self.resetPasswordSec = 15;
                  self.requerstChangePasswordSMSCodeButtonDisabled = false;
                  self.resetPasswordRequestCodeButtonContent = "获取验证码";
                  window.clearInterval(clock);
                }
              }, 1000);
            } else {
              self.$message.error(result.data.exceptionMessage);
            }
          }).catch((error) => {
            self.hideLoading()
            this.$message.error('出错啦，请检查后重试');
          });
        });
      });
    },
    // 提交新密码
    submitResetPassword() {
      if (this.resetPasswordPhone.trim().length === 0) {
        this.$message.error('手机号还没填呢');
        return;
      }

      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(this.resetPasswordPhone.trim())) {
        this.$message.error('你瞅瞅你那是手机号么');
        return;
      }

      if (this.resetPasswordValue.trim().length === 0 || this.repeatPasswordValue.trim().length === 0) {
        this.resetPasswordValue = "";
        this.repeatPasswordValue = "";
        this.$message.error('密码不能为空');
        return;
      }
      if (this.resetPasswordValue.trim() != this.repeatPasswordValue.trim()) {
        this.resetPasswordValue = "";
        this.repeatPasswordValue = "";
        this.$message.error('两次输入不同');
        return;
      }
      if (this.resetPasswordVerifyCode.trim().length < 6) {
        this.$message.error('请输入正确的验证码');
        return;
      }
      this.showLoading();
      let self = this;
      axios.get("https://www.li-xyz.com/LifeKeeper/ResetPassword?phone=" + this.resetPasswordPhone.trim() +
        "&code=" + this.resetPasswordVerifyCode.trim() +
        "&codeStamp=" + this.resetPasswordCodeStamp.trim() +
        "&newPassword=" + this.$md5(this.resetPasswordPhone.trim() + this.resetPasswordValue.trim() + 'LifeKeeper'),
        {
          headers: {
            'Token': this.token
          }
        }).then((result) => {
          this.hideLoading()
          if (result.data.result) {
            self.$message({
              message: '密码修改成功',
              type: 'success'
            });
            self.resetPasswordPhone = "";
            self.requerstChangePasswordSMSCodeButtonDisabled = false;
            self.resetPasswordButtonDisabled = false;
            self.resetPasswordRequestCodeButtonContent = "获取验证码";
            self.resetPasswordSec = 15;
            self.resetPasswordCodeStamp = "";
            self.resetPasswordVerifyCode = "";
            self.resetPasswordValue = "";
            self.repeatPasswordValue = "";
          } else {
            self.$message.error(result.data.exceptionMessage);
          }
        }).catch((error) => {
          self.hideLoading()
          this.$message.error('修改密码出错，请稍候重试...');
        });

    },
    handleChange() {
      this.$refs.carousel.setActiveItem(0);
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
    editAvatar() {
      this.editAvatarDialog = true
      this.option.img = this.avatarURL
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    uploadImg(file) {
      var _this = this;
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        _this.option.img = data
      }
      reader.readAsArrayBuffer(file.raw);
    },
    saveEditAvatar() {
      this.editAvatarDialog = false
      this.startUpload()
    },
    startUpload() {
      this.showLoading();
      this.$refs.cropper.getCropBlob((data) => {
        this.avatarURL = window.URL.createObjectURL(data)
        let formData = new FormData();
        formData.append('file', data);
        axios.post('https://www.li-xyz.com/LifeKeeper/UploadUserIcon', formData, {
          headers: {
            'Token': this.token,
          }
        }).then((res) => {
          this.previews = {};
          this.option = {
            img: '', // 裁剪图片的地址
            info: true, // 裁剪框的大小信息
            outputSize: 1, // 剪切后的图片质量（0.1-1）
            full: true, // 输出原图比例截图 props名full
            outputType: 'png', // 裁剪生成额图片的格式
            canMove: true,  // 能否拖动图片
            original: false,  // 上传图片是否显示原始宽高
            canMoveBox: true,  // 能否拖动截图框
            autoCrop: true, // 是否默认生成截图框
            autoCropWidth: 150,
            autoCropHeight: 150,
            fixedBox: true // 截图框固定大小
          };
          this.hideLoading();
          if (res.status == 200) {
            if (res.data.result) {
              this.userIcon = "https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperUserIcon/" + res.data.resultObject
              sessionStorage.setItem("UserIconUrl", this.userIcon);
            } else {
              this.$message.error('保存失败,请检查后重试');
            }
          } else {
            this.$message.error('保存失败,请检查后重试');
          }
        }).catch(function (error) {
          this.$message.error('保存失败,请检查后重试,' + error);
        });
      });
    },
    recaptcha(e) {
      e.preventDefault();
      grecaptcha.ready(function () {
        grecaptcha.execute('reCAPTCHA_site_key', { action: 'submit' }).then(function (token) {
          // Add your logic to submit to your backend server here.
        });
      });
    }
  },
  watch: {
  },
  mounted() {
    this.token = sessionStorage.getItem("UserId");
    this.userIcon = sessionStorage.getItem("UserIconUrl");

  }
}
</script>

<style>
#LSqOECVc #user-center-change-password-box {
  padding: 30px;
  background-color: antiquewhite;
}


#LSqOECVc #collapse {
  width: 80vw;
  background-color: #e9ecef;
  box-shadow:
    7px 7px 12px rgba(0, 0, 0, .4),
    -7px -7px 12px rgba(255, 255, 255, .9);
}

#LSqOECVc .el-collapse-item__header {
  border-bottom: 1px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#LSqOECVc .is-active {
  border-bottom: 1px !important;
  width: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#LSqOECVc .el-collapse-item__header.is-active {
  border-bottom: 1px !important;
  width: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#LSqOECVc .el-collapse-item__wrap {
  width: 100%;
  height: 100%;
  background-color: white
}

#LSqOECVc .el-collapse-item__arrow {
  background-color: white;
  display: none !important;
}


#LSqOECVc #LSqOECVc {
  width: 100%;
  background-color: #e9ecef;
}

#LSqOECVc #user-center-content-box {
  width: 80vw;
  height: 100vh;
  margin: auto;
  background-color: #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#LSqOECVc #user-center-title {
  font-size: 50px;
  text-shadow: 1px 1px 1px #000,
    -1px -1px 1px #fff;
}

#LSqOECVc #user-center-userIcon-box {
  width: 5vw;
  height: 5vw;
  margin-top: 5vh
}

#LSqOECVc #user-center-userIcon {
  width: 5vw;
  height: 5vw;
}

#LSqOECVc #user-center-userIcon-mask {
  width: 5vw;
  height: 5vw;
  position: fixed;
  top: 5vh;
  background-color: black;
  font-size: 10px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  border-radius: 50%;
}

#LSqOECVc #user-center-userIcon-box:hover #user-center-userIcon-mask {
  opacity: 0.5;
}

/* ------------------------------------------------------ */
#LSqOECVc .previewBox {
  text-align: center;
  margin-left: 60px;
}

#LSqOECVc .preview {
  width: 150px;
  height: 150px;
  margin: 0px auto 20px auto;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #ccc;
  overflow: hidden;
}

#LSqOECVc .cropper {
  width: 260px;
  height: 260px;
}
</style>
