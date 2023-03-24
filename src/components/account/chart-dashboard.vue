<template>
  <div id="dashboard-box" ref="dashboard-box" style="width:100%;height:500px">

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



export default {
  name: 'ChartDashboard',
  props: {
    update: Number,
    percent: Number,
  },
  data() {
    return {
    }
  },
  methods: {
    setDashboardChart() {
      let chartDom = document.getElementById('dashboard-box');
      var dashboardChar = echarts.init(chartDom);
      let dashboardOption = {
        title: {
          text: '收支比',
          left: 'center'
        },
        series: [
          {
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'auto',
              distance: 40,
              fontSize: 20
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'auto'
            },
            data: [
              {
                value: this.percent
              }
            ]
          }
        ]
      };
      dashboardOption && dashboardChar.setOption(dashboardOption);
    },
  },
  watch: {
    "update":function(){
      this.setDashboardChart();
    }
  },
  mounted() {
    this.setDashboardChart();
  }
}
</script>

<style>
#dashboard-box {
  height: 500px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;
  background-color: white;
}
</style>
