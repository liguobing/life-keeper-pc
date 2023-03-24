<template>
  <div :key="idStr" style="height:300px" class="pie-box">

  </div>
</template>

<script>
import Vue from 'vue';
import { NavBar } from 'vant';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

import * as echarts from 'echarts';

Vue.use(NavBar);
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts
var pieChart;


export default {
  name: 'ChartPie',
  props: {
    update: Number,
    title: String,
    idStr: {
      type: String,
      required: true
    },
    categoryData: [],
  },
  data() {
    return {
    }
  },
  methods: {
    setPieChart() {
      let pieDiv = document.getElementById(this.idStr);
      pieChart = echarts.init(pieDiv);
      let incomePieOption = {
        title: {
          text: this.title,
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            data: this.categoryData,
            label: {
              position: 'outer',
              alignTo: 'none',
              bleedMargin: 5
            },
            left: 0,
            top: 0,
            bottom: 0
          },
        ]
      };
      incomePieOption && pieChart.setOption(incomePieOption);
    },
  },
  watch: {
    "update": function () {
      this.setPieChart();
    }
  },
  mounted() {
    this.setPieChart();
  }
}
</script>

<style>
.pie-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 350px;
}
</style>
