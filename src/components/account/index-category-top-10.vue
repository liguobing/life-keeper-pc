<template>
  <div class="index-category-top-10-box">
    <el-tabs id="category-top-box" v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all" class="category-top-tab-box">
        <IndexCategoryTop10Item :items="allCategoryTop10"></IndexCategoryTop10Item>
      </el-tab-pane>
      <el-tab-pane label="收入" name="income" class="category-top-tab-box">
        <IndexCategoryTop10Item :items="incomeCategoryTop10"></IndexCategoryTop10Item>
      </el-tab-pane>
      <el-tab-pane label="支出" name="expend" class="category-top-tab-box">
        <IndexCategoryTop10Item :items="expendCategoryTop10"></IndexCategoryTop10Item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import Vue from 'vue';
import ElementUI from 'element-ui';
import IndexCategoryTop10Item from '../../components/account/index-category-top-10-item.vue'

Vue.component('IndexCategoryTop10Item', IndexCategoryTop10Item)
Vue.use(ElementUI);

export default {
  name: 'IndexCategoryTop10',
  props: {
    incomeCategoryTop10: [],
    expendCategoryTop10: [],
    allCategoryTop10: [],
  },
  data() {
    return {
      activeName: "all"
    }
  },
  methods: {
    handleClick: function () {

    }
  },
  watch: {
  },
  mounted() {
  }
}
</script>

<style>
.index-category-top-10-box #category-top-box {
  color: black;
  border-radius: 20px;
  background-color: #dde7c7;
  box-shadow: 5px 5px 5px #888888;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 600px;
}

.index-category-top-10-box .el-tabs__content {
  width: 100% !important;
}

.index-category-top-10-box .category-top-tab-box {
  margin-top: 0px;
  width: 30%;
}

.index-category-top-10-box #tab-all {
  width: 30%;
}

.index-category-top-10-box #tab-income {
  width: 30%;
}

.index-category-top-10-box #tab-expend {
  width: 30%;
}

.index-category-top-10-box #pane-all {
  width: 100%;
}

.index-category-top-10-box #pane-income {
  width: 100%;
}

.index-category-top-10-box #pane-expend {
  width: 100% !important;
}

.index-category-top-10-box .is-active {
  background-color: #77bfa3;
}
</style>
