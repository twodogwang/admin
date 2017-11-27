<template>
  <div class="block dr-pagination">
    <div v-if="pageInfo">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalItems">
      </el-pagination>
    </div>
  </div>
</template>
<style lang="">
.dr-pagination {
  text-align: center;
  margin: 15px auto;
}
</style>
<script>
export default {
  props: {
    pageInfo: Object,
    pageGet: String,
  },
  methods: {
    handleSizeChange(val) {
      this.$store.dispatch(`${this.pageGet}`)
    },
    handleCurrentChange(val) {
      this.$store.dispatch(`${this.pageGet}`)
    }
  },
  mounted() {
    console.log(this.pageInfo);
  }
};
</script>
