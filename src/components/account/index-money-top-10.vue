<template>
  <div id="index-money-top-10-box">
    <a id="top-title">{{ title }}</a>
    <div class="top-item" v-for="(item, index) in items" v-bind:key="index">
      <a class="top-item_data">{{ item.billDate }}</a>
      <a class="top-item_data">{{ item.billCategory }}</a>
      <a class="top-item_data">{{ item.billMoney }}</a>
    </div>

  </div>
</template>

<script>

export default {
  name: 'IndexBillTop10',
  props: {
    title: String,
    items: [],
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
#index-money-top-10-box {
  color: black;
  border-radius: 20px;
  background-color: #dde7c7;
  box-shadow: 5px 5px 5px #888888;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  height: 600px;
}

#index-money-top-10-box #top-title{
  font-size: 30px;
}

#index-money-top-10-box .top-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
}

#index-money-top-10-box .top-item_data {
  width: 30%;
  height: 50px;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
