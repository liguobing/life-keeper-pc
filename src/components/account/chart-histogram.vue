<template>
  <div id="histogram-box">

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
  name: 'ChartHistogram',
  props: {
    update: Number,
    days: [],
    incomes: [],
    expends: []
  },
  data() {
    return {
    }
  },
  methods: {
    setHistogramChart() {
      let chartDom = document.getElementById('histogram-box');
      var histogramChar = echarts.init(chartDom);
      let histogramOption = {
        title: {
          text: '每日收支'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: this.days
        },
        series: [
          {
            name: '收入',
            type: 'bar',
            data: this.incomes,
            itemStyle: {
              color: '#DA251D'
            }
          },
          {
            name: '支出',
            type: 'bar',
            data: this.expends,
            itemStyle: {
              color: '#00ff23'
            }
          }
        ]
      };
      histogramOption && histogramChar.setOption(histogramOption);
      histogramChar.resize({ height: this.days.length * 30 });
    },
  },
  watch: {
    "update": function () {
      this.setHistogramChart();
    },
  },
  mounted() {
    this.setHistogramChart();
  }
}
</script>

<style>
#histogram-box {
  width: 100%;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;
  background-color: white;
}
</style>
