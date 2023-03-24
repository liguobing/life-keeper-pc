<template>
  <div id="ADNGGMI">
    <div id="record-root-box">
      <div class="record-top-bar">
        <div style="display: flex;flex-direction: column;">
          <a style="margin-left:10px">通话录音</a>
        </div>
        <div style="flex-grow: 1;"></div>
        <!-- 删除选中的通话记录 -->
        <el-button class="edit-item" v-show="isEdit" type="danger" icon="el-icon-check" round
          @click="deleteRecord">删除选中的通话记录</el-button>
        <!-- 完成按钮 -->
        <el-button class="edit-item" v-show="isEdit" type="success" icon="el-icon-check" round
          @click="isEdit = false">完成</el-button>
        <!-- 编辑按钮 -->
        <el-button class="edit-item" v-show="!isEdit" type="info" icon="el-icon-edit" round
          @click="isEdit = true">编辑</el-button>
      </div>
      <div class="content-box">
        <el-collapse v-model="activeName" accordion @change="itemChange">
          <el-collapse-item v-for="(item, index) in recordData" :key="index" class="collapse-item"
            :name="item.contact.contactId">
            <template slot="title">
              <div class="title-box" v-if="index % 2 != 1" style="background-color:#e4e7ec">
                {{ item.contact.contactName }}
                <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' icon="el-icon-info" icon-color="red"
                  :title="deleteContactMessage" @confirm="deleteContact(item.contact)">
                  <i v-show="isEdit" slot="reference" class="el-icon-delete"
                    @click.stop.prevent="deleteContactMessage = '确定要删除与[' + item.contact.contactName + ']的通话记录吗？'"></i>
                </el-popconfirm>
              </div>
              <div class="title-box" v-else>
                {{ item.contact.contactName }}
                <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' icon="el-icon-info" icon-color="red"
                  :title="deleteContactMessage" @confirm="deleteContact(item.contact)">
                  <i v-show="isEdit" slot="reference" class="el-icon-delete"
                    @click.stop.prevent="deleteContactMessage = '确定要删除与[' + item.contact.contactName + ']的通话记录吗？'"></i>
                </el-popconfirm>
              </div>
            </template>
            <div class="reocrd-list-box">
              <div v-for="(record, position) in item.records" :key="position" class="record-item"
                @click="playRecord(item.contact, record)">
                <el-checkbox v-show="isEdit" v-model="record.checked"
                  @change="checkStatusChange($event, record)"></el-checkbox>
                {{
                  formatRecordTime(record.callTime)
                }}
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-backtop target="#ADNGGMI" class="aaaa" :visibility-height=20>
        <i class="el-icon-caret-top"></i>
      </el-backtop>
    </div>

    <el-dialog title="删除提示" :visible.sync="deleteRecordDialogVisible" width="30%" center>
      <span>{{ deleteRecordMessage }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteRecordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDeleteRecord">确 定</el-button>
      </span>
    </el-dialog>

    <div id="player-box" v-if="playerIsShow">
      <Aplayer :music="playingRecord" :key=playingRecord.src :autoplay=true ref="player" mini></Aplayer>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import { v4 as uuidv4 } from 'uuid'
import UploadImageItem from '../../components/image/upload-image-item.vue'
import Aplayer from 'vue-aplayer'


Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.component("UploadImageItem", UploadImageItem);
Vue.component("Aplayer", Aplayer);

Vue.prototype.$moment = moment;


export default {
  data() {
    return {
      playerIsShow: false,
      loading: {},
      "token": "",
      lastActiveName: "",
      activeName: "",
      recordData: [],
      checkedVideoCount: 0,
      isEdit: false,
      deleteContactMessage: "",
      deleteRecordMessage: "",
      deleteRecordDialogVisible: false,
      playingRecord: {
        title: "",
        artist: "",
        src: "",
      },
    }
  },

  methods: {
    playRecord(contact, record) {
      this.playerIsShow = false;
      this.playingRecord.title = contact.contactName;
      this.playingRecord.artist = this.formatRecordTime(record.callTime);
      this.playingRecord.src = 'https://www.li-xyz.com/LifeKeeper/resource/LifeKeeperCallRecord/' + record.recordUser + '/' + record.sourceFileName;
      this.playerIsShow = true;
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
    itemChange(activeName) {
      this.showLoading();
      this.recordData.forEach(item => {
        if (item.records.length > 0) {
          item.records.forEach(record => {
            record.checked = false;
          });
        }
      });

      axios.get("https://www.li-xyz.com/LifeKeeper/GetRecordByContactId", {
        headers: {
          'Token': this.token,
          'ContactId': activeName
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            if (result.status == 200) {
              if (result.data.result) {
                if (result.data.resultObject.length > 0) {
                  this.recordData.forEach(item => {
                    if (item.contact.contactId === activeName) {
                      item.records = [];
                      result.data.resultObject.forEach(obj => {
                        obj.checked = false;
                        item.records.push(obj);
                      });
                    }
                  })
                }
              }
            }
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    requestContant() {
      this.showLoading();
      axios.get("https://www.li-xyz.com/LifeKeeper/GetContactName", {
        headers: {
          'Token': this.token,
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            this.recordData = [];
            result.data.resultObject.forEach(element => {
              var obj = {
                contact: element,
                records: [],
              }
              this.recordData.push(obj);
            });
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    formatRecordTime(time) {
      return time.substring(0, 4) + "-" +
        time.substring(
          4,
          6
        ) + "-" + time.substring(
          6,
          8
        ) + " " + time.substring(
          8,
          10
        ) + ":" + time.substring(
          10,
          12
        ) + ":" + time.substring(
          12,
          14
        );
    },
    checkStatusChange(event, bean) {
      bean.checked = event;
      if (event) {
        this.checkedVideoCount++;
      } else {
        this.checkedVideoCount--;
      }
    },
    deleteContact(contact) {
      this.showLoading();
      var list = [];
      list.push(contact.contactId);
      axios.post("https://www.li-xyz.com/LifeKeeper/DeleteContact", JSON.stringify(list), {
        headers: {
          'Token': this.token,
          "Content-Type": "application/json",
          dataType: "json",
        }
      }).then((result) => {
        this.hideLoading();
        if (result.status == 200) {
          if (result.data.result) {
            this.requestContant();
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        } else {
          this.$message.error('出错啦，请检查后重试');
        }
      })
    },
    deleteRecord() {
      this.deleteRecordDialogVisible = true;
      var contactName = "";
      var recordCheckedCount = 0;
      for (var i = 0; i < this.recordData.length; i++) {
        var item = this.recordData[i];
        if (item.contact.contactId === this.activeName) {
          contactName = item.contact.contactName;
          item.records.forEach(record => {
            if (record.checked) {
              recordCheckedCount++;
            }
          });
          break;
        }
      }
      this.deleteRecordMessage = "确定要删除与 " + contactName + " 的 " + recordCheckedCount + " 条通话记录吗？"
    },
    submitDeleteRecord() {
      this.deleteRecordDialogVisible = false
      var checkedList = [];
      for (var i = 0; i < this.recordData.length; i++) {
        var item = this.recordData[i];
        if (item.contact.contactId === this.activeName) {
          item.records.forEach(record => {
            if (record.checked) {
              checkedList.push(record.objectId);
            }
          });
          break;
        }
      }
      if (checkedList.length > 0) {
        this.showLoading();
        axios.post("https://www.li-xyz.com/LifeKeeper/DeleteRecord", JSON.stringify(checkedList), {
          headers: {
            'Token': this.token,
            "Content-Type": "application/json",
            dataType: "json",
          }
        }).then((result) => {
          this.hideLoading();
          if (result.status == 200) {
            if (result.data.result) {
              this.activeName = "",
                this.requestContant();
            } else {
              this.$message.error('出错啦，请检查后重试');
            }
          } else {
            this.$message.error('出错啦，请检查后重试');
          }
        })
      } else {
        this.$message.error('你还没有选择录音文件呢');
      }
    }
  },
  watch: {

  },
  mounted() {
    let storage = window.sessionStorage;
    this.token = storage.getItem("UserId");
    this.requestContant();
  }
}

</script>

<style >
#ADNGGMI #player-box {
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 9999;

}

#ADNGGMI {
  width: 100%;
  height: 100vh;
  overflow: auto;
}

#ADNGGMI #record-root-box {
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: auto;
  background-color: white;
}

#ADNGGMI .record-top-bar {
  width: 80vw;
  height: 5vw;
  color: white;
  font-size: 30px;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  background-color: #599be7;
  box-shadow: 5px 5px 5px #888888;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  position: fixed;
  top: 0px;
}

#ADNGGMI .edit-item{
  margin-right: 10px;
}

#ADNGGMI .content-box {
  height: 100vh;
  margin-top: 5vw;
}

#ADNGGMI .reocrd-list-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

#ADNGGMI .record-item {
  width: 20vw;
  height: 30px;
  border: 1px solid gray;
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#ADNGGMI #toTop {
  width: 1vw;
  height: 1vw;
  position: absolute;
  right: 0px;
  bottom: 0px;
}

#ADNGGMI .delete-record-button {
  width: 100%;
  background-color: red;
}

#ADNGGMI .title-box {
  width: 100%;
}

#ADNGGMI .el-collapse-item__arrow {
  background-color: white;
  display: none !important;
}

#ADNGGMI .el-collapse-item__header {
  border-bottom: 0px !important;
}

#ADNGGMI .el-collapse-item__content{
  width: 100%;
  background-color: #EFFFE9;
}

#ADNGGMI .el-collapse-item__header.is-active{
  width: 80vw;
  font-size: 20px;
}


#ADNGGMI .el-collapse-item__wrap {
  width: 100%;
  border-bottom: 0px !important;
}

</style>