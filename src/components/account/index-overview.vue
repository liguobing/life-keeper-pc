<template>
  <div id="index-overview-box">
    <div id="income-box">
      <i class="iconfont icon-shouru" style="font-size: 40px; color: green;"></i>
      <a class="title">收入</a>
      {{ income }}
    </div>
    <div id="expend-box">
      <i class="iconfont icon-zhichu" style="font-size: 40px; color: red;"></i>
      <a class="title">支出</a>
      {{ expend }}
    </div>
    <div id="percent-box">
      <i class="iconfont icon-bili" style="font-size: 40px; color: blueviolet;"></i>
      <a class="title">收支比</a>
      {{ percent }}
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import { NavBar } from 'vant';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(NavBar);
Vue.use(ElementUI);



export default {
  name: 'IndexOverView',
  props: {
    income: Number,
    expend: Number,
    percent: String
  },
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

<style>
#index-overview-box {
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: #98c9a3;
  box-shadow: 5px 5px 5px #888888;
}

#index-overview-box #income-box,
#expend-box,
#percent-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33%;
  font-size: 30px;
}

#index-overview-box .title {
  font-size: 30px;
  margin-top: 30px;
  margin-bottom: 30px;
}

#index-overview-box .iconfont {
  font-size: 40px;
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
