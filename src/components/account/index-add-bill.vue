<template>
  <div id="add-bill-root-box">
    <div id="add-bill-box" @click="addNewBill">
      添加新账单
    </div>
    <div id="import-wechat-box" @click="importWeChatBill">
      导入微信账单
    </div>
    <div id="import-alipay-box" @click="importAlipayBill">
      导入支付宝账单
    </div>
  </div>
</template>

<script>

export default {
  name: 'IndexAddBill',
  props: {
  },
  data() {
    return {
    }
  },
  methods: {
    addNewBill: function () {
      this.$emit('addNewBill');
    },
    importWeChatBill: function () {
      this.$emit('importWeChatBill');
    },
    importAlipayBill: function () {
      this.$emit('importAlipayBill');
    },
  },
  watch: {
  },
  mounted() {
  }
}
</script>

<style>
#add-bill-root-box {
  height: 300px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-items: center;
  align-items: center;
  background-color: #FFFFFF;
  color: white;
}

#add-bill-root-box #add-bill-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 33%;
  text-align: center;
  background-color: #32a3b1;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 5px 5px 5px #888888
}

#add-bill-root-box #import-wechat-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 33%;
  text-align: center;
  background-color: #0FCF1A;
  width: 100%;
  box-shadow: 5px 5px 5px #888888
}

#add-bill-root-box #import-alipay-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34%;
  text-align: center;
  background-color: #1477FE;

  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 5px 5px 5px #888888
}
</style>
