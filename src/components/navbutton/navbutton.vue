<template>
  <div>
      <el-button size="small" type="primary" icon="plus" @click="addInfo">新建</el-button>
      <el-button size="small" type="danger" :disabled="deleteState" icon="delete" @click="Deletes">删除</el-button>
      <el-dialog :before-close='beforeclose' title='编辑' :visible.sync='dialogFormVisible'>
          <el-form :model='formState' :rules='rules' ref='ruleForm' label-width='120px' class='demo-ruleForm'>
          </el-form>
      </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      deleteState: false,
      formState: {}
    };
  },
  methods: {
    addInfo() {}
  }
};
</script>

<style>

</style>
