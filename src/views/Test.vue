<template>
  <div id="test">
    <el-date-picker class="date-picker" v-model="datePickerValue" type="daterange" range-separator="至"
      start-placeholder="开始日期" end-placeholder="结束日期">
    </el-date-picker>
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
    }
  },
  methods: {
  },
  watch: {
  },
  mounted() {
  }
}
</script>

<style scoped>
#test{
  display: flex;
  flex-direction: row;
}

.el-range-editor.el-input__inner{
  display: flex;
  flex-direction: row;
}
</style>
