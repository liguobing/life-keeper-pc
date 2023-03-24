<template>
  <div id="images-upload-item-box">
    <a>{{ FileName }}</a>
    <el-progress class="image-upload-item-progress" :text-inside="true" :stroke-width="13" :percentage="Percent"
      :objectId="ObjectId"></el-progress>
    <i class="el-icon-delete" @click="remove(FileName, ObjectId)"></i>
  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);



export default {
  name: 'UploadImageItem',
  props: {
    ObjectId: String,
    FileName: String,
    Percent: Number
  },
  data() {
    return {
    }
  },
  methods: {
    remove(FileName, ObjectId) {
      this.$emit("itemDeleteClick", FileName, ObjectId);
    },
  },
  watch: {
  },
  mounted() {
  }
}
</script>

<style scoped>
#images-upload-item-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.image-upload-item-progress {
  flex-grow: 1;
}
</style>
