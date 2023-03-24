<template>
  <div id="index-category-top-10-item-box">
    <div class="category-top-item" v-for="(item, index) in items" v-bind:key="index">
      <div v-if="item.isIncome > 0" class="category-top-item_data">
        <i class="iconfont icon-shouru" style="color:green"></i>
      </div>
      <div v-else class="category-top-item_data">
        <i class="iconfont icon-zhichu" style="color:red"></i>
      </div>
      <div class="category-top-item_data">
        <a>{{ item.billCategory }}</a>
      </div>
      <div class="category-top-item_data">
        <a>{{ item.moneyCount }}</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'IndexCategoryTop10Item',
  props: {
    items: [],
  },
  data() {
    return {

    }
  },
  created() {
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
#index-category-top-10-item-box .category-top-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

#index-category-top-10-item-box .category-top-item_data {
  /* width: 30%; */
  width: 0;
  flex-grow: 1;
  height: 50px;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

@font-face {
  font-family: "iconfont";
  /* Project id 2994771 */
  src: url('//at.alicdn.com/t/font_2994771_lx1x7ez0y0d.woff2?t=1640353637765') format('woff2'),
    url('//at.alicdn.com/t/font_2994771_lx1x7ez0y0d.woff?t=1640353637765') format('woff'),
    url('//at.alicdn.com/t/font_2994771_lx1x7ez0y0d.ttf?t=1640353637765') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 30px;
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
